import type { ReactNode } from "react";
import { Link } from "@/lib/router";

/* ============================ شريط قسم (Band) ============================ */
/* كل قسم بقى له لون خلفية وعنوان كبير مختلف عن اللي قبله عشان العين تفرّق */

type Tone = "paper" | "tint" | "ink" | "accent";

const toneStyles: Record<Tone, string> = {
  paper: "bg-background text-foreground",
  tint: "bg-secondary/60 text-foreground",
  ink: "band-ink",
  accent: "bg-accent/[0.07] text-foreground",
};


export function SectionBand({
  step,
  total = 8,
  label,
  hint,
  tone = "paper",
  children,
}: {
  step: number;
  total?: number;
  label: string;
  hint: string;
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <section
      className={`relative border-t border-border ${toneStyles[tone]} [&_section]:border-t-0 [&_section]:py-0`}
    >
      <div className="mx-auto max-w-6xl px-6 pt-16 md:px-14 md:pt-20">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-[12px] font-semibold ${
              tone === "ink" ? "bg-foreground text-background" : "bg-accent text-accent-foreground"
            }`}
            dir="ltr"
          >
            {step}
          </div>

          <span className="text-[12px] font-semibold tracking-[0.16em] opacity-45" dir="ltr">
            {step} / {total}
          </span>

          <span className="text-[13px] font-semibold tracking-[0.02em]">{label}</span>
        </div>

        <p className="mt-3 max-w-[560px] text-[14px] leading-relaxed opacity-65">{hint}</p>

        <div className="mt-7 h-px w-full bg-current opacity-10" />
      </div>


      <div className="pb-16 md:pb-20">{children}</div>
    </section>
  );
}

/* عنوان بسيط (للتوافق مع أي استخدام قديم) */
export function SectionLabel({ step, label, hint }: { step: number; total?: number; label: string; hint: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-20 md:px-14">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary px-2.5 text-[13px] font-semibold text-primary-foreground">
          {step}
        </span>
        <p className="text-[13px] font-semibold text-foreground">{label}</p>
        <span className="text-border">•</span>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{hint}</p>
      </div>
      <div className="mt-5 h-px w-full bg-border" />
    </div>
  );
}


/* ============================ إيه ده بالظبط؟ ============================ */

export function WhatIsThis() {
  const rows = [
    ["إيه ده؟", "كورس أونلاين بالعربي بيعلّمك تعمل مصدر دخل بالدولار من البيت، خطوة بخطوة."],
    ["لمين؟", "لأي مصري عنده 2–3 ساعات في اليوم ولابتوب — من غير خبرة ولا رأس مال."],
    ["بتاخد إيه؟", "12 مسار دخل + خطة تنفيذ يوم بيوم + قوالب جاهزة + دعم — وصول مدى الحياة."],
    ["بتدفع كام؟", "دفعة واحدة، بالجنيه، وضمان 14 يوم فلوسك ترجع لو مش عاجبك."],
  ];

  return (
    <section id="what" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-14">
        <h2 className="text-[clamp(24px,4vw,40px)] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground">
          إيه ده بالظبط؟ <span className="text-accent">في 4 سطور</span>
        </h2>

        <dl className="mt-10 divide-y divide-border border-y border-border">
          {rows.map(([q, a]) => (
            <div key={q} className="grid gap-2 py-6 sm:grid-cols-[160px_1fr] sm:gap-8">
              <dt className="text-[15px] font-semibold text-foreground">{q}</dt>
              <dd className="text-[15px] leading-relaxed text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/auth"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-[15px] font-medium text-primary-foreground shadow-[0_12px_30px_-14px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-foreground active:scale-95"
          >
            ابدأ دلوقتي
          </Link>
          <a
            href="#pricing"
            className="text-[14px] text-secondary-foreground underline decoration-border underline-offset-4 transition-opacity hover:opacity-60"
          >
            شوف السعر واللي جوّه الكورس
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================ الرحلة في 4 خطوات ============================ */

export function HowItWorks() {
  const steps = [
    ["تختار مسارك", "بنساعدك تختار مسار واحد من 12 يناسب وقتك ومهاراتك — مش 12 في نفس الوقت."],
    ["تتعلّم بالخطة", "كل يوم فيديو قصير + مهمة واحدة تنفّذها. مفيش نظريات فاضية."],
    ["تنفّذ بالقوالب", "قوالب وسكربتات وأدوات جاهزة تنسخها وتستخدمها فورًا."],
    ["تقبض بالدولار", "بنوضّحلك تستقبل فلوسك إزاي في مصر خطوة بخطوة."],
  ];

  return (
    <section id="how" className="border-b border-border bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-14">
        <h2 className="text-[clamp(24px,4vw,40px)] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground">
          بتشتغل إزاي؟ <span className="text-accent">4 خطوات بس</span>
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          كل خطوة واضحة وليها وقت محدد — تعرف إنت فين وإيه اللي جاي.
        </p>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="glass-card hover-lift rounded-[28px] p-7">
              <span className="text-[13px] font-semibold text-accent" dir="ltr">
                0{i + 1}
              </span>
              <p className="mt-3 text-[17px] font-semibold text-foreground">{t}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
