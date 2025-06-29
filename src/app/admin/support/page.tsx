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
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  reading?: {
    id: string;
    spreadType: string;
    question: string;
    cards: any[];
    messages: Array<{
      id: string;
      content: string;
      isUser: boolean;
      createdAt: string;
    }>;
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

export default function AdminSupportPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    priority: "",
  });

  useEffect(() => {
    if (session?.user?.role === "admin") {
      loadTickets();
    }
  }, [session, filter]);

  const loadTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.priority) params.append("priority", filter.priority);

      const response = await fetch(`/api/admin/support?${params}`);
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

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketId, status }),
      });

      if (response.ok) {
        loadTickets();
        if (selectedTicket?.id === ticketId) {
          const updatedTicket = tickets.find((t) => t.id === ticketId);
          if (updatedTicket) {
            setSelectedTicket({ ...updatedTicket, status: status as any });
          }
        }
      }
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
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
        const updatedTickets = await fetch(`/api/admin/support`).then((r) =>
          r.json()
        );
        const updatedTicket = updatedTickets.tickets.find(
          (t: SupportTicket) => t.id === selectedTicket.id
        );
        if (updatedTicket) {
          setSelectedTicket(updatedTicket);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-600/20 text-red-300 border-red-600/30";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  if (session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Доступ запрещен
          </h1>
          <p className="text-white/70">
            У вас нет прав для просмотра этой страницы
          </p>
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            🛠️ Техническая поддержка
          </h1>
          <Link href="/admin">
            <Button className="bg-purple-600 hover:bg-purple-700">
              ← Вернуться в админку
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Список тикетов */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Тикеты</h2>
                <div className="text-sm text-white/70">
                  Всего: {tickets.length}
                </div>
              </div>

              {/* Фильтры */}
              <div className="space-y-3 mb-4">
                <select
                  value={filter.status}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
                >
                  <option value="">Все статусы</option>
                  <option value="open">Открыт</option>
                  <option value="in_progress">В работе</option>
                  <option value="resolved">Решен</option>
                  <option value="closed">Закрыт</option>
                </select>

                <select
                  value={filter.priority}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, priority: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
                >
                  <option value="">Все приоритеты</option>
                  <option value="urgent">Срочный</option>
                  <option value="high">Высокий</option>
                  <option value="medium">Средний</option>
                  <option value="low">Низкий</option>
                </select>
              </div>

              {/* Список тикетов */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
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
                        {ticket.status === "open" && "Открыт"}
                        {ticket.status === "in_progress" && "В работе"}
                        {ticket.status === "resolved" && "Решен"}
                        {ticket.status === "closed" && "Закрыт"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs border ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority === "urgent" && "🔴"}
                        {ticket.priority === "high" && "🟠"}
                        {ticket.priority === "medium" && "🟡"}
                        {ticket.priority === "low" && "🟢"}
                      </span>
                    </div>

                    <h3 className="text-white font-medium text-sm mb-1 truncate">
                      {ticket.subject}
                    </h3>

                    <p className="text-white/70 text-xs mb-2 line-clamp-2">
                      {ticket.description}
                    </p>

                    <div className="text-xs text-white/50">
                      {ticket.user ? ticket.user.name : ticket.guestName} •{" "}
                      {new Date(ticket.createdAt).toLocaleDateString("ru-RU")}
                    </div>
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
                  <h2 className="text-xl font-semibold text-white">
                    {selectedTicket.subject}
                  </h2>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      updateTicketStatus(selectedTicket.id, e.target.value)
                    }
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                  >
                    <option value="open">Открыт</option>
                    <option value="in_progress">В работе</option>
                    <option value="resolved">Решен</option>
                    <option value="closed">Закрыт</option>
                  </select>
                </div>

                {/* Информация о пользователе */}
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-2">
                    👤 Пользователь
                  </h3>
                  {selectedTicket.user ? (
                    <div className="text-sm text-white/70">
                      <p>
                        <strong>Имя:</strong> {selectedTicket.user.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedTicket.user.email}
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-white/70">
                      <p>
                        <strong>Имя:</strong> {selectedTicket.guestName}
                      </p>
                      {selectedTicket.guestEmail && (
                        <p>
                          <strong>Email:</strong> {selectedTicket.guestEmail}
                        </p>
                      )}
                      {selectedTicket.guestPhone && (
                        <p>
                          <strong>Телефон:</strong> {selectedTicket.guestPhone}
                        </p>
                      )}
                      <p className="text-yellow-300">⚠️ Неавторизованный</p>
                    </div>
                  )}
                </div>

                {/* Связанное гадание */}
                {selectedTicket.reading && (
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <h3 className="text-white font-medium mb-2">
                      🔮 Связанное гадание
                    </h3>
                    <div className="text-sm text-white/70 space-y-2">
                      <p>
                        <strong>Расклад:</strong>{" "}
                        {selectedTicket.reading.spreadType}
                      </p>
                      <p>
                        <strong>Вопрос:</strong>{" "}
                        {selectedTicket.reading.question}
                      </p>

                      <div className="mt-3">
                        <p className="font-medium text-white mb-2">🃏 Карты:</p>
                        <div className="space-y-1">
                          {selectedTicket.reading.cards.map(
                            (card: any, index: number) => (
                              <div
                                key={index}
                                className="bg-white/10 rounded p-2 text-xs"
                              >
                                <strong>{card.name}</strong> -{" "}
                                {card.description}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {selectedTicket.reading.messages.length > 0 && (
                        <div className="mt-3">
                          <p className="font-medium text-white mb-2">
                            💬 Чат с гадалкой:
                          </p>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {selectedTicket.reading.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className="bg-white/10 rounded p-2 text-xs"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`px-1 py-0.5 rounded text-xs ${
                                      msg.isUser
                                        ? "bg-blue-500/20 text-blue-300"
                                        : "bg-purple-500/20 text-purple-300"
                                    }`}
                                  >
                                    {msg.isUser ? "👤" : "🔮"}
                                  </span>
                                  <span className="text-white/50">
                                    {new Date(msg.createdAt).toLocaleString(
                                      "ru-RU"
                                    )}
                                  </span>
                                </div>
                                <p className="text-white/80">{msg.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Описание */}
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-2">📝 Описание</h3>
                  <p className="text-white/80 text-sm whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Переписка */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-4">💬 Переписка</h3>

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
                            {message.isAdmin
                              ? "Админ"
                              : message.user?.name || "Пользователь"}
                          </span>
                          <span className="text-xs text-white/50">
                            {new Date(message.createdAt).toLocaleString(
                              "ru-RU"
                            )}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">
                          {message.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Форма ответа */}
                  <div className="flex gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ответ пользователю..."
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
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <p className="text-white/70">Выберите тикет для просмотра</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
