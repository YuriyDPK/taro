import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "Расклады Таро онлайн - Гадание на картах | Таро - ключи ко всем дверям",
  description:
    "Выберите расклад Таро и получите ответы на свои вопросы. Различные расклады: на любовь, карьеру, общие вопросы и духовность. Интерактивное гадание онлайн.",
  keywords: [
    "расклады таро",
    "гадание онлайн",
    "таро на любовь",
    "таро на карьеру",
    "расклад карт",
    "онлайн гадание",
    "таро вопросы",
    "карты таро",
    "предсказание",
    "магия",
  ],
  openGraph: {
    title: "Расклады Таро онлайн - Выберите свой расклад",
    description:
      "Различные расклады Таро для получения ответов на вопросы о любви, карьере и жизни. Интерактивное гадание с детальным толкованием.",
    url: "/spreads",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Расклады Таро онлайн",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Расклады Таро онлайн",
    description:
      "Выберите расклад Таро и получите ответы на свои вопросы. Гадание на картах онлайн.",
    images: ["/logo.png"],
  },
};

export default function SpreadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="spreads-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Расклады Таро онлайн",
            description:
              "Профессиональные расклады карт Таро для получения ответов на вопросы о любви, карьере и жизни",
            provider: {
              "@type": "Organization",
              name: "Таро - ключи ко всем дверям",
            },
            serviceType: "Гадание на картах Таро",
            audience: {
              "@type": "Audience",
              audienceType: "People interested in divination and spirituality",
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
              validFrom: new Date().toISOString(),
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Типы раскладов Таро",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Расклады на любовь",
                    description:
                      "Гадание на картах Таро для вопросов о любви и отношениях",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Расклады на карьеру",
                    description:
                      "Таро расклады для вопросов о работе и карьере",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Общие расклады",
                    description:
                      "Универсальные расклады Таро для любых жизненных вопросов",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Духовные расклады",
                    description:
                      "Расклады Таро для духовного развития и самопознания",
                  },
                },
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
