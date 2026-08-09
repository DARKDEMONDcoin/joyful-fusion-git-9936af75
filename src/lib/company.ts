/** بيانات الشركة الرسمية — تُستخدم في كل الصفحات القانونية والفوتر والفواتير */
export const company = {
  legalNameAr:
    "ميغسي لتطوير المنصات الرقمية والتجارة الإلكترونية — شركة ذات مسؤولية محدودة",
  shortNameAr: "ميغسي",
  legalNameEn: "Megsy for Digital Platforms Development & E-Commerce LLC",
  type: "شركة ذات مسؤولية محدودة (LLC)",
  country: "مصر",
  addressAr:
    "٥٨ شارع الحجاز، برج آمون، أمام مستشفى هليوبوليس، وحدة ٨٤، الدور ٨، شياخة شيراتون المطار، قسم النزهة، محافظة القاهرة، مصر",
  addressShortAr: "٥٨ شارع الحجاز، برج آمون، شيراتون المطار، النزهة، القاهرة، مصر",
  commercialRegister: "284691",
  taxId: "774034785",
  email: "support@megsyai.com",
  hours: "من السبت للخميس، 10 صباحًا – 6 مساءً (بتوقيت القاهرة)",
  refundDays: 14,
} as const;

/** بلوك بيانات قانونية جاهز للعرض (label/value) */
export const companyFacts: { label: string; value: string }[] = [
  { label: "الاسم القانوني", value: company.legalNameAr },
  { label: "الشكل القانوني", value: company.type },
  { label: "المقر الرسمي", value: company.addressAr },
  { label: "رقم السجل التجاري", value: company.commercialRegister },
  { label: "الرقم الضريبي", value: company.taxId },
  { label: "البريد الرسمي", value: company.email },
];
