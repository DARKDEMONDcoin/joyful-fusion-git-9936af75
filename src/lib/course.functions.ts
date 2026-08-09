import { supabase } from "@/integrations/supabase/client";

export const COURSE_PRICE_EGP = 999;
const HTTPS_PREVIEW_ORIGIN =
  "https://id-preview--cc3dadaa-d10d-4d7b-b209-717aed080420.lovable.app";

export type StudentRecord = {
  full_name: string | null;
  phone: string | null;
  telegram_username: string | null;
  access_code: string;
  has_access: boolean;
};

const STUDENT_COLUMNS = "full_name, phone, telegram_username, access_code, has_access";

async function requireUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("غير مسجّل الدخول");
  return data.user.id;
}

export async function getMyStudent(): Promise<StudentRecord> {
  const userId = await requireUserId();

  const existing = await supabase
    .from("course_students")
    .select(STUDENT_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();
  if (existing.error) throw new Error(existing.error.message);
  if (existing.data) return existing.data as StudentRecord;

  const created = await supabase
    .from("course_students")
    .insert({ user_id: userId })
    .select(STUDENT_COLUMNS)
    .single();
  if (created.error) throw new Error(created.error.message);
  return created.data as StudentRecord;
}

export async function updateMyStudent(input: {
  data: { full_name?: string; phone?: string; telegram_username?: string };
}) {
  const userId = await requireUserId();
  const payload = {
    full_name: input.data.full_name?.trim().slice(0, 80) ?? null,
    phone: input.data.phone?.trim().slice(0, 20) ?? null,
    telegram_username: input.data.telegram_username?.trim().slice(0, 40) ?? null,
  };

  const { error } = await supabase.from("course_students").update(payload).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

/**
 * Creates the Kashier order server-side (Supabase Edge Function) and returns
 * the hosted checkout URL to redirect the customer to.
 */
export async function createKashierCheckout(): Promise<{ url: string; orderId: string }> {
  const origin =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? HTTPS_PREVIEW_ORIGIN
      : window.location.origin;
  const { data, error } = await supabase.functions.invoke<{
    url?: string;
    checkoutUrl?: string;
    checkout_url?: string;
    payment_url?: string;
    orderId?: string;
    order_id?: string;
  }>("kashier-checkout", {
    body: { sku: "course_lifetime", origin },
  });
  if (error) throw new Error(error.message);

  const url = data?.url ?? data?.checkoutUrl ?? data?.checkout_url ?? data?.payment_url;
  if (!url) throw new Error("تعذّر بدء عملية الدفع");
  return { url, orderId: data?.orderId ?? data?.order_id ?? "" };
}

