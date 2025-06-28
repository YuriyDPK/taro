import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Проверяем пользователя в базе данных
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            return null;
          }

          // Проверяем пароль
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          // Возвращаем пользователя без пароля
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            isPremium: user.isPremium,
            premiumExpiry: user.premiumExpiry,
          };
        } catch (error) {
          console.error("Ошибка авторизации:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback:", { user, account, profile });

      // Если это Google авторизация
      if (account?.provider === "google" && user) {
        try {
          // Проверяем, существует ли пользователь в БД
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            console.log("Creating new Google user in DB");
            try {
              // Создаем пользователя в БД
              const newUser = await prisma.user.create({
                data: {
                  email: user.email!,
                  name: user.name,
                  image: user.image,
                  role: "user",
                  isPremium: false,
                },
              });
              console.log("New Google user created:", newUser);
            } catch (createError: any) {
              console.warn(
                "Error creating user, checking if exists:",
                createError.message
              );
              existingUser = await prisma.user.findUnique({
                where: { email: user.email! },
              });
              if (!existingUser) {
                throw createError;
              }
            }
          } else {
            console.log("Google user already exists:", existingUser);
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
          console.error("Error creating/updating Google user:", error);
          return false;
        }
      }

      return true;
    },
    async session({ session, token }) {
      console.log("Session callback:", {
        session: session?.user,
        token: token?.sub,
      });

      if (session?.user && token?.email) {
        // Получаем полную информацию о пользователе из базы данных по email
        const user = (await prisma.user.findUnique({
          where: { email: token.email as string },
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
          console.error("User not found in database:", token.email);
        }
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.isPremium = user.isPremium;
        token.premiumExpiry = user.premiumExpiry;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
