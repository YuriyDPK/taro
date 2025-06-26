import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - получить статистику пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Получаем все расклады пользователя
    const readings = await prisma.tarotReading.findMany({
      where: { userId: session.user.id },
      select: {
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Подсчитываем статистику
    const totalReadings = readings.length;

    const readingsByCategory = {
      love: readings.filter((r) => r.category === "love").length,
      career: readings.filter((r) => r.category === "career").length,
      spiritual: readings.filter((r) => r.category === "spiritual").length,
      general: readings.filter((r) => r.category === "general").length,
    };

    const lastReadingDate = readings.length > 0 ? readings[0].createdAt : null;

    return NextResponse.json({
      totalReadings,
      readingsByCategory,
      lastReadingDate,
    });
  } catch (error) {
    console.error("Ошибка при получении статистики:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
