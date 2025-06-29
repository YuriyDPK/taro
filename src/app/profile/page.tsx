"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import { Crown, User, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { PremiumStatusCard } from "@/components/PremiumStatusCard";
import Link from "next/link";

interface UserStats {
  totalReadings: number;
  readingsByCategory: {
    love: number;
    career: number;
    spiritual: number;
    general: number;
  };
  lastReadingDate?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      loadUserStats();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const loadUserStats = async () => {
    try {
      const response = await fetch("/api/user/stats");
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPremiumExpiry = (expiry: string | Date | null) => {
    if (!expiry) return null;
    const date = new Date(expiry);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "love":
        return "❤️";
      case "career":
        return "💼";
      case "spiritual":
        return "🙏";
      case "general":
        return "🔮";
      default:
        return "✨";
    }
  };

  const getMostPopularCategory = () => {
    if (!userStats) return null;
    const categories = userStats.readingsByCategory;
    const max = Math.max(...Object.values(categories));
    const category = Object.entries(categories).find(
      ([_, count]) => count === max
    );
    return category ? category[0] : null;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen p-0 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔮</div>
            <div className="text-2xl text-white/70 mb-4">
              Загружаем профиль...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔒</div>
            <div className="text-2xl text-white/70 mb-4">
              Войдите в аккаунт, чтобы просмотреть профиль
            </div>
            <Link href="/spreads">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                Перейти к раскладам
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mostPopularCategory = getMostPopularCategory();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-5xl font-light text-white mb-4">
            Профиль пользователя
          </h1>
          <p className="text-xl text-white/80">
            Ваша личная информация и статистика раскладов
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || ""}
                className="w-24 h-24 rounded-full border-2 border-purple-400/30"
              />
            )}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-light text-white mb-2">
                {session?.user?.name}
              </h2>
              <p className="text-white/70 mb-4">{session?.user?.email}</p>

              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                {session?.user?.isPremium ? (
                  <>
                    <Crown size={20} className="text-yellow-400" />
                    <span className="text-yellow-400 font-medium">
                      Premium аккаунт
                    </span>
                  </>
                ) : (
                  <>
                    <User size={20} className="text-gray-400" />
                    <span className="text-gray-400">Бесплатный аккаунт</span>
                  </>
                )}
              </div>

              {session?.user?.isPremium && session?.user?.premiumExpiry && (
                <div className="text-sm text-white/70 mb-4">
                  <Calendar size={16} className="inline mr-2" />
                  Premium действителен до:{" "}
                  {formatPremiumExpiry(session.user.premiumExpiry)}
                </div>
              )}

              {!session?.user?.isPremium && (
                <div className="text-sm text-purple-300">
                  💎 Обновите до Premium для безлимитного доступа ко всем
                  функциям
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Premium Status */}
        <PremiumStatusCard />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Readings */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 size={24} className="text-purple-400" />
              <h3 className="text-xl font-medium text-white">
                Всего раскладов
              </h3>
            </div>
            <div className="text-3xl font-light text-purple-300 mb-2">
              {userStats?.totalReadings || 0}
            </div>
            <div className="text-sm text-white/60">
              Ваша активность в гаданиях
            </div>
          </div>

          {/* Most Popular Category */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp size={24} className="text-green-400" />
              <h3 className="text-xl font-medium text-white">Любимая тема</h3>
            </div>
            <div className="text-2xl font-light text-green-300 mb-2">
              {mostPopularCategory ? (
                <>
                  {getCategoryIcon(mostPopularCategory)}{" "}
                  {mostPopularCategory === "love" && "Любовь"}
                  {mostPopularCategory === "career" && "Карьера"}
                  {mostPopularCategory === "spiritual" && "Духовность"}
                  {mostPopularCategory === "general" && "Общие"}
                </>
              ) : (
                "Пока нет данных"
              )}
            </div>
            <div className="text-sm text-white/60">
              {mostPopularCategory && userStats
                ? `${
                    userStats.readingsByCategory[
                      mostPopularCategory as keyof typeof userStats.readingsByCategory
                    ]
                  } раскладов`
                : "Создайте первый расклад"}
            </div>
          </div>

          {/* Last Activity */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={24} className="text-blue-400" />
              <h3 className="text-xl font-medium text-white">
                Последняя активность
              </h3>
            </div>
            <div className="text-lg font-light text-blue-300 mb-2">
              {userStats?.lastReadingDate
                ? new Date(userStats.lastReadingDate).toLocaleDateString(
                    "ru-RU"
                  )
                : "Нет раскладов"}
            </div>
            <div className="text-sm text-white/60">
              Дата последнего расклада
            </div>
          </div>
        </div>

        {/* Detailed Category Stats */}
        {userStats && userStats.totalReadings > 0 && (
          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-8">
            <h3 className="text-2xl font-light text-white mb-6 text-center">
              📊 Детальная статистика по категориям
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(userStats.readingsByCategory).map(
                ([category, count]) => (
                  <div key={category} className="text-center">
                    <div className="text-4xl mb-2">
                      {getCategoryIcon(category)}
                    </div>
                    <div className="text-2xl font-light text-purple-300 mb-1">
                      {count}
                    </div>
                    <div className="text-sm text-white/70">
                      {category === "love" && "Любовь"}
                      {category === "career" && "Карьера"}
                      {category === "spiritual" && "Духовность"}
                      {category === "general" && "Общие"}
                    </div>
                    <div className="w-full bg-gray-600/30 rounded-full h-2 mt-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            userStats.totalReadings > 0
                              ? (count / userStats.totalReadings) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/spreads">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-[16px] lg:text-lg">
              🔮 Создать новый расклад
            </Button>
          </Link>
          <Link href="/history">
            <Button className="bg-black/40 border border-purple-400/30 text-purple-300 hover:text-white text-[16px] lg:text-lg">
              📜 Посмотреть историю
            </Button>
          </Link>
          <Link href="/profile/support">
            <Button className="bg-black/40 border border-blue-400/30 text-blue-300 hover:text-white text-[16px] lg:text-lg">
              🎫 Мои обращения в поддержку
            </Button>
          </Link>
          {session?.user?.role === "admin" && (
            <Link href="/admin">
              <Button className="bg-gradient-to-r from-red-600 to-pink-600 text-[16px] lg:text-lg">
                ⚙️ Админка
              </Button>
            </Link>
          )}
          {!session?.user?.isPremium && (
            <Link href="/donations">
              <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 text-[16px] lg:text-lg">
                👑 Получить Premium
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
