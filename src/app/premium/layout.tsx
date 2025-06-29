import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "Premium доступ - Безлимитные расклады Таро | Таро - ключи ко всем дверям",
  description:
    "Получите Premium доступ к неограниченным раскладам Таро. Эксклюзивные функции, приоритетная поддержка и расширенные толкования карт.",
  keywords: [
    "премиум таро",
    "безлимитные расклады",
    "таро подписка",
    "vip доступ таро",
    "эксклюзивные расклады",
    "профессиональное таро",
    "премиум гадание",
  ],
  openGraph: {
    title: "Premium доступ к Таро",
    description:
      "Безлимитные расклады, эксклюзивные функции и расширенные толкования карт Таро.",
    url: "/premium",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Premium доступ к Таро",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium доступ к Таро",
    description:
      "Безлимитные расклады и эксклюзивные функции для истинных ценителей Таро.",
    images: ["/logo.png"],
  },
};

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="premium-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Premium доступ к Таро",
            description:
              "Премиум подписка для безлимитных раскладов Таро с эксклюзивными функциями",
            brand: {
              "@type": "Brand",
              name: "Таро - ключи ко всем дверям",
            },
            category: "Digital Service",
            offers: {
              "@type": "Offer",
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Таро - ключи ко всем дверям",
              },
            },
            hasFeature: [
              {
                "@type": "PropertyValue",
                name: "Безлимитные расклады",
                description: "Неограниченное количество раскладов Таро",
              },
              {
                "@type": "PropertyValue",
                name: "Приоритетная поддержка",
                description:
                  "Быстрая техническая поддержка для Premium пользователей",
              },
              {
                "@type": "PropertyValue",
                name: "Расширенные толкования",
                description: "Детальные интерпретации карт и раскладов",
              },
              {
                "@type": "PropertyValue",
                name: "Эксклюзивные расклады",
                description: "Доступ к специальным типам раскладов",
              },
            ],
            audience: {
              "@type": "Audience",
              audienceType:
                "Premium users interested in advanced Tarot readings",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
