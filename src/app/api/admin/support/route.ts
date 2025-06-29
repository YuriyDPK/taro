import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: true,
        reading: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
        messages: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Ошибка получения тикетов:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    const body = await req.json();
    const { ticketId, status, priority } = body;

    if (!ticketId) {
      return NextResponse.json(
        { error: "ID тикета обязателен" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        user: true,
        reading: true,
        messages: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Ошибка обновления тикета:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
