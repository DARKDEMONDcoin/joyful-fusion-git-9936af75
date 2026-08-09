import { createPageRoute, useNavigate, Link } from "@/lib/router";
import { BackButton } from "@/components/BackButton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const title = "تغيير الباسورد | كورس الشغل أونلاين";
const description = "اختار باسورد جديد لحسابك وارجع كمّل من حيث ما وقفت.";

export const Route = createPageRoute({
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setHasSession(Boolean(data.session));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setHasSession(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("الباسورد لازم 6 حروف على الأقل");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("تم تغيير الباسورد ✅");
      navigate({ to: "/welcome" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة، جرّب تاني");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="relative min-h-screen bg-background font-arabic">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
        <div className="mb-6">
          <BackButton to="/auth" label="رجوع" />
        </div>
        <div className="border border-border bg-card rounded-3xl p-7 sm:p-9">
          <h1 className="mb-2 text-center text-2xl font-bold text-foreground">باسورد جديد</h1>

          {hasSession === false ? (
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              اللينك انتهى أو مش صالح.{" "}
              <Link to="/auth" className="underline">
                اطلب لينك جديد
              </Link>
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 grid gap-3">
              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                <Lock size={16} className="text-muted-foreground" />
                <input
                  type="password"
                  dir="ltr"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent placeholder:text-muted-foreground/50"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                حفظ الباسورد
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
