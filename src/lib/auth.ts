import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
    signIn: "/profile",
    error: "/",
  },
};
