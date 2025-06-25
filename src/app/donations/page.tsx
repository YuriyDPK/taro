"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/shared/ui/button";

export default function DonationsPage() {
  const [copied, setCopied] = useState(false);
  const phoneNumber = "89101495344";
  const donationLink =
    "https://t-qr.ru/p.php?t=uvpmpgvfngg&n=YURIY_PRONYAGIN&b=t-bank";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Ошибка копирования:", err);
    }
  };

  const openDonationLink = () => {
    window.open(donationLink, "_blank");
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4">
            Поддержать проект
          </h1>
          <p className="text-base sm:text-lg text-white/80">
            Помочь развитию сайта таро-раскладов
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-8 text-center animate-fadeIn">
          <div className="mb-6">
            <div className="text-4xl mb-4">🙏</div>
            <h2 className="text-2xl font-medium text-white mb-4">
              Поддержать гадалку Асхат
            </h2>
            <p className="text-white/70 mb-6">
              Если мистические расклады помогли вам найти ответы, вы можете
              поблагодарить звёзды и поддержать развитие проекта через СБП
            </p>
          </div>

          <div className="space-y-6">
            {/* QR-код для перевода */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <Image
                  src="/qrcode.png"
                  alt="QR-код для пожертвований"
                  width={200}
                  height={200}
                  className="rounded"
                />
              </div>
            </div>

            <div className="bg-black/60 rounded-lg p-6 border border-purple-400/20">
              <div className="text-purple-300 text-base mb-2">СБП Т-Банк</div>
              <div className="text-white font-mono text-xl tracking-wide">
                +7 {phoneNumber.slice(1, 4)} {phoneNumber.slice(4, 7)}-
                {phoneNumber.slice(7, 9)}-{phoneNumber.slice(9)}
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30"
              >
                {copied ? "✅ Скопировано" : "📋 Копировать номер"}
              </Button>

              <Button
                onClick={openDonationLink}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
              >
                💳 Перевод через СБП
              </Button>
            </div>

            {/* Прямая ссылка */}
            <div className="text-center">
              {/* <div className="text-purple-300 text-sm mb-2">Прямая ссылка:</div> */}
              {/* <a
                href={donationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 text-sm underline break-all"
              >
                {donationLink}
              </a> */}
            </div>

            <div className="text-sm text-white/70 mt-6 space-y-2">
              <p>✨ Любая сумма будет принята с благодарностью</p>
              <p>🔮 Средства идут на развитие сайта и улучшение гаданий</p>
              <p>
                🌟 Благодаря вашей поддержке мы можем добавлять новые расклады
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/">
            <Button
              size="sm"
              className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30"
            >
              ← Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
