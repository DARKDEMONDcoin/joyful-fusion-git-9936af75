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
    // Kashier credentials live in Supabase Edge Function secrets, so checkout
    // creation is delegated there rather than reading them from this runtime.
    const checkout = await context.supabase.functions.invoke("kashier-webhook", {
      body: { action: "create-checkout" },
    });
    if (checkout.error) throw new Error(checkout.error.message);
    const url = typeof checkout.data?.url === "string" ? checkout.data.url : null;
    const orderId = typeof checkout.data?.orderId === "string" ? checkout.data.orderId : null;
    if (!url || !orderId) throw new Error("Kashier checkout returned an invalid response");
    return { url, orderId };
  });

