"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import {
  Crown,
  User,
  Search,
  Calendar,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import PaymentsSection from "@/components/admin/PaymentsSection";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  isPremium: boolean;
  premiumExpiry: Date | null;
  createdAt: Date;
  _count?: { readings: number };
}

interface UserDetail {
  user: AdminUser;
  readings: any[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Модальные формы
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({
    isPremium: false,
    premiumExpiry: "",
    role: "user",
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      loadUsers();
    } else if (
      status === "unauthenticated" ||
      (status === "authenticated" && session?.user?.role !== "admin")
    ) {
      setLoading(false);
    }
  }, [status, search, page]);

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: "10",
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки деталей пользователя:", error);
    }
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setEditForm({
      isPremium: user.isPremium,
      premiumExpiry: user.premiumExpiry
        ? new Date(user.premiumExpiry).toISOString().split("T")[0]
        : "",
      role: user.role,
    });
    setShowEditModal(true);
  };

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setShowEditModal(false);
        loadUsers();
        alert("Пользователь успешно обновлен");
      } else {
        alert("Ошибка обновления пользователя");
      }
    } catch (error) {
      console.error("Ошибка обновления:", error);
      alert("Ошибка обновления пользователя");
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚙️</div>
            <div className="text-2xl text-white/70">Загрузка админки...</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔒</div>
            <div className="text-2xl text-white/70 mb-4">
              Недостаточно прав для доступа к админке
            </div>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                На главную
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-light text-white mb-4">⚙️ Админка</h1>
          <p className="text-xl text-white/80">
            Управление пользователями системы
          </p>
          <div className="mt-6 flex flex-col lg:flex-row justify-center gap-4">
            <Link href="/admin/support">
              <Button className="bg-blue-600 hover:bg-blue-700 text-[18px] lg:text-[24px]">
                🛠️ Техническая поддержка
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700 text-[18px] lg:text-[24px]">
                🏠 На главную
              </Button>
            </Link>
          </div>
        </div>

        {!selectedUser ? (
          // Список пользователей
          <>
            {/* Поиск */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <Search className="text-purple-400" size={20} />
                <input
                  type="text"
                  placeholder="Поиск по имени или email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="flex-1 bg-black/60 border border-purple-400/30 rounded-lg px-4 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Таблица пользователей */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-purple-400/30">
                <h3 className="text-xl font-medium text-white">
                  Пользователи ({pagination.total})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-900/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-medium">
                        Пользователь
                      </th>
                      <th className="px-6 py-4 text-left text-white font-medium">
                        Статус
                      </th>
                      <th className="px-6 py-4 text-left text-white font-medium">
                        Раскладов
                      </th>
                      <th className="px-6 py-4 text-left text-white font-medium">
                        Дата регистрации
                      </th>
                      <th className="px-6 py-4 text-left text-white font-medium">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-purple-400/20 hover:bg-purple-900/10"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.image && (
                              <img
                                src={user.image}
                                alt={user.name || ""}
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                            <div>
                              <div className="text-white font-medium">
                                {user.name || "Без имени"}
                              </div>
                              <div className="text-white/60 text-sm">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {user.isPremium ? (
                                <>
                                  <Crown
                                    size={16}
                                    className="text-yellow-400"
                                  />
                                  <span className="text-yellow-400">
                                    Premium
                                  </span>
                                </>
                              ) : (
                                <>
                                  <User size={16} className="text-gray-400" />
                                  <span className="text-gray-400">
                                    Бесплатно
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="text-xs text-white/60">
                              {user.role === "admin" ? "Админ" : "Пользователь"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-purple-300">
                            {user._count?.readings || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white/70">
                            {formatDate(user.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => loadUserDetails(user.id)}
                              size="sm"
                              className="bg-transparent border border-blue-400/30 text-blue-300 hover:bg-blue-600/20"
                            >
                              <Eye size={14} className="mr-1" />
                              Просмотр
                            </Button>
                            <Button
                              onClick={() => openEditModal(user)}
                              size="sm"
                              className="bg-transparent border border-purple-400/30 text-purple-300 hover:bg-purple-600/20"
                            >
                              <Settings size={14} className="mr-1" />
                              Изменить
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Пагинация */}
              {pagination.totalPages > 1 && (
                <div className="p-6 border-t border-purple-400/30 flex justify-between items-center">
                  <div className="text-white/70">
                    Страница {pagination.page} из {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      size="sm"
                      className="bg-transparent border border-purple-400/30 text-purple-300"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Button
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.totalPages}
                      size="sm"
                      className="bg-transparent border border-purple-400/30 text-purple-300"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Детали пользователя
          <div className="space-y-6">
            <Button
              onClick={() => setSelectedUser(null)}
              className="bg-transparent border border-purple-400/30 text-purple-300"
            >
              ← Назад к списку
            </Button>

            <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
              <h3 className="text-2xl font-light text-white mb-4">
                Расклады пользователя: {selectedUser.user.name}
              </h3>

              {selectedUser.readings.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  У пользователя пока нет раскладов
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedUser.readings.map((reading) => (
                    <div
                      key={reading.id}
                      className="bg-black/60 border border-purple-400/20 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">
                          {reading.spreadType}
                        </h4>
                        <span className="text-white/60 text-sm">
                          {formatDate(reading.createdAt)}
                        </span>
                      </div>
                      {reading.question && (
                        <div className="text-purple-300 mb-2">
                          {reading.question}
                        </div>
                      )}
                      <div className="text-white/70 text-sm">
                        Сообщений: {reading.messages.length}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Модальное окно редактирования */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            />
            <div className="relative bg-black/90 border border-purple-400/30 rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-light text-white mb-6">
                Редактировать: {editingUser.name}
              </h3>

              <div className="space-y-4">
                {/* Роль */}
                <div>
                  <label className="block text-white text-sm mb-2">Роль</label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full bg-black/60 border border-purple-400/30 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Админ</option>
                  </select>
                </div>

                {/* Premium статус */}
                <div>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={editForm.isPremium}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          isPremium: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    Premium аккаунт
                  </label>
                </div>

                {/* Дата окончания Premium */}
                {editForm.isPremium && (
                  <div>
                    <label className="block text-white text-sm mb-2">
                      Действителен до
                    </label>
                    <input
                      type="date"
                      value={editForm.premiumExpiry}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          premiumExpiry: e.target.value,
                        })
                      }
                      className="w-full bg-black/60 border border-purple-400/30 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={updateUser}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  Сохранить
                </Button>
                <Button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-black/40 border border-purple-400/30 text-purple-300"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Секция платежей - отображается только в режиме списка пользователей */}
        {!selectedUser && <PaymentsSection />}
      </div>
    </div>
  );
}
