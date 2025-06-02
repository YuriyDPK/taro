import { useState } from "react";
import Image from "next/image";
import { TarotCard as TarotCardType } from "../types";

interface TarotCardProps {
  card: TarotCardType;
  isRevealed?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TarotCard({
  card,
  isRevealed = false,
  onClick,
  className = "",
}: TarotCardProps) {
  const [revealed, setRevealed] = useState(isRevealed);

  const handleClick = () => {
    if (!revealed) {
      setRevealed(true);
      if (onClick) onClick();
    }
  };

  return (
    <div
      className={`card-flip cursor-pointer mx-auto ${className}`}
      onClick={handleClick}
    >
      <div
        className={`card-inner relative w-full h-full transition-transform duration-700 ${
          revealed ? "rotate-y-180" : ""
        }`}
      >
        {/* Рубашка карты */}
        <div className="card-front absolute w-full h-full">
          <div className="relative w-[220px] h-[380px] rounded-xl overflow-hidden tarot-glow">
            <Image
              src="/cards/back.jpg"
              alt="Tarot Card Back"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Лицевая сторона карты */}
        <div className="card-back absolute w-full h-full transform rotate-y-180">
          <div
            className={`relative w-[220px] h-[380px] rounded-xl overflow-hidden shadow-xl ${
              card.isReversed ? "rotate-180" : ""
            }`}
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-white">
              <h3 className="text-lg font-cinzel font-bold">{card.name}</h3>
              <p className="text-xs opacity-80">
                {card.isReversed ? "Перевернутая" : "Прямая"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
