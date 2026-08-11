import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUp, Sparkle } from "lucide-react";
import { Link } from "@/lib/router";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";
const GRASS_SRC =
  "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1780586778/cta-bg_mlwy5s.png";

function FadeUp({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type Msg = { role: "user" | "assistant"; text: string };

const seed: Msg[] = [
  {
    role: "assistant",
    text: "أهلًا بيك في كورس الشغل أونلاين. هوصّلك خطوة بخطوة لأول دخل بالدولار. عايز تبدأ بأنهي مسار؟",
  },
  { role: "user", text: "عايز أبدأ مسار الخدمات وأجيب أول عميل بالدولار." },
  {
    role: "assistant",
    text: "اختيار ممتاز. هنظبط عرضك، ملفك على المنصات، سعرك بالدولار، ورسالة التواصل — وخطة يوم بيوم لحد أول تحويل.",
  },
];

function ChatPanel({ animateMessagesIn = false }: { animateMessagesIn?: boolean }) {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [value, setValue] = useState("");

  const send = () => {
    const t = value.trim();
    if (!t) return;
    setMsgs((m) => [
      ...m,
      { role: "user", text: t },
      { role: "assistant", text: "تمام — هحطّها في خطتك وأول خطوة تنفيذية تبدأ بيها النهاردة." },
    ]);
    setValue("");
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[rgba(8,8,10,0.6)] backdrop-blur-[24px]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5">
          <Sparkle size={14} className="text-white" />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-medium text-white">كورس الشغل أونلاين</span>
          <span className="block text-[11px] text-white/40">اتعلّم تكسب بالدولار من مصر</span>
        </span>
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {msgs.map((m, i) => {
          const bubble = (
            <div className={cn("flex", m.role === "user" ? "justify-start" : "justify-end")}>
              <p
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-white/15 text-white/90"
                    : "border border-white/5 bg-white/5 text-white/70",
                )}
              >
                {m.text}
              </p>
            </div>
          );
          return animateMessagesIn ? (
            <FadeUp key={i} delay={i * 0.12} y={16}>
              {bubble}
            </FadeUp>
          ) : (
            <div key={i}>{bubble}</div>
          );
        })}
      </div>

      <div className="p-3">
        <div className="liquid-glass flex items-end gap-2 rounded-2xl p-2">
          <textarea
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="اسأل عن الكورس..."
            className="max-h-24 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={send}
            aria-label="إرسال"
            className="rounded-xl bg-white p-2 text-black"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroPreview() {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl"
      style={{ backgroundColor: "hsl(201 100% 13%)" }}
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
        <span className="font-display text-sm tracking-tight text-white sm:text-base md:text-lg">
          الإمبراطورية<sup className="text-[0.5em]">®</sup>
        </span>
        <div className="hidden items-center gap-4 text-[9px] text-white/60 md:flex lg:text-[10px]">
          <span className="text-white">الرئيسية</span>
          {["المسارات", "المحتوى", "الأسعار", "الأسئلة"].map((t) => (
            <span key={t} className="transition-colors hover:text-white">
              {t}
            </span>
          ))}
        </div>
        <span className="liquid-glass rounded-full px-2.5 py-1 text-[9px] text-white sm:px-3 sm:text-[10px]">
          ابدأ دلوقتي
        </span>
      </div>

      <div className="flex flex-col items-center px-3 pb-6 pt-3 text-center sm:px-4 sm:pt-5 md:pt-7">
        <h3 className="animate-fade-rise max-w-[90%] font-display text-lg font-normal leading-[1.15] tracking-[-0.03em] text-white sm:text-2xl md:text-3xl lg:text-4xl">
          من مصر… تبني إمبراطورية دخل{" "}
          <em className="not-italic text-white/55">بالدولار.</em>
        </h3>
        <p className="animate-fade-rise-delay mt-2 max-w-[80%] text-[9px] leading-relaxed text-white/60 sm:mt-3 sm:max-w-sm sm:text-[11px] md:mt-4 md:max-w-md md:text-xs">
          12 محرك دخل، أصول رقمية بتملكها، وخطة يوم بيوم — مش شغل بالساعة.
        </p>

        <span className="animate-fade-rise-delay-2 liquid-glass mt-3 rounded-full px-4 py-1.5 text-[9px] text-white sm:mt-4 sm:px-5 sm:py-2 sm:text-[10px] md:mt-5 md:px-6 md:py-2.5">
          ابدأ رحلتك
        </span>
      </div>
    </div>
  );
}

function DashboardMock() {
  return (
    <div className="liquid-glass mx-auto aspect-[3/4] w-full max-w-[1100px] overflow-hidden rounded-2xl p-2 sm:aspect-[16/10] sm:p-3 lg:aspect-[16/9]">
      <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-[minmax(220px,320px)_1fr] sm:gap-3">
        <div className="hidden min-h-0 sm:block">
          <ChatPanel animateMessagesIn />
        </div>
        <div className="min-h-0">
          <HeroPreview />
        </div>
      </div>
    </div>
  );
}

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const dashboardY = useTransform(scrollYProgress, [0, 1], ["120px", "-120px"]);
  const grassY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["80px", "-40px"] : ["200px", "-200px"],
  );

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(to bottom, transparent 0%, #14191E 100%)" }}
    >
      <div className="relative mx-auto max-w-[1080px] px-4 pb-[440px] pt-24 sm:px-6 sm:pb-[520px] sm:pt-32 md:pb-[440px] md:pt-40">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="relative z-20 max-w-[400px]">
            <FadeUp delay={1}>
              <h2 className="font-display text-3xl font-normal leading-[1.15] tracking-[-0.02em] text-foreground sm:text-4xl">
                اتعلّم إزاي تبدأ من صفر وتوصل لأول دخل بالدولار في 60 يوم.
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="mt-6 max-w-[380px] text-base leading-[1.7] text-muted-foreground sm:text-lg">
                12 مسار دخل حقيقي على النت، خطة تنفيذ يوم بيوم، وأدوات وقوالب جاهزة تنسخها من أول
                يوم — وكل ده بدفعة واحدة ووصول مدى الحياة.
              </p>
            </FadeUp>
            <FadeUp delay={0.2} className="mt-10">
              <Link
                to="/auth"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white/80 px-9 text-sm font-medium leading-none text-black transition-colors hover:bg-white"
              >
                ابدأ دلوقتي
              </Link>
            </FadeUp>
          </div>
        </div>
      </div>

      <motion.div
        style={{ y: dashboardY }}
        className="absolute left-4 right-4 top-[440px] z-10 sm:-right-[8%] sm:left-auto sm:top-[460px] sm:w-[85%] md:-right-[10%] md:top-[500px] md:w-[80%] lg:-right-[12%] lg:top-20 lg:w-[68%]"
      >
        <DashboardMock />
      </motion.div>

      <motion.img
        src={GRASS_SRC}
        alt=""
        aria-hidden
        style={{ y: grassY }}
        className="pointer-events-none absolute bottom-[-40px] left-0 right-0 z-30 w-full select-none object-cover sm:bottom-[-80px] lg:bottom-[-140px]"
      />
    </section>
  );
}
