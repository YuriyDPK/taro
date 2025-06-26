const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function manageRoles() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case "list":
        await listUsers();
        break;
      case "admin":
        const email = args[1];
        if (!email) {
          console.log(
            "❌ Укажите email: node scripts/manage-roles.js admin user@example.com"
          );
          return;
        }
        await makeAdmin(email);
        break;
      case "user":
        const userEmail = args[1];
        if (!userEmail) {
          console.log(
            "❌ Укажите email: node scripts/manage-roles.js user admin@example.com"
          );
          return;
        }
        await makeUser(userEmail);
        break;
      case "premium":
        const premiumEmail = args[1];
        const days = args[2] || 365;
        if (!premiumEmail) {
          console.log(
            "❌ Укажите email: node scripts/manage-roles.js premium user@example.com [дни]"
          );
          return;
        }
        await makePremium(premiumEmail, parseInt(days));
        break;
      case "remove-premium":
        const noPremiumEmail = args[1];
        if (!noPremiumEmail) {
          console.log(
            "❌ Укажите email: node scripts/manage-roles.js remove-premium user@example.com"
          );
          return;
        }
        await removePremium(noPremiumEmail);
        break;
      default:
        showHelp();
    }
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function listUsers() {
  console.log("👥 Список всех пользователей:\n");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isPremium: true,
      premiumExpiry: true,
      createdAt: true,
      _count: {
        select: {
          readings: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (users.length === 0) {
    console.log("Пользователи не найдены");
    return;
  }

  users.forEach((user, index) => {
    const role = user.role === "admin" ? "👑 Админ" : "👤 Пользователь";
    const premium = user.isPremium ? "✨ Premium" : "🆓 Обычный";
    const expiry = user.premiumExpiry
      ? ` (до ${new Date(user.premiumExpiry).toLocaleDateString()})`
      : "";
    const readings = user._count.readings;

    console.log(`${index + 1}. ${user.name || "Без имени"}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🏷️  Роль: ${role}`);
    console.log(`   💎 Статус: ${premium}${expiry}`);
    console.log(`   📚 Раскладов: ${readings}`);
    console.log(
      `   📅 Регистрация: ${new Date(user.createdAt).toLocaleDateString()}`
    );
    console.log();
  });
}

async function makeAdmin(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`❌ Пользователь с email ${email} не найден`);
    return;
  }

  if (user.role === "admin") {
    console.log(`ℹ️  Пользователь ${email} уже является админом`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });

  console.log(`✅ Пользователь ${email} (${user.name}) теперь админ!`);
}

async function makeUser(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`❌ Пользователь с email ${email} не найден`);
    return;
  }

  if (user.role === "user") {
    console.log(`ℹ️  Пользователь ${email} уже обычный пользователь`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: "user" },
  });

  console.log(
    `✅ Пользователь ${email} (${user.name}) теперь обычный пользователь`
  );
}

async function makePremium(email, days) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`❌ Пользователь с email ${email} не найден`);
    return;
  }

  const premiumExpiry = new Date();
  premiumExpiry.setDate(premiumExpiry.getDate() + days);

  await prisma.user.update({
    where: { email },
    data: {
      isPremium: true,
      premiumExpiry: premiumExpiry,
    },
  });

  console.log(
    `✅ Пользователь ${email} (${user.name}) получил Premium на ${days} дней`
  );
  console.log(`📅 Действителен до: ${premiumExpiry.toLocaleDateString()}`);
}

async function removePremium(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`❌ Пользователь с email ${email} не найден`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: {
      isPremium: false,
      premiumExpiry: null,
    },
  });

  console.log(
    `✅ Premium статус удален у пользователя ${email} (${user.name})`
  );
}

function showHelp() {
  console.log(`
🔧 Управление ролями и статусами пользователей

Использование:
  node scripts/manage-roles.js <команда> [параметры]

Команды:
  list                              - Показать всех пользователей
  admin <email>                     - Сделать пользователя админом
  user <email>                      - Сделать админа обычным пользователем
  premium <email> [дни]             - Выдать Premium (по умолчанию 365 дней)
  remove-premium <email>            - Убрать Premium статус

Примеры:
  node scripts/manage-roles.js list
  node scripts/manage-roles.js admin user@example.com
  node scripts/manage-roles.js premium user@example.com 30
  node scripts/manage-roles.js user admin@example.com
  node scripts/manage-roles.js remove-premium user@example.com
`);
}

manageRoles();
