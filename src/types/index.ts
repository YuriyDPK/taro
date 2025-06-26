export type TarotCard = {
  id: number;
  name: string;
  image: string;
  description: string;
  meaning: {
    upright: string;
    reversed: string;
  };
  isReversed?: boolean;
};

export type ReadingType = "love" | "career" | "spiritual" | "general";

export type TarotReading = {
  id: string;
  date: string;
  type: ReadingType;
  question?: string;
  cards: TarotCard[];
  notes?: string;
  gptResponse?: string;
  spreadType: string;
};

export type TarotSpread = {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: {
    id: number;
    name: string;
    description: string;
  }[];
};

export type TarotCardDeck = {
  id: string;
  name: string;
  image: string;
  meaning: {
    upright: string;
    reversed: string;
  };
  isReversed?: boolean;
};

export type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
};

export type TarotSpreadType = {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  category: ReadingType;
  positions: Array<{
    id: number;
    name: string;
    description: string;
    x: number;
    y: number;
  }>;
};

// Типы для базы данных
export type DbTarotReading = {
  id: string;
  userId: string;
  spreadType: string;
  question?: string | null;
  category: string;
  cards: any; // JSON
  createdAt: Date;
  updatedAt: Date;
  messages: DbChatMessage[];
};

export type DbChatMessage = {
  id: string;
  userId: string;
  readingId: string;
  content: string;
  isUser: boolean;
  createdAt: Date;
};

export type DbUser = {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  isPremium: boolean;
  premiumExpiry?: Date | null;
  lastReadingAt?: Date | null;
  readingsCount: number;
  createdAt: Date;
  updatedAt: Date;
};
