"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { ChatMessage } from "@/types";
import { getTarotReadingStream } from "@/shared/api/gpt";
import { useRateLimits } from "@/shared/hooks/useRateLimits";

interface TarotChatProps {
  initialMessage?: string;
  className?: string;
  readingId?: string;
  onRateLimitExceeded?: (type: "message") => void;
  onPremiumClick?: () => void;
}

export const TarotChat = ({
  initialMessage,
  className = "",
  readingId,
  onRateLimitExceeded,
  onPremiumClick,
}: TarotChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "🌟 Приветствую тебя, дитя света! Я Асхат, твоя проводница в мир таинственных карт Таро. Расскажи мне, что тревожит твою душу, и карты откроют свои секреты...",
      isUser: false,
      timestamp: Date.now(),
    },
  ]);

  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setTick] = useState(0);

  const {
    canSendMessage,
    registerMessage,
    getTimeUntilNextMessage,
    formatTimeLeft,
  } = useRateLimits();

  // Обновляем время каждую секунду для живого таймера
  useState(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  const timeUntilNextMessage = readingId
    ? getTimeUntilNextMessage(readingId)
    : 0;
  const canSend = !readingId || canSendMessage(readingId);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    // Проверяем лимит на сообщения если есть readingId
    if (readingId && !canSendMessage(readingId)) {
      onRateLimitExceeded?.("message");
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: currentMessage,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    // Регистрируем сообщение в лимитах
    if (readingId) {
      registerMessage(readingId);
    }

    // Создаем сообщение для GPT с контекстом
    const contextMessage = initialMessage
      ? `${initialMessage}\n\nВопрос пользователя: ${currentMessage}`
      : currentMessage;

    // Создаем пустое сообщение гадалки для стрима
    const gptMessageId = `gpt-${Date.now()}`;
    const gptMessage: ChatMessage = {
      id: gptMessageId,
      text: "",
      isUser: false,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, gptMessage]);

    try {
      await getTarotReadingStream(contextMessage, (chunk: string) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === gptMessageId
              ? { ...msg, text: (msg.text || "") + chunk }
              : msg
          )
        );
      });
    } catch (error) {
      console.error("Ошибка при получении ответа:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === gptMessageId
            ? {
                ...msg,
                text: "🌙 Простите, энергия нарушена. Попробуйте позже...",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg flex flex-col ${className}`}
    >
      {/* Заголовок чата */}
      <div className="border-b border-purple-400/30 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg">
            🔮
          </div>
          <div>
            <div className="text-white font-medium">Асхат</div>
            <div className="text-purple-300 text-sm">Таро гадалка</div>
          </div>
        </div>
      </div>

      {/* Сообщения */}
      <div className="max-h-96 min-h-32 overflow-y-auto p-4 space-y-4 flex-1">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
                max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm
                ${
                  message.isUser
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-black/60 border border-purple-400/30 text-white"
                }
              `}
            >
              {message.text}
              {isLoading &&
                message.id === messages[messages.length - 1]?.id &&
                !message.isUser && (
                  <span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse">
                    |
                  </span>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Поле ввода */}
      <div className="border-t border-purple-400/30 p-4">
        {/* Блок с информацией о лимитах и Premium кнопкой */}
        {onPremiumClick && (
          <div className="mb-3 p-3 bg-purple-900/30 border border-purple-400/30 rounded-lg text-center">
            {!canSend && timeUntilNextMessage > 0 ? (
              <>
                <p className="text-purple-300 text-sm mb-1">
                  Следующее сообщение будет доступно через:
                </p>
                <p className="text-white font-mono text-lg">
                  {formatTimeLeft(timeUntilNextMessage)}
                </p>
                <p className="text-purple-400 text-xs mt-1 mb-2">
                  Астральная энергия восстанавливается...
                </p>
              </>
            ) : (
              <p className="text-purple-300 text-sm mb-2">
                Получите неограниченный доступ к сообщениям
              </p>
            )}
            <Button
              onClick={onPremiumClick}
              size="sm"
              className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs px-3 py-1 hover:from-yellow-500 hover:to-orange-500 transition-all"
            >
              ✨ Premium
            </Button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              canSend
                ? "Задайте вопрос гадалке..."
                : "Ожидайте восстановления энергии..."
            }
            className="flex-1 w-full lg:w-auto bg-black/60 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-purple-300/50 resize-none focus:outline-none focus:border-purple-400 disabled:opacity-50"
            rows={2}
            disabled={isLoading || !canSend}
          />
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isLoading || !canSend}
            className={`px-6 py-2 ${
              !canSend ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "..." : canSend ? "Спросить" : "Ожидание..."}
          </Button>
        </div>
      </div>
    </div>
  );
};
