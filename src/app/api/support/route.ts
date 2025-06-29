import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      subject,
      description,
      readingId,
      guestName,
      guestEmail,
      guestPhone,
    } = body;

    if (!subject || !description) {
      return NextResponse.json(
        { error: "Тема и описание обязательны" },
        { status: 400 }
      );
    }

    // Если пользователь не авторизован, требуем контактную информацию
    if (!session?.user) {
      if (!guestName || (!guestEmail && !guestPhone)) {
        return NextResponse.json(
          {
            error:
              "Для неавторизованных пользователей обязательны имя и email или телефон",
          },
          { status: 400 }
        );
      }
    }

    const ticketData: any = {
      subject,
      description,
      readingId: readingId || null,
    };

    if (session?.user) {
      ticketData.userId = session.user.id;
    } else {
      ticketData.guestName = guestName;
      ticketData.guestEmail = guestEmail || null;
      ticketData.guestPhone = guestPhone || null;
    }

    const ticket = await prisma.supportTicket.create({
      data: ticketData,
      include: {
        user: true,
        reading: true,
      },
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Ошибка создания тикета поддержки:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const tickets = await prisma.supportTicket.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        reading: true,
      },
      orderBy: { createdAt: "desc" },
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
