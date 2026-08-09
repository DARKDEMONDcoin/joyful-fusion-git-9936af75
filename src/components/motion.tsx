import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** ظهور ناعم عند السكرول — بيحترم prefers-reduced-motion */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** عدّاد أرقام بيشتغل أول ما العنصر يبان */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1200,
}: {
  to: number;
  prefix?: string | undefined;
  suffix?: string | undefined;
  duration?: number | undefined;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setV(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} dir="ltr">
      {prefix}
      {v.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/** شريط متحرك أفقي (تيكر) بدون مكتبات */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee-mask relative overflow-hidden border-y border-border py-4">
      <div className="marquee-track flex w-max items-center gap-10">
        {row.map((t, i) => (
          <span
            key={i}
            dir="ltr"
            className="flex shrink-0 items-center gap-3 text-[13px] tracking-tight text-muted-foreground"
          >
            <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
