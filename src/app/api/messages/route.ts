import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTarotReadingStream } from "@/shared/api/gpt";

// Функция для генерации контекста расклада
function generateReadingContext(reading: any): string {
  const cards = Array.isArray(reading.cards) ? reading.cards : [];

  let context = `🔮 Контекст расклада "${reading.spreadType}"\n`;

  if (reading.question) {
    context += `❓ Первоначальный вопрос: ${reading.question}\n`;
  }

  context += `📅 Дата расклада: ${reading.createdAt.toLocaleDateString(
    "ru-RU"
  )}\n\n`;

  if (cards.length > 0) {
    context += "🃏 Карты в раскладе:\n";
    cards.forEach((card: any, index: number) => {
      context += `\n${index + 1}. ${card.name}`;
      if (card.description) {
        context += ` (Позиция: ${card.description})`;
      }

      if (card.meaning) {
        const meaning = card.isReversed
          ? card.meaning.reversed
          : card.meaning.upright;
        context += `\n   Значение: ${meaning}`;
      }

      if (card.isReversed) {
        context += "\n   Карта перевернута";
      }
    });
    context += "\n";
  }

  context +=
    "\n✨ Учитывай этот расклад при ответе на вопросы пользователя. Давай толкования с учетом выпавших карт и их позиций.\n\n";

  return context;
}

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

    // Генерируем контекст расклада для GPT
    const readingContext = generateReadingContext(reading);
    const fullMessage = `${readingContext}Вопрос пользователя: ${content}`;

    // Получаем ответ от GPT с контекстом расклада
    let gptResponse = "";

    try {
      await new Promise<void>((resolve, reject) => {
        getTarotReadingStream(fullMessage, (chunk: string) => {
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
