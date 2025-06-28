"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { GoogleIcon } from "@/shared/ui/icons/GoogleIcon";

function SignInForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isRegistering) {
        // Регистрация
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        // После успешной регистрации сразу авторизуем пользователя
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error("Ошибка входа после регистрации");
        }

        // Обновляем сессию и перенаправляем
        await getSession();
        router.push(callbackUrl);
      } else {
        // Вход
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error("Неверный email или пароль");
        }

        if (result?.ok) {
          router.push(callbackUrl);
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            {isRegistering ? "Регистрация" : "Вход в аккаунт"}
          </h2>
          <p className="mt-2 text-purple-300">
            {isRegistering
              ? "Создайте аккаунт для сохранения раскладов"
              : "Войдите в ваш аккаунт"}
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-purple-300 text-sm mb-2">
                  Имя*
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/60 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                  placeholder="Ваше имя"
                />
              </div>
            )}

            <div>
              <label className="block text-purple-300 text-sm mb-2">
                Email*
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/60 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-purple-300 text-sm mb-2">
                Пароль*
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-black/60 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                placeholder="Минимум 6 символов"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-[20px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2 hover:from-purple-500 hover:to-indigo-500 transition-all"
            >
              {isLoading
                ? "..."
                : isRegistering
                ? "Зарегистрироваться"
                : "Войти"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-400/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black/40 text-purple-300">или</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full text-[20px] bg-black/60 border border-purple-400/30 text-white hover:bg-purple-600/30 hover:border-purple-400 transition-all"
          >
            <GoogleIcon width={20} height={20} />
            Войти через Google
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              className="text-purple-300 hover:text-white transition-colors text-sm"
            >
              {isRegistering
                ? "Уже есть аккаунт? Войти"
                : "Нет аккаунта? Зарегистрироваться"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="text-white">Загрузка...</div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
