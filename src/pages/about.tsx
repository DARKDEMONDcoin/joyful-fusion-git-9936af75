import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { company } from "@/lib/company";

const title = "عن شركة ميغسي | الجهة المسؤولة عن المنصة";
const description =
  "ميغسي لتطوير المنصات الرقمية والتجارة الإلكترونية — شركة ذات مسؤولية محدودة مقرها القاهرة، سجل تجاري 284691 ورقم ضريبي 774034785.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://egyptian-empire-quest.lovable.app/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://egyptian-empire-quest.lovable.app/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: company.legalNameAr,
          alternateName: company.legalNameEn,
          email: company.email,
          taxID: company.taxId,
          identifier: company.commercialRegister,
          address: {
            "@type": "PostalAddress",
            streetAddress: "58 Al Hegaz St., Amoun Tower, Unit 84, Floor 8",
            addressLocality: "Sheraton Al Matar, El Nozha, Cairo",
            addressCountry: "EG",
          },
        }),
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <LegalPage
      eyebrow="الجهة المسؤولة"
      title="مين وراء المنصة دي بالاسم والعنوان"
      intro="مش صفحة مجهولة على الإنترنت. دي شركة مسجّلة في مصر بسجل تجاري ورقم ضريبي وعنوان تقدر تزوره — وده الفرق بينا وبين أي حد بيبيع كورس من ورا صفحة مجهولة."
    >
      <LegalSection title="مين إحنا">
        <p>
          {company.legalNameAr} شركة مصرية متخصصة في تطوير المنصات الرقمية والتجارة الإلكترونية.
          بنبني ونشغّل منتجات رقمية، وبننقل نفس الخبرة العملية دي في صورة محتوى تعليمي وخطط تنفيذ
          للمصريين اللي عايزين يبنوا دخل أونلاين.
        </p>
      </LegalSection>

      <LegalSection title="اللي بنقدّمه">
        <p>
          محتوى تعليمي مبني على تنفيذ حقيقي: 12 مسار دخل، خطة يوم بيوم، قوالب وسكربتات، ووحدة كاملة
          لاستلام الدولار في مصر بشكل قانوني. تقدر تشوف التفاصيل في{" "}
          <Link to="/tracks" className="text-accent underline underline-offset-4">
            صفحة المسارات
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="التزاماتنا المكتوبة">
        <p>
          ضمان استرداد {company.refundDays} يوم، شفافية كاملة في الأسعار قبل الدفع، عدم بيع بيانات
          المستخدمين لأي طرف تالت، وإخلاء مسؤولية واضح إن النتائج تعتمد على تنفيذك ومش مضمونة.
        </p>
      </LegalSection>

      <LegalSection title="فواتير وتعاملات رسمية">
        <p>
          كل عملية شراء بيتم تسجيلها باسم الشركة أعلاه، وتقدر تطلب فاتورة رسمية تحمل السجل التجاري
          والرقم الضريبي على {company.email}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
