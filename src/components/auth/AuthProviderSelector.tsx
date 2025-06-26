"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/shared/ui/button";

interface AuthProviderSelectorProps {
  className?: string;
}

export function AuthProviderSelector({
  className = "",
}: AuthProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие дропдауна при клике вне его
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTelegramAuth = () => {
    // Показываем Telegram Login Widget
    setIsOpen(false);
    showTelegramLoginWidget();
  };

  const handleGoogleAuth = () => {
    setIsOpen(false);
    signIn("google");
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        className="bg-black/40 border border-purple-400/30 text-purple-300 hover:text-white flex items-center gap-2"
      >
        Войти
        <svg
          className={`w-4 h-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-black/90 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-2">
            <button
              onClick={handleGoogleAuth}
              className="w-full text-left px-4 py-3 text-white hover:bg-purple-600/20 rounded-lg transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <div>
                <div className="font-medium">Google</div>
                <div className="text-sm text-white/60">Быстрая авторизация</div>
              </div>
            </button>

            <button
              onClick={handleTelegramAuth}
              className="w-full text-left px-4 py-3 text-white hover:bg-purple-600/20 rounded-lg transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.58 7.44c-.12.539-.432.672-.864.42l-2.388-1.764-1.152 1.108c-.128.128-.236.236-.484.236l.172-2.436 4.452-4.02c.192-.168-.04-.264-.3-.096L9.72 12.684l-2.4-.756c-.524-.168-.532-.524.108-.776l9.38-3.616c.428-.168.804.096.66.624z" />
              </svg>
              <div>
                <div className="font-medium">Telegram</div>
                <div className="text-sm text-white/60">
                  Через @TaroAshatEmpressBot
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Функция для показа Telegram Login Widget
function showTelegramLoginWidget() {
  const botUsername = "TaroAshatEmpressBot";

  // Создаем модальное окно с Telegram Login Widget
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm";

  modal.innerHTML = `
    <div class="relative bg-black/90 border border-purple-400/30 rounded-lg p-8 max-w-md w-full mx-4">
      <button class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors close-modal">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <div class="text-center flex flex-col">
        <div class="text-6xl mb-4">📱</div>
        <h2 class="text-2xl font-light text-white mb-4">Авторизация через Telegram</h2>
        <p class="text-white/70 mb-6">Нажмите кнопку ниже для авторизации через Telegram</p>
        
        <div id="telegram-login-widget" class="mb-4"></div>
        
        <div class="text-sm text-white/50">
          <p>🔒 Безопасная авторизация через Telegram</p>
          <p>✨ Быстрый вход без пароля</p>
          <p>💬 Прямая связь с @${botUsername}</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Закрытие модального окна
  const closeModal = () => {
    document.body.removeChild(modal);
  };

  modal.addEventListener("click", (e) => {
    if (
      e.target === modal ||
      (e.target as HTMLElement).classList.contains("close-modal")
    ) {
      closeModal();
    }
  });

  // Создаем Telegram Login Widget
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute("data-telegram-login", botUsername);
  script.setAttribute("data-size", "large");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");

  // Важно: добавляем текущий домен для Telegram
  const currentDomain = window.location.hostname;
  if (currentDomain !== "localhost") {
    script.setAttribute(
      "data-auth-url",
      `https://${currentDomain}/api/auth/callback/telegram`
    );
  }

  const widgetContainer = modal.querySelector("#telegram-login-widget");
  if (widgetContainer) {
    widgetContainer.appendChild(script);
  }

  // Callback функция для Telegram авторизации
  (window as any).onTelegramAuth = async function (user: any) {
    console.log("Telegram auth data:", user);

    try {
      // Сначала проверяем данные через наш API
      const response = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        // Если проверка прошла успешно, вызываем signIn напрямую
        console.log("Verification passed, calling signIn with:", user);

        const result = await signIn("telegram", {
          ...user,
          redirect: false,
        });

        console.log("SignIn result:", result);

        if (result?.ok) {
          // Успешная авторизация
          console.log("Auth successful, redirecting...");
          window.location.href = "/";
        } else if (result?.error) {
          console.error("SignIn failed:", result.error);
          alert(`Ошибка входа: ${result.error}`);
        } else {
          console.error("SignIn failed with unknown error");
          alert("Ошибка входа в систему");
        }
      } else {
        const error = await response.json();
        console.error("Telegram auth failed:", error);
        alert("Ошибка авторизации через Telegram");
      }
    } catch (error) {
      console.error("Telegram auth error:", error);
      alert("Ошибка авторизации через Telegram");
    }

    closeModal();
  };
}
