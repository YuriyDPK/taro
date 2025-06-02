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
