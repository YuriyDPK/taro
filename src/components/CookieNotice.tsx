"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, было ли уже принято уведомление о куки
    const cookieAccepted = localStorage.getItem("cookieAccepted");
    if (!cookieAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-purple-400/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🍪</div>
              <div>
                <h3 className="text-white font-medium mb-1">
                  Использование файлов cookie
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Мы используем файлы cookie для обеспечения корректной работы
                  сайта, авторизации пользователей и сохранения ваших
                  предпочтений. Продолжая использовать сайт, вы соглашаетесь с
                  использованием cookie.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 self-end md:self-center">
            <Button
              onClick={handleClose}
              className="bg-black/40 border border-purple-400/30 text-purple-300 hover:text-white hover:bg-purple-600/20 px-4 py-2 text-sm"
            >
              Закрыть
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 text-sm"
            >
              Принять
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
