"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import { UserDropdown } from "./UserDropdown";

export function SignInButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button
        size="sm"
        className="bg-black/40 border border-purple-400/30 text-purple-300"
        disabled
      >
        Загрузка...
      </Button>
    );
  }

  if (session?.user) {
    return <UserDropdown />;
  }

  return (
    <Button
      onClick={() => signIn("google")}
      size="sm"
      className="bg-black/40 border border-purple-400/30 text-purple-300 hover:text-white"
    >
      Войти через Google
    </Button>
  );
}
