"use client";

import { useState } from "react";
import { zodiacSigns, getElementColor } from "@/shared/data/zodiac-signs";
import { generateHoroscope } from "@/shared/data/horoscope-templates";
import { Button } from "@/shared/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";

export default function WeeklyHoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const selectedSignData = selectedSign
    ? zodiacSigns.find((s) => s.id === selectedSign)
    : null;

  // Генерируем прогнозы для всех категорий
  const weeklyForecasts = selectedSign
    ? {
        love: generateHoroscope(selectedSign, "love"),
        career: generateHoroscope(selectedSign, "career"),
        health: generateHoroscope(selectedSign, "health"),
        money: generateHoroscope(selectedSign, "money"),
        general: generateHoroscope(selectedSign, "general"),
      }
    : null;

  // Получаем даты недели
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Понедельник
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Воскресенье

  const weekString = `${startOfWeek.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  })} - ${endOfWeek.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;

  // Дни недели с энергетическими прогнозами
  const weekDays = [
    { name: "Понедельник", energy: "💼", description: "День новых начинаний" },
    {
      name: "Вторник",
      energy: "🔥",
      description: "Активность и решительность",
    },
    { name: "Среда", energy: "💬", description: "Общение и обмен идеями" },
    {
      name: "Четверг",
      energy: "⚡",
      description: "Пик энергии и продуктивности",
    },
    { name: "Пятница", energy: "💕", description: "Творчество и отношения" },
    { name: "Суббота", energy: "🎉", description: "Отдых и развлечения" },
    {
      name: "Воскресенье",
      energy: "🧘",
      description: "Восстановление и планирование",
    },
  ];

  const categories = [
    {
      id: "general",
      name: "Общий прогноз",
      emoji: "🌟",
      color: "from-purple-600 to-indigo-600",
    },
    {
      id: "love",
      name: "Любовь и отношения",
      emoji: "💕",
      color: "from-pink-600 to-rose-600",
    },
    {
      id: "career",
      name: "Карьера и работа",
      emoji: "💼",
      color: "from-blue-600 to-cyan-600",
    },
    {
      id: "health",
      name: "Здоровье",
      emoji: "🏥",
      color: "from-green-600 to-emerald-600",
    },
    {
      id: "money",
      name: "Финансы",
      emoji: "💰",
      color: "from-yellow-600 to-orange-600",
    },
  ];

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
            <h1 className="text-4xl lg:text-5xl font-light text-white mb-4">
              📊 Недельный прогноз
            </h1>
            <p className="text-xl text-white/80 mb-2">{weekString}</p>
            <p className="text-white/60">
              Подробный астрологический прогноз на всю неделю
            </p>
          </div>

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

          {/* Weekly Forecast */}
          {selectedSign && selectedSignData && weeklyForecasts && (
            <div className="space-y-8">
              {/* Sign Header */}
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
                      <p className="text-white/60">
                        Недельный прогноз: {weekString}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedSign(null)}
                    className="bg-white/10 hover:bg-white/20 text-white"
                  >
                    Изменить знак
                  </Button>
                </div>

                {/* Element Badge */}
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getElementColor(
                    selectedSignData.element
                  )}`}
                >
                  {selectedSignData.element === "fire" && "🔥 Огненный знак"}
                  {selectedSignData.element === "earth" && "🌍 Земной знак"}
                  {selectedSignData.element === "air" && "💨 Воздушный знак"}
                  {selectedSignData.element === "water" && "🌊 Водный знак"}
                </div>
              </div>

              {/* Category Forecasts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-r ${category.color}`}
                      >
                        <span className="text-2xl">{category.emoji}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-white/90 leading-relaxed mb-4">
                      {
                        weeklyForecasts[
                          category.id as keyof typeof weeklyForecasts
                        ]
                      }
                    </p>

                    {/* Weekly Energy */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">
                        Энергия недели
                      </h4>
                      <div className="grid grid-cols-7 gap-1">
                        {weekDays.map((day, index) => (
                          <div key={day.name} className="text-center">
                            <div className="text-lg mb-1">{day.energy}</div>
                            <div className="text-xs text-white/60">
                              {day.name.slice(0, 2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Daily Energy Flow */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                  🌟 Энергетический поток недели
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                  {weekDays.map((day, index) => (
                    <div
                      key={day.name}
                      className="bg-white/5 rounded-lg p-4 text-center"
                    >
                      <div className="text-3xl mb-2">{day.energy}</div>
                      <h4 className="text-white font-medium mb-2">
                        {day.name}
                      </h4>
                      <p className="text-white/70 text-sm">{day.description}</p>

                      {/* Energy Level */}
                      <div className="mt-3">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${
                              index === 3
                                ? "from-yellow-500 to-orange-500" // Четверг - пик
                                : index === 0 || index === 1
                                ? "from-blue-500 to-purple-500" // Пн-Вт - рабочая энергия
                                : index === 4
                                ? "from-pink-500 to-rose-500" // Пятница - творчество
                                : "from-green-500 to-emerald-500" // Выходные - восстановление
                            }`}
                            style={{
                              width: `${
                                index === 3
                                  ? 100 // Четверг
                                  : index === 0 || index === 1
                                  ? 80 // Пн-Вт
                                  : index === 4
                                  ? 75 // Пятница
                                  : 60 // Выходные
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lucky Elements for the Week */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
                  <h4 className="text-xl font-semibold text-white mb-4">
                    🍀 Счастливые дни
                  </h4>
                  <div className="space-y-2">
                    <div className="text-green-400 font-medium">
                      Вторник, Четверг
                    </div>
                    <div className="text-white/70 text-sm">
                      Лучшие дни для важных решений
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
                  <h4 className="text-xl font-semibold text-white mb-4">
                    🎨 Цвета недели
                  </h4>
                  <div className="flex justify-center gap-2 mb-2">
                    {selectedSignData.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-white/30"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="text-white/70 text-sm">
                    Используйте в одежде и аксессуарах
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
                  <h4 className="text-xl font-semibold text-white mb-4">
                    🔢 Числа силы
                  </h4>
                  <div className="flex justify-center gap-2 mb-2">
                    {selectedSignData.luckyNumbers.slice(0, 3).map((num) => (
                      <span
                        key={num}
                        className="bg-purple-600/50 text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  <div className="text-white/70 text-sm">
                    Обратите внимание на эти числа
                  </div>
                </div>
              </div>

              {/* Advice Section */}
              <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                  💫 Совет астролога на неделю
                </h3>
                <p className="text-lg text-white/90 text-center leading-relaxed mb-6">
                  {selectedSignData.name}, эта неделя принесет вам новые
                  возможности для роста и развития. Ваша стихия{" "}
                  {selectedSignData.element === "fire"
                    ? "огня"
                    : selectedSignData.element === "earth"
                    ? "земли"
                    : selectedSignData.element === "air"
                    ? "воздуха"
                    : "воды"}{" "}
                  будет особенно активна в середине недели. Используйте свои
                  сильные стороны:{" "}
                  {selectedSignData.traits.positive.slice(0, 2).join(" и ")}.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-green-400 font-medium mb-2">
                      ✨ Сосредоточьтесь на
                    </h4>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• Развитии личных отношений</li>
                      <li>• Карьерных возможностях</li>
                      <li>• Заботе о здоровье</li>
                    </ul>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-orange-400 font-medium mb-2">
                      ⚠️ Избегайте
                    </h4>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• Импульсивных решений</li>
                      <li>• Конфликтов в понедельник</li>
                      <li>• Переутомления в четверг</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Related Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/horoscope/daily">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-lg py-3">
                    📅 Гороскоп на сегодня
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
