import { createPageRoute, Link, useNavigate } from "@/lib/router";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Apple, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useSignIn } from "@clerk/clerk-react";
import { clerkEnabled } from "@/lib/clerk-supabase";


const title = "تسجيل الدخول | كورس الشغل أونلاين";
const description =
  "سجّل حسابك ودخول على محتوى كورس الشغل أونلاين وكسب الدولار — تسجيل بالإيميل أو جوجل أو Apple.";

export const Route = createPageRoute({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function arabicAuthError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const m = raw.toLowerCase();
  if (m.includes("unsupported provider") || m.includes("provider is not enabled"))
    return "تسجيل الدخول بـ Apple مش مفعّل حالياً — استخدم جوجل أو الإيميل.";
  if (m.includes("already registered") || m.includes("already exists"))
    return "الإيميل ده مسجّل عندنا بالفعل — اعمل دخول بنفس الإيميل.";
  if (m.includes("invalid login credentials"))
    return "الإيميل أو الباسورد غلط. لو ناسي الباسورد اضغط «نسيت الباسورد».";
  if (m.includes("email not confirmed"))
    return "لازم تأكد الإيميل الأول من اللينك المبعوت لك.";
  if (m.includes("password should be at least"))
    return "الباسورد قصير — خليه 6 حروف أو أكتر.";
  if (m.includes("invalid") && m.includes("email")) return "الإيميل مش مكتوب صح.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "جرّبت كتير في وقت قصير — استنى دقيقة وحاول تاني.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "النت واقع أو الاتصال بالسيرفر فشل — جرّب تاني.";
  return raw || "حصلت مشكلة، جرّب تاني";
}

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { signIn: clerkSignIn, isLoaded: clerkReady } = useSignIn();
  const [providers, setProviders] = useState<{ apple: boolean; google: boolean }>({
    apple: clerkEnabled,
    google: true,
  });

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? "/welcome";

  useEffect(() => setReady(true), []);

  // اكتشاف المزوّدين المفعّلين فعليًا على Supabase (يظهر زر أبل تلقائيًا بعد تفعيله)
  useEffect(() => {
    const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
    const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

    if (!url || !key) return;
    let active = true;
    void fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!active || !json?.external) return;
        setProviders({
          // أبل يعمل عبر Supabase مباشرة أو عبر Clerk (Third-Party Auth)
          apple: Boolean(json.external.apple) || clerkEnabled,
          google: Boolean(json.external.google),
        });
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);


  // Already signed in? never show the login form again (until they sign out).
  useEffect(() => {
    if (!authLoading && session) navigate({ to: redirectTo, replace: true });
  }, [authLoading, session, navigate, redirectTo]);

  if (authLoading || session) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    const mail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      toast.error("اكتب إيميل صحيح");
      return;
    }
    if (password.length < 6) {
      toast.error("الباسورد لازم 6 حروف على الأقل");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: mail,
          password,
          options: { emailRedirectTo: window.location.origin + "/welcome" },
        });
        if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes("already registered") || msg.includes("already exists")) {
            setMode("signin");
            toast.error("الإيميل ده مسجّل بالفعل — اكتب الباسورد ودوس دخول.");
            return;
          }
          throw error;
        }
        if (!data.session) {
          toast.success("بعتنالك لينك تأكيد على الإيميل — افتحه وبعدها دخول");
          setMode("signin");
          return;
        }
        toast.success("تم إنشاء حسابك ✅");
        navigate({ to: redirectTo, replace: true });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: mail,
          password,
        });
        if (error) throw error;
        if (!data.session) throw new Error("Invalid login credentials");
        toast.success("أهلاً بيك 👋");
        navigate({ to: redirectTo, replace: true });
      }
    } catch (err) {
      toast.error(arabicAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function forgotPassword() {
    const mail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      toast.error("اكتب إيميلك الأول عشان نبعتلك لينك تغيير الباسورد");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(mail, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      toast.success("بعتنالك لينك تغيير الباسورد على الإيميل");
    } catch (err) {
      toast.error(arabicAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function oauth(provider: "google" | "apple") {
    if (loading) return;
    setLoading(true);
    try {
      // أبل مش مفعّل على Supabase Auth → نستخدم Clerk المفعّل كـ Third-Party Auth
      if (provider === "apple" && clerkEnabled) {
        if (!clerkReady || !clerkSignIn) {
          setLoading(false);
          toast.error("لحظة، جاري تجهيز تسجيل الدخول بأبل…");
          return;
        }
        sessionStorage.setItem("auth:redirect", redirectTo);
        await clerkSignIn.authenticateWithRedirect({
          strategy: "oauth_apple",
          redirectUrl: window.location.origin + "/oauth-callback",
          redirectUrlComplete: window.location.origin + "/oauth-callback",
        });
        return;
      }

      // remember where to land after the provider redirect
      sessionStorage.setItem("auth:redirect", redirectTo);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + "/oauth-callback",
          ...(provider === "google"
            ? { queryParams: { prompt: "select_account" } }
            : // Apple returns name/email only on the very first consent
              { scopes: "name email" }),
        },
      });
      if (error) throw error;
    } catch (err) {
      setLoading(false);
      toast.error(arabicAuthError(err));
    }
  }


  return (
    <div dir="rtl" className="min-h-screen bg-background font-arabic">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-14">
        <h1 className="mb-3 text-4xl font-medium leading-tight tracking-[-1px] text-foreground">
          {mode === "signup" ? "افتح حسابك " : "دخول "}
          <span className="text-accent">
            {mode === "signup" ? "دلوقتي" : "الطلاب"}
          </span>
        </h1>
        <p className="mb-8 text-base leading-relaxed text-muted-foreground">
          {mode === "signup"
            ? "دقيقة واحدة وحسابك جاهز — وبعد الدفع بيفتح المحتوى كله على طول."
            : "كمّل من حيث ما وقفت."}
        </p>

        {/* سويتش نظيف بين إنشاء حساب ودخول */}
        <div className="mb-8 grid grid-cols-2 gap-1 rounded-full bg-secondary/60 p-1">
          {(["signup", "signin"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full py-2.5 text-sm font-semibold transition-colors ${
                mode === m
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "signup" ? "حساب جديد" : "عندي حساب"}
            </button>
          ))}
        </div>

        <div className="mb-7 grid gap-3">
          {providers.google && (
          <button
            onClick={() => oauth("google")}
            disabled={loading}
            className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2a7 7 0 0 1-6.6-4.8H1.4v3.1A11.9 11.9 0 0 0 12 24Z"
              />
              <path fill="#FBBC05" d="M5.4 14.5a7.1 7.1 0 0 1 0-4.9V6.5H1.4a11.9 11.9 0 0 0 0 10.6l4-2.6Z" />
              <path
                fill="#EA4335"
                d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4A11.9 11.9 0 0 0 1.4 6.5l4 3.1A7 7 0 0 1 12 4.8Z"
              />
            </svg>
            المتابعة بحساب جوجل
          </button>
          )}
          {providers.apple && (
          <button
            onClick={() => oauth("apple")}
            disabled={loading}
            className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60 disabled:opacity-50"
          >
            <Apple size={17} className="fill-current" />
            المتابعة بحساب Apple
          </button>
          )}
        </div>



        <div className="mb-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">أو بالإيميل</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
            <Mail size={16} className="text-muted-foreground" />
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-transparent text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent placeholder:text-muted-foreground/60"
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
            <Lock size={16} className="text-muted-foreground" />
            <input
              type="password"
              dir="ltr"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent placeholder:text-muted-foreground/60"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !ready}
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-base font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === "signup" ? "إنشاء الحساب" : "دخول"}
          </button>
        </form>

        {mode === "signin" && (
          <button
            onClick={forgotPassword}
            disabled={loading}
            className="mt-6 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            نسيت الباسورد؟
          </button>
        )}

        <p className="mt-8 text-center text-[11px] leading-relaxed text-muted-foreground">
          بإنشاء حساب إنت موافق على{" "}
          <Link to="/terms" className="underline underline-offset-4">
            الشروط والأحكام
          </Link>{" "}
          و{" "}
          <Link to="/privacy" className="underline underline-offset-4">
            سياسة الخصوصية
          </Link>
        </p>
      </div>

    </div>
  );
}
