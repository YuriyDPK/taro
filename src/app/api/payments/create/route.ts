import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import YooKassa from "yookassa-ts/lib/yookassa";
import { v4 as uuidv4 } from "uuid";

const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const { subscriptionType } = await request.json();

    if (
      !subscriptionType ||
      !["monthly", "yearly"].includes(subscriptionType)
    ) {
      return NextResponse.json(
        { error: "Неверный тип подписки" },
        { status: 400 }
      );
    }

    // Определяем цену и описание
    const prices = {
      monthly: parseInt(process.env.PREMIUM_MONTHLY_PRICE || "299"),
      yearly: parseInt(process.env.PREMIUM_YEARLY_PRICE || "2500"),
    };

    const descriptions = {
      monthly: "Премиум подписка на 1 месяц - Асхат Таро",
      yearly: "Премиум подписка на 1 год - Асхат Таро",
    };

    const amount = prices[subscriptionType as keyof typeof prices];
    const description =
      descriptions[subscriptionType as keyof typeof descriptions];

    // Создаем платеж в ЮKassa
    const payment = await yooKassa.createPayment(
      {
        amount: {
          value: amount.toString() + ".00",
          currency: "RUB" as any,
        },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium/success`,
        } as any,
        description,
      },
      uuidv4()
    );

    // Сохраняем информацию о платеже в базу данных
    await prisma.payment.create({
      data: {
        id: payment.id,
        userId: session.user.id,
        amount: amount,
        currency: "RUB",
        status: payment.status,
        subscriptionType,
        description,
        confirmationUrl: (payment.confirmation as any)?.confirmation_url || "",
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      paymentId: payment.id,
      confirmationUrl: (payment.confirmation as any)?.confirmation_url,
      amount,
      subscriptionType,
    });
  } catch (error) {
    console.error("Ошибка создания платежа:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
