"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import { UserDropdown } from "./UserDropdown";
import { AuthProviderSelector } from "./AuthProviderSelector";

export function SignInButton({
  onClose,
  onCloseMenu,
}: {
  onClose?: () => void;
  onCloseMenu?: () => void;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button
        size="default"
        className="bg-black/40 border border-purple-400/30 text-white/70 px-6 py-2 text-base"
        disabled
      >
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Загрузка...
        </div>
      </Button>
    );
  }

  if (session?.user) {
    return <UserDropdown onCloseMenu={onCloseMenu || (() => {})} />;
  }

  return <AuthProviderSelector onClose={onClose} onCloseMenu={onCloseMenu} />;
}
