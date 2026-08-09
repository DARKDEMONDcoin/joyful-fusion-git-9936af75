import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BackButton } from "@/components/BackButton";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { COURSE_PRICE_EGP, getMyStudent } from "@/lib/course.functions";

const title = "أهلاً بيك | كورس الشغل أونلاين";
const description = "خطوة واحدة فاصلة بينك وبين فتح محتوى كورس الشغل أونلاين والأرباح بالدولار.";

export const Route = createFileRoute("/_authenticated/welcome")({
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
  component: Welcome,
});

const POINTS = [
  "١٢ مسار كامل للشغل أونلاين — من أول عميل لحد الوكالة.",
  "الذكاء الاصطناعي: تبني مواقع وتطبيقات في أيام مش شهور.",
  "علم نفس البيع: تعرف تقنع أي حد يدفعلك.",
  "دفع مرة واحدة… ومعاك مدى الحياة بكل التحديثات.",
];

function Welcome() {
  const navigate = useNavigate();
  const fetchStudent = useServerFn(getMyStudent);
  const { data } = useQuery({ queryKey: ["my-student"], queryFn: () => fetchStudent() });

  useEffect(() => {
    if (data?.has_access) navigate({ to: "/dashboard", replace: true });
  }, [data, navigate]);

  return (
    <div dir="rtl" className="min-h-screen bg-background font-arabic">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-14">
        <div className="mb-10">
          <BackButton to="/" label="رجوع" />
        </div>

        <p className="mb-5 text-xs uppercase tracking-[3px] text-muted-foreground">
          تم إنشاء حسابك
        </p>
        <h1 className="mb-5 text-4xl font-medium leading-tight tracking-[-1px] text-foreground sm:text-5xl">
          تحب تسجل <span className="text-accent">معانا؟</span>
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
          حسابك جاهز، بس المحتوى لسه مقفول. سجّل مرة واحدة بـ{" "}
          <span className="text-foreground">{COURSE_PRICE_EGP.toLocaleString("en-US")} جنيه</span>{" "}
          وافتح كل حاجة على طول.
        </p>

        <ul className="mb-11 divide-y divide-border/50 border-y border-border/50">
          {POINTS.map((p) => (
            <li key={p} className="py-4 text-base leading-relaxed text-secondary-foreground">
              {p}
            </li>
          ))}
        </ul>

        <div className="grid gap-3">
          <Link
            to="/checkout"
            className="rounded-full bg-foreground py-4 text-center text-base font-semibold text-background transition-opacity hover:opacity-85"
          >
            أيوه، عايز أسجل وأفتح المحتوى
          </Link>
          <Link
            to="/"
            className="glass-card rounded-full py-4 text-center text-base text-foreground"
          >
            اقرأ المميزات تاني
          </Link>
          <Link to="/dashboard" className="pt-2 text-center text-sm text-muted-foreground">
            بعدين — دخّلني لوحة الطالب
          </Link>
        </div>
      </div>
    </div>
  );
}
