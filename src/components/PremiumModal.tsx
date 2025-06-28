"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { DonationBlock } from "./DonationBlock";
import Link from "next/link";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "reading" | "message";
  getTimeLeft: () => number; // функция для получения времени в миллисекундах
}

export const PremiumModal = ({
  isOpen,
  onClose,
  type,
  getTimeLeft,
}: PremiumModalProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [formattedTime, setFormattedTime] = useState("0с");

  // Обновляем таймер каждую секунду
  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      const time = getTimeLeft();
      setTimeLeft(time);

      // Форматируем время
      const minutes = Math.floor(time / 60000);
      const seconds = Math.floor((time % 60000) / 1000);

      if (minutes > 0) {
        setFormattedTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      } else {
        setFormattedTime(`${seconds}с`);
      }
    };

    updateTimer(); // Обновляем сразу
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isOpen, getTimeLeft]);

  if (!isOpen) return null;

  const isReading = type === "reading";

  // Закрытие по клику вне модалки
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-black/90 h-[80vh] overflow-y-auto border border-purple-400/30 rounded-lg max-w-md w-full p-6 animate-fadeIn relative">
        {/* Крестик для закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-4">{timeLeft > 0 ? "⏰" : "✨"}</div>
          <h2 className="text-2xl font-medium text-white mb-2">
            {timeLeft > 0
              ? isReading
                ? "Лимит раскладов исчерпан"
                : "Лимит сообщений исчерпан"
              : "Premium доступ"}
          </h2>
          <p className="text-white/70 text-sm">
            {timeLeft > 0
              ? isReading
                ? `Следующий расклад будет доступен через ${formattedTime}`
                : `Следующее сообщение будет доступно через ${formattedTime}`
              : "Получите неограниченный доступ ко всем функциям"}
          </p>
          {timeLeft > 0 && (
            <div className="mt-2 text-purple-300 text-xs">
              Таймер обновляется автоматически
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-400/30 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
              ✨ Premium доступ
            </h3>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Неограниченные расклады
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Неограниченные сообщения
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Эксклюзивные расклады
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Приоритетная поддержка
              </div>
            </div>
          </div>

          {/* Кнопка перехода к премиуму */}
          <div className="text-center">
            <Link href="/premium">
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium mb-4"
              >
                🔮 Выбрать тариф Premium
              </Button>
            </Link>
            <p className="text-purple-300 text-sm mb-4">
              Или поддержите проект любой суммой
            </p>
            <DonationBlock className="" />
          </div>

          <div className="text-center text-xs text-white/50">
            После поддержки свяжитесь с нами для активации Premium
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20"
            size="sm"
          >
            Подождать
          </Button>
          <Button
            onClick={() => {
              // TODO: Добавить логику активации Premium
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
            size="sm"
          >
            У меня Premium
          </Button>
        </div>
      </div>
    </div>
  );
};
