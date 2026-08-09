import { createPageRoute } from "@/lib/router";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { company } from "@/lib/company";

const title = "سياسة الخصوصية | ميغسي";
const description =
  "إزاي بنجمع بياناتك ونستخدمها ونحميها: أنواع البيانات، الأساس القانوني، مزوّدي الخدمة، مدة الحفظ، وحقوقك في التعديل والحذف.";

export const Route = createPageRoute({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://egyptian-empire-quest.lovable.app/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://egyptian-empire-quest.lovable.app/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage
      eyebrow="مستند قانوني"
      title="سياسة الخصوصية"
      intro={`المتحكم في بياناتك هو ${company.legalNameAr}. الصفحة دي بتشرح بدقة إيه اللي بنجمعه، ليه، ومين بيشوفه، وإزاي تتحكم فيه.`}
    >
      <LegalSection title="1. البيانات اللي بنجمعها">
        <p>
          <strong className="text-foreground">بيانات الحساب:</strong> الاسم، البريد الإلكتروني،
          ورقم الموبايل لو أدخلته، وصورة الحساب لو سجّلت بجوجل أو Apple.
        </p>
        <p>
          <strong className="text-foreground">بيانات الشراء:</strong> قيمة الطلب، حالته، ومعرّف
          المعاملة من مزوّد الدفع. <strong className="text-foreground">إحنا مش بنستقبل ولا
          بنخزّن أرقام كروت الدفع.</strong>
        </p>
        <p>
          <strong className="text-foreground">بيانات الاستخدام:</strong> الصفحات اللي بتزورها،
          الجهاز والمتصفح، وIP — لأغراض الأمان وتحسين المنصة.
        </p>
      </LegalSection>

      <LegalSection title="2. الأساس القانوني والغرض">
        <p>
          بنعالج بياناتك لتنفيذ العقد معاك (تفعيل الوصول للمحتوى والدعم)، وللالتزام القانوني
          (الفواتير والسجلات الضريبية بالقانون المصري)، ولمصلحتنا المشروعة (منع الاحتيال وحماية
          الحسابات)، وبموافقتك في حالة الرسائل التسويقية اللي تقدر توقفها في أي وقت.
        </p>
      </LegalSection>

      <LegalSection title="3. مزوّدو الخدمة اللي بنشاركهم البيانات">
        <p>
          Supabase (تسجيل الدخول وقاعدة البيانات)، Kashier (معالجة المدفوعات)، Google و Apple (لو
          اخترت الدخول بحسابك عندهم)، ومزوّدو الاستضافة والبريد. مشاركة البيانات بتكون بالحد
          الأدنى اللازم لأداء الخدمة، وممنوع بيع بياناتك لأي طرف تالت — نهائيًا.
        </p>
      </LegalSection>

      <LegalSection title="4. الكوكيز">
        <p>
          بنستخدم كوكيز أساسية لتشغيل تسجيل الدخول وحفظ الجلسة، وكوكيز قياس بسيطة لمعرفة أداء
          الصفحات. تقدر تمنع الكوكيز من إعدادات المتصفح، لكن ساعتها تسجيل الدخول مش هيشتغل.
        </p>
      </LegalSection>

      <LegalSection title="5. مدة الحفظ">
        <p>
          بيانات الحساب بتتحفظ طول ما حسابك موجود. سجلات الدفع والفواتير بتتحفظ للمدة المطلوبة
          قانونًا في مصر (5 سنوات على الأقل). بعد الحذف بنبقّي فقط السجلات اللي القانون يفرضها.
        </p>
      </LegalSection>

      <LegalSection title="6. حقوقك">
        <p>
          لك الحق في الوصول لبياناتك، تصحيحها، حذفها، نقلها، وسحب الموافقة التسويقية — طبقًا لقانون
          حماية البيانات الشخصية المصري رقم 151 لسنة 2020. ابعت طلبك على {company.email} وبنرد
          خلال 30 يوم كحد أقصى.
        </p>
      </LegalSection>

      <LegalSection title="7. أمان البيانات">
        <p>
          الاتصال بالموقع مشفّر عبر HTTPS، وكلمات المرور مخزّنة مشفّرة (hashed) عند مزوّد
          المصادقة، والوصول للبيانات محصور بصلاحيات محددة. مفيش نظام آمن 100%، فلو حصل أي خلل يمس
          بياناتك بنبلّغك في أسرع وقت.
        </p>
      </LegalSection>

      <LegalSection title="8. الأطفال">
        <p>الخدمة مش موجهة لأقل من 18 سنة، ومش بنجمع بياناتهم بشكل مقصود.</p>
      </LegalSection>

      <LegalSection title="9. جهة التواصل">
        <p>
          مسؤول حماية البيانات — {company.legalNameAr}، {company.addressAr} · {company.email}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
