"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/shared/ui/button";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const errorCode = searchParams.get("error");
    const provider = searchParams.get("provider");

    console.log("Auth error:", errorCode, "Provider:", provider);

    switch (errorCode) {
      case "CredentialsSignin":
        setError(
          "Неверный email или пароль. Проверьте данные и попробуйте еще раз."
        );
        break;
      case "OAuthSignin":
        setError("Ошибка при входе через OAuth провайдер.");
        break;
      case "OAuthCallback":
        setError("Ошибка при обработке ответа от OAuth провайдера.");
        break;
      case "OAuthCreateAccount":
        setError("Не удалось создать аккаунт через OAuth.");
        break;
      case "EmailCreateAccount":
        setError("Не удалось создать аккаунт с этим email.");
        break;
      case "Callback":
        setError("Ошибка в процессе авторизации.");
        break;
      case "OAuthAccountNotLinked":
        setError("Аккаунт уже связан с другим способом входа.");
        break;
      case "EmailSignin":
        setError("Ошибка отправки письма для входа.");
        break;
      case "SessionRequired":
        setError("Требуется авторизация для доступа к этой странице.");
        break;
      default:
        setError("Произошла неизвестная ошибка авторизации.");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black/90 backdrop-blur-sm border border-red-400/30 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>

          <h1 className="text-2xl font-light text-white mb-4">
            Ошибка авторизации
          </h1>

          <p className="text-white/80 mb-6 leading-relaxed">{error}</p>

          <div className="space-y-4">
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              На главную
            </Button>

            <Button
              onClick={() => router.back()}
              className="w-full bg-black/40 border border-purple-400/30 text-purple-300 hover:text-white"
            >
              Назад
            </Button>
          </div>

          <div className="mt-6 text-sm text-white/50">
            <p>💡 Попробуйте:</p>
            <ul className="mt-2 space-y-1">
              <li>• Очистить cookies браузера</li>
              <li>• Использовать другой способ входа</li>
              <li>• Обновить страницу</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-black/90 backdrop-blur-sm border border-purple-400/30 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">⏳</div>
              <h1 className="text-2xl font-light text-white mb-4">
                Загрузка...
              </h1>
              <p className="text-white/80">Обработка ошибки авторизации</p>
            </div>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
