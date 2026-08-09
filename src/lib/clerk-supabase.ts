/**
 * جسر بين Clerk (Third-Party Auth) و Supabase.
 * Clerk مفعّل في Supabase → Authentication → Third-Party Auth،
 * فنمرر توكن Clerk لـ Supabase كي تعمل الـ RLS مع مستخدمي أبل.
 */
type TokenGetter = () => Promise<string | null>;

let getter: TokenGetter | null = null;

export function setClerkTokenGetter(fn: TokenGetter | null) {
  getter = fn;
}

export async function getClerkToken(): Promise<string | null> {
  if (!getter) return null;
  try {
    return await getter();
  } catch {
    return null;
  }
}

export const CLERK_PUBLISHABLE_KEY =
  (import.meta.env["VITE_CLERK_PUBLISHABLE_KEY"] as string | undefined) ?? "";

export const clerkEnabled = CLERK_PUBLISHABLE_KEY.startsWith("pk_");
