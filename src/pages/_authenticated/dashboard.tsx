import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check, Copy, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BackButton } from "@/components/BackButton";
import { COURSE_PRICE_EGP, getMyStudent, updateMyStudent } from "@/lib/course.functions";

const title = "لوحة الطالب | كورس الشغل أونلاين";
const description = "بياناتك، كود التسجيل، وحالة الدفع والوصول لمحتوى كورس الشغل أونلاين.";

export const Route = createFileRoute("/_authenticated/dashboard")({
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
  component: Dashboard,
});

/* حقل بأسلوب iPhone: صف نظيف بعنوان صغير على اليمين */
function Field({
  label,
  value,
  onChange,
  placeholder,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="flex items-center gap-4 px-5 py-4">
      <span className="w-28 shrink-0 text-sm text-muted-foreground">{label}</span>
      <input
        value={value}
        dir={dir}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent placeholder:text-muted-foreground/50"
      />
    </label>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchStudent = useServerFn(getMyStudent);
  const saveStudent = useServerFn(updateMyStudent);

  // Returning from Kashier the webhook may land a second or two after the
  // redirect, so poll briefly instead of showing a locked page to a paying user.
  const [justPaid, setJustPaid] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("paid")) {
      setJustPaid(true);
      const t = setTimeout(() => setJustPaid(false), 45000);
      return () => clearTimeout(t);
    }
    return;
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["my-student"],
    queryFn: () => fetchStudent(),
    refetchInterval: (q) => (justPaid && !q.state.data?.has_access ? 3000 : false),
  });


  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    setFullName(data.full_name ?? "");
    setPhone(data.phone ?? "");
    setTelegram(data.telegram_username ?? "");
  }, [data]);

  async function onSave() {
    setSaving(true);
    try {
      await saveStudent({ data: { full_name: fullName, phone, telegram_username: telegram } });
      await queryClient.invalidateQueries({ queryKey: ["my-student"] });
      toast.success("تم حفظ بياناتك");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "مش قادر أحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function onSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background font-arabic">
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
        <div className="mb-10 flex items-center justify-between gap-4">
          <BackButton to="/" label="الرئيسية" />
          <button
            onClick={onSignOut}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            خروج
          </button>
        </div>

        <h1 className="mb-12 text-4xl font-medium leading-tight tracking-[-1px] text-foreground sm:text-5xl">
          حسابك <span className="text-accent">وكودك</span>
        </h1>

        {isLoading || !data ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-6">
            {/* حالة الوصول */}
            <div className="rounded-3xl border border-border bg-card p-7">
              {data.has_access ? (
                <>
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground">
                      <Check size={15} className="text-background" />
                    </span>
                    <h2 className="text-lg font-semibold text-foreground">الوصول مفتوح</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    ابعت كود التسجيل على تليجرام{" "}
                    <a
                      href="https://t.me/eigiza"
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground underline underline-offset-4"
                    >
                      @eigiza
                    </a>{" "}
                    وهيتم ضمّك لجروب الطلاب ومنصة المحتوى فورًا.
                  </p>
                </>
              ) : justPaid ? (
                <>
                  <div className="mb-3 flex items-center gap-2.5">
                    <Loader2 size={17} className="animate-spin text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">بنأكد الدفع…</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    استنى ثواني، الصفحة بتحدّث نفسها لوحدها. لو الدفع اتلغى أو فشل تقدر تجرب تاني من{" "}
                    <Link to="/checkout" className="text-foreground underline underline-offset-4">
                      صفحة الدفع
                    </Link>
                    .
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-3 flex items-center gap-2.5">
                    <Lock size={17} className="text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">المحتوى لسه مقفول</h2>
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    دفعة واحدة {COURSE_PRICE_EGP.toLocaleString("en-US")} جنيه بتفتح المحتوى كامل +
                    التحديثات مدى الحياة.
                  </p>
                  <Link
                    to="/checkout"
                    className="block rounded-full bg-foreground py-3.5 text-center text-base font-semibold text-background transition-opacity hover:opacity-85"
                  >
                    افتح المحتوى دلوقتي
                  </Link>
                </>
              )}

            </div>

            {/* الكود */}
            <div className="rounded-3xl border border-border bg-card p-7">
              <h2 className="mb-4 text-lg font-semibold text-foreground">كود التسجيل</h2>
              <div className="flex items-center gap-3">
                <code
                  dir="ltr"
                  className="flex-1 rounded-2xl bg-secondary/60 px-4 py-3.5 text-center font-sans text-lg tracking-[0.25em] text-foreground"
                >
                  {data.access_code}
                </code>
                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(data.access_code);
                    toast.success("تم نسخ الكود");
                  }}
                  aria-label="نسخ الكود"
                  className="rounded-2xl bg-secondary/60 p-3.5 text-foreground transition-colors hover:bg-secondary"
                >
                  <Copy size={16} />
                </button>
              </div>
              <a
                href="https://t.me/eigiza"
                target="_blank"
                rel="noreferrer"
                className="mt-4 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                ابعت الكود على تليجرام @eigiza
              </a>
            </div>

            {/* بياناتك */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <h2 className="px-5 pb-2 pt-6 text-lg font-semibold text-foreground">بياناتك</h2>
              <div className="divide-y divide-border/60">
                <Field
                  label="الاسم"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="الاسم بالكامل"
                />
                <Field
                  label="الموبايل"
                  value={phone}
                  onChange={setPhone}
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                />
                <Field
                  label="تليجرام"
                  value={telegram}
                  onChange={setTelegram}
                  placeholder="@username"
                  dir="ltr"
                />
              </div>
              <div className="p-5">
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3.5 text-sm font-semibold text-secondary-foreground transition-opacity hover:opacity-85 disabled:opacity-60"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />} حفظ البيانات
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
