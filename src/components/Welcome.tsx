import Image from "next/image";

interface WelcomeProps {
  onStartReading: () => void;
}

export default function Welcome({ onStartReading }: WelcomeProps) {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-ping" />
        <div className="relative flex items-center justify-center w-full h-full">
          <Image
            src="/images/tarot-icon.png"
            alt="Таро"
            width={120}
            height={120}
            className="float"
          />
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold text-white mb-4">
        <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-400 to-purple-400">
          Познай свою судьбу
        </span>
      </h1>

      <p className="text-xl text-white/80 max-w-2xl mb-8">
        Добро пожаловать в мир мистических карт Таро. Узнайте ответы на свои
        вопросы через древнее искусство гадания.
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <div className="flex flex-col items-center max-w-[280px] p-4 bg-purple-950/30 rounded-xl backdrop-blur-sm">
          <div className="w-16 h-16 mb-3 flex items-center justify-center text-3xl rounded-full bg-purple-800/50">
            🔮
          </div>
          <h3 className="text-lg font-cinzel font-bold text-white mb-2">
            Точные расклады
          </h3>
          <p className="text-white/70 text-sm">
            Различные типы раскладов для разных жизненных ситуаций
          </p>
        </div>

        <div className="flex flex-col items-center max-w-[280px] p-4 bg-purple-950/30 rounded-xl backdrop-blur-sm">
          <div className="w-16 h-16 mb-3 flex items-center justify-center text-3xl rounded-full bg-purple-800/50">
            ✨
          </div>
          <h3 className="text-lg font-cinzel font-bold text-white mb-2">
            Детальные значения
          </h3>
          <p className="text-white/70 text-sm">
            Полные интерпретации карт в прямом и перевернутом положении
          </p>
        </div>

        <div className="flex flex-col items-center max-w-[280px] p-4 bg-purple-950/30 rounded-xl backdrop-blur-sm">
          <div className="w-16 h-16 mb-3 flex items-center justify-center text-3xl rounded-full bg-purple-800/50">
            📚
          </div>
          <h3 className="text-lg font-cinzel font-bold text-white mb-2">
            История раскладов
          </h3>
          <p className="text-white/70 text-sm">
            Сохраняйте и возвращайтесь к своим предыдущим раскладам
          </p>
        </div>
      </div>

      <button
        onClick={onStartReading}
        className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-cinzel rounded-full text-lg hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all shadow-lg"
      >
        Начать новый расклад
      </button>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[0, 1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="relative w-[120px] h-[200px] rounded-lg overflow-hidden mx-auto float"
            style={{
              animationDelay: `${idx * 0.2}s`,
              transform: `rotate(${idx % 2 === 0 ? 5 : -5}deg)`,
            }}
          >
            <Image
              src={`/cards/card-${idx}.jpg`}
              alt={`Карта Таро ${idx}`}
              fill
              className="object-cover tarot-glow"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
