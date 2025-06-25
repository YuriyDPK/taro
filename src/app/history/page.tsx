"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { TarotChat } from "@/components/TarotChat";
import TarotCardModal from "@/components/TarotCardModal";
import { PremiumModal } from "@/components/PremiumModal";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { useRateLimits } from "@/shared/hooks/useRateLimits";
import { TarotReading, TarotCardDeck } from "@/types";
import Image from "next/image";

export default function HistoryPage() {
  const [readings, setReadings] = useLocalStorage<TarotReading[]>(
    "tarot-readings",
    []
  );
  const [selectedReading, setSelectedReading] = useState<TarotReading | null>(
    null
  );
  const [activeChats, setActiveChats] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedCard, setSelectedCard] = useState<TarotCardDeck | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const { getTimeUntilNextMessage } = useRateLimits();

  const deleteReading = (readingId: string) => {
    setReadings((prev) => prev.filter((reading) => reading.id !== readingId));
    if (selectedReading?.id === readingId) {
      setSelectedReading(null);
      setActiveChats((prev) => {
        const newChats = new Set(prev);
        newChats.delete(readingId);
        return newChats;
      });
    }
  };

  const clearAllHistory = () => {
    setReadings([]);
    setSelectedReading(null);
    setActiveChats(new Set());
  };

  const toggleChat = (readingId: string) => {
    setActiveChats((prev) => {
      const newChats = new Set(prev);
      if (newChats.has(readingId)) {
        newChats.delete(readingId);
      } else {
        newChats.add(readingId);
      }
      return newChats;
    });
  };

  const handleCardClick = (card: TarotCardDeck) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const filteredReadings =
    filterType === "all"
      ? readings
      : readings.filter((reading) => reading.type === filterType);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generateReadingDescription = (reading: TarotReading) => {
    let description = `🔮 Расклад "${reading.spreadType}"\n`;
    description += `📅 Дата: ${formatDate(reading.date)}\n\n`;

    if (reading.question && reading.question !== "Общий вопрос") {
      description += `❓ Вопрос: ${reading.question}\n\n`;
    }

    description += "🃏 Выпавшие карты:\n";
    reading.cards.forEach((card) => {
      description += `\n• ${card.name}`;
      if (card.description) {
        description += ` (${card.description})`;
      }
      description += `\n  ${
        card.isReversed ? "Обратное значение" : "Прямое значение"
      }: ${card.isReversed ? card.meaning.reversed : card.meaning.upright}\n`;
    });

    description +=
      "\n✨ Дайте дополнительное толкование этого расклада и мудрый совет на сегодня.";

    return description;
  };

  const filterCategories = [
    { id: "all", name: "Все расклады", icon: "🌟" },
    { id: "general", name: "Общие", icon: "🔮" },
    { id: "love", name: "Любовь", icon: "❤️" },
    { id: "career", name: "Карьера", icon: "💼" },
    { id: "spiritual", name: "Духовность", icon: "🙏" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-light text-white mb-4">
            История раскладов
          </h1>
          <p className="text-xl text-white/80">
            Все ваши прошлые гадания сохранены здесь
          </p>
        </div>

        {readings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔮</div>
            <div className="text-2xl text-white/70 mb-4">
              У вас пока нет сохраненных раскладов
            </div>
            <div className="text-white/50 mb-8">
              Проведите первый расклад, чтобы начать накапливать мудрость карт
            </div>
            <Button
              onClick={() => (window.location.href = "/spreads")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
              size="lg"
            >
              Сделать расклад
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Список раскладов */}
            <div className="w-full lg:w-96 space-y-4 lg:flex-shrink-0">
              {/* Фильтры */}
              <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-4">
                <div className="text-white font-medium mb-3">
                  Фильтр по категории
                </div>
                <div className="space-y-2">
                  {filterCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setFilterType(category.id)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        filterType === category.id
                          ? "bg-purple-600/50 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Управление историей */}
              <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-4">
                <div className="text-white font-medium mb-3">Управление</div>
                <div className="space-y-2">
                  <Button
                    onClick={() => (window.location.href = "/spreads")}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                    size="sm"
                  >
                    Новый расклад
                  </Button>
                  <Button
                    onClick={clearAllHistory}
                    className="w-full"
                    variant="destructive"
                    size="sm"
                    disabled={readings.length === 0}
                  >
                    Очистить историю
                  </Button>
                </div>
              </div>

              {/* Список раскладов */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredReadings.map((reading) => (
                  <div
                    key={reading.id}
                    className={`bg-black/40 backdrop-blur-sm border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedReading?.id === reading.id
                        ? "border-purple-400/60 bg-purple-900/20"
                        : "border-purple-400/30 hover:border-purple-400/50"
                    }`}
                    onClick={() => setSelectedReading(reading)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-white font-medium">
                        {reading.spreadType}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteReading(reading.id);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-sm text-white/70 mb-2">
                      {formatDate(reading.date)}
                    </div>
                    {reading.question &&
                      reading.question !== "Общий вопрос" && (
                        <div className="text-sm text-purple-300 mb-2 line-clamp-2">
                          {reading.question}
                        </div>
                      )}
                    <div className="flex gap-1 flex-wrap">
                      {reading.cards.slice(0, 3).map((card, index) => (
                        <div
                          key={index}
                          className="w-6 h-8 bg-purple-600/30 rounded border border-purple-400/50 text-xs flex items-center justify-center text-white/60"
                        >
                          {index + 1}
                        </div>
                      ))}
                      {reading.cards.length > 3 && (
                        <div className="text-white/60 text-xs flex items-center">
                          +{reading.cards.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Детали выбранного расклада */}
            <div className="flex-1">
              {selectedReading ? (
                <div className="space-y-6">
                  {/* Информация о раскладе */}
                  <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-light text-white mb-2">
                          {selectedReading.spreadType}
                        </h2>
                        <div className="text-white/70">
                          {formatDate(selectedReading.date)}
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row gap-2">
                        <Button
                          onClick={() => toggleChat(selectedReading.id)}
                          className={`${
                            activeChats.has(selectedReading.id)
                              ? "bg-gradient-to-r from-red-600 to-pink-600"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600"
                          }`}
                          size="sm"
                        >
                          {activeChats.has(selectedReading.id)
                            ? "Закрыть чат"
                            : "Пообщаться с гадалкой"}
                        </Button>
                        <Button
                          onClick={() => deleteReading(selectedReading.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>

                    {selectedReading.question &&
                      selectedReading.question !== "Общий вопрос" && (
                        <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4 mb-4">
                          <div className="text-purple-300 text-sm mb-1">
                            Вопрос:
                          </div>
                          <div className="text-white">
                            {selectedReading.question}
                          </div>
                        </div>
                      )}
                  </div>
                  {/* Чат с гадалкой */}
                  {activeChats.has(selectedReading.id) && (
                    <TarotChat
                      initialMessage={generateReadingDescription(
                        selectedReading
                      )}
                      className="h-fit max-h-[500px]"
                      readingId={selectedReading.id}
                      onRateLimitExceeded={() => setShowPremiumModal(true)}
                      onPremiumClick={() => setShowPremiumModal(true)}
                    />
                  )}
                  {/* Карты расклада */}
                  <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
                    <h3 className="text-xl font-light text-white mb-4">
                      Выпавшие карты
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {selectedReading.cards.map((card, index) => (
                        <div
                          key={index}
                          className="bg-black/60 border border-purple-400/30 rounded-lg p-4 cursor-pointer hover:border-purple-400/60 transition-all"
                          onClick={() =>
                            handleCardClick({
                              id: card.id?.toString() || `card-${index}`,
                              name: card.name,
                              image: card.image,
                              meaning: card.meaning,
                              isReversed: card.isReversed,
                            })
                          }
                        >
                          <div className="flex gap-4">
                            <div className="relative w-16 h-24 flex-shrink-0">
                              <Image
                                src={card.image}
                                alt={card.name}
                                fill
                                className={`object-cover rounded border border-purple-400/50 transition-transform duration-300 hover:scale-105 ${
                                  card.isReversed ? "rotate-180" : ""
                                }`}
                                unoptimized
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium mb-1">
                                {card.name}
                                {card.isReversed && (
                                  <span className="text-red-400 text-xs ml-1">
                                    (Перевернутая)
                                  </span>
                                )}
                              </div>
                              {card.description && (
                                <div className="text-purple-300 text-sm mb-2">
                                  {card.description}
                                </div>
                              )}
                              <div className="text-white/70 text-xs">
                                <div className="mb-1">
                                  <strong>
                                    {card.isReversed ? "Обратное" : "Прямое"}:
                                  </strong>
                                </div>
                                <div className="line-clamp-2">
                                  {card.isReversed
                                    ? card.meaning.reversed
                                    : card.meaning.upright}
                                </div>
                                <div className="text-purple-400 text-xs mt-1">
                                  Нажмите для подробностей
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4">📜</div>
                  <div className="text-xl text-white/70">
                    Выберите расклад из списка для просмотра деталей
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Модальное окно для карты */}
        <TarotCardModal
          card={selectedCard}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        {/* Модальное окно Premium */}
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          type="message"
          getTimeLeft={() =>
            selectedReading?.id
              ? getTimeUntilNextMessage(selectedReading.id)
              : 0
          }
        />
      </div>
    </div>
  );
}
