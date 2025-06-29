"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка отправки");
      }

      setSubmitSuccess(true);
      setFormData({
        subject: "",
        description: "",
        guestName: "",
        guestEmail: "",
        guestPhone: "",
      });
    } catch (error) {
      console.error("Ошибка:", error);
      alert(error instanceof Error ? error.message : "Ошибка отправки");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChooseLink = () => {
    if (session) {
      router.push("/profile/support");
    } else {
      router.push("/");
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Обращение отправлено!
          </h2>
          <p className="text-white/80 mb-6">
            Мы получили ваше обращение и свяжемся с вами в ближайшее время.
            Отслеживайте статус в личном кабинете в разделе тех.поддержка или
            ожидайте отклика на ваше обращение по указанному вами email или
            телефону.
          </p>
          <Button
            onClick={handleChooseLink}
            className="w-full px-4 text-[18px]"
          >
            Перейти в раздел поддержки
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            🛠️ Техническая поддержка
          </h1>
          <p className="text-white/80">
            Опишите вашу проблему, и мы поможем вам её решить
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Контактная информация для неавторизованных */}
          {!session && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-200 text-sm mb-4">
                💡 Для быстрого решения вопросов рекомендуем{" "}
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="underline hover:text-yellow-100"
                >
                  авторизоваться
                </button>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    required={!session}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="guestEmail"
                    value={formData.guestEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="md:col-span-2 text-sm text-white/60">
                  * Укажите email или телефон для связи с вами
                </div>
              </div>
            </div>
          )}

          {/* Основная форма */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Тема обращения *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Кратко опишите проблему"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Подробное описание *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Подробно опишите вашу проблему или вопрос..."
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-lg"
          >
            {isSubmitting ? "Отправляем..." : "📧 Отправить обращение"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Среднее время ответа: 2-4 часа
          </p>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
