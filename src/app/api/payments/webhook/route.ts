import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import YooKassa from "yookassa-ts/lib/yookassa";

const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Webhook получен:", JSON.stringify(body, null, 2));

    if (body.event === "payment.succeeded") {
      const paymentId = body.object.id;
      console.log(`Обрабатываем успешный платеж: ${paymentId}`);

      // Получаем подробную информацию о платеже
      const payment = await yooKassa.getPayment(paymentId);
      console.log(
        "Данные платежа от ЮKassa:",
        JSON.stringify(payment, null, 2)
      );

      // Проверяем, существует ли платеж в нашей базе
      const existingPayment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { user: true },
      });

      if (!existingPayment) {
        console.error(`Платеж ${paymentId} не найден в базе данных`);
        return NextResponse.json(
          { error: "Платеж не найден" },
          { status: 404 }
        );
      }

      // Обновляем статус платежа в базе данных
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: payment.status,
          updatedAt: new Date(),
        },
        include: {
          user: true,
        },
      });

      console.log("Платеж обновлен в БД:", updatedPayment);

      // Если платеж успешен, активируем премиум подписку
      if (payment.status === "succeeded") {
        const now = new Date();
        const premiumExpiry = new Date(now);

        // Устанавливаем срок действия в зависимости от типа подписки
        if (updatedPayment.subscriptionType === "monthly") {
          premiumExpiry.setMonth(premiumExpiry.getMonth() + 1);
        } else if (updatedPayment.subscriptionType === "yearly") {
          premiumExpiry.setFullYear(premiumExpiry.getFullYear() + 1);
        }

        console.log(
          `Активируем премиум для пользователя ${updatedPayment.userId} до ${premiumExpiry}`
        );

        // Обновляем пользователя
        const updatedUser = await prisma.user.update({
          where: { id: updatedPayment.userId },
          data: {
            isPremium: true,
            premiumExpiry: premiumExpiry,
          },
        });

        console.log("Пользователь обновлен:", updatedUser);
        console.log(
          `✅ Успешно активирована премиум подписка для пользователя ${updatedPayment.userId} до ${premiumExpiry}`
        );
      }
    } else {
      console.log(`Получен webhook с событием: ${body.event}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Ошибка обработки webhook:", error);
    console.error("Stack trace:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
