"use client";

import { Button } from "@/shared/ui/button";
import { AuthProviderSelector } from "./AuthProviderSelector";

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
            <div className="flex justify-center">
              <AuthProviderSelector className="w-full" />
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-black/40 text-[14px] border border-purple-400/30 text-purple-300 hover:text-white"
            >
              Отмена
            </Button>
          </div>

          <div className="mt-6 text-sm text-white/50">
            <p>🔒 Безопасная авторизация через Google или логин/пароль</p>
            <p>✨ Сохранение истории раскладов</p>
            <p>💬 Возможность общения с гадалкой</p>
            <p>📱 Регистрация и вход одним кликом</p>
          </div>
        </div>
      </div>
    </div>
  );
}
