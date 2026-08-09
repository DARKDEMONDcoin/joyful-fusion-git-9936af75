import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const COURSE_PRICE_EGP = 999;

export type StudentRecord = {
  full_name: string | null;
  phone: string | null;
  telegram_username: string | null;
  access_code: string;
  has_access: boolean;
};

export const getMyStudent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StudentRecord> => {
    const { supabase, userId } = context;
    const existing = await supabase
      .from("course_students")
      .select("full_name, phone, telegram_username, access_code, has_access")
      .eq("user_id", userId)
      .maybeSingle();
    if (existing.error) throw new Error(existing.error.message);
    if (existing.data) return existing.data as StudentRecord;

    const created = await supabase
      .from("course_students")
      .insert({ user_id: userId })
      .select("full_name, phone, telegram_username, access_code, has_access")
      .single();
    if (created.error) throw new Error(created.error.message);
    return created.data as StudentRecord;
  });

export const updateMyStudent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { full_name?: string; phone?: string; telegram_username?: string }) => ({
    full_name: input.full_name?.trim().slice(0, 80) ?? null,
    phone: input.phone?.trim().slice(0, 20) ?? null,
    telegram_username: input.telegram_username?.trim().slice(0, 40) ?? null,
  }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("course_students")
      .update(data)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createKashierCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { kashierEnv, kashierOrderHash } = await import("@/lib/kashier.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { merchantId, apiKey, mode } = kashierEnv();

    const request = getRequest();
    const origin = request ? new URL(request.url).origin : "";
    const orderId = `COURSE-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const amount = COURSE_PRICE_EGP.toFixed(2);
    const currency = "EGP";

    const inserted = await supabaseAdmin.from("course_orders").insert({
      user_id: context.userId,
      order_id: orderId,
      amount: COURSE_PRICE_EGP,
      currency,
      status: "pending",
    });
    if (inserted.error) throw new Error(inserted.error.message);

    const student = await context.supabase
      .from("course_students")
      .select("full_name, phone")
      .eq("user_id", context.userId)
      .maybeSingle();
    const claims = context.claims as { email?: string } | undefined;

    const hash = kashierOrderHash({ merchantId, apiKey, orderId, amount, currency });
    const params = new URLSearchParams({
      merchantId,
      orderId,
      amount,
      currency,
      hash,
      mode,
      merchantRedirect: `${origin}/dashboard?paid=1`,
      failureRedirect: "true",
      serverWebhook: `${origin}/api/public/kashier-webhook`,
      display: "ar",
      redirectMethod: "get",
      interactionSource: "Ecommerce",
      description: "كورس الشغل أونلاين — وصول كامل مدى الحياة",
      customerReference: context.userId,
    });

    const name = student.data?.full_name?.trim();
    if (name) params.set("customerName", name);
    const phone = student.data?.phone?.trim();
    if (phone) params.set("customerPhone", phone);
    if (claims?.email) params.set("customerEmail", claims.email);

    return { url: `https://checkout.kashier.io/?${params.toString()}`, orderId };
  });

