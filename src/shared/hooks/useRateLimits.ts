import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface RateLimit {
  lastAction: number;
  count: number;
}

interface ReadingLimit {
  lastReading: number;
  readingId: string;
  messagesCount: number;
}

export const useRateLimits = () => {
  const [readingLimits, setReadingLimits] = useLocalStorage<ReadingLimit[]>(
    "reading-limits",
    []
  );
  const [messageLimits, setMessageLimits] = useLocalStorage<
    Record<string, RateLimit>
  >("message-limits", {});

  // Проверка лимита на расклады (1 расклад в 30 секунд)
  const canCreateReading = useCallback(() => {
    const now = Date.now();
    const fiveMinutes = 1 * 60 * 1000;

    const lastReading = readingLimits.sort(
      (a, b) => b.lastReading - a.lastReading
    )[0];

    if (!lastReading) return true;

    return now - lastReading.lastReading >= fiveMinutes;
  }, [readingLimits]);

  // Проверка лимита на сообщения в раскладе (1 сообщение в 30 секунд)
  const canSendMessage = useCallback(
    (readingId: string) => {
      const now = Date.now();
      const fiveMinutes = 1 * 60 * 1000;

      const readingLimit = readingLimits.find((r) => r.readingId === readingId);
      if (!readingLimit) return true;

      const messageLimit = messageLimits[readingId];
      if (!messageLimit) return true;

      return now - messageLimit.lastAction >= fiveMinutes;
    },
    [readingLimits, messageLimits]
  );

  // Получение времени до следующего расклада
  const getTimeUntilNextReading = useCallback(() => {
    const now = Date.now();
    const fiveMinutes = 1 * 60 * 1000;

    const lastReading = readingLimits.sort(
      (a, b) => b.lastReading - a.lastReading
    )[0];

    if (!lastReading) return 0;

    const timePassed = now - lastReading.lastReading;
    const timeLeft = fiveMinutes - timePassed;

    return Math.max(0, timeLeft);
  }, [readingLimits]);

  // Получение времени до следующего сообщения
  const getTimeUntilNextMessage = useCallback(
    (readingId: string) => {
      const now = Date.now();
      const fiveMinutes = 1 * 60 * 1000;

      const messageLimit = messageLimits[readingId];
      if (!messageLimit) return 0;

      const timePassed = now - messageLimit.lastAction;
      const timeLeft = fiveMinutes - timePassed;

      return Math.max(0, timeLeft);
    },
    [messageLimits]
  );

  // Регистрация нового расклада
  const registerReading = useCallback(
    (readingId: string) => {
      const now = Date.now();

      setReadingLimits((prev) => [
        ...prev.filter((r) => r.readingId !== readingId),
        {
          lastReading: now,
          readingId,
          messagesCount: 0,
        },
      ]);
    },
    [setReadingLimits]
  );

  // Регистрация нового сообщения
  const registerMessage = useCallback(
    (readingId: string) => {
      const now = Date.now();

      setMessageLimits((prev) => ({
        ...prev,
        [readingId]: {
          lastAction: now,
          count: (prev[readingId]?.count || 0) + 1,
        },
      }));

      setReadingLimits((prev) =>
        prev.map((r) =>
          r.readingId === readingId
            ? { ...r, messagesCount: r.messagesCount + 1 }
            : r
        )
      );
    },
    [setMessageLimits, setReadingLimits]
  );

  // Проверка наличия активных лимитов
  const hasActiveMessageLimit = useCallback(
    (readingId: string) => {
      const messageLimit = messageLimits[readingId];
      if (!messageLimit) return false;

      const now = Date.now();
      const fiveMinutes = 1 * 60 * 1000;
      const timePassed = now - messageLimit.lastAction;

      return timePassed < fiveMinutes;
    },
    [messageLimits]
  );

  // Форматирование времени ожидания
  const formatTimeLeft = useCallback((timeLeft: number) => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${seconds}с`;
  }, []);

  return {
    canCreateReading,
    canSendMessage,
    getTimeUntilNextReading,
    getTimeUntilNextMessage,
    hasActiveMessageLimit,
    registerReading,
    registerMessage,
    formatTimeLeft,
  };
};
