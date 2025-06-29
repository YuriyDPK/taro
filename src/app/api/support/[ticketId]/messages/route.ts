import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Содержимое сообщения обязательно" },
        { status: 400 }
      );
    }

    // Проверяем существование тикета
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.ticketId },
      include: { user: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Тикет не найден" }, { status: 404 });
    }

    // Проверяем права доступа
    if (!session?.user) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    // Пользователь может отвечать только в своих тикетах или админ может отвечать везде
    if (ticket.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Нет доступа к этому тикету" },
        { status: 403 }
      );
    }

    const message = await prisma.supportMessage.create({
      data: {
        ticketId: params.ticketId,
        userId: session.user.id,
        content: content.trim(),
        isAdmin: session.user.role === "admin",
      },
      include: {
        user: true,
      },
    });

    // Обновляем статус тикета
    if (ticket.status === "resolved" || ticket.status === "closed") {
      await prisma.supportTicket.update({
        where: { id: params.ticketId },
        data: { status: "in_progress" },
      });
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Ошибка создания сообщения:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    // Проверяем существование тикета и права доступа
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Тикет не найден" }, { status: 404 });
    }

    if (ticket.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Нет доступа к этому тикету" },
        { status: 403 }
      );
    }

    const messages = await prisma.supportMessage.findMany({
      where: { ticketId: params.ticketId },
      include: {
        user: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Ошибка получения сообщений:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
