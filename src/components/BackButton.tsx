import { useNavigate, useRouter } from "@/lib/router";
import { ArrowRight } from "lucide-react";

type Props = {
  /** الصفحة اللي نرجع لها لو مفيش history */
  to?: string;
  label?: string;
  className?: string;
};

/** زر رجوع موحّد (RTL: السهم لليمين) */
export function BackButton({ to = "/", label = "رجوع", className = "" }: Props) {
  const router = useRouter();
  const navigate = useNavigate();

  function goBack() {
    if (router.history.canGoBack()) router.history.back();
    else navigate({ to });
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      className={
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground " +
        className
      }

    >
      <ArrowRight size={14} /> {label}
    </button>
  );
}
