import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT - обновить пользователя (только для админов)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Проверяем что пользователь - админ
    const currentUser = (await prisma.user.findUnique({
      where: { id: session.user.id },
    })) as any;

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }

    const { isPremium, premiumExpiry, role } = await request.json();

    // Обновляем пользователя
    const updatedUser = (await prisma.user.update({
      where: { id },
      data: {
        ...(isPremium !== undefined && { isPremium }),
        ...(premiumExpiry !== undefined && {
          premiumExpiry: premiumExpiry ? new Date(premiumExpiry) : null,
        }),
        ...(role !== undefined && { role }),
      },
    })) as any;

    return NextResponse.json({
      message: "Пользователь успешно обновлен",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// GET - получить расклады конкретного пользователя (только для админов)
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

    // Проверяем что пользователь - админ
    const currentUser = (await prisma.user.findUnique({
      where: { id: session.user.id },
    })) as any;

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }

    // Получаем пользователя и его расклады
    const [user, readings] = await Promise.all([
      prisma.user.findUnique({
        where: { id },
      }) as any,
      prisma.tarotReading.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
      readings,
    });
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
