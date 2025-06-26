"use client";

import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { TarotReading } from "@/types";

// Получить все расклады пользователя
export function useReadings() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["readings"],
    queryFn: async () => {
      const response = await fetch("/api/readings");
      if (!response.ok) {
        throw new Error("Ошибка загрузки раскладов");
      }
      return response.json();
    },
    enabled: !!session?.user,
  });
}

// Создать новый расклад
export function useCreateReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reading: {
      spreadType: string;
      question?: string;
      category: string;
      cards: any;
    }) => {
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reading),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка создания расклада");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readings"] });
    },
  });
}

// Отправить сообщение
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      readingId,
      content,
    }: {
      readingId: string;
      content: string;
    }) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ readingId, content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка отправки сообщения");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readings"] });
    },
  });
}
