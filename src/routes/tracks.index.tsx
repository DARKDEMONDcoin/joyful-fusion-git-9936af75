import { createFileRoute, Link } from "@tanstack/react-router";
import { BackButton } from "@/components/BackButton";
import { SiteNav } from "@/components/SiteNav";
import { tracks } from "@/lib/tracks";

const title = "المسارات الـ12 | كورس الشغل أونلاين";
const description =
  "12 مسار دخل مشروح بالتفصيل: بيزنس، تجارة إلكترونية، ذكاء اصطناعي، AI Agency، Micro-SaaS، علم نفس البيع، No-Code، والفريلانس — بخطة تنفيذ وأسعار سوق حقيقية.";

export const Route = createFileRoute("/tracks/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://egyptian-empire-quest.lovable.app/tracks" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://egyptian-empire-quest.lovable.app/tracks" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "مسارات الدخل الـ12",
          itemListElement: tracks.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.title,
            url: `https://egyptian-empire-quest.lovable.app/tracks/${t.slug}`,
          })),
        }),
      },
    ],
  }),
  component: TracksIndex,
});

function TracksIndex() {
  return (
    <div dir="rtl" className="min-h-screen bg-background font-arabic">
      <div className="border-b border-border/30">
        <SiteNav />
      </div>

      {/* هيدر تحريري: عمودين على الديسكتوب */}
      <header className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8">
        <div className="mb-10">
          <BackButton to="/" label="رجوع للصفحة الرئيسية" />
        </div>
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <h1 className="text-4xl font-medium leading-[1.1] tracking-[-1px] text-foreground sm:text-6xl">
              12 مسار… كل واحد له صفحة كاملة{" "}
              <span className="text-accent">بخطة تنفيذ</span>
            </h1>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            مش عناوين. كل صفحة فيها: لمين المسار، الأدوات، شرح عميق، خطة يوم بيوم، أسعار السوق
            الحقيقية، الأخطاء اللي بتخسّرك، وطريقة أول عميل.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-28 sm:px-8">
        <div className="divide-y divide-border/50 border-y border-border/50">
          {tracks.map((t) => (
            <Link
              key={t.slug}
              to="/tracks/$slug"
              params={{ slug: t.slug }}
              className="group flex flex-col gap-3 py-8 transition-colors hover:bg-secondary/30 sm:flex-row sm:items-baseline sm:gap-10 sm:px-4"
            >
              <span className="font-semibold text-3xl text-accent/70 transition-colors group-hover:text-foreground">
                {t.n}
              </span>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{t.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {t.short}
                </p>
              </div>
              <div className="shrink-0 sm:text-left">
                <p dir="ltr" className="font-sans text-sm font-semibold text-foreground">
                  {t.income}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  أول فلوس: {t.timeToFirstMoney}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/checkout"
            className="inline-block rounded-full bg-foreground px-9 py-3.5 text-base font-semibold text-background transition-opacity hover:opacity-85"
          >
            ابدأ الكورس دلوقتي
          </Link>
        </div>
      </div>
    </div>
  );
}
