import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { faqs, SiteFooter } from "@/components/sections";

const SITE = "https://egyptian-empire-quest.lovable.app";
const title = "الأسئلة الشائعة | كورس الشغل أونلاين";
const description =
  "كل الأسئلة قبل الاشتراك: محتاج رأس مال؟ موبايل بس؟ وقت قليل؟ إزاي أستلم فلوسي في مصر؟ وإيه اللي بيغطيه ضمان الـ 14 يوم.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/faq` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/faq` }],
    scripts: [
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
  component: FaqPage,
});

function FaqPage() {
  return (
    <div dir="rtl" className="paper-grain min-h-screen bg-background font-arabic">
      <div className="mx-auto w-full max-w-[1240px] border-x border-border">
        <SiteNav />

        <header className="border-b border-border px-6 py-14 md:px-14 md:py-20">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-12 bg-accent" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-[0.3em] text-accent">
              قبل ما تشترك
            </span>
          </div>
          <h1 className="max-w-[820px] font-display text-[clamp(34px,6.5vw,68px)] font-bold leading-[1.08] text-foreground">
            أسئلة بتتكرر… وردود بدون لف
          </h1>
          <p className="mt-5 max-w-[620px] text-[15.5px] leading-[1.95] text-muted-foreground">
            {description}
          </p>
        </header>

        <div className="mx-auto max-w-[860px] px-6 py-14 md:py-20">
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((f, i) => (
              <article key={f.q} className="grid gap-3 py-8 md:grid-cols-[64px_1fr] md:gap-8">
                <span dir="ltr" className="text-[13px] tracking-[0.14em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-[19px] font-semibold text-foreground">{f.q}</h2>
                  <p className="mt-3 text-[15.5px] leading-[1.95] text-muted-foreground">{f.a}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/auth"
              className="inline-flex h-[54px] items-center justify-center bg-foreground px-8 text-[15px] font-semibold text-background transition-colors hover:bg-accent"
            >
              ابدأ دلوقتي
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-[54px] items-center justify-center border border-foreground px-7 text-[15px] font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              سؤالك مش هنا؟ كلمنا
            </Link>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
