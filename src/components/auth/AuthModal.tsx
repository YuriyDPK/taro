"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/shared/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-black/90 border border-purple-400/30 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-light text-white mb-4">
            Авторизация необходима
          </h2>
          <p className="text-white/70 mb-6">
            Для создания раскладов Таро необходимо войти в аккаунт. Ваши
            расклады будут сохранены и доступны в любое время.
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => signIn("google")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
              Войти через Google
            </Button>

            <Button
              onClick={onClose}
              className="w-full bg-black/40 border border-purple-400/30 text-purple-300 hover:text-white"
            >
              Отмена
            </Button>
          </div>

          <div className="mt-6 text-sm text-white/50">
            <p>🔒 Безопасная авторизация через Google</p>
            <p>✨ Сохранение истории раскладов</p>
            <p>💬 Возможность общения с гадалкой</p>
          </div>
        </div>
      </div>
    </div>
  );
}
