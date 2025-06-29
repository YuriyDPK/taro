"use client";

import { useState } from "react";
import { zodiacSigns, getElementColor } from "@/shared/data/zodiac-signs";
import { getCompatibilityDescription } from "@/shared/data/horoscope-templates";
import { Button } from "@/shared/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";

export default function CompatibilityPage() {
  const [sign1, setSign1] = useState<string | null>(null);
  const [sign2, setSign2] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const sign1Data = sign1 ? zodiacSigns.find((s) => s.id === sign1) : null;
  const sign2Data = sign2 ? zodiacSigns.find((s) => s.id === sign2) : null;

  const compatibility =
    sign1 && sign2 ? getCompatibilityDescription(sign1, sign2) : null;

  const handleCalculate = () => {
    if (sign1 && sign2) {
      setShowResult(true);
    }
  };

  const reset = () => {
    setSign1(null);
    setSign2(null);
    setShowResult(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-emerald-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "💖";
    if (score >= 80) return "💕";
    if (score >= 70) return "💛";
    if (score >= 60) return "🧡";
    return "💔";
  };

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
              💕 Совместимость знаков
            </h1>
            <p className="text-xl text-white/80 mb-2">
              Узнайте совместимость двух знаков зодиака
            </p>
            <p className="text-white/60">
              Выберите два знака и получите детальный анализ отношений
            </p>
          </div>

          {!showResult ? (
            <div className="space-y-8">
              {/* Sign Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* First Sign */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                    {sign1Data ? (
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">{sign1Data.emoji}</span>
                        <span>{sign1Data.name}</span>
                        <Button
                          onClick={() => setSign1(null)}
                          className="ml-2 bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1"
                        >
                          Изменить
                        </Button>
                      </div>
                    ) : (
                      "Выберите первый знак"
                    )}
                  </h2>

                  {!sign1 && (
                    <div className="grid grid-cols-3 gap-3">
                      {zodiacSigns.map((sign) => (
                        <button
                          key={sign.id}
                          onClick={() => setSign1(sign.id)}
                          className="bg-white/5 border border-white/20 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">{sign.emoji}</div>
                            <div className="text-white text-xs font-medium">
                              {sign.name}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {sign1Data && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-6xl mb-3">{sign1Data.emoji}</div>
                        <div className="text-2xl text-white/80 mb-2">
                          {sign1Data.symbol}
                        </div>
                        <div className="text-white/60">
                          {sign1Data.dateRange}
                        </div>
                      </div>

                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getElementColor(
                          sign1Data.element
                        )} w-full justify-center`}
                      >
                        {sign1Data.element === "fire" && "🔥 Огонь"}
                        {sign1Data.element === "earth" && "🌍 Земля"}
                        {sign1Data.element === "air" && "💨 Воздух"}
                        {sign1Data.element === "water" && "🌊 Вода"}
                      </div>

                      <div className="text-sm text-white/70 text-center">
                        <div className="mb-2">
                          <span className="font-medium">Планета:</span>{" "}
                          {sign1Data.rulingPlanet}
                        </div>
                        <div className="text-xs text-white/60">
                          {sign1Data.description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Second Sign */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                    {sign2Data ? (
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">{sign2Data.emoji}</span>
                        <span>{sign2Data.name}</span>
                        <Button
                          onClick={() => setSign2(null)}
                          className="ml-2 bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1"
                        >
                          Изменить
                        </Button>
                      </div>
                    ) : (
                      "Выберите второй знак"
                    )}
                  </h2>

                  {!sign2 && (
                    <div className="grid grid-cols-3 gap-3">
                      {zodiacSigns.map((sign) => (
                        <button
                          key={sign.id}
                          onClick={() => setSign2(sign.id)}
                          disabled={sign.id === sign1}
                          className={`bg-white/5 border border-white/20 rounded-lg p-3 transition-all duration-300 ${
                            sign.id === sign1
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-white/10 hover:scale-105"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">{sign.emoji}</div>
                            <div className="text-white text-xs font-medium">
                              {sign.name}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {sign2Data && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-6xl mb-3">{sign2Data.emoji}</div>
                        <div className="text-2xl text-white/80 mb-2">
                          {sign2Data.symbol}
                        </div>
                        <div className="text-white/60">
                          {sign2Data.dateRange}
                        </div>
                      </div>

                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getElementColor(
                          sign2Data.element
                        )} w-full justify-center`}
                      >
                        {sign2Data.element === "fire" && "🔥 Огонь"}
                        {sign2Data.element === "earth" && "🌍 Земля"}
                        {sign2Data.element === "air" && "💨 Воздух"}
                        {sign2Data.element === "water" && "🌊 Вода"}
                      </div>

                      <div className="text-sm text-white/70 text-center">
                        <div className="mb-2">
                          <span className="font-medium">Планета:</span>{" "}
                          {sign2Data.rulingPlanet}
                        </div>
                        <div className="text-xs text-white/60">
                          {sign2Data.description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Calculate Button */}
              {sign1 && sign2 && (
                <div className="text-center">
                  <Button
                    onClick={handleCalculate}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 lg:text-xl text-[14px] lg:px-12 py-4"
                  >
                    💖 Рассчитать совместимость
                  </Button>
                </div>
              )}

              {/* Info Section */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  🔮 Как работает расчет совместимости?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/70">
                  <div>
                    <h4 className="font-medium text-white mb-2">🌟 Стихии</h4>
                    <p className="text-sm">
                      Огонь и Воздух усиливают друг друга, Земля и Вода создают
                      стабильность. Одинаковые стихии понимают друг друга.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">🪐 Планеты</h4>
                    <p className="text-sm">
                      Планеты-управители влияют на характер и энергетику знаков,
                      создавая гармонию или напряжение.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">⚖️ Качества</h4>
                    <p className="text-sm">
                      Кардинальные знаки инициативны, фиксированные стабильны,
                      мутабельные адаптивны.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">
                      💝 Характеры
                    </h4>
                    <p className="text-sm">
                      Анализируем совместимость темпераментов, жизненных
                      ценностей и способов выражения эмоций.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Results */
            <div className="space-y-8">
              {/* Result Header */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-6xl">{sign1Data?.emoji}</div>
                    <div className="text-4xl">💕</div>
                    <div className="text-6xl">{sign2Data?.emoji}</div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {sign1Data?.name} & {sign2Data?.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">{sign1Data?.symbol}</span>
                    <span className="text-white/60">+</span>
                    <span className="text-2xl">{sign2Data?.symbol}</span>
                  </div>
                </div>

                {compatibility && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {getScoreEmoji(compatibility.score)}
                    </div>
                    <div
                      className={`text-4xl font-bold mb-4 ${getScoreColor(
                        compatibility.score
                      )}`}
                    >
                      {compatibility.score}%
                    </div>
                    <div className="text-xl text-white/90 mb-6">
                      {compatibility.description}
                    </div>

                    {/* Score Bar */}
                    <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          compatibility.score >= 90
                            ? "bg-green-500"
                            : compatibility.score >= 80
                            ? "bg-emerald-500"
                            : compatibility.score >= 70
                            ? "bg-yellow-500"
                            : compatibility.score >= 60
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${compatibility.score}%` }}
                      />
                    </div>

                    <p className="text-white/70">{compatibility.advice}</p>
                  </div>
                )}
              </div>

              {/* Detailed Analysis */}
              {sign1Data && sign2Data && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Element Compatibility */}
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      🌟 Совместимость стихий
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full bg-gradient-to-r ${getElementColor(
                              sign1Data.element
                            )}`}
                          />
                          <span className="text-white">{sign1Data.name}</span>
                        </div>
                        <span className="text-white/60 capitalize">
                          {sign1Data.element}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full bg-gradient-to-r ${getElementColor(
                              sign2Data.element
                            )}`}
                          />
                          <span className="text-white">{sign2Data.name}</span>
                        </div>
                        <span className="text-white/60 capitalize">
                          {sign2Data.element}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Traits Comparison */}
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      ⚖️ Сравнение качеств
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-green-400 font-medium mb-2">
                          Общие сильные стороны
                        </h4>
                        <div className="text-white/70 text-sm">
                          {sign1Data.traits.positive
                            .filter((trait) =>
                              sign2Data.traits.positive.includes(trait)
                            )
                            .map((trait) => `• ${trait}`)
                            .join("\n") || "Разные подходы к жизни"}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-orange-400 font-medium mb-2">
                          Возможные конфликты
                        </h4>
                        <div className="text-white/70 text-sm">
                          {sign1Data.traits.negative
                            .filter((trait) =>
                              sign2Data.traits.negative.includes(trait)
                            )
                            .map((trait) => `• ${trait}`)
                            .join("\n") || "Взаимодополняющие характеры"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={reset}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-lg px-8 py-3"
                >
                  🔄 Проверить другую пару
                </Button>
                <Link href="/horoscope/daily">
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-lg px-8 py-3">
                    📅 Гороскоп на сегодня
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
