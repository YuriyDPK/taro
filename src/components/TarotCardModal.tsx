"use client";

import { TarotCardDeck } from "@/types";
import { X } from "lucide-react";
import Image from "next/image";

interface TarotCardModalProps {
  card: TarotCardDeck | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TarotCardModal({
  card,
  isOpen,
  onClose,
}: TarotCardModalProps) {
  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-purple-900/95 to-black/95 border border-purple-500/30 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Заголовок с кнопкой закрытия */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-100">
              {card.name}
              {card.isReversed && (
                <span className="text-red-400 ml-2 text-lg">
                  (Перевернутая)
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <X size={24} />
            </button>
          </div>

          {/* Изображение карты */}
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={card.image}
                alt={card.name}
                fill
                className={`object-cover transition-transform duration-300 ${
                  card.isReversed ? "rotate-180" : ""
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Значение карты */}
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                {card.isReversed
                  ? "Перевернутое значение:"
                  : "Прямое значение:"}
              </h3>
              <p className="text-purple-100 leading-relaxed">
                {card.isReversed ? card.meaning.reversed : card.meaning.upright}
              </p>
            </div>

            {/* Показываем и альтернативное значение для справки */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/20">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                {card.isReversed
                  ? "Прямое значение:"
                  : "Перевернутое значение:"}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {card.isReversed ? card.meaning.upright : card.meaning.reversed}
              </p>
            </div>
          </div>

          {/* Кнопка закрытия */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
