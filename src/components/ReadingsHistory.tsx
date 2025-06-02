import { useState } from "react";
import { TarotReading } from "../types";
import TarotCard from "./TarotCard";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ReadingsHistoryProps {
  readings: TarotReading[];
  onViewReading: (reading: TarotReading) => void;
}

export default function ReadingsHistory({
  readings,
  onViewReading,
}: ReadingsHistoryProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredReadings =
    filter === "all"
      ? readings
      : readings.filter((reading) => reading.type === filter);

  const getReadingTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      love: "Любовь",
      career: "Карьера",
      spiritual: "Духовность",
      general: "Общее",
    };
    return types[type] || "Неизвестно";
  };

  return (
    <div className="bg-gradient-to-br from-purple-950/50 to-indigo-900/30 backdrop-blur-md rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-cinzel font-bold text-white mb-6 text-center">
        История раскладов
      </h2>

      <div className="flex justify-center mb-6 gap-2">
        <button
          className={`px-4 py-2 rounded-lg transition-all ${
            filter === "all"
              ? "bg-purple-700 text-white"
              : "bg-purple-900/50 text-white/70 hover:bg-purple-800/70"
          }`}
          onClick={() => setFilter("all")}
        >
          Все
        </button>
        {["love", "career", "spiritual", "general"].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === type
                ? "bg-purple-700 text-white"
                : "bg-purple-900/50 text-white/70 hover:bg-purple-800/70"
            }`}
            onClick={() => setFilter(type)}
          >
            {getReadingTypeLabel(type)}
          </button>
        ))}
      </div>

      {filteredReadings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/70">Еще нет сохраненных раскладов.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReadings.map((reading) => (
            <div
              key={reading.id}
              className="bg-purple-950/50 rounded-xl p-4 cursor-pointer hover:bg-purple-900/50 transition-all"
              onClick={() => onViewReading(reading)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-purple-300 text-sm">
                    {format(new Date(reading.date), "PP", { locale: ru })}
                  </span>
                  <h3 className="text-lg font-cinzel font-bold text-white">
                    {getReadingTypeLabel(reading.type)}
                  </h3>
                  {reading.question && (
                    <p className="text-white/90 italic mt-1">
                      "{reading.question}"
                    </p>
                  )}
                </div>
                <span className="bg-purple-700/50 text-white text-xs px-2 py-1 rounded-full">
                  {reading.cards.length} карт
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
                {reading.cards.map((card, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0"
                    style={{ width: "80px" }}
                  >
                    <div className="relative w-[80px] h-[120px] rounded-lg overflow-hidden shadow-md">
                      <img
                        src={card.image}
                        alt={card.name}
                        className={`h-full w-full object-cover ${
                          card.isReversed ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
