import type { Metadata } from "next";
import "./globals.css";
import { QueryClientProviderApp } from "@/shared/api/query-client";
import { Header } from "@/features/header";
import { NextAuthProvider } from "@/components/providers/SessionProvider";
import { CookieNotice } from "@/components/CookieNotice";
import { Roboto } from "next/font/google";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Таро - ключи ко всем дверям | Онлайн гадание на картах Таро",
  description:
    "Интерактивный сайт для проведения раскладов карт Таро. Гадание онлайн, различные расклады, толкование карт. Узнайте свое будущее с помощью древней мудрости Таро.",
  keywords: [
    "таро",
    "гадание",
    "карты таро",
    "расклад",
    "онлайн гадание",
    "предсказание",
    "будущее",
    "толкование карт",
    "магия",
    "эзотерика",
  ],
  authors: [{ name: "Taro App" }],
  creator: "Taro App",
  publisher: "Taro App",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Таро - ключи ко всем дверям",
    description:
      "Интерактивный сайт для проведения раскладов карт Таро. Гадание онлайн, различные расклады, толкование карт.",
    url: "/",
    siteName: "Таро - ключи ко всем дверям",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Таро - ключи ко всем дверям",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Таро - ключи ко всем дверям",
    description:
      "Интерактивный сайт для проведения раскладов карт Таро. Гадание онлайн, различные расклады, толкование карт.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/logo.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    yandex: "103111814",
  },
};

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bg = "/bg.png";
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2A2641" />
        <meta name="yandex-verification" content="7480909fd367eb09" />
        <link
          rel="canonical"
          href={process.env.NEXTAUTH_URL || "http://localhost:3000"}
        />
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(103111814, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true
            });
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Таро - ключи ко всем дверям",
              description:
                "Интерактивный сайт для проведения раскладов карт Таро",
              url: process.env.NEXTAUTH_URL || "http://localhost:3000",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${
                    process.env.NEXTAUTH_URL || "http://localhost:3000"
                  }/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Таро - ключи ко всем дверям",
              description:
                "Интерактивное веб-приложение для гадания на картах Таро с различными раскладами",
              url: process.env.NEXTAUTH_URL || "http://localhost:3000",
              applicationCategory: "EntertainmentApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "RUB",
                availability: "https://schema.org/InStock",
              },
              featureList: [
                "Различные расклады Таро",
                "Интерпретация карт",
                "История раскладов",
                "Premium функции",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Таро - ключи ко всем дверям",
              description: "Платформа для онлайн гадания на картах Таро",
              url: process.env.NEXTAUTH_URL || "http://localhost:3000",
              logo: `${
                process.env.NEXTAUTH_URL || "http://localhost:3000"
              }/logo.png`,
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "Russian",
              },
            }),
          }}
        />
      </head>
      <body>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/103111814"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        <NextAuthProvider>
          <QueryClientProviderApp>
            <div
              className={`flex flex-col min-h-screen px-0 lg:px-10 py-8 bg-black ${roboto.className} bg-[#2A2641] bg-cover bg-center bg-no-repeat`}
              style={{ backgroundImage: `url(${bg})` }}
            >
              <Header />
              <main className="flex-1">{children}</main>
              <CookieNotice />
            </div>
          </QueryClientProviderApp>
        </NextAuthProvider>
      </body>
    </html>
  );
}
