"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  reading?: {
    id: string;
    spreadType: string;
    question: string;
  };
  messages: Array<{
    id: string;
    content: string;
    isAdmin: boolean;
    createdAt: string;
    user?: {
      name: string;
      email: string;
    };
  }>;
}

export default function UserSupportPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadTickets();
    }
  }, [session]);

  const loadTickets = async () => {
    try {
      const response = await fetch("/api/support");
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error("Ошибка загрузки тикетов:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    try {
      const response = await fetch(
        `/api/support/${selectedTicket.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (response.ok) {
        setNewMessage("");
        loadTickets();
        // Обновляем выбранный тикет
        const updatedTicket = tickets.find((t) => t.id === selectedTicket.id);
        if (updatedTicket) {
          const messagesResponse = await fetch(
            `/api/support/${selectedTicket.id}/messages`
          );
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            setSelectedTicket({
              ...updatedTicket,
              messages: messagesData.messages,
            });
          }
        }
      }
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "resolved":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "closed":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Открыт";
      case "in_progress":
        return "В работе";
      case "resolved":
        return "Решен";
      case "closed":
        return "Закрыт";
      default:
        return status;
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Необходима авторизация
          </h1>
          <Link href="/auth/signin">
            <Button>Войти в аккаунт</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            🎫 Мои обращения в поддержку
          </h1>
          <div className="flex gap-2">
            <Link href="/support">
              <Button className="bg-green-600 hover:bg-green-700">
                ➕ Новое обращение
              </Button>
            </Link>
            <Link href="/profile">
              <Button className="bg-purple-600 hover:bg-purple-700">
                ← Назад в профиль
              </Button>
            </Link>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              У вас пока нет обращений
            </h2>
            <p className="text-white/70 mb-6">
              Если у вас возникли вопросы или проблемы, создайте новое обращение
            </p>
            <Link href="/support">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Создать обращение
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Список тикетов */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Ваши обращения ({tickets.length})
                </h2>

                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedTicket?.id === ticket.id
                          ? "bg-purple-500/20 border-purple-400"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {getStatusText(ticket.status)}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(ticket.createdAt).toLocaleDateString(
                            "ru-RU"
                          )}
                        </span>
                      </div>

                      <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
                        {ticket.subject}
                      </h3>

                      <p className="text-white/70 text-xs line-clamp-2">
                        {ticket.description}
                      </p>

                      {ticket.reading && (
                        <div className="mt-2 text-xs text-purple-300">
                          🔮 Связано с гаданием: {ticket.reading.spreadType}
                        </div>
                      )}

                      {ticket.messages.length > 0 && (
                        <div className="mt-2 text-xs text-blue-300">
                          💬 Сообщений: {ticket.messages.length}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Детали тикета */}
            <div className="lg:col-span-2">
              {selectedTicket ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">
                        {selectedTicket.subject}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                            selectedTicket.status
                          )}`}
                        >
                          {getStatusText(selectedTicket.status)}
                        </span>
                        <span className="text-sm text-white/60">
                          Создано:{" "}
                          {new Date(selectedTicket.createdAt).toLocaleString(
                            "ru-RU"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Связанное гадание */}
                  {selectedTicket.reading && (
                    <div className="bg-white/5 rounded-lg p-4 mb-6">
                      <h3 className="text-white font-medium mb-2">
                        🔮 Связанное гадание
                      </h3>
                      <div className="text-sm text-white/70">
                        <p>
                          <strong>Расклад:</strong>{" "}
                          {selectedTicket.reading.spreadType}
                        </p>
                        <p>
                          <strong>Вопрос:</strong>{" "}
                          {selectedTicket.reading.question}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Описание */}
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <h3 className="text-white font-medium mb-2">
                      📝 Описание проблемы
                    </h3>
                    <p className="text-white/80 text-sm whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                  </div>

                  {/* Переписка */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4">
                      💬 Переписка
                    </h3>

                    {selectedTicket.messages.length > 0 ? (
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {selectedTicket.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.isAdmin
                                ? "bg-purple-500/20 border-l-4 border-purple-400"
                                : "bg-blue-500/20 border-l-4 border-blue-400"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">
                                {message.isAdmin ? "👨‍💼 Поддержка" : "👤 Вы"}
                              </span>
                              <span className="text-xs text-white/50">
                                {new Date(message.createdAt).toLocaleString(
                                  "ru-RU"
                                )}
                              </span>
                            </div>
                            <p className="text-white/80 text-sm whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-white/60">
                        <div className="text-4xl mb-2">💭</div>
                        <p>Пока нет сообщений. Напишите первое сообщение!</p>
                      </div>
                    )}

                    {/* Форма ответа */}
                    {selectedTicket.status !== "closed" && (
                      <div className="border-t border-white/10 pt-4">
                        <div className="flex gap-2">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Напишите ваше сообщение..."
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            rows={3}
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="self-end bg-purple-600 hover:bg-purple-700"
                          >
                            Отправить
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedTicket.status === "closed" && (
                      <div className="border-t border-white/10 pt-4 text-center">
                        <p className="text-white/60 text-sm">
                          🔒 Обращение закрыто. Для новых вопросов создайте
                          новое обращение.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">👈</div>
                  <p className="text-white/70">
                    Выберите обращение для просмотра деталей
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
