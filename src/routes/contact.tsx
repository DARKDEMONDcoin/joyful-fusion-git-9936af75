import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { company } from "@/lib/company";

const title = "اتصل بنا | ميغسي";
const description =
  "بيانات التواصل الرسمية مع ميغسي لتطوير المنصات الرقمية والتجارة الإلكترونية: البريد، العنوان، مواعيد الدعم، وطريقة تقديم الشكاوى.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://egyptian-empire-quest.lovable.app/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://egyptian-empire-quest.lovable.app/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <LegalPage
      eyebrow="الدعم والشكاوى"
      title="تواصل مباشر — بدون فورمات مجهولة"
      intro={`أي سؤال قبل الشراء أو بعده، أو طلب فاتورة أو استرداد أو حذف بيانات: ابعت على ${company.email} وبنرد في مواعيد العمل.`}
    >
      <LegalSection title="قنوات التواصل">
        <p>
          <strong className="text-foreground">البريد الرسمي:</strong>{" "}
          <a href={`mailto:${company.email}`} className="text-accent underline underline-offset-4">
            {company.email}
          </a>
        </p>
        <p>
          <strong className="text-foreground">مواعيد الدعم:</strong> {company.hours}
        </p>
        <p>
          <strong className="text-foreground">المقر:</strong> {company.addressAr}
        </p>
      </LegalSection>

      <LegalSection title="مدة الرد">
        <p>
          أسئلة ما قبل الشراء: خلال 24 ساعة عمل. مشاكل الدخول والدفع: خلال 12 ساعة عمل. طلبات
          الاسترداد: تأكيد خلال 48 ساعة وتنفيذ خلال 7 أيام عمل.
        </p>
      </LegalSection>

      <LegalSection title="الشكاوى الرسمية">
        <p>
          اكتب في عنوان الرسالة كلمة «شكوى» وأرفق بريد الحساب وتاريخ المعاملة. بنسجّل الشكوى برقم
          مرجعي ونرد بقرار مكتوب خلال 14 يوم. بيانات الجهة القانونية: س.ت{" "}
          {company.commercialRegister} · ر.ض {company.taxId}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
