import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BackButton } from "@/components/BackButton";
import { SiteNav } from "@/components/SiteNav";
import { company, companyFacts } from "@/lib/company";

export const legalLinks: { to: string; label: string }[] = [
  { to: "/terms", label: "الشروط والأحكام" },
  { to: "/privacy", label: "سياسة الخصوصية" },
  { to: "/refund", label: "الاسترداد والإلغاء" },
  { to: "/about", label: "عن الشركة" },
  { to: "/contact", label: "اتصل بنا" },
];

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-8 first:border-t-0 first:pt-0">
      <h2 className="mb-4 text-xl font-medium tracking-[-0.02em] text-foreground">{title}</h2>
      <div className="space-y-3 text-[15px] leading-[1.9] text-muted-foreground">{children}</div>
    </section>
  );
}

export function CompanyCard() {
  return (
    <div className="glass-card rounded-[28px] p-6 sm:p-8">
      <p className="mb-5 text-[12px] font-semibold tracking-[0.08em] text-accent">
        بيانات الجهة المسؤولة قانونيًا
      </p>
      <dl className="grid gap-4 sm:grid-cols-2">
        {companyFacts.map((f) => (
          <div key={f.label}>
            <dt className="text-[12px] text-muted-foreground">{f.label}</dt>
            <dd className="mt-1 text-[14px] leading-relaxed text-foreground">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated = "9 أغسطس 2026",
  children,
  showCompanyCard = true,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated?: string;
  children: ReactNode;
  showCompanyCard?: boolean;
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-background font-arabic">
      <div className="border-b border-border/30">
        <SiteNav />
      </div>

      <header className="mx-auto max-w-3xl px-5 pb-10 pt-12 sm:px-8">
        <div className="mb-9">
          <BackButton to="/" label="رجوع للصفحة الرئيسية" />
        </div>
        <p className="mb-3 text-[12px] font-semibold tracking-[0.08em] text-accent">{eyebrow}</p>
        <h1 className="text-3xl font-medium leading-[1.15] tracking-[-1px] text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-[15px] leading-[1.9] text-muted-foreground">{intro}</p>
        <p className="mt-4 text-[12px] text-muted-foreground">آخر تحديث: {updated}</p>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        {showCompanyCard && (
          <div className="mb-10">
            <CompanyCard />
          </div>
        )}
        {children}
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-5 text-[13px] sm:px-8">
          {legalLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-3xl px-5 text-center text-[12px] leading-relaxed text-muted-foreground sm:px-8">
          {company.legalNameAr} — س.ت {company.commercialRegister} · ر.ض {company.taxId}
        </p>
      </footer>
    </div>
  );
}
