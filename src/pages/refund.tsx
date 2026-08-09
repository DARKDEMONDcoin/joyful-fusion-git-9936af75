import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { company } from "@/lib/company";

const title = "سياسة الاسترداد والإلغاء | ميغسي";
const description =
  "ضمان 14 يوم: إمتى تسترد فلوسك بالكامل، إزاي تطلب الاسترداد خطوة بخطوة، ومدة تنفيذ التحويل، وحالات الاستثناء.";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://egyptian-empire-quest.lovable.app/refund" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://egyptian-empire-quest.lovable.app/refund" }],
  }),
  component: Refund,
});

function Refund() {
  return (
    <LegalPage
      eyebrow="مستند قانوني"
      title={`سياسة الاسترداد والإلغاء — ضمان ${company.refundDays} يوم`}
      intro="مكتوبة بوضوح بدون شروط مخفية: لو المحتوى مش زي ما وعدناك، فلوسك ترجع. اقرا الخطوات والحالات المستثناة قبل الشراء."
    >
      <LegalSection title="1. مدة الضمان">
        <p>
          عندك {company.refundDays} يوم تقويمي من تاريخ الدفع لطلب استرداد كامل للمبلغ، بدون
          الحاجة لتبرير مفصّل.
        </p>
      </LegalSection>

      <LegalSection title="2. إزاي تطلب الاسترداد">
        <p>
          ابعت رسالة من نفس بريد الحساب على <strong className="text-foreground">{company.email}</strong>{" "}
          بعنوان «طلب استرداد» واكتب فيها: اسمك، بريد الحساب، وتاريخ الدفع أو رقم المعاملة. بنأكد
          استلام الطلب خلال 48 ساعة عمل.
        </p>
      </LegalSection>

      <LegalSection title="3. مدة تنفيذ الاسترداد">
        <p>
          بننفّذ الاسترداد من عندنا خلال 7 أيام عمل من الموافقة. ووصول المبلغ لحسابك بيتوقف على
          البنك أو مزوّد الدفع (Kashier) وعادة بياخد من 5 لـ 14 يوم عمل إضافية. الاسترداد بيرجع
          لنفس وسيلة الدفع الأصلية فقط.
        </p>
      </LegalSection>

      <LegalSection title="4. حالات مستثناة من الاسترداد">
        <p>
          مشاركة بيانات الدخول أو تحميل/تسجيل المحتوى وإعادة توزيعه، أو طلبات بعد انتهاء مدة
          الـ{company.refundDays} يوم، أو حالات الاحتيال وتكرار الشراء والاسترداد بشكل مسيء، أو
          الشراء عبر حساب بمعلومات غير صحيحة.
        </p>
      </LegalSection>

      <LegalSection title="5. إلغاء الحساب">
        <p>
          تقدر تطلب إلغاء حسابك وحذف بياناتك أي وقت من {company.email}. الإلغاء بعد مدة الضمان مش
          بيستتبع استرداد مالي، لكن بيوقف أي تواصل تسويقي فورًا.
        </p>
      </LegalSection>

      <LegalSection title="6. الاعتراض">
        <p>
          لو مش موافق على قرار الاسترداد، ابعت اعتراض مكتوب خلال 14 يوم من القرار وهيتم مراجعته
          إداريًا. تفاصيل التسوية القانونية في{" "}
          <Link to="/terms" className="text-accent underline underline-offset-4">
            الشروط والأحكام
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
