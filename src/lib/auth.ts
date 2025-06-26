import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { createHash, createHmac } from "crypto";

// Функция для проверки данных Telegram
function verifyTelegramAuth(data: any, botToken: string): boolean {
  const { hash, ...userData } = data;

  const dataKeys = Object.keys(userData).sort();
  const dataString = dataKeys
    .map((key) => `${key}=${userData[key]}`)
    .join("\n");

  const secretKey = createHash("sha256").update(botToken).digest();
  const hmac = createHmac("sha256", secretKey).update(dataString).digest("hex");

  return hmac === hash;
}

// Кастомный Telegram провайдер
const TelegramProvider = CredentialsProvider({
  id: "telegram",
  name: "Telegram",
  credentials: {
    id: { type: "text" },
    first_name: { type: "text" },
    last_name: { type: "text" },
    username: { type: "text" },
    photo_url: { type: "text" },
    auth_date: { type: "text" },
    hash: { type: "text" },
  },
  async authorize(credentials: any) {
    try {
      console.log("Telegram auth attempt:", credentials);

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        console.error("TELEGRAM_BOT_TOKEN not found");
        return null;
      }

      if (!credentials?.id || !credentials?.hash) {
        console.error("Missing required Telegram data");
        return null;
      }

      // Проверяем подлинность данных от Telegram
      if (!verifyTelegramAuth(credentials, botToken)) {
        console.error("Invalid Telegram auth data");
        return null;
      }
      console.log("✅ HMAC verification passed");

      // Проверяем что данные не старше 24 часов
      const authDate = parseInt(credentials.auth_date);
      const now = Math.floor(Date.now() / 1000);
      if (now - authDate > 86400) {
        console.error("Auth data is too old");
        return null;
      }

      const user = {
        id: credentials.id?.toString(),
        name:
          credentials.first_name +
          (credentials.last_name ? ` ${credentials.last_name}` : ""),
        email: `${credentials.id}@telegram.user`,
        image: credentials.photo_url || null,
      };

      console.log("Telegram auth successful:", user);
      return user;
    } catch (error) {
      console.error("Telegram auth error:", error);
      return null;
    }
  },
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    TelegramProvider as any,
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      console.log("SignIn callback:", { user, account, profile });

      // Если это Telegram авторизация (Credentials provider)
      if (account?.provider === "telegram" && user) {
        try {
          console.log("Processing Telegram user:", user);

          // Проверяем, существует ли пользователь в БД (сначала по ID, потом по email)
          let existingUser = await prisma.user.findUnique({
            where: { id: user.id },
          });

          if (!existingUser) {
            existingUser = await prisma.user.findUnique({
              where: { email: user.email! },
            });
          }

          if (!existingUser) {
            console.log("Creating new Telegram user in DB");
            try {
              // Создаем пользователя в БД
              const newUser = await prisma.user.create({
                data: {
                  id: user.id,
                  name: user.name,
                  email: user.email!,
                  image: user.image,
                  role: "user",
                  isPremium: false,
                },
              });
              console.log("New Telegram user created:", newUser);
            } catch (createError: any) {
              // Возможно пользователь уже был создан в другом запросе
              console.warn(
                "Error creating user, checking if exists:",
                createError.message
              );
              existingUser = await prisma.user.findUnique({
                where: { id: user.id },
              });
              if (!existingUser) {
                throw createError;
              }
            }
          } else {
            console.log("Telegram user already exists:", existingUser);
            // Обновляем информацию пользователя (аватарка могла измениться)
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name,
                image: user.image,
              },
            });
          }
        } catch (error) {
          console.error("Error creating/updating Telegram user:", error);
          return false;
        }
      }

      return true;
    },
    session: async ({ session, token }) => {
      console.log("Session callback:", {
        session: session?.user,
        token: token?.sub,
      });

      if (session?.user && token?.sub) {
        // Получаем полную информацию о пользователе из базы данных
        const user = (await prisma.user.findUnique({
          where: { id: token.sub },
        })) as any;

        console.log("Found user in DB:", user ? "YES" : "NO", user?.id);

        if (user) {
          session.user.id = user.id;
          session.user.role = user.role;
          session.user.isPremium = user.isPremium;
          session.user.premiumExpiry = user.premiumExpiry;

          // Проверяем не истек ли Premium
          if (
            user.isPremium &&
            user.premiumExpiry &&
            user.premiumExpiry < new Date()
          ) {
            await prisma.user.update({
              where: { id: user.id },
              data: { isPremium: false },
            });
            session.user.isPremium = false;
          }
        } else {
          console.error("User not found in database:", token.sub);
          console.error("Session user:", session.user);

          // Попробуем найти по email для Telegram пользователей
          if (session.user.email?.includes("@telegram.user")) {
            console.log(
              "Trying to find Telegram user by email:",
              session.user.email
            );
            const telegramUser = await prisma.user.findUnique({
              where: { email: session.user.email },
            });

            if (telegramUser) {
              console.log("Found Telegram user by email:", telegramUser.id);
              session.user.id = telegramUser.id;
              session.user.role = telegramUser.role;
              session.user.isPremium = telegramUser.isPremium;
              session.user.premiumExpiry = telegramUser.premiumExpiry;
            }
          }
        }
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
        // Для Telegram пользователей убеждаемся что используется правильный ID
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
};
