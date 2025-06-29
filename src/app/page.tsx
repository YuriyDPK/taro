"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { DonationBlock } from "@/components/DonationBlock";
import { Footer } from "@/components/Footer";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Script
        id="home-faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Что такое Таро?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Таро - это система гадания с помощью специальных карт, которая помогает получить ответы на жизненные вопросы и лучше понять себя и свою ситуацию.",
                },
              },
              {
                "@type": "Question",
                name: "Как работают расклады Таро?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Расклады Таро работают через интуитивный выбор карт, которые затем интерпретируются в контексте вашего вопроса. Каждая карта имеет свое значение и символику.",
                },
              },
              {
                "@type": "Question",
                name: "Бесплатно ли гадание на сайте?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Да, базовые расклады Таро на нашем сайте доступны бесплатно. Также есть Premium подписка с дополнительными функциями.",
                },
              },
              {
                "@type": "Question",
                name: "Какие типы раскладов доступны?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Мы предлагаем различные расклады: на любовь, карьеру, общие вопросы и духовное развитие. Каждый расклад адаптирован под конкретную тематику.",
                },
              },
              {
                "@type": "Question",
                name: "Нужна ли регистрация?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Да, для сохранения истории ваших раскладов и доступа к персональным функциям требуется регистрация через Google или Telegram.",
                },
              },
            ],
          }),
        }}
      />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center mt-[5vh] gap-[40px] px-8 lg:px-0">
          <header className="flex flex-col items-center justify-center gap-2">
            <h1
              className={`xl:text-[80px] lg:text-[60px] sm:text-[40px] text-[40px] font-light text-white text-center `}
            >
              Задай вопрос - получи ответ
            </h1>
            <h2
              className={`xl:text-[30px] lg:text-[26px] text-[20px] font-light text-white text-center`}
            >
              Интуитивные расклады на Таро в один клик
            </h2>
          </header>

          <nav role="navigation" aria-label="Основные действия">
            <Link href="/spreads">
              <Button className="px-[40px] lg:px-[60px] lg:py-[20px] py-[10px] text-[22px] lg:text-[28px] xl:text-[32px] shadow-white/5 shadow-[0px_-10px_10px_0px_rgba(255,255,255,0.05)] hover:scale-105 transition-transform duration-300">
                🔮 Сделать расклад
              </Button>
            </Link>
          </nav>

          {/* Блок пожертвований */}
          <aside
            className="max-w-md w-full px-4"
            aria-label="Поддержка проекта"
          >
            <DonationBlock />
          </aside>
        </main>

        {/* Футер */}
        <Footer />
      </div>
    </>
  );
}
