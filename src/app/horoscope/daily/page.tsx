"use client";

import { useState } from "react";
import { zodiacSigns, getZodiacSignByDate } from "@/shared/data/zodiac-signs";
import { generateHoroscope } from "@/shared/data/horoscope-templates";
import { Button } from "@/shared/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";

export default function DailyHoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    "general" | "love" | "career" | "health" | "money"
  >("general");
  const [autoDetected, setAutoDetected] = useState(false);

  const categories = [
    {
      id: "general",
      name: "Общий",
      emoji: "🌟",
      description: "Общий прогноз на день",
    },
    {
      id: "love",
      name: "Любовь",
      emoji: "💕",
      description: "Романтические отношения",
    },
    {
      id: "career",
      name: "Карьера",
      emoji: "💼",
      description: "Работа и профессия",
    },
    {
      id: "health",
      name: "Здоровье",
      emoji: "🏥",
      description: "Физическое состояние",
    },
    {
      id: "money",
      name: "Финансы",
      emoji: "💰",
      description: "Деньги и инвестиции",
    },
  ];

  const autoDetectSign = () => {
    const today = new Date();
    const sign = getZodiacSignByDate(today);
    if (sign) {
      setSelectedSign(sign.id);
      setAutoDetected(true);
    }
  };

  const selectedSignData = selectedSign
    ? zodiacSigns.find((s) => s.id === selectedSign)
    : null;
  const horoscope = selectedSign
    ? generateHoroscope(selectedSign, selectedCategory)
    : null;

  const today = new Date();
  const todayString = today.toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/horoscope"
              className="text-purple-300 hover:text-purple-200 mb-4 inline-block"
            >
              ← Назад к гороскопам
            </Link>
            <h1 className="text-4xl lg:text-5xl font-light text-white mb-4">
              📅 Гороскоп на сегодня
            </h1>
            <p className="text-xl text-white/80 mb-2">{todayString}</p>
            <p className="text-white/60">
              Узнайте, что готовят для вас звезды в этот день
            </p>
          </div>

          {/* Auto-detect section */}
          {!selectedSign && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-8 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">
                🎯 Быстрый старт
              </h2>
              <p className="text-white/70 mb-6">
                Хотите автоматически определить ваш знак зодиака по сегодняшней
                дате?
              </p>
              <Button
                onClick={autoDetectSign}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-lg px-8 py-3"
              >
                🔮 Определить мой знак автоматически
              </Button>
              <p className="text-white/50 text-sm mt-4">
                Или выберите знак вручную ниже
              </p>
            </div>
          )}

          {/* Sign Selection */}
          {!selectedSign && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white text-center mb-6">
                Выберите ваш знак зодиака
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {zodiacSigns.map((sign) => (
                  <button
                    key={sign.id}
                    onClick={() => setSelectedSign(sign.id)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:border-purple-400/50"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{sign.emoji}</div>
                      <div className="text-white font-medium text-sm">
                        {sign.name}
                      </div>
                      <div className="text-white/60 text-xs">
                        {sign.dateRange}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Sign & Category */}
          {selectedSign && selectedSignData && (
            <div className="space-y-8">
              {/* Sign Info */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{selectedSignData.emoji}</div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {selectedSignData.name} {selectedSignData.symbol}
                      </h2>
                      <p className="text-white/70">
                        {selectedSignData.dateRange}
                      </p>
                      {autoDetected && (
                        <p className="text-green-400 text-sm">
                          ✨ Автоматически определен
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedSign(null);
                      setAutoDetected(false);
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white"
                  >
                    Изменить знак
                  </Button>
                </div>

                {/* Category Selection */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Выберите категорию прогноза
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id as any)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          selectedCategory === category.id
                            ? "border-purple-400 bg-purple-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-2xl mb-1">{category.emoji}</div>
                        <div className="text-white font-medium text-sm">
                          {category.name}
                        </div>
                        <div className="text-white/60 text-xs">
                          {category.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horoscope */}
                {horoscope && (
                  <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">
                        {
                          categories.find((c) => c.id === selectedCategory)
                            ?.emoji
                        }
                      </span>
                      <h3 className="text-xl font-semibold text-white">
                        {
                          categories.find((c) => c.id === selectedCategory)
                            ?.name
                        }{" "}
                        - {todayString}
                      </h3>
                    </div>
                    <p className="text-lg text-white/90 leading-relaxed mb-6">
                      {horoscope}
                    </p>

                    {/* Lucky Elements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">
                          🍀 Счастливые числа
                        </h4>
                        <div className="flex gap-2">
                          {selectedSignData.luckyNumbers.map((num) => (
                            <span
                              key={num}
                              className="bg-purple-600/50 text-white px-2 py-1 rounded text-sm"
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">
                          🎨 Счастливые цвета
                        </h4>
                        <div className="flex gap-2">
                          {selectedSignData.colors
                            .slice(0, 3)
                            .map((color, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full border-2 border-white/30"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sign Traits */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-green-400 font-medium mb-2">
                      ✨ Сильные стороны
                    </h4>
                    <div className="space-y-1">
                      {selectedSignData.traits.positive.map((trait, index) => (
                        <span
                          key={index}
                          className="text-white/80 text-sm block"
                        >
                          • {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-orange-400 font-medium mb-2">
                      ⚠️ Что стоит учесть
                    </h4>
                    <div className="space-y-1">
                      {selectedSignData.traits.negative.map((trait, index) => (
                        <span
                          key={index}
                          className="text-white/80 text-sm block"
                        >
                          • {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/horoscope/weekly">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-lg py-3">
                    📊 Недельный прогноз
                  </Button>
                </Link>
                <Link href="/horoscope/compatibility">
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-lg py-3">
                    💕 Проверить совместимость
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
