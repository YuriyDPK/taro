import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const usePremium = () => {
  const { data: session } = useSession();

  const premiumStatus = useMemo(() => {
    if (!session?.user) {
      return {
        isPremium: false,
        isExpired: false,
        expiryDate: null,
        daysLeft: 0,
      };
    }

    const user = session.user;
    const isPremium = Boolean(user.isPremium);
    const expiryDate = user.premiumExpiry ? new Date(user.premiumExpiry) : null;
    const now = new Date();

    let isExpired = false;
    let daysLeft = 0;

    if (expiryDate) {
      isExpired = now > expiryDate;
      if (!isExpired) {
        const timeDiff = expiryDate.getTime() - now.getTime();
        daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      }
    }

    return {
      isPremium: isPremium && !isExpired,
      isExpired,
      expiryDate,
      daysLeft,
    };
  }, [session]);

  return premiumStatus;
};
