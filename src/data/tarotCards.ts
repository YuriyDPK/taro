import { TarotCard } from "../types";

// Данные для примера, позже можно будет дополнить полным набором карт
export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: "Шут",
    image: "/cards/fool.jpg",
    description:
      "Шут символизирует новые начинания, непосредственность и спонтанность.",
    meaning: {
      upright:
        "Новые начинания, спонтанность, беззаботность, свободный дух, невинность",
      reversed: "Безрассудство, риск, беспокойство, неосторожность",
    },
  },
  {
    id: 1,
    name: "Маг",
    image: "/cards/magician.jpg",
    description: "Маг олицетворяет проявление, творчество и силу воли.",
    meaning: {
      upright: "Проявление, творчество, сила воли, мастерство, вдохновение",
      reversed: "Обман, манипуляция, растрата талантов, упущенные возможности",
    },
  },
  {
    id: 2,
    name: "Верховная Жрица",
    image: "/cards/high-priestess.jpg",
    description:
      "Верховная Жрица представляет интуицию, таинственность и внутреннее знание.",
    meaning: {
      upright: "Интуиция, бессознательное, внутренняя мудрость, тайны",
      reversed:
        "Тайны, скрытые агендами, отрицание интуиции, подавленные чувства",
    },
  },
  {
    id: 3,
    name: "Императрица",
    image: "/cards/empress.jpg",
    description:
      "Императрица символизирует изобилие, плодородие и материнскую заботу.",
    meaning: {
      upright: "Изобилие, плодородие, материнство, природа, чувственность",
      reversed: "Блокированное творчество, зависимость, чрезмерная забота",
    },
  },
  {
    id: 4,
    name: "Император",
    image: "/cards/emperor.jpg",
    description: "Император олицетворяет структуру, авторитет и стабильность.",
    meaning: {
      upright: "Авторитет, структура, контроль, стабильность, отцовская фигура",
      reversed:
        "Чрезмерный контроль, жесткость, доминирование, отсутствие гибкости",
    },
  },
];

// Функция для случайного перемешивания колоды
export function shuffleDeck(deck: TarotCard[]): TarotCard[] {
  const shuffledDeck = [...deck];

  // Алгоритм Фишера-Йейтса для перемешивания
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];

    // Случайное определение, будет ли карта перевернутой
    shuffledDeck[i].isReversed = Math.random() > 0.7;
  }

  return shuffledDeck;
}

// Функция для вытягивания заданного количества карт из колоды
export function drawCards(deck: TarotCard[], count: number): TarotCard[] {
  const shuffled = shuffleDeck(deck);
  return shuffled.slice(0, count);
}
