import { Metadata } from "next";

export const metadata: Metadata = {
  title: "История раскладов Таро - Мои гадания | Таро - ключи ко всем дверям",
  description:
    "Просмотрите историю ваших раскладов Таро. Все ваши прошлые гадания, вопросы и толкования карт в одном месте. Ведите дневник своих предсказаний.",
  keywords: [
    "история таро",
    "мои расклады",
    "дневник таро",
    "прошлые гадания",
    "архив раскладов",
    "история гаданий",
    "таро записи",
    "личный кабинет таро",
  ],
  openGraph: {
    title: "История раскладов Таро",
    description:
      "Ваша личная история гаданий на картах Таро. Просматривайте прошлые расклады и толкования.",
    url: "/history",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "История раскладов Таро",
      },
    ],
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
