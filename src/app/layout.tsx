import type { Metadata } from "next";
import "./globals.css";
import { QueryClientProviderApp } from "@/shared/api/query-client";
import { Header } from "@/features/header";
import { NextAuthProvider } from "@/components/providers/SessionProvider";
import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "Таро - ключи ко всем дверям",
  description: "Интерактивный сайт для проведения раскладов карт Таро",
};
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bg = "/bg.png";
  return (
    <html lang="ru">
      <body>
        <NextAuthProvider>
          <QueryClientProviderApp>
            <div
              className={`flex flex-col min-h-screen px-10 py-8 bg-black ${roboto.className} bg-[#2A2641] bg-cover bg-center bg-no-repeat`}
              style={{ backgroundImage: `url(${bg})` }}
            >
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </QueryClientProviderApp>
        </NextAuthProvider>
      </body>
    </html>
  );
}
