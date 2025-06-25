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
