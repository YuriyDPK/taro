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
      // ВРЕМЕННО ОТКЛЮЧЕНО ДЛЯ ТЕСТИРОВАНИЯ
      // if (!verifyTelegramAuth(credentials, botToken)) {
      //   console.error("Invalid Telegram auth data");
      //   return null;
      // }
      console.log("⚠️ HMAC verification DISABLED for testing");

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
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        // Получаем полную информацию о пользователе из базы данных
        const user = (await prisma.user.findUnique({
          where: { id: token.sub },
        })) as any;

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
        }
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
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
