import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import YooKassa from "yookassa-ts/lib/yookassa";

const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const paymentId = params.id;

    // Проверяем, принадлежит ли платеж пользователю
    const dbPayment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: session.user.id,
      },
    });

    if (!dbPayment) {
      return NextResponse.json({ error: "Платеж не найден" }, { status: 404 });
    }

    // Получаем актуальный статус от ЮKassa
    const yooKassaPayment = await yooKassa.getPayment(paymentId);

    // Обновляем статус в базе данных, если он изменился
    if (dbPayment.status !== yooKassaPayment.status) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: yooKassaPayment.status,
          updatedAt: new Date(),
        },
      });

      // Если платеж стал успешным, активируем премиум (на случай если webhook не сработал)
      if (
        yooKassaPayment.status === "succeeded" &&
        dbPayment.status !== "succeeded"
      ) {
        console.log(
          `Активируем премиум через API проверки статуса для платежа ${paymentId}`
        );

        const now = new Date();
        const premiumExpiry = new Date(now);

        // Устанавливаем срок действия в зависимости от типа подписки
        if (dbPayment.subscriptionType === "monthly") {
          premiumExpiry.setMonth(premiumExpiry.getMonth() + 1);
        } else if (dbPayment.subscriptionType === "yearly") {
          premiumExpiry.setFullYear(premiumExpiry.getFullYear() + 1);
        }

        // Обновляем пользователя
        await prisma.user.update({
          where: { id: dbPayment.userId },
          data: {
            isPremium: true,
            premiumExpiry: premiumExpiry,
          },
        });

        console.log(
          `✅ Премиум активирован через API для пользователя ${dbPayment.userId} до ${premiumExpiry}`
        );
      }
    }

    return NextResponse.json({
      id: yooKassaPayment.id,
      status: yooKassaPayment.status,
      amount: dbPayment.amount,
      subscriptionType: dbPayment.subscriptionType,
      description: dbPayment.description,
      createdAt: dbPayment.createdAt,
    });
  } catch (error) {
    console.error("Ошибка проверки статуса платежа:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
