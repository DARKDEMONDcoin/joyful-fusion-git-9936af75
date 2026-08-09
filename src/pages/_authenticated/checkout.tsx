import { company } from "@/lib/company";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { COURSE_INCLUDES } from "@/components/sections";
import { COURSE_PRICE_EGP, createKashierCheckout, getMyStudent } from "@/lib/course.functions";

const title = "الباقة والدفع | كورس الشغل أونلاين";
const description =
  "باقة كورس الشغل أونلاين: 12 مسار دخل، علم نفس البيع، خطة 60 يوم، وتحديثات مدى الحياة — دفعة واحدة 999 جنيه.";

export const Route = createFileRoute("/_authenticated/checkout")({
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
  component: CheckoutPage,
});
const PAY_METHODS = [
  {
    title: "بطاقات بنكية",
    detail: "فيزا وماستركارد وميزة — بنكية أو مسبقة الدفع، مؤمّنة بـ 3D Secure.",
  },
  {
    title: "محافظ الموبايل",
    detail: "فودافون كاش، اتصالات كاش، أورنج كاش، وي باي — من غير ما تمتلك كارت.",
  },
  {
    title: "تقسيط",
    detail: "تقسيط بطاقات البنوك وvalU وأمان وسهولة — حسب المتاح على حسابك.",
  },
  {
    title: "Apple Pay",
    detail: "لو بتدفع من آيفون بتلاقيه ظاهر على صفحة كاشير على طول.",
  },
];

const AFTER_PAY = [
  "بيتم تحويلك لصفحة كاشير المؤمّنة وتختار الطريقة اللي تناسبك.",
  "بعد نجاح الدفع بترجع للوحة الطالب والمحتوى بيتفتح تلقائيًا.",
  "بيظهر لك كود التسجيل الخاص بيك — انسخه.",
  "ابعت الكود على تليجرام @eigiza عشان تتضم لجروب الطلاب والمنصة.",
];


function CheckoutPage() {
  const navigate = useNavigate();
  const fetchStudent = useServerFn(getMyStudent);
  const startCheckout = useServerFn(createKashierCheckout);
  const [paying, setPaying] = useState(false);

  const { data } = useQuery({ queryKey: ["my-student"], queryFn: () => fetchStudent() });

  useEffect(() => {
    if (data?.has_access) navigate({ to: "/dashboard", replace: true });
  }, [data, navigate]);

  async function onPay() {
    setPaying(true);
    try {
      const { url } = await startCheckout();
      window.location.href = url;
    } catch {
      toast.error("الدفع مش متاح دلوقتي — كلّمنا على تليجرام @eigiza ونفعّلك يدوي");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background font-arabic">
      <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <div className="mb-12">
          <BackButton to="/" label="رجوع" />
        </div>

        <h1 className="mb-14 max-w-2xl text-4xl font-medium leading-[1.1] tracking-[-1px] text-foreground sm:text-6xl">
          باقة واحدة… بتفتح{" "}
          <span className="text-accent">كل حاجة للأبد</span>
        </h1>

        <div className="grid gap-10 md:grid-cols-[1fr_360px] md:items-start">
          {/* اللي بتاخده */}
          <div>
            <h2 className="mb-6 text-lg font-semibold text-foreground">اللي بتاخده</h2>
            <ul className="divide-y divide-border/50 border-y border-border/50">
              {COURSE_INCLUDES.map((f) => (
                <li key={f} className="flex items-start gap-3 py-4">
                  <Check size={16} className="mt-1 shrink-0 text-foreground" />
                  <span className="text-base leading-relaxed text-secondary-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              الدفع مرة واحدة — مفيش اشتراك شهري ومفيش رسوم مخفية. بعد الدفع بيفتح المحتوى فورًا
              ويظهر لك كود التسجيل الخاص بيك.
            </p>

            <h2 className="mb-6 mt-14 text-lg font-semibold text-foreground">طرق الدفع المتاحة</h2>
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/50 sm:grid-cols-2">
              {PAY_METHODS.map((m) => (
                <li key={m.title} className="bg-background p-5">
                  <p className="mb-1.5 text-sm font-semibold text-foreground">{m.title}</p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{m.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
              الطرق الظاهرة قدامك على صفحة كاشير بتتحدد حسب المفعّل في حساب التاجر ونوع كارتك. لو
              طريقة معيّنة مش ظاهرة، كلّمنا على تليجرام{" "}
              <a
                href="https://t.me/eigiza"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                @eigiza
              </a>{" "}
              ونظبّطهالك.
            </p>

            <h2 className="mb-6 mt-14 text-lg font-semibold text-foreground">بيحصل إيه بعد الدفع</h2>
            <ol className="divide-y divide-border/50 border-y border-border/50">
              {AFTER_PAY.map((s, i) => (
                <li key={s} className="flex items-start gap-3 py-4">
                  <span className="mt-0.5 w-5 shrink-0 font-sans text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] leading-relaxed text-secondary-foreground">{s}</span>
                </li>
              ))}
            </ol>
          </div>


          {/* ملخص الدفع */}
          <aside className="glass-card rounded-2xl p-7 md:sticky md:top-8">
            <div className="flex items-end gap-3">
              <span className="font-sans text-5xl font-semibold text-foreground">
                {COURSE_PRICE_EGP.toLocaleString("en-US")}
              </span>
              <span className="pb-2 text-base text-muted-foreground">جنيه</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground/70 line-through">4,500 جنيه</p>

            <dl className="mt-7 space-y-3 border-t border-border/50 pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">الباقة</dt>
                <dd className="text-foreground">وصول كامل — مدى الحياة</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">نوع الدفع</dt>
                <dd className="text-foreground">دفعة واحدة</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">الإجمالي</dt>
                <dd className="font-semibold text-foreground">
                  {COURSE_PRICE_EGP.toLocaleString("en-US")} جنيه
                </dd>
              </div>
            </dl>

            <button
              onClick={onPay}
              disabled={paying}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 text-base font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {paying && <Loader2 size={16} className="animate-spin" />}
              ادفع بأمان عن طريق كاشير
            </button>

            <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
              كارت بنكي أو محفظة موبايل أو تقسيط — كله مؤمّن بالكامل عن طريق Kashier بـ 3D Secure،
              وإحنا مش بنشوف بيانات الكارت.
            </p>


            <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
              بالدفع إنت موافق على{" "}
              <Link to="/terms" className="underline underline-offset-4">
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link to="/privacy" className="underline underline-offset-4">
                سياسة الخصوصية
              </Link>{" "}
              و{" "}
              <Link to="/refund" className="underline underline-offset-4">
                سياسة الاسترداد ({company.refundDays} يوم)
              </Link>
              .
            </p>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
              البائع: {company.legalNameAr} — س.ت {company.commercialRegister} · ر.ض {company.taxId}
            </p>

            <Link
              to="/dashboard"
              className="mt-5 block text-center text-sm text-muted-foreground hover:text-foreground"
            >
              رجوع لوحة الطالب
            </Link>

          </aside>
        </div>
      </div>
    </div>
  );
}
