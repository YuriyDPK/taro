"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { zodiacSigns, getElementColor } from "@/shared/data/zodiac-signs";
import { generateHoroscope } from "@/shared/data/horoscope-templates";
import { Button } from "@/shared/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";

export default function ZodiacSignPage() {
  const params = useParams();
  const signId = params.sign as string;

  const [selectedCategory, setSelectedCategory] = useState<
    "general" | "love" | "career" | "health" | "money"
  >("general");

  const signData = zodiacSigns.find((s) => s.id === signId);

  if (!signData) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-white mb-4">Знак не найден</h1>
          <Link href="/horoscope">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
              ← Вернуться к гороскопам
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const horoscope = generateHoroscope(signId, selectedCategory);

  const categories = [
    {
      id: "general",
      name: "Общий",
      emoji: "🌟",
      description: "Общие характеристики",
    },
    { id: "love", name: "Любовь", emoji: "💕", description: "В отношениях" },
    { id: "career", name: "Карьера", emoji: "💼", description: "В работе" },
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
      description: "Материальная сфера",
    },
  ];

  const compatibleSigns = zodiacSigns.filter(
    (sign) =>
      signData.compatibility.best.includes(sign.id) ||
      signData.compatibility.good.includes(sign.id)
  );

  const challengingSigns = zodiacSigns.filter((sign) =>
    signData.compatibility.challenging.includes(sign.id)
  );

  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/horoscope"
              className="text-purple-300 hover:text-purple-200 mb-4 inline-block"
            >
              ← Назад к гороскопам
            </Link>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-8xl">{signData.emoji}</div>
              <div>
                <h1 className="text-4xl lg:text-6xl font-light text-white mb-2">
                  {signData.name}
                </h1>
                <div className="text-3xl text-white/80 mb-2">
                  {signData.symbol}
                </div>
                <p className="text-xl text-white/70">{signData.dateRange}</p>
              </div>
            </div>
          </div>

          {/* Main Info Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Element & Planet */}
                <div className="space-y-4">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getElementColor(
                      signData.element
                    )}`}
                  >
                    {signData.element === "fire" && "🔥 Огненный знак"}
                    {signData.element === "earth" && "🌍 Земной знак"}
                    {signData.element === "air" && "💨 Воздушный знак"}
                    {signData.element === "water" && "🌊 Водный знак"}
                  </div>

                  <div className="space-y-2">
                    <div className="text-white/70">
                      <span className="font-medium text-white">
                        Планета-управитель:
                      </span>{" "}
                      {signData.rulingPlanet}
                    </div>
                    <div className="text-white/70">
                      <span className="font-medium text-white">Качество:</span>{" "}
                      {signData.quality === "cardinal"
                        ? "Кардинальный"
                        : signData.quality === "fixed"
                        ? "Фиксированный"
                        : "Мутабельный"}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Описание
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {signData.description}
                  </p>
                </div>

                {/* Lucky Elements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">
                      🍀 Счастливые числа
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {signData.luckyNumbers.map((num) => (
                        <span
                          key={num}
                          className="bg-purple-600/50 text-white px-3 py-1 rounded-full text-sm"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">
                      🎨 Счастливые цвета
                    </h4>
                    <div className="flex gap-2">
                      {signData.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-white/30"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Traits */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-green-400 font-medium mb-3">
                      ✨ Сильные стороны
                    </h4>
                    <div className="space-y-1">
                      {signData.traits.positive.map((trait, index) => (
                        <div
                          key={index}
                          className="text-white/80 text-sm flex items-center gap-2"
                        >
                          <span className="text-green-400">•</span>
                          {trait}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-orange-400 font-medium mb-3">
                      ⚠️ Слабые стороны
                    </h4>
                    <div className="space-y-1">
                      {signData.traits.negative.map((trait, index) => (
                        <div
                          key={index}
                          className="text-white/80 text-sm flex items-center gap-2"
                        >
                          <span className="text-orange-400">•</span>
                          {trait}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Horoscope */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              🔮 Гороскоп на сегодня - {today}
            </h2>

            {/* Category Selection */}
            <div className="mb-6">
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

            {/* Horoscope Text */}
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">
                  {categories.find((c) => c.id === selectedCategory)?.emoji}
                </span>
                <h3 className="text-xl font-semibold text-white">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </h3>
              </div>
              <p className="text-lg text-white/90 leading-relaxed">
                {horoscope}
              </p>
            </div>
          </div>

          {/* Compatibility Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Best Compatibility */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                💕 Лучшая совместимость
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {compatibleSigns.slice(0, 6).map((sign) => (
                  <Link
                    key={sign.id}
                    href={`/horoscope/${sign.id}`}
                    className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{sign.emoji}</div>
                      <div className="text-white text-xs font-medium">
                        {sign.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/horoscope/compatibility">
                <Button className="w-full mt-4 bg-gradient-to-r from-pink-600 to-rose-600">
                  🔮 Детальная совместимость
                </Button>
              </Link>
            </div>

            {/* Challenging Compatibility */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                ⚡ Сложные отношения
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {challengingSigns.slice(0, 3).map((sign) => (
                  <Link
                    key={sign.id}
                    href={`/horoscope/${sign.id}`}
                    className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{sign.emoji}</div>
                      <div className="text-white text-xs font-medium">
                        {sign.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="text-white/70 text-sm mt-4">
                Эти отношения требуют больше усилий, но могут принести ценный
                опыт роста.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/horoscope/daily">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-lg py-3">
                📅 Ежедневный гороскоп
              </Button>
            </Link>
            <Link href="/horoscope/weekly">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-lg py-3">
                📊 Недельный прогноз
              </Button>
            </Link>
            <Link href="/horoscope/compatibility">
              <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-lg py-3">
                💕 Совместимость
              </Button>
            </Link>
          </div>

          {/* Other Signs */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              🌟 Другие знаки зодиака
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {zodiacSigns
                .filter((sign) => sign.id !== signId)
                .map((sign) => (
                  <Link
                    key={sign.id}
                    href={`/horoscope/${sign.id}`}
                    className="bg-white/5 border border-white/20 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 hover:scale-105"
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
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
