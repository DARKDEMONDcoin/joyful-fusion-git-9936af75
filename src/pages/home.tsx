import { createPageRoute, Link } from "@/lib/router";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import heroPoster from "@/assets/hero-poster.webp";
import secTracks from "@/assets/sec-tracks.webp";
import secProof from "@/assets/sec-proof.webp";
import { SiteNav } from "@/components/SiteNav";
import { Counter, Marquee, Reveal } from "@/components/motion";
import { tracks } from "@/lib/tracks";
import {
  AudienceSection,
  ComparisonSection,
  CurriculumSection,
  faqs,
  FaqSection,
  FounderSection,
  GuaranteeSection,
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
  "ضمان 14 يوم · تسترجع فلوسك من غير أسئلة",
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
      <GuaranteeSection />


      <PricingSection />
      <FaqSection />
      <SiteFooter />
      <StickyCta />
    </div>
  );
}


/* ============================ الهيرو — واجهة جريدة ============================ */

function Hero() {
  const today = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="relative w-full bg-background">
      <div className="mx-auto w-full max-w-[1240px] border-x border-border">
        <SiteNav />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-2.5 text-[11.5px] tracking-[0.08em] text-muted-foreground md:px-14">
          <span>{today}</span>
          <span className="hidden sm:inline">العدد الأول · دليل الدخل بالدولار من مصر</span>
          <span dir="ltr">999 EGP · مدى الحياة</span>
        </div>

        <div className="grid gap-10 px-6 py-14 md:px-14 md:py-20 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="h-px w-12 bg-accent" aria-hidden="true" />
              <span className="text-[11px] font-semibold tracking-[0.3em] text-accent">
                افتتاحية العدد
              </span>
            </motion.div>

            <h1 className="font-display text-[clamp(44px,8.5vw,92px)] font-bold leading-[1.06] text-foreground">
              {["راتبك بالجنيه…", "ومصاريفك بالدولار"].map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08 + i * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
                  className={i === 1 ? "block text-accent" : "block"}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <div className="mt-8 border-t border-foreground pt-6 md:columns-2 md:gap-10">
              <p className="text-[16px] leading-[1.9] text-secondary-foreground">
                <span className="font-display text-[19px] font-bold text-accent">فرق العملة</span>
                {" "} بيشتغل لصالحك: نفس الشغل اللي بيتدفع فيه بالجنيه هنا، بيتدفع فيه بالدولار بره.
              </p>
              <p className="mt-4 text-[16px] leading-[1.9] text-muted-foreground">
                مش كورس فريلانس: 12 مسار دخل — تختار واحد وتمشي على خطة يوم بيوم لحد أول دولار.
              </p>

            </div>



            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/auth"
                className="group inline-flex h-[54px] items-center justify-center gap-2 bg-accent px-8 text-[15px] font-semibold text-accent-foreground transition-colors hover:bg-[--color-gold-soft]"
              >
                ابدأ دلوقتي
                <ArrowLeft
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
              </Link>
              <a
                href="#tracks"
                className="inline-flex h-[54px] items-center justify-center border border-foreground px-7 text-[15px] font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                شوف الـ 12 مسار
              </a>
            </div>
          </div>

          <aside className="border-t border-border pt-8 lg:border-r lg:border-t-0 lg:pr-10 lg:pt-0">
            <figure className="border border-border">
              <img
                src={heroPoster}
                alt="طالب مصري بيشتغل أونلاين من مكتبه ويستلم أرباحه بالدولار"
                fetchPriority="high"
                decoding="async"
                width={1920}
                height={1088}
                className="editorial-img h-[240px] w-full object-cover"
              />
              <figcaption className="border-t border-border px-4 py-2.5 text-[12px] text-muted-foreground">
                شغل أونلاين من مصر — بأدوات وأسواق متاحة لأي حد النهاردة.


              </figcaption>
            </figure>

            <dl className="mt-8 divide-y divide-border border-y border-border">
              {[
                ["عدد المسارات", "12 مسار"],
                ["مدة الخطة", "60 يوم"],
                ["ساعات المحتوى", "38 ساعة"],
                ["الضمان", "14 يوم استرداد"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="text-[13px] text-muted-foreground">{k}</dt>
                  <dd className="text-[14px] font-semibold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-[12.5px] leading-relaxed text-muted-foreground">
              باقة واحدة · دفعة واحدة · وصول مدى الحياة. الأسعار بتزيد مع كل تحديث، والسعر بيتثبّت
              لحظة الاشتراك.
            </p>
          </aside>
        </div>

        <div className="flex justify-center border-t border-border pb-6 pt-5">
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
            { n: 14, suffix: " يوم", l: "ضمان استرداد" },
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

