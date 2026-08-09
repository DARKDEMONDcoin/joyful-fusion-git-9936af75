import { createPageRoute, useNavigate } from "@/lib/router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const title = "جاري تسجيل الدخول | كورس الشغل أونلاين";
const description = "بنكمّل تسجيل دخولك بحساب جوجل ونحوّلك على لوحة الطالب.";

export const Route = createPageRoute({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OAuthCallback,
});

function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let done = false;

    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const oauthError =
      params.get("error_description") ??
      params.get("error") ??
      hash.get("error_description") ??
      hash.get("error");
    if (oauthError) {
      setError(oauthError);
      return;
    }

    const finish = () => {
      if (done) return;
      done = true;
      const target = sessionStorage.getItem("auth:redirect") || "/welcome";
      sessionStorage.removeItem("auth:redirect");
      navigate({ to: target, replace: true });
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) finish();
    });

    // PKCE flow: exchange the ?code= for a session, then fall back to getSession.
    const code = params.get("code");
    const bootstrap = code
      ? supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          if (error && !data?.session) throw error;
          return data.session;
        })
      : supabase.auth.getSession().then(({ data }) => data.session);

    void bootstrap
      .then((session) => {
        if (session) finish();
      })
      .catch((err: unknown) => {
        if (!done) {
          setError(
            err instanceof Error && /apple/i.test(err.message)
              ? "تسجيل الدخول بـ Apple فشل — جرّب تاني أو استخدم جوجل/الإيميل."
              : "مقدرناش نكمّل تسجيل الدخول، جرّب تاني.",
          );
        }
      });

    const timeout = window.setTimeout(() => {
      if (!done) setError("مقدرناش نكمّل تسجيل الدخول، جرّب تاني.");
    }, 10000);

    return () => {
      sub.subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [navigate]);


  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center font-arabic"
    >
      {error ? (
        <>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => navigate({ to: "/auth", replace: true })}
            className="glass-card rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] text-foreground"
          >
            رجوع لصفحة الدخول
          </button>
        </>
      ) : (
        <>
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">لحظة… بنكمّل تسجيل دخولك</p>
        </>
      )}
    </div>
  );
}
