import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - получить все расклады пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const readings = await prisma.tarotReading.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json(readings);
  } catch (error) {
    console.error("Ошибка при получении раскладов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// POST - создать новый расклад
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { spreadType, question, category, cards } = await request.json();

    // Проверка лимитов только для не-Premium пользователей
    if (!session.user.isPremium) {
      const lastReading = await prisma.tarotReading.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });

      if (lastReading) {
        const timeSinceLastReading =
          Date.now() - lastReading.createdAt.getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeSinceLastReading < fiveMinutes) {
          return NextResponse.json(
            {
              error: "Лимит раскладов превышен",
              timeLeft: fiveMinutes - timeSinceLastReading,
            },
            { status: 429 }
          );
        }
      }
    }
    // Premium пользователи создают расклады без ограничений

    const reading = await prisma.tarotReading.create({
      data: {
        userId: session.user.id,
        spreadType,
        question,
        category,
        cards,
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json(reading);
  } catch (error) {
    console.error("Ошибка при создании расклада:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
