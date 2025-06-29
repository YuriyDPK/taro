const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function debugPayments() {
  try {
    console.log("🔍 Диагностика системы платежей...\n");

    // 1. Проверяем все платежи
    const allPayments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isPremium: true,
            premiumExpiry: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    console.log(`💳 Найдено платежей: ${allPayments.length}\n`);

    allPayments.forEach((payment, index) => {
      console.log(`${index + 1}. Платеж ID: ${payment.id.slice(-8)}...`);
      console.log(`   Пользователь: ${payment.user.email}`);
      console.log(`   Сумма: ${payment.amount} ₽`);
      console.log(`   Статус: ${payment.status}`);
      console.log(`   Тип: ${payment.subscriptionType}`);
      console.log(`   Создан: ${payment.createdAt.toLocaleString("ru-RU")}`);
      console.log(
        `   Премиум пользователя: ${
          payment.user.isPremium ? "✅ Да" : "❌ Нет"
        }`
      );
      if (payment.user.premiumExpiry) {
        console.log(
          `   Премиум до: ${payment.user.premiumExpiry.toLocaleString("ru-RU")}`
        );
      }
      console.log("");
    });

    // 2. Находим успешные платежи без активированного премиума
    const successfulPaymentsWithoutPremium = await prisma.payment.findMany({
      where: {
        status: "succeeded",
        user: {
          isPremium: false,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isPremium: true,
            premiumExpiry: true,
          },
        },
      },
    });

    if (successfulPaymentsWithoutPremium.length > 0) {
      console.log("🚨 НАЙДЕНЫ ПРОБЛЕМНЫЕ ПЛАТЕЖИ:");
      console.log(
        `   Успешных платежей без активированного премиума: ${successfulPaymentsWithoutPremium.length}\n`
      );

      successfulPaymentsWithoutPremium.forEach((payment, index) => {
        console.log(
          `   ${index + 1}. ${payment.id.slice(-8)}... | ${
            payment.user.email
          } | ${payment.amount}₽`
        );
      });
      console.log("");
    } else {
      console.log("✅ Все успешные платежи имеют активированный премиум\n");
    }

    // 3. Статистика по статусам
    const statusStats = await prisma.payment.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    console.log("📊 Статистика по статусам платежей:");
    statusStats.forEach((stat) => {
      console.log(`   ${stat.status}: ${stat._count.status}`);
    });
    console.log("");

    // 4. Статистика по премиум пользователям
    const premiumUsers = await prisma.user.count({
      where: { isPremium: true },
    });

    const totalUsers = await prisma.user.count();

    console.log("👑 Статистика премиум пользователей:");
    console.log(`   Всего пользователей: ${totalUsers}`);
    console.log(`   Премиум пользователей: ${premiumUsers}`);
    console.log(
      `   Процент премиум: ${((premiumUsers / totalUsers) * 100).toFixed(1)}%\n`
    );

    // 5. Ближайшие истечения премиума
    const upcomingExpirations = await prisma.user.findMany({
      where: {
        isPremium: true,
        premiumExpiry: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // в течение 7 дней
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        premiumExpiry: true,
      },
      orderBy: {
        premiumExpiry: "asc",
      },
    });

    if (upcomingExpirations.length > 0) {
      console.log("⚠️ Скоро истекает премиум:");
      upcomingExpirations.forEach((user) => {
        const daysLeft = Math.ceil(
          (user.premiumExpiry - new Date()) / (1000 * 60 * 60 * 24)
        );
        console.log(
          `   ${
            user.email
          } - через ${daysLeft} дней (${user.premiumExpiry.toLocaleDateString(
            "ru-RU"
          )})`
        );
      });
      console.log("");
    } else {
      console.log(
        "✅ Нет пользователей с истекающим премиумом в ближайшие 7 дней\n"
      );
    }
  } catch (error) {
    console.error("❌ Ошибка диагностики:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Функция для автоматической активации премиума для проблемных платежей
async function fixPayments() {
  try {
    console.log("🔧 Исправление проблемных платежей...\n");

    const problemPayments = await prisma.payment.findMany({
      where: {
        status: "succeeded",
        user: {
          isPremium: false,
        },
      },
      include: {
        user: true,
      },
    });

    if (problemPayments.length === 0) {
      console.log("✅ Проблемных платежей не найдено");
      return;
    }

    console.log(
      `Найдено ${problemPayments.length} проблемных платежей. Активирую премиум...`
    );

    for (const payment of problemPayments) {
      const now = new Date();
      const premiumExpiry = new Date(now);

      if (payment.subscriptionType === "monthly") {
        premiumExpiry.setMonth(premiumExpiry.getMonth() + 1);
      } else if (payment.subscriptionType === "yearly") {
        premiumExpiry.setFullYear(premiumExpiry.getFullYear() + 1);
      }

      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          isPremium: true,
          premiumExpiry: premiumExpiry,
        },
      });

      console.log(
        `✅ Активирован премиум для ${
          payment.user.email
        } до ${premiumExpiry.toLocaleDateString("ru-RU")}`
      );
    }
  } catch (error) {
    console.error("❌ Ошибка исправления:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Парсим аргументы командной строки
const args = process.argv.slice(2);
const command = args[0];

if (command === "fix") {
  fixPayments();
} else {
  debugPayments();
}
