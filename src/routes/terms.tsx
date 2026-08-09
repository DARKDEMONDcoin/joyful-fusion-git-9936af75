import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { company } from "@/lib/company";

const title = "الشروط والأحكام | ميغسي";
const description =
  "شروط وأحكام استخدام منصة ميغسي لتطوير المنصات الرقمية والتجارة الإلكترونية: الترخيص، الدفع، حقوق الملكية الفكرية، والقانون الحاكم.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://egyptian-empire-quest.lovable.app/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://egyptian-empire-quest.lovable.app/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage
      eyebrow="مستند قانوني"
      title="الشروط والأحكام"
      intro={`باستخدامك للموقع أو شرائك أي منتج تعليمي، بتوافق على الشروط دي بالكامل. الطرف المتعاقد معك هو ${company.legalNameAr}، المسجلة في ${company.country}.`}
    >
      <LegalSection title="1. تعريفات">
        <p>
          «الشركة» أو «إحنا» تعني {company.legalNameAr}. «المنصة» تعني هذا الموقع وكل صفحاته
          والمحتوى التعليمي المتاح من خلاله. «المستخدم» أو «إنت» تعني أي شخص يزور المنصة أو ينشئ
          حسابًا أو يشتري منتجًا.
        </p>
      </LegalSection>

      <LegalSection title="2. طبيعة الخدمة">
        <p>
          إحنا نقدّم محتوى تعليمي رقمي (فيديوهات، مستندات، خطط تنفيذ، قوالب) بخصوص العمل عبر
          الإنترنت. الخدمة تعليمية بحتة، ومش عرض استثماري، ولا وساطة مالية، ولا وعد بدخل مضمون،
          ولا استشارة قانونية أو ضريبية.
        </p>
      </LegalSection>

      <LegalSection title="3. الحساب ومسؤوليتك عنه">
        <p>
          لازم تكون 18 سنة أو أكتر، أو تستخدم المنصة بموافقة وليّ الأمر. بيانات التسجيل لازم تكون
          صحيحة. إنت مسؤول عن سرية كلمة المرور وعن كل نشاط يحصل من حسابك، ولازم تبلّغنا فورًا على{" "}
          {company.email} لو شكيت في أي استخدام غير مصرّح به.
        </p>
      </LegalSection>

      <LegalSection title="4. الترخيص وحدود الاستخدام">
        <p>
          بعد الدفع، بناخد ترخيص شخصي، غير قابل للتحويل، وغير حصري، لاستخدام المحتوى لأغراضك
          التعليمية الخاصة فقط. ممنوع منعًا تامًا: مشاركة بيانات الدخول، إعادة البيع، النشر، إعادة
          التسجيل (Screen recording) أو الترجمة أو التوزيع بأي شكل. أي مخالفة بتؤدي لإيقاف الحساب
          فورًا بدون استرداد، مع حقنا في المطالبة بالتعويض.
        </p>
      </LegalSection>

      <LegalSection title="5. الأسعار والدفع">
        <p>
          الأسعار معروضة على صفحة الشراء وقد تشمل ضرائب مطبقة بحسب القانون المصري. الدفع بيتم عبر
          مزوّد خدمات دفع خارجي (Kashier)، وإحنا مش بنخزّن بيانات كارت الدفع على سيرفراتنا. الوصول
          للمحتوى بيتم تفعيله بعد تأكيد الدفع من مزوّد الدفع.
        </p>
      </LegalSection>

      <LegalSection title="6. الاسترداد">
        <p>
          سياسة الاسترداد ({company.refundDays} يوم بشروطها) موضحة بالكامل في صفحة «الاسترداد
          والإلغاء»، وهي جزء لا يتجزأ من الشروط دي.
        </p>
      </LegalSection>

      <LegalSection title="7. الملكية الفكرية">
        <p>
          كل المحتوى والعلامات والتصميمات والأكواد على المنصة مملوكة للشركة أو مرخّصة لها، ومحمية
          بقانون حماية حقوق الملكية الفكرية المصري رقم 82 لسنة 2002 والاتفاقيات الدولية.
        </p>
      </LegalSection>

      <LegalSection title="8. إخلاء المسؤولية عن النتائج">
        <p>
          أي أرقام أو حالات نجاح معروضة هي نتائج فعلية لأفراد معيّنين وظروفهم، ومش وعد بنتيجة
          مماثلة. نتيجتك بتعتمد على تنفيذك ووقتك ورأس مالك والسوق. إنت المسؤول الوحيد عن قراراتك
          التجارية والمالية والضريبية.
        </p>
      </LegalSection>

      <LegalSection title="9. حدود المسؤولية">
        <p>
          في أقصى حد يسمح به القانون، مسؤوليتنا الإجمالية تجاهك محدودة بقيمة المبلغ اللي دفعته
          فعليًا خلال آخر 12 شهر. مش مسؤولين عن أي أضرار غير مباشرة أو تبعية أو فقدان أرباح أو
          بيانات.
        </p>
      </LegalSection>

      <LegalSection title="10. تعديل الشروط وإنهاء الخدمة">
        <p>
          يحق لنا تحديث الشروط دي، وننشر تاريخ آخر تحديث أعلى الصفحة. استمرارك في الاستخدام بعد
          التعديل يعني قبولك. ويحق لنا إيقاف حسابك في حالة المخالفة الجسيمة أو الاحتيال أو محاولة
          الإضرار بالمنصة.
        </p>
      </LegalSection>

      <LegalSection title="11. القانون الحاكم وتسوية النزاعات">
        <p>
          تخضع الشروط دي للقوانين المصرية، وتختص محاكم القاهرة حصريًا بأي نزاع. بنشجّع دائمًا على
          حل أي خلاف وديًا خلال 30 يوم من إبلاغنا على {company.email} قبل أي إجراء قضائي.
        </p>
      </LegalSection>

      <LegalSection title="12. التواصل الرسمي">
        <p>
          {company.legalNameAr} — {company.addressAr}. س.ت {company.commercialRegister} · ر.ض{" "}
          {company.taxId} · {company.email}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
