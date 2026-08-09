import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@/lib/router";
import { useAuth } from "@/hooks/use-auth";

const links = ["المحتوى", "النتايج", "الأسعار"];
const targets = ["curriculum", "proof", "pricing"];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { session, loading } = useAuth();
  const signedIn = loading ? null : Boolean(session);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });


  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToSection = (id: string) => {
    setOpen(false);
    if (pathname === "/") {
      scrollToId(id);
      return;
    }
    void navigate({ to: "/", hash: id }).then(() => {
      setTimeout(() => scrollToId(id), 120);
    });
  };

  const authLabel = signedIn ? "لوحة الطالب" : "دخول";
  const authTo = signedIn ? "/dashboard" : "/auth";

  const navItem =
    "inline-flex min-h-[40px] items-center text-[13px] font-medium tracking-[0.06em] text-muted-foreground transition-colors hover:text-foreground";


  return (
    <>
      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6 md:px-8">
        <Link to="/" className="font-display text-[26px] leading-none tracking-tight text-foreground">
          الإمبراطورية
          <sup className="text-xs">®</sup>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link to="/tracks" className={navItem}>
            المسارات
          </Link>
          {links.map((l, i) => (
            <button key={l} type="button" onClick={() => goToSection(targets[i]!)} className={navItem}>
              {l}
            </button>
          ))}
          <Link to="/faq" className={navItem}>
            الأسئلة
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Link
            to={authTo}
            className="liquid-glass hidden rounded-full px-6 py-2.5 text-sm text-foreground transition-transform hover:scale-[1.03] md:block"
          >
            {authLabel}
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
            className="text-foreground md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu-glass absolute left-4 right-4 top-[68px] z-50 flex flex-col divide-y divide-border md:hidden">
          <Link
            to="/tracks"
            onClick={() => setOpen(false)}
            className="px-5 py-4 text-right text-[15px] text-foreground"
          >
            المسارات
          </Link>
          {links.map((l, i) => (
            <button
              key={l}
              type="button"
              onClick={() => goToSection(targets[i]!)}
              className="px-5 py-4 text-right text-[15px] text-foreground"
            >
              {l}
            </button>
          ))}

          <Link
            to="/faq"
            onClick={() => setOpen(false)}
            className="px-5 py-4 text-right text-[15px] text-foreground"
          >
            الأسئلة
          </Link>

          <Link
            to={authTo}
            onClick={() => setOpen(false)}
            className="bg-accent py-4 text-center text-[15px] font-semibold text-accent-foreground"
          >
            {authLabel}
          </Link>
        </div>
      )}
    </>
  );
}
