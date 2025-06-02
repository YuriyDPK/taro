import { useState } from "react";
import { TarotSpread } from "../types";

interface SpreadSelectorProps {
  spreads: TarotSpread[];
  onSelect: (spread: TarotSpread) => void;
}

export default function SpreadSelector({
  spreads,
  onSelect,
}: SpreadSelectorProps) {
  const [selectedSpreadId, setSelectedSpreadId] = useState<string | null>(null);
  const [readingType, setReadingType] = useState<string>("love");
  const [question, setQuestion] = useState<string>("");

  const handleSubmit = () => {
    const selectedSpread = spreads.find((s) => s.id === selectedSpreadId);
    if (selectedSpread) {
      onSelect(selectedSpread);
    }
  };

  return (
    <div className="bg-linear-to-br from-purple-950/50 to-indigo-900/30 backdrop-blur-md rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-cinzel font-bold text-white mb-6 text-center">
        Выберите тип расклада
      </h2>

      <div className="mb-6">
        <label className="text-white font-cinzel mb-2 block">
          Тип вопроса:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {["любовь", "карьера", "духовность", "общее"].map((type, index) => (
            <button
              key={index}
              className={`py-3 px-4 rounded-lg transition-all ${
                readingType ===
                ["love", "career", "spiritual", "general"][index]
                  ? "bg-purple-700 text-white"
                  : "bg-purple-900/50 text-white/70 hover:bg-purple-800/70"
              }`}
              onClick={() =>
                setReadingType(
                  ["love", "career", "spiritual", "general"][index]
                )
              }
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="question" className="text-white font-cinzel mb-2 block">
          Ваш вопрос (необязательно):
        </label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full py-3 px-4 rounded-lg bg-purple-950/70 text-white border border-purple-700/50 focus:border-purple-500 focus:outline-hidden"
          placeholder="Введите свой вопрос для расклада..."
        />
      </div>

      <div className="mb-8">
        <label className="text-white font-cinzel mb-2 block">
          Выберите расклад:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spreads.map((spread) => (
            <div
              key={spread.id}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedSpreadId === spread.id
                  ? "border-purple-500 bg-purple-900/50"
                  : "border-purple-800/30 bg-purple-950/30 hover:bg-purple-900/30"
              }`}
              onClick={() => setSelectedSpreadId(spread.id)}
            >
              <h3 className="text-xl font-cinzel font-bold text-white mb-2">
                {spread.name}
              </h3>
              <p className="text-white/70 text-sm mb-2">{spread.description}</p>
              <p className="text-purple-300 text-sm">{spread.cardCount} карт</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedSpreadId}
          className={`px-8 py-3 rounded-full font-cinzel text-white ${
            selectedSpreadId
              ? "bg-purple-600 hover:bg-purple-500"
              : "bg-purple-900/50 cursor-not-allowed"
          }`}
        >
          Начать расклад
        </button>
      </div>
    </div>
  );
}
