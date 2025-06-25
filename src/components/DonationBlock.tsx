"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/shared/ui/button";

export const DonationBlock = ({ className }: { className?: string }) => {
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
    <div
      className={`bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6 text-center animate-fadeIn ${className}`}
    >
      <div className="mb-4">
        <div className="text-2xl mb-2">🙏</div>
        <h3 className="text-xl font-medium text-white mb-2">
          Поддержать гадалку Асхат
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Если расклад помог вам, вы можете поблагодарить звёзды через СБП
        </p>
      </div>

      <div className="space-y-4">
        {/* QR-код для перевода */}
        <div className="flex justify-center">
          <div className="bg-white p-3 rounded-lg">
            <Image
              src="/qrcode.png"
              alt="QR-код для пожертвований"
              width={150}
              height={150}
              className="rounded"
            />
          </div>
        </div>

        <div className="bg-black/60 rounded-lg p-4 border border-purple-400/20">
          <div className="text-purple-300 text-sm mb-1">СБП Т-Банк</div>
          <div className="text-white font-mono text-lg tracking-wide">
            +7 {phoneNumber.slice(1, 4)} {phoneNumber.slice(4, 7)}-
            {phoneNumber.slice(7, 9)}-{phoneNumber.slice(9)}
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
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
          {/* <a
            href={donationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 text-sm underline break-all"
          >
            {donationLink}
          </a> */}
        </div>

        <div className="text-xs text-white/50 mt-4">
          Любая сумма будет принята с благодарностью ✨
        </div>
      </div>
    </div>
  );
};
