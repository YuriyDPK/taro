import { Metadata } from "next";

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
  return children;
}
