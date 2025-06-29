"use client";

import { useState } from "react";
import { zodiacSigns, getElementColor } from "@/shared/data/zodiac-signs";
import { Button } from "@/shared/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";

export default function HoroscopePage() {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const elements = [
    {
      id: "fire",
      name: "Огонь",
      emoji: "🔥",
      description: "Энергия, страсть, лидерство",
    },
    {
      id: "earth",
      name: "Земля",
      emoji: "🌍",
      description: "Стабильность, практичность, надежность",
    },
    {
      id: "air",
      name: "Воздух",
      emoji: "💨",
      description: "Интеллект, общение, свобода",
    },
    {
      id: "water",
      name: "Вода",
      emoji: "🌊",
      description: "Эмоции, интуиция, глубина",
    },
  ];

  const filteredSigns = selectedElement
    ? zodiacSigns.filter((sign) => sign.element === selectedElement)
    : zodiacSigns;

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative">
              <h1 className="text-4xl lg:text-6xl font-light text-white mb-6 animate-pulse">
                ✨ Гороскопы ✨
              </h1>
              {/* Floating stars animation */}
            </div>
            <p className="text-xl text-white/80 mb-8">
              Узнайте, что готовят для вас звезды сегодня
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/horoscope/daily">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-lg px-8 py-3">
                  📅 Гороскоп на сегодня
                </Button>
              </Link>
              <Link href="/horoscope/compatibility">
                <Button className="bg-gradient-to-r from-pink-600 to-rose-600 text-lg px-8 py-3">
                  💕 Совместимость знаков
                </Button>
              </Link>
              <Link href="/horoscope/weekly">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-lg px-8 py-3">
                  📊 Недельный прогноз
                </Button>
              </Link>
            </div>
          </div>

          {/* Element Filter */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white text-center mb-6">
              Выберите стихию или знак зодиака
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => setSelectedElement(null)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedElement === null
                    ? "border-purple-400 bg-purple-500/20"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="text-3xl mb-2">🌟</div>
                <div className="text-white font-medium">Все знаки</div>
                <div className="text-white/60 text-sm">Показать всех</div>
              </button>

              {elements.map((element) => (
                <button
                  key={element.id}
                  onClick={() => setSelectedElement(element.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedElement === element.id
                      ? "border-purple-400 bg-purple-500/20"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="text-3xl mb-2">{element.emoji}</div>
                  <div className="text-white font-medium">{element.name}</div>
                  <div className="text-white/60 text-sm">
                    {element.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Zodiac Signs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSigns.map((sign) => (
              <Link
                key={sign.id}
                href={`/horoscope/${sign.id}`}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:border-purple-400/50">
                  {/* Sign Header */}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{sign.emoji}</div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {sign.name}
                    </h3>
                    <div className="text-2xl text-white/80 mb-2">
                      {sign.symbol}
                    </div>
                    <div className="text-sm text-white/60">
                      {sign.dateRange}
                    </div>
                  </div>

                  {/* Element Badge */}
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getElementColor(
                      sign.element
                    )} mb-4`}
                  >
                    {sign.element === "fire" && "🔥 Огонь"}
                    {sign.element === "earth" && "🌍 Земля"}
                    {sign.element === "air" && "💨 Воздух"}
                    {sign.element === "water" && "🌊 Вода"}
                  </div>

                  {/* Ruling Planet */}
                  <div className="text-sm text-white/70 mb-3">
                    <span className="font-medium">Планета:</span>{" "}
                    {sign.rulingPlanet}
                  </div>

                  {/* Traits Preview */}
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-green-400">+</span>
                      <span className="text-white/70 ml-1">
                        {sign.traits.positive.slice(0, 2).join(", ")}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-orange-400">-</span>
                      <span className="text-white/70 ml-1">
                        {sign.traits.negative.slice(0, 1).join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-purple-300 text-sm font-medium">
                      Узнать подробнее →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/5 rounded-lg p-6">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Персональные прогнозы
              </h3>
              <p className="text-white/70">
                Получайте точные предсказания, основанные на вашем знаке зодиака
                и текущем положении планет
              </p>
            </div>

            <div className="text-center bg-white/5 rounded-lg p-6">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Совместимость
              </h3>
              <p className="text-white/70">
                Узнайте о совместимости с партнером, друзьями и коллегами по
                знакам зодиака
              </p>
            </div>

            <div className="text-center bg-white/5 rounded-lg p-6">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Еженедельные тренды
              </h3>
              <p className="text-white/70">
                Планируйте свою неделю с помощью детальных астрологических
                прогнозов
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Готовы узнать свое будущее?
            </h2>
            <p className="text-xl text-white/80 mb-6">
              Выберите свой знак зодиака и получите персональный гороскоп
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/horoscope/daily">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-lg px-8 py-3">
                  🌟 Мой гороскоп на сегодня
                </Button>
              </Link>
              <Link href="/horoscope/compatibility">
                <Button className="bg-transparent border-2 border-purple-400 text-purple-300 hover:bg-purple-600/20 text-lg px-8 py-3">
                  💕 Проверить совместимость
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
