"use client";

import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import { ChevronDown, User, LogOut, Crown, Settings } from "lucide-react";
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

export function UserDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && session?.user) {
      loadUserStats();
    }
  }, [isOpen, session]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const loadUserStats = async () => {
    try {
      const response = await fetch("/api/user/stats");
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
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

  if (!session?.user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors p-2 rounded-lg hover:bg-white/10"
      >
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || ""}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{session.user.name}</span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="fixed sm:absolute top-16 sm:top-auto left-4 right-4 sm:right-0 sm:left-auto mt-0 sm:mt-2 w-auto sm:w-80 bg-black/95 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-xl z-50">
          {/* Header */}
          <div className="p-4 border-b border-purple-400/30">
            <div className="flex items-center gap-3">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || ""}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <div className="text-white font-medium">
                  {session.user.name}
                </div>
                <div className="text-sm text-white/70">
                  {session.user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-4 border-b border-purple-400/30">
            <div className="flex items-center gap-2 mb-2">
              {session.user.isPremium ? (
                <>
                  <Crown size={16} className="text-yellow-400" />
                  <span className="text-yellow-400 font-medium">
                    Premium аккаунт
                  </span>
                </>
              ) : (
                <>
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-400">Бесплатный аккаунт</span>
                </>
              )}
            </div>

            {session.user.isPremium && session.user.premiumExpiry && (
              <div className="text-sm text-white/70">
                Действителен до:{" "}
                {formatPremiumExpiry(session.user.premiumExpiry)}
              </div>
            )}

            {!session.user.isPremium && (
              <div className="text-sm text-purple-300">
                Обновите до Premium для безлимитного доступа
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="p-4 border-b border-purple-400/30">
            <h4 className="text-white font-medium mb-3">📊 Статистика</h4>
            {userStats ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Всего раскладов:</span>
                  <span className="text-purple-300 font-medium">
                    {userStats.totalReadings}
                  </span>
                </div>

                {userStats.totalReadings > 0 && (
                  <>
                    <div className="text-xs text-white/50 mt-2 mb-1">
                      По категориям:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>❤️ Любовь:</span>
                        <span>{userStats.readingsByCategory.love}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>💼 Карьера:</span>
                        <span>{userStats.readingsByCategory.career}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🙏 Духовность:</span>
                        <span>{userStats.readingsByCategory.spiritual}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🔮 Общие:</span>
                        <span>{userStats.readingsByCategory.general}</span>
                      </div>
                    </div>
                  </>
                )}

                {userStats.lastReadingDate && (
                  <div className="flex justify-between text-white/70 mt-2">
                    <span>Последний расклад:</span>
                    <span className="text-purple-300">
                      {new Date(userStats.lastReadingDate).toLocaleDateString(
                        "ru-RU"
                      )}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-white/50">
                Загрузка статистики...
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 flex flex-col gap-2 items-center">
            <Link href="/profile" onClick={() => setIsOpen(false)}>
              <Button className=" text-sm justify-start text-left bg-transparent border border-purple-400/30 text-purple-300 hover:text-white hover:bg-purple-600/20">
                <User size={16} className="mr-2" />
                Перейти в профиль
              </Button>
            </Link>

            {session?.user?.role === "admin" && (
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <Button className=" text-sm justify-start text-left bg-transparent border border-red-400/30 text-red-300 hover:text-white hover:bg-red-600/20">
                  <Settings size={16} className="mr-2" />
                  Админка
                </Button>
              </Link>
            )}

            <Button
              onClick={() => signOut()}
              className=" text-sm justify-start text-left bg-transparent border border-red-400/30 text-red-300 hover:text-white hover:bg-red-600/20"
            >
              <LogOut size={16} className="mr-2" />
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
