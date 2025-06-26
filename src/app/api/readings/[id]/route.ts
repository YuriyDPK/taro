import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE - удалить расклад
export async function DELETE(
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

    // Удаляем расклад (каскадно удалятся и сообщения)
    await prisma.tarotReading.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении расклада:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
