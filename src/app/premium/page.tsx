"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function PremiumPage() {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<"month" | "year">("month");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const plans = {
    month: {
      price: 299,
      period: "месяц",
      savings: null,
    },
    year: {
      price: 2390,
      period: "год",
      savings: "Экономия 1200₽",
    },
  };

  const features = [
    {
      icon: "🔮",
      title: "Неограниченные расклады",
      description:
        "Создавайте столько раскладов, сколько хотите, без временных ограничений",
    },
    {
      icon: "💬",
      title: "Безлимитное общение с гадалкой",
      description:
        "Задавайте вопросы и получайте детальные толкования без ограничений",
    },
    {
      icon: "📈",
      title: "Продвинутые расклады",
      description:
        "Доступ к сложным раскладам: Кельтский крест, Звезда судьбы и другие",
    },
    {
      icon: "💾",
      title: "Расширенная история",
      description: "Сохранение всех ваших раскладов с возможностью экспорта",
    },
    {
      icon: "🎯",
      title: "Персональные рекомендации",
      description: "ИИ изучает ваши вопросы и дает более точные толкования",
    },
    {
      icon: "⚡",
      title: "Приоритетная поддержка",
      description: "Быстрые ответы на ваши вопросы и техническая поддержка",
    },
  ];

  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const handlePurchase = async () => {
    if (!agreedToTerms || !agreedToPrivacy) {
      alert(
        "Необходимо согласиться с условиями использования и политикой конфиденциальности"
      );
      return;
    }
    if (session?.user?.isPremium) {
      alert("У вас уже активен Премиум доступ!");
      return;
    }
    if (!session?.user) {
      alert("Необходимо авторизоваться для покупки Премиум доступа");
      return;
    }

    setIsCreatingPayment(true);

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionType: selectedPlan === "month" ? "monthly" : "yearly",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Сохраняем ID платежа для проверки статуса
        localStorage.setItem("lastPaymentId", data.paymentId);

        // Перенаправляем на страницу оплаты ЮKassa
        window.location.href = data.confirmationUrl;
      } else {
        alert(data.error || "Ошибка создания платежа");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка соединения с сервером");
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const canPurchase =
    agreedToTerms && agreedToPrivacy && !session?.user?.isPremium;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
              ✨ Премиум доступ
            </h1>
            <p className="text-xl text-white/70 mb-6">
              Откройте полный потенциал Таро с безлимитным доступом
            </p>
            {session?.user?.isPremium && (
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-lg p-4 inline-block">
                <p className="text-yellow-300">
                  🎉 У вас уже активен Премиум доступ!
                </p>
              </div>
            )}
          </div>

          {/* Описание услуги */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-medium text-white mb-4">
              🔮 О нашей услуге
            </h2>
            <div className="space-y-4 text-white/70">
              <p>
                <strong className="text-white">
                  Наш ИИ-ассистент обучен на традиционных значениях карт Таро
                </strong>{" "}
                и мнениях опытных практиков. Это современный инструмент для
                размышлений и самопознания.
              </p>
              <p>
                Премиум доступ предоставляет вам полную свободу в изучении Таро:
                неограниченные расклады, безлимитное общение с ИИ-гадалкой и
                доступ ко всем функциям платформы.
              </p>
              <div className="bg-purple-900/20 border border-purple-400/20 rounded-lg p-4 mt-4">
                <p className="text-purple-300 text-sm">
                  <strong>Важно:</strong> Наши услуги носят информационный,
                  развлекательный и познавательный характер. Результаты
                  раскладов не являются медицинской, юридической, финансовой или
                  иной профессиональной консультацией.
                </p>
              </div>
            </div>
          </div>

          {/* Функции */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-medium text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Тарифы */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-medium text-white mb-6 text-center">
              Выберите тариф
            </h2>

            <div className="flex justify-center gap-4 mb-8">
              {Object.entries(plans).map(([key, plan]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlan(key as "month" | "year")}
                  className={`relative p-6 rounded-lg border-2 transition-all ${
                    selectedPlan === key
                      ? "border-purple-400 bg-purple-600/20"
                      : "border-purple-400/30 bg-black/20 hover:border-purple-400/50"
                  }`}
                >
                  {plan.savings && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-3 py-1 rounded-full">
                      {plan.savings}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-white mb-2">
                    {plan.price}₽
                  </div>
                  <div className="text-purple-300">за {plan.period}</div>
                  {key === "year" && (
                    <div className="text-green-400 text-sm mt-1">
                      199₽ в месяц
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Согласие с документами */}
            <div className="space-y-4 mb-6">
              <div
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  !agreedToTerms
                    ? "bg-red-500/10 border border-red-400/30"
                    : "bg-transparent"
                }`}
              >
                <input
                  type="checkbox"
                  id="terms-agreement"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 bg-black/60 border border-purple-400/30 rounded focus:ring-purple-500 focus:ring-2 text-purple-600"
                />
                <label
                  htmlFor="terms-agreement"
                  className="text-sm text-white/70 leading-relaxed cursor-pointer"
                >
                  Я прочитал(а) и согласен(на) с{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-purple-300 hover:text-white transition-colors underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Пользовательским соглашением (офертой)
                  </Link>
                  <span className="text-red-400 ml-1">*</span>
                </label>
              </div>

              <div
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  !agreedToPrivacy
                    ? "bg-red-500/10 border border-red-400/30"
                    : "bg-transparent"
                }`}
              >
                <input
                  type="checkbox"
                  id="privacy-agreement"
                  checked={agreedToPrivacy}
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                  className="mt-1 w-4 h-4 bg-black/60 border border-purple-400/30 rounded focus:ring-purple-500 focus:ring-2 text-purple-600"
                />
                <label
                  htmlFor="privacy-agreement"
                  className="text-sm text-white/70 leading-relaxed cursor-pointer"
                >
                  Я прочитал(а) и согласен(на) с{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-purple-300 hover:text-white transition-colors underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Политикой конфиденциальности
                  </Link>
                  <span className="text-red-400 ml-1">*</span>
                </label>
              </div>

              <div className="text-xs text-white/50">
                <span className="text-red-400">*</span> Обязательные поля для
                оформления покупки
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handlePurchase}
                disabled={!canPurchase || isCreatingPayment}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-8 py-3 text-lg hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Создание платежа...
                  </div>
                ) : session?.user?.isPremium ? (
                  "Премиум уже активен"
                ) : !agreedToTerms || !agreedToPrivacy ? (
                  "Примите условия для продолжения"
                ) : (
                  `Купить за ${plans[selectedPlan].price}₽`
                )}
              </Button>
            </div>
          </div>

          {/* Условия и гарантии */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-white mb-4">
              💳 Условия оплаты
            </h3>
            <div className="space-y-3 text-sm text-white/70">
              <p>• Оплата производится через безопасные платежные системы</p>
              <p>• Доступ активируется мгновенно после успешной оплаты</p>
              <p>
                • Возврат денежных средств не производится после предоставления
                доступа
              </p>
              <p>
                • Подписка продлевается автоматически (можно отключить в
                настройках)
              </p>
              <p>
                • При возникновении технических проблем - обращайтесь в
                поддержку
              </p>
            </div>
          </div>

          {/* Юридическая информация */}
          <div className="text-center space-y-2">
            <p className="text-white/60 text-sm">
              Услуги предоставляет: ИП Пронягин Юрий Максимович (ИНН:
              524926143433)
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Link
                href="/terms"
                className="text-purple-300 hover:text-white transition-colors"
              >
                Пользовательское соглашение
              </Link>
              <Link
                href="/privacy"
                className="text-purple-300 hover:text-white transition-colors"
              >
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
