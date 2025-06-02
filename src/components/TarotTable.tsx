import { useState, useEffect } from "react";
import { TarotCard as TarotCardType, TarotSpread } from "../types";
import TarotCard from "./TarotCard";
import { drawCards } from "../data/tarotCards";
import { majorArcana } from "../data/tarotCards";

interface TarotTableProps {
  spread: TarotSpread;
  onReadingComplete?: (cards: TarotCardType[]) => void;
}

export default function TarotTable({
  spread,
  onReadingComplete,
}: TarotTableProps) {
  const [deck, setDeck] = useState<TarotCardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCardType[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [step, setStep] = useState<
    "init" | "shuffling" | "selecting" | "revealing"
  >("init");

  // Инициализация колоды
  useEffect(() => {
    setDeck([...majorArcana]);
  }, []);

  // Функция перемешивания колоды с анимацией
  const handleShuffle = () => {
    setIsShuffling(true);
    setStep("shuffling");

    // Имитация анимации перемешивания
    setTimeout(() => {
      setIsShuffling(false);
      setStep("selecting");
    }, 2000);
  };

  // Обработчик выбора карты
  const handleCardSelect = () => {
    if (selectedCards.length < spread.cardCount) {
      const drawnCard = drawCards(deck, 1)[0];

      setSelectedCards((prev) => [...prev, drawnCard]);

      // Удаляем выбранную карту из колоды
      setDeck((prev) => prev.filter((card) => card.id !== drawnCard.id));

      // Если выбрали все карты для расклада
      if (selectedCards.length + 1 === spread.cardCount) {
        setStep("revealing");

        // Уведомляем родительский компонент о завершении расклада
        if (onReadingComplete) {
          setTimeout(() => {
            onReadingComplete([...selectedCards, drawnCard]);
          }, 1000);
        }
      }
    }
  };

  return (
    <div className="relative w-full min-h-[500px] rounded-xl bg-purple-950/30 backdrop-blur-sm p-8 mt-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-cinzel font-bold text-white">
          {spread.name}
        </h2>
        <p className="text-gray-300">{spread.description}</p>
      </div>

      {step === "init" && (
        <div className="flex flex-col items-center gap-6">
          <p className="text-white text-lg">Готовы начать расклад?</p>
          <button
            className="px-6 py-3 bg-purple-700 text-white rounded-full hover:bg-purple-600 transition-all"
            onClick={handleShuffle}
          >
            Перемешать колоду
          </button>
        </div>
      )}

      {step === "shuffling" && (
        <div className="flex flex-col items-center gap-6">
          <div className="w-80 h-80 relative">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="absolute w-[150px] h-[220px] bg-indigo-900 rounded-lg shadow-lg"
                style={{
                  transform: `rotate(${Math.random() * 360}deg) translate(${
                    Math.random() * 50 - 25
                  }px, ${Math.random() * 50 - 25}px)`,
                  transition: "all 0.5s ease",
                  opacity: isShuffling ? 1 : 0,
                  top: "calc(50% - 110px)",
                  left: "calc(50% - 75px)",
                  zIndex: index,
                  animationDelay: `${index * 100}ms`,
                }}
              />
            ))}
          </div>
          <p className="text-white animate-pulse">Перемешиваем карты...</p>
        </div>
      )}

      {step === "selecting" && (
        <div className="flex flex-col items-center gap-8">
          <p className="text-white text-lg">
            Выберите {spread.cardCount} карт для расклада
          </p>

          <div className="relative w-[220px] h-[300px]">
            <div
              className="absolute top-0 left-0 cursor-pointer float transition-all transform"
              onClick={handleCardSelect}
            >
              <div className="relative w-[220px] h-[380px] rounded-xl overflow-hidden shadow-xl tarot-glow">
                <div className="absolute inset-0 bg-indigo-900/90 flex items-center justify-center">
                  <span className="text-white font-cinzel text-xl">
                    Колода Таро
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
            {selectedCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center">
                <TarotCard card={card} isRevealed={false} />
                <span className="text-white mt-2">
                  {spread.positions[index].name}
                </span>
              </div>
            ))}

            {Array.from({
              length: spread.cardCount - selectedCards.length,
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex flex-col items-center"
              >
                <div className="w-[220px] h-[380px] rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center">
                  <span className="text-white/50">Выберите карту</span>
                </div>
                <span className="text-white/70 mt-2">
                  {spread.positions[selectedCards.length + index].name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "revealing" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {selectedCards.map((card, index) => (
            <div key={index} className="flex flex-col items-center mb-8">
              <TarotCard card={card} isRevealed={true} />
              <div className="text-center mt-4">
                <h3 className="text-white font-bold">
                  {spread.positions[index].name}
                </h3>
                <p className="text-white/80 text-sm">
                  {spread.positions[index].description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
