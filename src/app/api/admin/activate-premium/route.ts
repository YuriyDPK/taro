import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Проверяем, что пользователь - администратор
    if (!session?.user?.email || session.user.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: "Не указан ID платежа" },
        { status: 400 }
      );
    }

    // Находим платеж
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Платеж не найден" }, { status: 404 });
    }

    if (payment.status !== "succeeded") {
      return NextResponse.json(
        { error: "Платеж не в статусе succeeded" },
        { status: 400 }
      );
    }

    // Проверяем, не активирован ли уже премиум
    if (payment.user.isPremium) {
      return NextResponse.json(
        { message: "Премиум уже активен у пользователя" },
        { status: 200 }
      );
    }

    const now = new Date();
    const premiumExpiry = new Date(now);

    // Устанавливаем срок действия в зависимости от типа подписки
    if (payment.subscriptionType === "monthly") {
      premiumExpiry.setMonth(premiumExpiry.getMonth() + 1);
    } else if (payment.subscriptionType === "yearly") {
      premiumExpiry.setFullYear(premiumExpiry.getFullYear() + 1);
    }

    // Обновляем пользователя
    const updatedUser = await prisma.user.update({
      where: { id: payment.userId },
      data: {
        isPremium: true,
        premiumExpiry: premiumExpiry,
      },
    });

    console.log(
      `🔧 Админ ${session.user.email} активировал премиум для пользователя ${payment.userId} до ${premiumExpiry}`
    );

    return NextResponse.json({
      message: "Премиум успешно активирован",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        isPremium: updatedUser.isPremium,
        premiumExpiry: updatedUser.premiumExpiry,
      },
      payment: {
        id: payment.id,
        subscriptionType: payment.subscriptionType,
        amount: payment.amount,
      },
    });
  } catch (error) {
    console.error("Ошибка активации премиума админом:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
