import type { Metadata } from "next";
import "./globals.css";
import { QueryClientProviderApp } from "@/shared/api/query-client";

export const metadata: Metadata = {
  title: "Таро - Познай свою судьбу",
  description:
    "Интерактивный сайт для проведения раскладов карт Таро с красивыми анимациями и сохранением истории.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <QueryClientProviderApp>
          <main>{children}</main>
        </QueryClientProviderApp>
      </body>
    </html>
  );
}
