"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { User } from "lucide-react";

interface AuthProviderSelectorProps {
  className?: string;
  onClose?: () => void;
}

export function AuthProviderSelector({
  className = "",
  onClose,
}: AuthProviderSelectorProps) {
  const router = useRouter();

  const handleSignIn = () => {
    if (onClose) {
      onClose();
    }
    router.push("/auth/signin");
  };

  return (
    <Button
      onClick={handleSignIn}
      size="entry"
      className={`bg-black/60 border border-purple-400/50 text-white hover:bg-purple-600/30 hover:border-purple-400 font-medium px-6 py-2 text-[14px] transition-all flex items-center gap-2 ${className}`}
    >
      <User size={24} color="white" />
      Войти
    </Button>
  );
}
