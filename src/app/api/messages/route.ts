import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTarotReadingStream } from "@/shared/api/gpt";

// POST - отправить сообщение
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { readingId, content } = await request.json();

    // Проверяем что расклад принадлежит пользователю
    const reading = await prisma.tarotReading.findFirst({
      where: {
        id: readingId,
        userId: session.user.id,
      },
    });

    if (!reading) {
      return NextResponse.json({ error: "Расклад не найден" }, { status: 404 });
    }

    // Проверка лимитов только для не-Premium пользователей
    if (!session.user.isPremium) {
      const lastMessage = await prisma.chatMessage.findFirst({
        where: {
          readingId,
          userId: session.user.id,
          isUser: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (lastMessage) {
        const timeSinceLastMessage =
          Date.now() - lastMessage.createdAt.getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeSinceLastMessage < fiveMinutes) {
          return NextResponse.json(
            {
              error: "Лимит сообщений превышен",
              timeLeft: fiveMinutes - timeSinceLastMessage,
            },
            { status: 429 }
          );
        }
      }
    }
    // Premium пользователи отправляют сообщения без ограничений

    // Сохраняем сообщение пользователя
    const userMessage = await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        readingId,
        content,
        isUser: true,
      },
    });

    // Получаем ответ от GPT
    let gptResponse = "";

    try {
      await new Promise<void>((resolve, reject) => {
        getTarotReadingStream(content, (chunk: string) => {
          gptResponse += chunk;
        })
          .then(() => resolve())
          .catch(reject);
      });
    } catch (error) {
      console.error("Ошибка GPT:", error);
      gptResponse = "🌙 Простите, энергия нарушена. Попробуйте позже...";
    }

    // Сохраняем ответ гадалки
    const gptMessage = await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        readingId,
        content: gptResponse,
        isUser: false,
      },
    });

    return NextResponse.json({
      userMessage,
      gptMessage,
    });
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
