import { createPageRoute, Link, notFound } from "@/lib/router";
import { BackButton } from "@/components/BackButton";
import { SiteNav } from "@/components/SiteNav";
import { getTrack, tracks, type Track } from "@/lib/tracks";

export const Route = createPageRoute({
  loader: ({ params }) => {
    const track = getTrack(params.slug);
    if (!track) throw notFound();
    return { track };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "المسار غير متاح" }, { name: "robots", content: "noindex" }] };
    }
    const t = loaderData.track;
    const title = `${t.title} | شرح كامل وخطة تنفيذ`;
    const description = `${t.short} الدخل المتوقع: ${t.income}. أول فلوس في ${t.timeToFirstMoney}. خطة يوم بيوم، أدوات، أسعار السوق، وأخطاء لازم تتجنبها.`;
    const url = `https://egyptian-empire-quest.lovable.app/tracks/${t.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: t.title,
            description: t.short,
            url,
            inLanguage: "ar",
            provider: {
              "@type": "Organization",
              name: "ميغسي لتطوير المنصات الرقمية",
              url: "https://egyptian-empire-quest.lovable.app",
            },
            offers: {
              "@type": "Offer",
              price: "999",
              priceCurrency: "EGP",
              availability: "https://schema.org/InStock",
            },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "online",
              inLanguage: "ar",
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "الرئيسية",
                item: "https://egyptian-empire-quest.lovable.app/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "المسارات",
                item: "https://egyptian-empire-quest.lovable.app/tracks",
              },
              { "@type": "ListItem", position: 3, name: t.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: TrackNotFound,
  component: TrackPage,
});

function TrackNotFound() {
  return (
    <div dir="rtl" className="min-h-screen bg-background font-arabic">
      <SiteNav />
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <h1 className="text-2xl font-bold text-foreground">المسار ده مش موجود</h1>
        <Link to="/tracks" className="mt-6 inline-block text-sm text-foreground">
          شوف كل المسارات
        </Link>
      </div>
    </div>
  );
}

function Block({
  title,
  accent,
  children,
}: {
  kicker?: string;
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border/40 py-14">
      <h2 className="mb-8 text-2xl font-medium tracking-[-0.5px] text-foreground sm:text-4xl">
        {title}
        {accent && <span className="text-accent"> {accent}</span>}
      </h2>
      {children}
    </section>
  );
}


function TrackPage() {
  const { track: t } = Route.useLoaderData() as { track: Track };
  const index = tracks.findIndex((x) => x.slug === t.slug);
  const next = tracks[(index + 1) % tracks.length]!;

  return (
    <div dir="rtl" className="min-h-screen bg-background font-arabic">
      <div className="border-b border-border/40">
        <SiteNav />
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-1/4 h-64 w-[32rem] rounded-full bg-foreground/5 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-5 pb-12 pt-14 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <BackButton to="/tracks" label="رجوع" />
            <Link
              to="/tracks"
              className="text-[11px] tracking-[0.2em] text-muted-foreground hover:text-foreground/80"
            >
              كل المسارات ←
            </Link>
          </div>

          <p className="mt-8 font-semibold text-5xl text-muted-foreground/40 sm:text-6xl">{t.n}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 text-lg text-foreground/80 sm:text-xl">{t.headline}</p>
          <p className="mt-5 max-w-2xl text-sm leading-loose text-muted-foreground sm:text-base">
            {t.promise}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border/40 pt-8 sm:grid-cols-4">
            {[
              { l: "الدخل المتوقع", v: t.income },
              { l: "أول فلوس", v: t.timeToFirstMoney },
              { l: "الصعوبة", v: t.difficulty },
              { l: "رأس المال", v: t.capital },
            ].map((s) => (
              <div key={s.l}>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.l}</dt>
                <dd className="mt-2 text-sm font-semibold text-foreground sm:text-base">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        {/* لمين */}
        <Block kicker="لمين المسار ده" title="هل ده مسارك إنت؟">
          <ul className="space-y-4">
            {t.forWho.map((f) => (
              <li key={f} className="flex gap-4 text-sm leading-relaxed text-secondary-foreground sm:text-base">
                <span className="mt-2 h-1 w-6 shrink-0 bg-foreground/70" />
                {f}
              </li>
            ))}
          </ul>
        </Block>

        {/* شرح عميق */}
        <Block kicker="الشرح العميق" title="إزاي المسار ده بيشتغل فعلاً">
          <div className="space-y-10">
            {t.deep.map((d, i) => (
              <div key={d.h} className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                <span className="font-semibold text-xl text-muted-foreground/50 sm:pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{d.h}</h3>
                  <p className="text-sm leading-loose text-muted-foreground sm:text-base">{d.p}</p>
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* الخطة */}
        <Block kicker="خطة التنفيذ" title="اعمل إيه… وامتى بالظبط">
          <div className="space-y-4">
            {t.roadmap.map((p) => (
              <div key={p.days} className="border border-border bg-card rounded-2xl p-6">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-border/40 pb-3">
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">{p.title}</h3>
                  <span className="text-[11px] tracking-[0.15em] text-foreground/80">{p.days}</span>
                </div>
                <ol className="space-y-3">
                  {p.steps.map((s, i) => (
                    <li key={s} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-sans text-xs text-muted-foreground">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Block>

        {/* الأدوات */}
        <Block kicker="الأدوات" title="بتشتغل بإيه — وليه">
          <div className="divide-y divide-border/40 border-y border-border/40">
            {t.stack.map((s) => (
              <div key={s.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                <p dir="ltr" className="w-48 shrink-0 font-sans text-sm font-semibold text-foreground">
                  {s.name}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.why}</p>
              </div>
            ))}
          </div>
        </Block>

        {/* الأسعار */}
        <Block kicker="أسعار السوق" title="بتاخد كام… على إيه">
          <div className="grid gap-4 sm:grid-cols-3">
            {t.offers.map((o) => (
              <div key={o.name} className="border border-border bg-card rounded-2xl p-6">
                <p className="text-sm text-muted-foreground">{o.name}</p>
                <p dir="ltr" className="mt-3 font-sans text-xl font-bold text-foreground">
                  {o.price}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{o.note}</p>
              </div>
            ))}
          </div>
        </Block>

        {/* أول عميل */}
        <Block kicker="أول فلوس" title="إزاي تجيب أول عميل / أول بيعة">
          <ol className="space-y-5">
            {t.firstClient.map((s, i) => (
              <li key={s} className="flex gap-5 text-sm leading-relaxed text-secondary-foreground sm:text-base">
                <span className="font-semibold text-lg text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </Block>

        {/* الأخطاء */}
        <Block kicker="تحذير" title="الأخطاء اللي بتخسّر الناس فلوسها هنا">
          <ul className="space-y-4">
            {t.mistakes.map((m) => (
              <li
                key={m}
                className="border-r-2 border-border pr-4 text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                {m}
              </li>
            ))}
          </ul>
        </Block>

        {/* FAQ */}
        <Block kicker="أسئلة" title="أسئلة بتتكرر عن المسار ده">
          <div className="divide-y divide-border/40 border-y border-border/40">
            {t.faq.map((f) => (
              <div key={f.q} className="py-5">
                <h3 className="mb-2 text-base font-semibold text-foreground">{f.q}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </Block>

        {/* CTA */}
        <section className="mt-8 border-t border-border/40 pt-14 text-center">
          <h2 className="mx-auto max-w-xl text-2xl font-bold leading-snug text-foreground sm:text-3xl">
            المعلومة لوحدها مش بتغيّر حاجة… التنفيذ بخطة هو اللي بيغيّر
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            المسار ده جوه الكورس بالفيديو، القوالب، والسكربتات — ومعاه 11 مسار تاني بنفس العمق.
          </p>
          <Link
            to="/checkout"
            className="mt-8 inline-block rounded-full bg-foreground px-9 py-3.5 text-base font-semibold text-background"
          >
            ابدأ دلوقتي
          </Link>
        </section>

        <div className="mt-16 border-t border-border/40 pt-8">
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            المسار اللي بعده
          </p>
          <Link
            to="/tracks/$slug"
            params={{ slug: next.slug }}
            className="group flex items-baseline gap-4"
          >
            <span className="font-semibold text-2xl text-muted-foreground/50">{next.n}</span>
            <span className="text-lg font-semibold text-foreground transition-colors group-hover:text-foreground sm:text-xl">
              {next.title}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
