import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/kashier-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { kashierEnv, verifyKashierSignature } = await import("@/lib/kashier.server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        let payload: Record<string, unknown>;
        try {
          payload = (await request.json()) as Record<string, unknown>;
        } catch {
          return new Response("Bad request", { status: 400 });
        }

        const data = (payload["data"] ?? payload) as Record<string, unknown>;
        const signature =
          request.headers.get("x-kashier-signature") ??
          (typeof payload["signature"] === "string" ? (payload["signature"] as string) : null);

        const { apiKey } = kashierEnv();
        if (!verifyKashierSignature(data, signature, apiKey)) {
          console.error("[kashier-webhook] invalid signature", {
            orderId: data["merchantOrderId"] ?? null,
          });
          return new Response("Invalid signature", { status: 401 });
        }

        const orderId = String(data["merchantOrderId"] ?? "");
        if (!orderId) return new Response("Missing order", { status: 400 });

        const status = String(data["status"] ?? data["paymentStatus"] ?? "").toUpperCase();
        const paidStatuses = new Set(["SUCCESS", "PAID", "CAPTURED"]);
        const failedStatuses = new Set([
          "FAILURE",
          "FAILED",
          "DECLINED",
          "CANCELLED",
          "CANCELED",
          "EXPIRED",
          "VOIDED",
        ]);

        // Unknown / intermediate statuses (PENDING, INPROGRESS…) are acknowledged
        // without touching the order, so a later terminal callback decides it.
        if (!paidStatuses.has(status) && !failedStatuses.has(status)) {
          console.warn("[kashier-webhook] non-terminal status ignored", { orderId, status });
          return new Response("ok");
        }

        const paid = paidStatuses.has(status);

        const existing = await supabaseAdmin
          .from("course_orders")
          .select("user_id, status, amount, currency")
          .eq("order_id", orderId)
          .maybeSingle();

        if (existing.error) {
          console.error("[kashier-webhook] order lookup failed", existing.error);
          return new Response("Lookup failed", { status: 500 });
        }
        if (!existing.data) {
          console.error("[kashier-webhook] unknown order", { orderId });
          return new Response("Unknown order", { status: 404 });
        }

        // Idempotency: a settled order is never re-processed.
        if (existing.data.status === "paid") {
          return new Response("ok");
        }

        if (paid) {
          // Amount / currency must match what we asked the customer to pay.
          const paidAmount = Number(data["amount"] ?? data["totalAmount"] ?? NaN);
          const paidCurrency = String(data["currency"] ?? "").toUpperCase();
          const expectedAmount = Number(existing.data.amount ?? NaN);
          const expectedCurrency = String(existing.data.currency ?? "").toUpperCase();

          const amountOk =
            !Number.isFinite(expectedAmount) ||
            (Number.isFinite(paidAmount) && Math.abs(paidAmount - expectedAmount) < 0.01);
          const currencyOk = !expectedCurrency || !paidCurrency || paidCurrency === expectedCurrency;

          if (!amountOk || !currencyOk) {
            console.error("[kashier-webhook] amount/currency mismatch", {
              orderId,
              paidAmount,
              paidCurrency,
              expectedAmount,
              expectedCurrency,
            });
            await supabaseAdmin
              .from("course_orders")
              .update({ status: "review", raw: data as never })
              .eq("order_id", orderId);
            return new Response("Amount mismatch", { status: 409 });
          }
        }

        const updated = await supabaseAdmin
          .from("course_orders")
          .update({
            status: paid ? "paid" : "failed",
            kashier_ref: data["transactionId"] ? String(data["transactionId"]) : null,
            raw: data as never,
          })
          .eq("order_id", orderId)
          .select("user_id")
          .maybeSingle();

        if (updated.error) {
          console.error("[kashier-webhook] order update failed", updated.error);
          return new Response("Update failed", { status: 500 });
        }

        if (paid && updated.data?.user_id) {
          const access = await supabaseAdmin
            .from("course_students")
            .update({ has_access: true })
            .eq("user_id", updated.data.user_id);
          if (access.error) {
            console.error("[kashier-webhook] granting access failed", access.error);
            return new Response("Access grant failed", { status: 500 });
          }
        }

        return new Response("ok");
      },
    },
  },
});
