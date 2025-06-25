"use client";

import { useState } from "react";
import Image from "next/image";
import { TarotCardDeck } from "@/types";

interface TarotCardProps {
  card?: TarotCardDeck;
  isRevealed?: boolean;
  onReveal?: () => void;
  positionName?: string;
  positionDescription?: string;
  delay?: number;
  onCardClick?: (card: TarotCardDeck) => void;
}

export const TarotCard = ({
  card,
  isRevealed = false,
  onReveal,
  positionName,
  positionDescription,
  delay = 0,
  onCardClick,
}: TarotCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    if (!isRevealed && card && !isFlipped) {
      setIsFlipped(true);
      setTimeout(() => {
        onReveal?.();
        setShowInfo(true);
      }, 400);
    } else if (isRevealed && card && onCardClick) {
      onCardClick(card);
    }
  };

  const shouldShowCard = isFlipped || isRevealed;

  return (
    <div
      className="flex flex-col items-center space-y-3 animate-fadeIn"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Название позиции */}
      {positionName && (
        <div className="text-center px-2">
          <div className="text-sm sm:text-base md:text-lg xl:text-xl font-medium text-white mb-1">
            {positionName}
          </div>
          {positionDescription && (
            <div className="text-xs sm:text-sm xl:text-base text-white/70 text-center max-w-24 sm:max-w-28 md:max-w-32 xl:max-w-48">
              {positionDescription}
            </div>
          )}
        </div>
      )}

      {/* Карта */}
      <div
        className={`
          relative w-24 h-36 sm:w-28 sm:h-42 md:w-32 md:h-48 lg:w-36 lg:h-52 xl:w-48 xl:h-72
          cursor-pointer transition-all duration-500
          hover:scale-105 hover:z-10
          ${shouldShowCard ? "" : "hover:shadow-lg hover:shadow-purple-500/30"}
        `}
        style={{ perspective: "1000px" }}
        onClick={handleClick}
      >
        <div
          className={`
            relative w-full h-full transition-transform duration-800 preserve-3d
            ${shouldShowCard ? "rotate-y-180" : ""}
          `}
        >
          {/* Задняя сторона карты */}
          <div
            className={`
              absolute inset-0 w-full h-full rounded-lg border-2 border-purple-400/50 
              bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-purple-800/90 
              backdrop-blur-sm shadow-lg shadow-purple-500/25
              flex items-center justify-center backface-hidden
              ${!shouldShowCard ? "animate-pulse-border" : ""}
            `}
          >
            <div className="text-center">
              <div className="text-purple-300 text-2xl sm:text-3xl md:text-4xl xl:text-5xl mb-1 sm:mb-2 animate-float">
                🌟
              </div>
              <div className="text-purple-200 text-xs sm:text-xs md:text-xs xl:text-sm font-light px-1">
                Нажмите для открытия
              </div>
            </div>
          </div>

          {/* Передняя сторона карты */}
          {card && (
            <div
              className={`
                absolute inset-0 w-full h-full rounded-lg border-2 border-purple-400/50 
                bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 
                backdrop-blur-sm shadow-lg shadow-purple-500/25 overflow-hidden
                backface-hidden rotate-y-180
                ${shouldShowCard ? "animate-glow" : ""}
              `}
            >
              <div className="relative w-full h-full">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className={`object-cover rounded-lg transition-transform duration-300 ${
                    card.isReversed ? "rotate-180" : ""
                  }`}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 text-white">
                  <div className="text-xs sm:text-sm xl:text-base font-medium text-center bg-black/60 rounded px-1 sm:px-2 py-1 backdrop-blur-sm">
                    {card.name}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Подсказка о клике */}
      {shouldShowCard && card && showInfo && (
        <div className="w-full max-w-48 sm:max-w-56 md:max-w-64 bg-black/80 backdrop-blur-sm rounded-lg p-2 text-white text-sm animate-slideInUp border border-purple-400/30">
          <div className="font-medium mb-1 text-center text-purple-300 text-xs sm:text-sm">
            {card.name}
            {card.isReversed && (
              <span className="text-red-400 text-xs ml-1">(Перевернутая)</span>
            )}
          </div>
          <div className="text-xs text-center text-white/70">
            Нажмите для подробностей
          </div>
        </div>
      )}
    </div>
  );
};
