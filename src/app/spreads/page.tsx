"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import { TarotCard } from "@/components/TarotCard";
import TarotCardModal from "@/components/TarotCardModal";
import { TarotChat } from "@/components/TarotChat";
import { DonationBlock } from "@/components/DonationBlock";
import { PremiumModal } from "@/components/PremiumModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { getSpreadsByCategory } from "@/shared/data/tarot-spreads";
import { getRandomCards } from "@/shared/data/tarot-cards";
import { useRateLimits } from "@/shared/hooks/useRateLimits";
import {
  TarotReading,
  TarotSpreadType,
  ReadingType,
  TarotCardDeck,
} from "@/types";

export default function SpreadsPage() {
  const { data: session, status } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<ReadingType | "all">(
    "all"
  );
  const [selectedSpread, setSelectedSpread] = useState<TarotSpreadType | null>(
    null
  );
  const [drawnCards, setDrawnCards] = useState<TarotCardDeck[]>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [question, setQuestion] = useState("");
  const [currentReading, setCurrentReading] = useState<TarotReading | null>(
    null
  );
  const [showChat, setShowChat] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TarotCardDeck | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalType, setPremiumModalType] = useState<
    "reading" | "message"
  >("reading");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Сброс расклада при каждом заходе на страницу (когда кликают в меню)
  // Состояние автоматически сбрасывается так как selectedSpread инициализируется как null

  // Лимиты на расклады и сообщения
  const {
    canCreateReading,
    getTimeUntilNextReading,
    getTimeUntilNextMessage,
    hasActiveMessageLimit,
    registerReading,
  } = useRateLimits();

  const categories = [
    { id: "all", name: "Все категории", icon: "🌟" },
    { id: "general", name: "Общие вопросы", icon: "🔮" },
    { id: "love", name: "Любовь", icon: "❤️" },
    { id: "career", name: "Карьера", icon: "💼" },
    { id: "spiritual", name: "Духовность", icon: "🙏" },
  ];

  const availableSpreads = getSpreadsByCategory(selectedCategory);

  const startReading = async (spread: TarotSpreadType) => {
    // Проверяем авторизацию
    if (!session?.user) {
      setShowAuthModal(true);
      return;
    }

    // Проверяем что введен вопрос
    if (!question.trim()) {
      alert("Пожалуйста, сформулируйте свой вопрос перед началом расклада");
      return;
    }

    // Проверяем лимит на расклады
    if (!canCreateReading()) {
      // const timeLeft = getTimeUntilNextReading();
      setPremiumModalType("reading");
      setShowPremiumModal(true);
      return;
    }

    const cards = getRandomCards(spread.cardCount);

    setSelectedSpread(spread);
    setDrawnCards(cards);
    setRevealedCards([]);
    setShowChat(false);

    try {
      // Создаем расклад в БД
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spreadType: spread.name,
          question: question.trim(),
          category: spread.category,
          cards: cards.map((card, index) => ({
            id: index,
            name: card.name,
            image: card.image,
            description: spread.positions[index]?.description || "",
            meaning: card.meaning,
            isReversed: Math.random() < 0.3,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          setPremiumModalType("reading");
          setShowPremiumModal(true);
          return;
        }
        throw new Error(error.error || "Ошибка создания расклада");
      }

      const dbReading = await response.json();

      const newReading: TarotReading = {
        id: dbReading.id,
        date: new Date(dbReading.createdAt).toISOString(),
        type: spread.category,
        question: question.trim(),
        cards: cards.map((card, index) => ({
          id: index,
          name: card.name,
          image: card.image,
          description: spread.positions[index]?.description || "",
          meaning: card.meaning,
          isReversed: Math.random() < 0.3,
        })),
        spreadType: spread.name,
      };

      setCurrentReading(newReading);

      // Регистрируем новый расклад в лимитах
      registerReading(dbReading.id);
    } catch (error) {
      console.error("Ошибка создания расклада:", error);
      alert("Ошибка создания расклада. Попробуйте позже.");
    }
  };

  const revealCard = (cardIndex: number) => {
    setRevealedCards((prev) => [...prev, cardIndex]);

    // Если все карты открыты, показываем чат
    if (revealedCards.length + 1 === drawnCards.length) {
      setTimeout(() => {
        setShowChat(true);

        // Расклад уже сохранен в БД при создании
      }, 1000);
    }
  };

  const resetReading = () => {
    setSelectedSpread(null);
    setDrawnCards([]);
    setRevealedCards([]);
    setQuestion("");
    setCurrentReading(null);
    setShowChat(false);
    setSelectedCard(null);
    setIsModalOpen(false);
  };

  const handleCardClick = (card: TarotCardDeck) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const generateReadingDescription = () => {
    if (!selectedSpread || !drawnCards.length) return "";

    let description = `🔮 Расклад "${selectedSpread.name}"\n\n`;

    if (question) {
      description += `❓ Вопрос: ${question}\n\n`;
    }

    description += "🃏 Выпавшие карты:\n";
    drawnCards.forEach((card, index) => {
      const position = selectedSpread.positions[index];
      description += `\n${position.name}: ${card.name}\n`;
      description += `Значение позиции: ${position.description}\n`;
    });

    description +=
      "\n✨ Пожалуйста, дайте толкование этого расклада и мудрый совет.";

    return description;
  };

  // Простой flex класс для всех раскладов
  const getFlexClass = () => {
    return "flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 xl:p-12";
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-2 sm:mb-4">
            Расклады Таро
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 px-2">
            Выберите категорию и тип расклада для получения ответов
          </p>
        </div>

        {!selectedSpread ? (
          // Выбор категории и расклада
          <div className="space-y-8">
            {/* Поле для вопроса */}
            <div className="max-w-2xl mx-auto">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Сформулируйте свой вопрос (обязательно)..."
                className={`w-full bg-black/40 border rounded-lg px-4 py-3 text-white placeholder-purple-300/50 resize-none focus:outline-none ${
                  question.trim()
                    ? "border-purple-400/30 focus:border-purple-400"
                    : "border-red-400/50 focus:border-red-400"
                }`}
                rows={3}
              />
              {!session?.user ? (
                <p className="text-yellow-400 text-sm mt-2 text-center">
                  🔒 Войдите в аккаунт, чтобы создавать расклады
                </p>
              ) : !question.trim() ? (
                <p className="text-red-400 text-sm mt-2 text-center">
                  💭 Пожалуйста, сформулируйте свой вопрос перед началом
                  расклада
                </p>
              ) : null}
            </div>

            {/* Категории */}
            <div className="flex justify-center gap-4 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(category.id as ReadingType | "all")
                  }
                  className={`${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                      : ""
                  }`}
                  size="sm"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Доступные расклады */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto px-2">
              {availableSpreads.map((spread) => (
                <div
                  key={spread.id}
                  className={`bg-black/40 backdrop-blur-sm border rounded-lg p-6 transition-all group ${
                    session?.user && question.trim()
                      ? "border-purple-400/30 hover:border-purple-400/60 cursor-pointer"
                      : "border-gray-600/30 opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => startReading(spread)}
                >
                  <div className="text-center">
                    <h3
                      className={`text-xl font-medium mb-2 transition-colors ${
                        session?.user && question.trim()
                          ? "text-white group-hover:text-purple-300"
                          : "text-gray-400"
                      }`}
                    >
                      {spread.name}
                    </h3>
                    <p className="text-sm text-white/70 mb-4">
                      {spread.description}
                    </p>
                    <div className="flex justify-center gap-2 mb-4 flex-wrap">
                      {Array.from({
                        length: Math.min(spread.cardCount, 6),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="w-6 h-8 bg-purple-600/30 rounded border border-purple-400/50"
                        />
                      ))}
                      {spread.cardCount > 6 && (
                        <div className="text-white/60 text-xs flex items-center">
                          +{spread.cardCount - 6}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-purple-300">
                      {spread.cardCount}{" "}
                      {spread.cardCount === 1
                        ? "карта"
                        : spread.cardCount < 5
                        ? "карты"
                        : "карт"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Активный расклад
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex justify-center items-center gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-0 px-2">
                    {selectedSpread.name}
                  </h2>
                </div>
              </div>
              <p className="text-sm sm:text-base text-white/70 mb-4 px-2">
                {selectedSpread.description}
              </p>
              <Button
                onClick={resetReading}
                size="sm"
                className="bg-black/40 border border-purple-400/30 text-purple-300 hover:text-white mb-4"
              >
                ← К выбору раскладов
              </Button>
              {question && (
                <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-4 max-w-2xl mx-auto">
                  <div className="text-purple-300 text-sm mb-1">
                    Ваш вопрос:
                  </div>
                  <div className="text-white">{question}</div>
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Область расклада */}
              <div className="flex-1">
                <div
                  className={`
                  bg-black/20 backdrop-blur-sm border border-purple-400/30 rounded-lg 
                  mx-auto w-full min-h-64
                  ${getFlexClass()}
                `}
                >
                  {drawnCards.map((card, index) => (
                    <TarotCard
                      key={index}
                      card={card}
                      isRevealed={revealedCards.includes(index)}
                      onReveal={() => revealCard(index)}
                      onCardClick={handleCardClick}
                      positionName={selectedSpread.positions[index]?.name}
                      positionDescription={
                        selectedSpread.positions[index]?.description
                      }
                      delay={index * 200}
                    />
                  ))}
                </div>

                <div className="text-center mt-8">
                  <div className="text-white/70 mb-4">
                    Карт открыто: {revealedCards.length} из {drawnCards.length}
                  </div>
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Button onClick={resetReading} size="sm">
                      Новый расклад
                    </Button>
                    {revealedCards.length === drawnCards.length &&
                      !showChat && (
                        <Button
                          onClick={() => setShowChat(true)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600"
                          size="sm"
                        >
                          Получить толкование
                        </Button>
                      )}
                  </div>
                </div>
              </div>

              {/* Чат с гадалкой */}
              {showChat && (
                <div className="w-full lg:w-96 lg:flex-shrink-0 space-y-6">
                  <TarotChat
                    initialMessage={generateReadingDescription()}
                    className="h-fit max-h-[600px]"
                    readingId={currentReading?.id}
                    onRateLimitExceeded={(type) => {
                      setPremiumModalType(type);
                      setShowPremiumModal(true);
                    }}
                    onPremiumClick={() => {
                      setPremiumModalType("message");
                      setShowPremiumModal(true);
                    }}
                  />

                  {/* Блок пожертвований после расклада */}
                  <DonationBlock />
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
          type={premiumModalType}
          getTimeLeft={() => {
            if (premiumModalType === "reading") {
              return getTimeUntilNextReading();
            } else {
              // Для сообщений: если есть активный лимит, показываем время, иначе 0
              return currentReading?.id &&
                hasActiveMessageLimit(currentReading.id)
                ? getTimeUntilNextMessage(currentReading.id)
                : 0;
            }
          }}
        />

        {/* Модальное окно авторизации */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </div>
  );
}
