"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import { ChatMessage } from "@/types";
import { getTarotReadingStream } from "@/shared/api/gpt";
import { useRateLimits } from "@/shared/hooks/useRateLimits";

interface TarotChatProps {
  initialMessage?: string;
  className?: string;
  readingId?: string;
  questionFromReading?: string;
  onRateLimitExceeded?: (type: "message") => void;
  onPremiumClick?: () => void;
}

export const TarotChat = ({
  initialMessage,
  className = "",
  readingId,
  questionFromReading,
  onRateLimitExceeded,
  onPremiumClick,
}: TarotChatProps) => {
  const { data: session } = useSession();
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
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    canSendMessage,
    registerMessage,
    getTimeUntilNextMessage,
    formatTimeLeft,
  } = useRateLimits();

  // Фразы для заглушки "думает"
  const thinkingPhrases = [
    "Асхат читает карты...",
    "Энергия карт пробуждается...",
    "Звёзды шепчут тайны...",
    "Вижу образы в картах...",
    "Астральные силы говорят...",
    "Карты раскрывают секреты...",
    "Чувствую мощную энергию...",
    "Тайные знаки проявляются...",
  ];

  // Автоскролл к концу сообщений
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Скроллим при добавлении новых сообщений или включении режима "думает"
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Эффект для смены фраз в режиме "думает"
  useEffect(() => {
    if (!isThinking) return;

    // Сразу устанавливаем первую фразу
    setThinkingText(thinkingPhrases[0]);

    // Меняем фразы каждые 2 секунды
    const interval = setInterval(() => {
      setThinkingText((prev) => {
        const currentIndex = thinkingPhrases.indexOf(prev);
        const nextIndex = (currentIndex + 1) % thinkingPhrases.length;
        return thinkingPhrases[nextIndex];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isThinking]);

  // Предзаполняем поле ввода вопросом из расклада
  useEffect(() => {
    if (questionFromReading && !currentMessage) {
      setCurrentMessage(questionFromReading);
    }
  }, [questionFromReading]);

  // Загружаем существующие сообщения из БД
  useEffect(() => {
    if (readingId && !messagesLoaded) {
      loadMessages();
    }
  }, [readingId, messagesLoaded]);

  // Обновляем время каждую секунду для живого таймера
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    if (!readingId) return;

    try {
      const response = await fetch(`/api/readings/${readingId}/messages`);
      if (response.ok) {
        const dbMessages = await response.json();
        const loadedMessages = dbMessages.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          isUser: msg.isUser,
          timestamp: new Date(msg.createdAt).getTime(),
        }));

        setMessages((prev) => [
          ...prev.filter((msg) => msg.id === "welcome"), // Оставляем приветствие
          ...loadedMessages,
        ]);
      }
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
    } finally {
      setMessagesLoaded(true);
    }
  };

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
    setIsThinking(true);

    // Регистрируем сообщение в лимитах
    if (readingId) {
      registerMessage(readingId);
    }

    try {
      // Отправляем сообщение в API для сохранения в БД и получения ответа
      if (readingId) {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            readingId,
            content: currentMessage,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          if (response.status === 429) {
            onRateLimitExceeded?.("message");
            return;
          }
          throw new Error(error.error || "Ошибка отправки сообщения");
        }

        const { userMessage, gptMessage } = await response.json();

        // Добавляем сообщения в локальное состояние для отображения
        const localUserMessage: ChatMessage = {
          id: userMessage.id,
          text: userMessage.content,
          isUser: true,
          timestamp: new Date(userMessage.createdAt).getTime(),
        };

        const localGptMessage: ChatMessage = {
          id: gptMessage.id,
          text: gptMessage.content,
          isUser: false,
          timestamp: new Date(gptMessage.createdAt).getTime(),
        };

        setMessages((prev) => [...prev, localGptMessage]);
        setIsThinking(false);
      } else {
        // Fallback для случаев без readingId (не должно происходить с новым кодом)
        const contextMessage = initialMessage
          ? `${initialMessage}\n\nВопрос пользователя: ${currentMessage}`
          : currentMessage;

        const gptMessageId = `gpt-${Date.now()}`;
        const gptMessage: ChatMessage = {
          id: gptMessageId,
          text: "",
          isUser: false,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, gptMessage]);

        await getTarotReadingStream(contextMessage, (chunk: string) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === gptMessageId
                ? { ...msg, text: (msg.text || "") + chunk }
                : msg
            )
          );
        });

        setIsThinking(false);
      }
    } catch (error) {
      console.error("Ошибка при получении ответа:", error);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "🌙 Простите, энергия нарушена. Попробуйте позже...",
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
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
      <div
        ref={messagesEndRef}
        className="max-h-96 min-h-32 overflow-y-auto p-4 space-y-4 flex-1"
      >
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

        {/* Заглушка "думает" */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg text-sm bg-black/60 border border-purple-400/30 text-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-bounce shadow-sm shadow-purple-400/50"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce shadow-sm shadow-indigo-400/50"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-sm shadow-purple-400/50"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="text-purple-300 text-xs italic font-medium">
                  {thinkingText}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Элемент для автоскролла */}
        <div />
      </div>

      {/* Поле ввода */}
      <div className="border-t border-purple-400/30 p-4">
        {/* Блок с информацией о лимитах и Premium кнопкой - только для не-Premium пользователей */}
        {onPremiumClick && !session?.user?.isPremium && (
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

        {/* Информация для Premium пользователей */}
        {session?.user?.isPremium && (
          <div className="mb-3 p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-400/30 rounded-lg text-center">
            <p className="text-yellow-300 text-sm mb-1">✨ Premium активен</p>
            <p className="text-yellow-400/80 text-xs">
              Неограниченные сообщения и расклады
            </p>
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
