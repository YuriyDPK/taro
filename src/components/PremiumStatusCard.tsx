"use client";

import { usePremium } from "@/shared/hooks/usePremium";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export const PremiumStatusCard = () => {
  const { isPremium, isExpired, expiryDate, daysLeft } = usePremium();

  if (!isPremium && !isExpired) {
    return (
      <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-400/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⭐</div>
            <h3 className="text-xl font-semibold text-white">Premium доступ</h3>
          </div>
          <div className="bg-gray-600/50 text-gray-300 px-3 py-1 rounded-full text-sm">
            Не активен
          </div>
        </div>

        <p className="text-white/70 mb-4">
          Получите безлимитный доступ ко всем функциям платформы
        </p>

        <div className="space-y-2 text-white/60 text-sm mb-4">
          <p>• Неограниченные расклады Таро</p>
          <p>• Безлимитное общение с ИИ-гадалкой</p>
          <p>• Эксклюзивные расклады</p>
          <p>• Приоритетная поддержка</p>
        </div>

        <Link href="/premium">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            ✨ Получить Premium
          </Button>
        </Link>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚠️</div>
            <h3 className="text-xl font-semibold text-white">Premium доступ</h3>
          </div>
          <div className="bg-red-600/50 text-red-200 px-3 py-1 rounded-full text-sm">
            Истек
          </div>
        </div>

        <p className="text-white/70 mb-4">
          Ваша премиум подписка истекла{" "}
          {expiryDate && expiryDate.toLocaleDateString()}
        </p>

        <Link href="/premium">
          <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
            🔄 Продлить Premium
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">👑</div>
          <h3 className="text-xl font-semibold text-white">Premium доступ</h3>
        </div>
        <div className="bg-green-600/50 text-green-200 px-3 py-1 rounded-full text-sm">
          Активен
        </div>
      </div>

      <div className="space-y-3">
        {expiryDate && (
          <div className="text-white/80">
            <p className="text-sm text-white/60">Действует до:</p>
            <p className="font-medium">{expiryDate.toLocaleDateString()}</p>
            {daysLeft > 0 && (
              <p className="text-sm text-yellow-300">
                Осталось дней: {daysLeft}
              </p>
            )}
          </div>
        )}

        <div className="text-white/70 text-sm">
          <p className="mb-2">🎉 У вас есть доступ ко всем функциям:</p>
          <div className="space-y-1">
            <p>• Безлимитные расклады</p>
            <p>• Все типы гаданий</p>
            <p>• Приоритетная поддержка</p>
            <p>• Новые функции</p>
          </div>
        </div>

        {daysLeft <= 7 && daysLeft > 0 && (
          <div className="bg-yellow-600/20 border border-yellow-400/30 rounded p-3">
            <p className="text-yellow-300 text-sm">
              ⏰ Подписка скоро истечет. Не забудьте продлить!
            </p>
            <Link href="/premium">
              <Button className="w-full mt-2 bg-gradient-to-r from-yellow-600 to-orange-600">
                Продлить сейчас
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
