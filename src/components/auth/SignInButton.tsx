"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import { UserDropdown } from "./UserDropdown";
import { AuthProviderSelector } from "./AuthProviderSelector";

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

  return <AuthProviderSelector />;
}
