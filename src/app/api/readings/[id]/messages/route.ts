import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - получить сообщения конкретного расклада
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Проверяем что расклад принадлежит пользователю
    const reading = await prisma.tarotReading.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!reading) {
      return NextResponse.json({ error: "Расклад не найден" }, { status: 404 });
    }

    // Получаем все сообщения для данного расклада
    const messages = await prisma.chatMessage.findMany({
      where: { readingId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Ошибка при получении сообщений:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
