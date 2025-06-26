"use client";

import { useSession } from "next-auth/react";
import { SignInButton } from "./SignInButton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
              🌟 Войдите в священное пространство
            </h2>
            <p className="text-white/80 mb-6">
              Чтобы получить доступ к раскладам и сохранить свою историю,
              необходимо войти в систему через Google
            </p>
            <SignInButton />
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
