"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { TarotCard, TarotSpread, TarotReading } from "../types";
import Navbar from "../components/Navbar";
import Welcome from "../components/Welcome";
import SpreadSelector from "../components/SpreadSelector";
import TarotTable from "../components/TarotTable";
import CardDetails from "../components/CardDetails";
import ReadingsHistory from "../components/ReadingsHistory";
import TarotInfo from "../components/TarotInfo";
import { tarotSpreads } from "../data/tarotSpreads";

export default function Home() {
  // Состояния для управления UI
  const [activeTab, setActiveTab] = useState<"home" | "readings" | "info">(
    "home"
  );
  const [step, setStep] = useState<"welcome" | "select" | "reading">("welcome");
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread | null>(
    null
  );
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [selectedReading, setSelectedReading] = useState<TarotReading | null>(
    null
  );

  // Загрузка сохраненных раскладов при первом рендере
  useEffect(() => {
    const savedReadings = localStorage.getItem("tarotReadings");
    if (savedReadings) {
      try {
        const parsed = JSON.parse(savedReadings);
        setReadings(parsed);
      } catch (error) {
        console.error("Ошибка при загрузке раскладов:", error);
      }
    }
  }, []);

  // Обработчик для сохранения нового расклада
  const handleReadingComplete = (cards: TarotCard[]) => {
    const newReading: TarotReading = {
      id: uuidv4(),
      date: new Date().toISOString(),
      type: "general",
      cards,
      question: "",
    };

    const updatedReadings = [...readings, newReading];
    setReadings(updatedReadings);

    // Сохраняем в localStorage
    localStorage.setItem("tarotReadings", JSON.stringify(updatedReadings));
  };

  // Обработчик для выбора расклада
  const handleSpreadSelect = (spread: TarotSpread) => {
    setSelectedSpread(spread);
    setStep("reading");
  };

  // Обработчик для начала нового расклада
  const handleStartReading = () => {
    setStep("select");
  };

  // Обработчик для возврата на главную
  const handleBackToHome = () => {
    setStep("welcome");
    setSelectedSpread(null);
  };

  // Обработчик для выбора карты
  const handleCardSelect = (card: TarotCard) => {
    setSelectedCard(card);
  };

  // Обработчик для закрытия деталей карты
  const handleCloseCardDetails = () => {
    setSelectedCard(null);
  };

  // Обработчик для просмотра расклада из истории
  const handleViewReading = (reading: TarotReading) => {
    setSelectedReading(reading);
  };

  // Обработчик для закрытия просмотра расклада
  const handleCloseReadingView = () => {
    setSelectedReading(null);
  };

  return (
    <>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "home" && (
        <>
          {step === "welcome" && (
            <Welcome onStartReading={handleStartReading} />
          )}

          {step === "select" && (
            <SpreadSelector
              spreads={tarotSpreads}
              onSelect={handleSpreadSelect}
            />
          )}

          {step === "reading" && selectedSpread && (
            <TarotTable
              spread={selectedSpread}
              onReadingComplete={handleReadingComplete}
            />
          )}

          {step !== "welcome" && (
            <div className="mt-8 text-center">
              <button
                onClick={handleBackToHome}
                className="text-white/70 hover:text-white underline"
              >
                Вернуться на главную
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === "readings" && (
        <ReadingsHistory
          readings={readings}
          onViewReading={handleViewReading}
        />
      )}

      {activeTab === "info" && <TarotInfo />}

      {selectedCard && (
        <CardDetails card={selectedCard} onClose={handleCloseCardDetails} />
      )}

      {selectedReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-purple-950 to-black rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-cinzel font-bold text-white">
                Расклад от{" "}
                {new Date(selectedReading.date).toLocaleDateString("ru-RU")}
              </h2>
              <button
                onClick={handleCloseReadingView}
                className="text-white/70 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {selectedReading.question && (
              <div className="mb-6">
                <p className="text-white italic">
                  "{selectedReading.question}"
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedReading.cards.map((card, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => handleCardSelect(card)}
                >
                  <div className="relative w-full h-[300px] rounded-xl overflow-hidden shadow-lg mb-3">
                    <img
                      src={card.image}
                      alt={card.name}
                      className={`h-full w-full object-cover ${
                        card.isReversed ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-cinzel font-bold text-white mb-1">
                    {card.name}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {card.isReversed ? "Перевернутая - " : "Прямая - "}
                    {card.isReversed
                      ? card.meaning.reversed.split(",")[0]
                      : card.meaning.upright.split(",")[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
