import { createPageRoute, Link } from "@/lib/router";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import heroPoster from "@/assets/hero-poster.webp";
import secTracks from "@/assets/sec-tracks.webp";
import secProof from "@/assets/sec-proof.webp";
import { SiteNav } from "@/components/SiteNav";
import { CtaSection } from "@/components/CtaSection";
import { Counter, Marquee, Reveal } from "@/components/motion";
import { tracks } from "@/lib/tracks";
import {
  AudienceSection,
  ComparisonSection,
  CurriculumSection,
  faqs,
  FaqSection,
  FounderSection,
  
  MoneyMathSection,
  PainSection,
  PricingSection,
  SiteFooter,
  
  StickyCta,
  TrustStrip,
} from "@/components/sections";



const title = "اشتغل أونلاين واكسب بالدولار من مصر | 12 مسار دخل";
const description =
  "مش كورس فريلانس: 12 مسار دخل أونلاين — تجارة إلكترونية، ذكاء اصطناعي وأتمتة، منتجات رقمية واشتراكات، محتوى وعمولات — بخطة يوم بيوم لحد أول دولار. 999 جنيه.";


const SITE = "https://egyptian-empire-quest.lovable.app";
const ogImage = `${SITE}/og-image.jpg`;

export const Route = createPageRoute({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/` },
      { rel: "preload", as: "image", href: heroPoster, fetchPriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          name: "كورس الشغل أونلاين والكسب بالدولار",
          description,
          inLanguage: "ar",
          url: `${SITE}/`,
          image: ogImage,
          provider: {
            "@type": "Organization",
            name: "ميغسي لتطوير المنصات الرقمية",
            url: SITE,
          },
          offers: {
            "@type": "Offer",
            price: "999",
            priceCurrency: "EGP",
            category: "Paid",
            availability: "https://schema.org/InStock",
            url: `${SITE}/auth`,
          },
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            courseWorkload: "PT38H",
            inLanguage: "ar",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Index,
});

const ticker = [
  "12 مسار دخل · تختار واحد وتمشي عليه خطوة بخطوة",
  "خدماتك بالدولار · نفس الشغل بسعر السوق العالمي",
  "متجر إلكتروني · هامش ربح محسوب قبل ما تصرف جنيه إعلان",
  "ذكاء اصطناعي وأتمتة · الشركات بتدفع شهري عشان توفّر وقت",
  "منتجات رقمية · تبنيها مرة وتفضل تتباع وإنت نايم",
  "براند شخصي · رعاية وعمولات وأفلييت من جمهورك",
  "بيع High-Ticket · نسبة من كل صفقة بتقفلها",
  "استلام فلوسك في مصر · طرق قانونية وموثّقة خطوة بخطوة",
  "قوالب وسكربتات جاهزة · تنسخ وتستخدم من أول يوم",
  "تحديثات مدى الحياة · دفعة واحدة بـ 999 جنيه",
  "دعم مباشر · جروب الطلاب ورد على أسئلتك",
];


/* أمثلة سوق عامة — مش شهادات ولا وعود دخل */
const marketCases = [
  {
    tag: "خدمات ومهارات",
    title: "عميل واحد بالدولار",
    text: "أسعار المستقلين العرب معروضة علنًا على Upwork و Fiverr. أول عقد صغير ممكن يعادل راتب شهر هنا — محتاج عرض واضح وتواصل حقيقي.",
    foot: "مهارة → عرض → عميل → عقد شهري",
  },
  {
    tag: "تجارة وأصول رقمية",
    title: "دخل مش مربوط بساعاتك",
    text: "المتجر أو المنتج الرقمي بيشتغل وإنت نايم، وهو أصل ليه قيمة تقدر تبيعه. اللعبة أرقام: التكلفة، الهامش، ونسبة التحويل.",
    foot: "منتج → اختبار → توسّع → أصل",
  },
  {
    tag: "ذكاء اصطناعي وأتمتة",
    title: "الشركات بتدفع عشان توفّر",
    text: "أي نظام بيوفّر على شركة ساعات شغل كل يوم ليه سعر شهري. أسرع سوق بيكبر دلوقتي، والدخول محتاج أدوات مش شهادة.",
    foot: "أداة → نيتش → عقد شهري → وكالة",

  },
];


function Index() {
  return (
    <div dir="rtl" className="paper-grain min-h-screen overflow-x-hidden bg-background font-arabic">
      <Hero />

      <TrustStrip />
      <Marquee items={ticker} />

      <PainSection />
      <MoneyMathSection />
      <TracksList />
      <CurriculumSection />
      <Proof />
      <ComparisonSection />
      <AudienceSection />
      <FounderSection />
      


      <PricingSection />
      <FaqSection />
      <CtaSection />
      <SiteFooter />
      <StickyCta />
    </div>
  );
}


/* ============================ الهيرو — واجهة جريدة ============================ */

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-background">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={HERO_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,26,42,0.55)_0%,rgba(0,26,42,0.35)_45%,rgba(0,26,42,0.75)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <SiteNav />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center md:py-[90px]">



          <h1
            className="animate-fade-rise max-w-5xl font-display text-[clamp(38px,7vw,80px)] font-normal leading-[1.25] tracking-[-0.02em] text-foreground [text-wrap:balance]"
          >
            من مصر… تبني إمبراطورية دخل{" "}
            <em className="not-italic text-muted-foreground">بالدولار.</em>
          </h1>

          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
            مش سبوبة ولا شغل فريلانس بالساعة. ده نظام كامل لبناء أصول رقمية بتملكها: 12 محرك دخل —
            تجارة إلكترونية، ذكاء اصطناعي وأتمتة، منتجات واشتراكات، ووكالات — بخطة يوم بيوم من أول
            دولار يوصلك لحد بيزنس بيكبر من غيرك.
          </p>


          <div className="animate-fade-rise-delay-2 mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/auth"
              className="liquid-glass group inline-flex items-center justify-center gap-2 rounded-full px-14 py-5 text-base text-foreground transition-transform hover:scale-[1.03]"
            >
              ابدأ مسارك دلوقتي
              <ArrowLeft
                size={17}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
            <a
              href="#tracks"
              className="inline-flex items-center justify-center rounded-full border border-border px-10 py-5 text-base text-foreground/85 transition-colors hover:text-foreground"
            >
              شوف الـ 12 مسار
            </a>
          </div>

          <dl className="animate-fade-rise-delay-2 mt-14 grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
            {[
              ["عدد المسارات", "12 مسار"],
              ["مدة الخطة", "60 يوم"],
              ["ساعات المحتوى", "38 ساعة"],
              ["الوصول", "مدى الحياة"],
            ].map(([k, v]) => (
              <div key={k} className="text-center">
                <dd className="text-[15px] font-semibold text-foreground">{v}</dd>
                <dt className="mt-1 text-[12px] text-muted-foreground">{k}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex justify-center pb-8">
          <ChevronDown size={18} className="scroll-cue text-muted-foreground" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}




/* ============================ المسارات ============================ */

function TracksList() {
  const [open, setOpen] = useState<string | null>(tracks[0]?.slug ?? null);

  return (
    <section id="tracks" className="border-t border-border bg-secondary/25 py-16 md:py-24">
      <div className="mx-auto max-w-[1080px] px-6">
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-[560px] font-display text-[clamp(30px,5.4vw,54px)] leading-[1.06] tracking-[-0.02em] text-foreground">
              12 مسار دخل. <span className="text-accent">تختار واحد.</span>
            </h2>
            <p className="max-w-[320px] text-[15px] leading-relaxed text-muted-foreground">
              كل مسار جواه خطة يوم بيوم، الأدوات بالاسم، أسعار السوق الحقيقية، وطريقة أول عميل.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mb-12 overflow-hidden  border border-border">
            <img
              src={secTracks}
              alt="لوحة تحليلات متجر إلكتروني بتوضح المبيعات ونسبة التحويل"
              loading="lazy"
              decoding="async"
              width={1600}
              height={1000}
              className="editorial-img h-[190px] w-full object-cover sm:h-[300px]"
            />
          </div>
        </Reveal>

        <div className="border-t border-border">
          {tracks.map((t) => {
            const isOpen = open === t.slug;
            return (
              <div key={t.slug} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : t.slug)}
                  aria-expanded={isOpen}
                  className="track-row flex w-full items-center gap-4 px-3 py-5 text-right sm:px-5"
                >
                  <span dir="ltr" className="w-8 shrink-0 text-[13px] text-muted-foreground">
                    {t.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16.5px] font-semibold text-foreground">
                      {t.title}
                    </span>
                  </span>
                  <span
                    dir="ltr"
                    className="hidden shrink-0 text-[13px] text-accent sm:block"
                  >
                    {t.income}
                  </span>
                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-7 sm:px-5 sm:pr-[60px]">
                    <p className="max-w-[640px] text-[15px] leading-relaxed text-muted-foreground">
                      {t.short}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
                      <span dir="ltr" className="text-accent sm:hidden">
                        {t.income}
                      </span>
                      <span className="text-muted-foreground">
                        أول فلوس: <span className="text-foreground">{t.timeToFirstMoney}</span>
                      </span>
                      <span className="text-muted-foreground">
                        رأس المال: <span className="text-foreground">{t.capital}</span>
                      </span>
                    </div>
                    <Link
                      to="/tracks/$slug"
                      params={{ slug: t.slug }}
                      className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      افتح المسار كامل
                      <ArrowLeft size={15} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================ النتايج ============================ */

function Proof() {
  return (
    <section id="proof" className="mx-auto max-w-[1080px] px-6 py-16 md:py-24">
      <Reveal>
        <h2 className="max-w-[640px] font-display text-[clamp(30px,5.4vw,54px)] leading-[1.06] tracking-[-0.02em] text-foreground">
          مش شهادات مفبركة — <span className="text-accent">أرقام سوق تقدر تشوفها بنفسك</span>.
        </h2>
        <p className="mt-5 max-w-[620px] text-[15.5px] leading-[1.9] text-muted-foreground">
          أي حد يقدر يطبع لقطة تحويل. إحنا بنوريك السوق نفسه: الأسعار المعلنة وطريقة حساب الأرباح
          — وتقرر بعقلك.
        </p>

      </Reveal>

      <Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9 border-y border-border py-9 md:grid-cols-4">
          {[
            { n: 12, l: "مسار دخل مختلف" },
            { n: 38, suffix: " ساعة", l: "محتوى عملي" },
            { n: 60, suffix: " يوم", l: "خطة يوم بيوم" },
            { n: 120, suffix: "+ قالب", l: "أدوات جاهزة للتنفيذ" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-[26px] font-semibold tracking-tight text-foreground">
                <Counter to={s.n} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-12 overflow-hidden  border border-border">
          <img
            src={secProof}
            alt="أدوات استلام الأرباح من الخارج للمصريين: Payoneer وWise وتحويل بنكي"
            loading="lazy"
            decoding="async"
            width={1600}
            height={1000}
            className="editorial-img h-[190px] w-full object-cover sm:h-[300px]"
          />
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {marketCases.map((c, i) => (
          <Reveal key={c.tag} delay={i * 0.08}>
            <article className="flex h-full flex-col border-t border-border pt-6">
              <span className="text-[11px] font-semibold tracking-[0.24em] text-accent">
                {c.tag}
              </span>
              <h3 className="mb-3 mt-3 text-[19px] font-semibold text-foreground">{c.title}</h3>
              <p className="flex-1 text-[15px] leading-[1.95] text-muted-foreground">{c.text}</p>
              <p className="mt-6 border-t border-border pt-4 text-[13px] text-secondary-foreground">
                {c.foot}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <p className="mt-10 border border-border bg-secondary px-6 py-5 text-[13.5px] leading-[1.9] text-muted-foreground">
        <span className="font-semibold text-foreground">للتوضيح:</span> الأرقام فوق أمثلة لأسعار
        سوق عامة وطرق حساب — مش وعد بدخل ولا ضمان نتيجة. إحنا بنبيع تعليم وخطة تنفيذ، والنتيجة
        بتتوقف على شغلك ووقتك والسوق اللي تختاره.
      </p>
    </section>
  );
}

