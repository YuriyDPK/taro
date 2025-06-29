export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: "fire" | "earth" | "air" | "water";
  quality: "cardinal" | "fixed" | "mutable";
  rulingPlanet: string;
  dateRange: string;
  emoji: string;
  colors: string[];
  luckyNumbers: number[];
  traits: {
    positive: string[];
    negative: string[];
  };
  description: string;
  compatibility: {
    best: string[];
    good: string[];
    challenging: string[];
  };
}

export const zodiacSigns: ZodiacSign[] = [
  {
    id: "aries",
    name: "Овен",
    symbol: "♈",
    element: "fire",
    quality: "cardinal",
    rulingPlanet: "Марс",
    dateRange: "21 марта - 19 апреля",
    emoji: "🐏",
    colors: ["#FF6B6B", "#FF4757", "#FF3838"],
    luckyNumbers: [1, 8, 17],
    traits: {
      positive: ["Энергичный", "Смелый", "Лидер", "Инициативный", "Честный"],
      negative: ["Импульсивный", "Нетерпеливый", "Агрессивный", "Эгоистичный"],
    },
    description:
      "Овен - первый знак зодиака, символизирующий новые начинания и энергию. Люди этого знака отличаются смелостью, решительностью и стремлением к лидерству.",
    compatibility: {
      best: ["leo", "sagittarius", "gemini"],
      good: ["aquarius", "libra"],
      challenging: ["cancer", "capricorn"],
    },
  },
  {
    id: "taurus",
    name: "Телец",
    symbol: "♉",
    element: "earth",
    quality: "fixed",
    rulingPlanet: "Венера",
    dateRange: "20 апреля - 20 мая",
    emoji: "🐂",
    colors: ["#2ECC71", "#27AE60", "#16A085"],
    luckyNumbers: [2, 6, 9, 12, 24],
    traits: {
      positive: [
        "Надежный",
        "Практичный",
        "Терпеливый",
        "Стабильный",
        "Чувственный",
      ],
      negative: ["Упрямый", "Материалистичный", "Ленивый", "Ревнивый"],
    },
    description:
      "Телец ценит стабильность, комфорт и красоту. Это знак, который стремится к материальной безопасности и наслаждается жизненными удовольствиями.",
    compatibility: {
      best: ["virgo", "capricorn", "cancer"],
      good: ["pisces", "scorpio"],
      challenging: ["leo", "aquarius"],
    },
  },
  {
    id: "gemini",
    name: "Близнецы",
    symbol: "♊",
    element: "air",
    quality: "mutable",
    rulingPlanet: "Меркурий",
    dateRange: "21 мая - 20 июня",
    emoji: "👥",
    colors: ["#F39C12", "#E67E22", "#D35400"],
    luckyNumbers: [5, 7, 14, 23],
    traits: {
      positive: [
        "Умный",
        "Общительный",
        "Адаптивный",
        "Любознательный",
        "Остроумный",
      ],
      negative: ["Непостоянный", "Поверхностный", "Нервный", "Нерешительный"],
    },
    description:
      "Близнецы - знак общения и интеллекта. Они любят учиться, общаться и постоянно находятся в поиске новой информации и впечатлений.",
    compatibility: {
      best: ["libra", "aquarius", "aries"],
      good: ["leo", "sagittarius"],
      challenging: ["virgo", "pisces"],
    },
  },
  {
    id: "cancer",
    name: "Рак",
    symbol: "♋",
    element: "water",
    quality: "cardinal",
    rulingPlanet: "Луна",
    dateRange: "21 июня - 22 июля",
    emoji: "🦀",
    colors: ["#3498DB", "#2980B9", "#1ABC9C"],
    luckyNumbers: [2, 7, 11, 16, 20, 25],
    traits: {
      positive: [
        "Заботливый",
        "Интуитивный",
        "Эмоциональный",
        "Защитный",
        "Семейный",
      ],
      negative: [
        "Капризный",
        "Пессимистичный",
        "Подозрительный",
        "Манипулятивный",
      ],
    },
    description:
      "Рак - самый эмоциональный и интуитивный знак. Семья и дом для них имеют первостепенное значение, они прекрасные защитники и заботливые люди.",
    compatibility: {
      best: ["scorpio", "pisces", "taurus"],
      good: ["virgo", "capricorn"],
      challenging: ["aries", "libra"],
    },
  },
  {
    id: "leo",
    name: "Лев",
    symbol: "♌",
    element: "fire",
    quality: "fixed",
    rulingPlanet: "Солнце",
    dateRange: "23 июля - 22 августа",
    emoji: "🦁",
    colors: ["#F1C40F", "#F39C12", "#E67E22"],
    luckyNumbers: [1, 3, 10, 19],
    traits: {
      positive: [
        "Щедрый",
        "Творческий",
        "Уверенный",
        "Лояльный",
        "Драматичный",
      ],
      negative: ["Эгоцентричный", "Высокомерный", "Ленивый", "Упрямый"],
    },
    description:
      "Лев - король зодиака, любит быть в центре внимания. Это творческий, щедрый и гордый знак, который стремится к признанию и восхищению.",
    compatibility: {
      best: ["aries", "sagittarius", "gemini"],
      good: ["libra", "aquarius"],
      challenging: ["taurus", "scorpio"],
    },
  },
  {
    id: "virgo",
    name: "Дева",
    symbol: "♍",
    element: "earth",
    quality: "mutable",
    rulingPlanet: "Меркурий",
    dateRange: "23 августа - 22 сентября",
    emoji: "👩",
    colors: ["#95A5A6", "#7F8C8D", "#34495E"],
    luckyNumbers: [3, 15, 6, 27],
    traits: {
      positive: [
        "Аналитичный",
        "Практичный",
        "Трудолюбивый",
        "Надежный",
        "Скромный",
      ],
      negative: ["Критичный", "Перфекционист", "Беспокойный", "Застенчивый"],
    },
    description:
      "Дева - знак служения и совершенства. Они внимательны к деталям, практичны и всегда стремятся помочь другим, улучшить себя и окружающий мир.",
    compatibility: {
      best: ["taurus", "capricorn", "cancer"],
      good: ["scorpio", "pisces"],
      challenging: ["gemini", "sagittarius"],
    },
  },
  {
    id: "libra",
    name: "Весы",
    symbol: "♎",
    element: "air",
    quality: "cardinal",
    rulingPlanet: "Венера",
    dateRange: "23 сентября - 22 октября",
    emoji: "⚖️",
    colors: ["#E91E63", "#9B59B6", "#8E44AD"],
    luckyNumbers: [4, 6, 13, 15, 24],
    traits: {
      positive: [
        "Справедливый",
        "Дипломатичный",
        "Социальный",
        "Миролюбивый",
        "Элегантный",
      ],
      negative: [
        "Нерешительный",
        "Поверхностный",
        "Ленивый",
        "Избегающий конфликтов",
      ],
    },
    description:
      "Весы стремятся к гармонии и справедливости во всем. Они прекрасные дипломаты, ценят красоту и всегда ищут баланс в отношениях.",
    compatibility: {
      best: ["gemini", "aquarius", "leo"],
      good: ["aries", "sagittarius"],
      challenging: ["cancer", "capricorn"],
    },
  },
  {
    id: "scorpio",
    name: "Скорпион",
    symbol: "♏",
    element: "water",
    quality: "fixed",
    rulingPlanet: "Плутон",
    dateRange: "23 октября - 21 ноября",
    emoji: "🦂",
    colors: ["#E74C3C", "#C0392B", "#8E44AD"],
    luckyNumbers: [8, 11, 18, 22],
    traits: {
      positive: [
        "Страстный",
        "Решительный",
        "Интуитивный",
        "Лояльный",
        "Магнетичный",
      ],
      negative: ["Ревнивый", "Мстительный", "Скрытный", "Обидчивый"],
    },
    description:
      "Скорпион - самый интенсивный знак зодиака. Они обладают сильной интуицией, страстностью и способностью к трансформации.",
    compatibility: {
      best: ["cancer", "pisces", "virgo"],
      good: ["taurus", "capricorn"],
      challenging: ["leo", "aquarius"],
    },
  },
  {
    id: "sagittarius",
    name: "Стрелец",
    symbol: "♐",
    element: "fire",
    quality: "mutable",
    rulingPlanet: "Юпитер",
    dateRange: "22 ноября - 21 декабря",
    emoji: "🏹",
    colors: ["#9B59B6", "#8E44AD", "#3498DB"],
    luckyNumbers: [3, 9, 15, 21, 27],
    traits: {
      positive: [
        "Оптимистичный",
        "Философский",
        "Авантюрный",
        "Честный",
        "Щедрый",
      ],
      negative: [
        "Нетактичный",
        "Безответственный",
        "Нетерпеливый",
        "Поверхностный",
      ],
    },
    description:
      "Стрелец - знак путешествий и философии. Они любят свободу, приключения и постоянно стремятся расширить свои горизонты.",
    compatibility: {
      best: ["aries", "leo", "libra"],
      good: ["gemini", "aquarius"],
      challenging: ["virgo", "pisces"],
    },
  },
  {
    id: "capricorn",
    name: "Козерог",
    symbol: "♑",
    element: "earth",
    quality: "cardinal",
    rulingPlanet: "Сатурн",
    dateRange: "22 декабря - 19 января",
    emoji: "🐐",
    colors: ["#2C3E50", "#34495E", "#7F8C8D"],
    luckyNumbers: [6, 9, 8, 26],
    traits: {
      positive: [
        "Амбициозный",
        "Дисциплинированный",
        "Ответственный",
        "Практичный",
        "Терпеливый",
      ],
      negative: ["Пессимистичный", "Упрямый", "Скупой", "Фаталистичный"],
    },
    description:
      "Козерог - знак достижений и ответственности. Они целеустремленны, практичны и готовы упорно работать для достижения своих целей.",
    compatibility: {
      best: ["taurus", "virgo", "scorpio"],
      good: ["cancer", "pisces"],
      challenging: ["aries", "libra"],
    },
  },
  {
    id: "aquarius",
    name: "Водолей",
    symbol: "♒",
    element: "air",
    quality: "fixed",
    rulingPlanet: "Уран",
    dateRange: "20 января - 18 февраля",
    emoji: "🏺",
    colors: ["#1ABC9C", "#16A085", "#3498DB"],
    luckyNumbers: [4, 7, 11, 22, 29],
    traits: {
      positive: [
        "Независимый",
        "Оригинальный",
        "Гуманный",
        "Интеллектуальный",
        "Дружелюбный",
      ],
      negative: ["Отстраненный", "Упрямый", "Непредсказуемый", "Бунтарский"],
    },
    description:
      "Водолей - знак инноваций и гуманности. Они независимы, оригинальны и всегда стремятся сделать мир лучше.",
    compatibility: {
      best: ["gemini", "libra", "sagittarius"],
      good: ["aries", "leo"],
      challenging: ["taurus", "scorpio"],
    },
  },
  {
    id: "pisces",
    name: "Рыбы",
    symbol: "♓",
    element: "water",
    quality: "mutable",
    rulingPlanet: "Нептун",
    dateRange: "19 февраля - 20 марта",
    emoji: "🐟",
    colors: ["#9B59B6", "#8E44AD", "#3498DB"],
    luckyNumbers: [3, 9, 12, 15, 18, 24],
    traits: {
      positive: [
        "Сочувствующий",
        "Интуитивный",
        "Творческий",
        "Мечтательный",
        "Духовный",
      ],
      negative: [
        "Эскапистский",
        "Нереалистичный",
        "Жертвенный",
        "Чрезмерно эмоциональный",
      ],
    },
    description:
      "Рыбы - самый интуитивный и духовный знак. Они обладают богатым воображением, глубокой эмпатией и художественными способностями.",
    compatibility: {
      best: ["cancer", "scorpio", "taurus"],
      good: ["virgo", "capricorn"],
      challenging: ["gemini", "sagittarius"],
    },
  },
];

export const getZodiacSignByDate = (date: Date): ZodiacSign | null => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
    return zodiacSigns[0]; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
    return zodiacSigns[1]; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
    return zodiacSigns[2]; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
    return zodiacSigns[3]; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
    return zodiacSigns[4]; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
    return zodiacSigns[5]; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
    return zodiacSigns[6]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return zodiacSigns[7]; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return zodiacSigns[8]; // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return zodiacSigns[9]; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return zodiacSigns[10]; // Aquarius
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
    return zodiacSigns[11]; // Pisces

  return null;
};

export const getElementColor = (element: string) => {
  switch (element) {
    case "fire":
      return "from-red-500 to-orange-500";
    case "earth":
      return "from-green-500 to-emerald-500";
    case "air":
      return "from-blue-500 to-cyan-500";
    case "water":
      return "from-purple-500 to-indigo-500";
    default:
      return "from-gray-500 to-slate-500";
  }
};
