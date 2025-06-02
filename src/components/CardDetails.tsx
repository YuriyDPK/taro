import Image from "next/image";
import { TarotCard as TarotCardType } from "../types";

interface CardDetailsProps {
  card: TarotCardType;
  onClose: () => void;
}

export default function CardDetails({ card, onClose }: CardDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-purple-950 to-black rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Изображение карты */}
          <div className="flex-shrink-0">
            <div className="relative w-[250px] h-[430px] rounded-xl overflow-hidden shadow-2xl mx-auto md:mx-0 tarot-glow">
              <Image
                src={card.image}
                alt={card.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Информация о карте */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-cinzel font-bold text-white">
                {card.name}
              </h2>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl text-purple-300 font-cinzel mb-2">
                  Описание
                </h3>
                <p className="text-white/90">{card.description}</p>
              </div>

              <div>
                <h3 className="text-xl text-purple-300 font-cinzel mb-2">
                  Значение в прямом положении
                </h3>
                <p className="text-white/90">{card.meaning.upright}</p>
              </div>

              <div>
                <h3 className="text-xl text-purple-300 font-cinzel mb-2">
                  Значение в перевернутом положении
                </h3>
                <p className="text-white/90">{card.meaning.reversed}</p>
              </div>

              <div>
                <h3 className="text-xl text-purple-300 font-cinzel mb-2">
                  Интерпретация в раскладе
                </h3>
                <p className="text-white/90">
                  {card.isReversed
                    ? `Карта появилась в перевернутом положении, что может указывать на ${card.meaning.reversed.toLowerCase()}.`
                    : `Карта появилась в прямом положении, что указывает на ${card.meaning.upright.toLowerCase()}.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
