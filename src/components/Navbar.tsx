import Link from "next/link";

interface NavbarProps {
  activeTab: "home" | "readings" | "info";
  onTabChange: (tab: "home" | "readings" | "info") => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <header className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Таро
            </span>
            <span className="ml-2 text-sm text-purple-300 uppercase tracking-wider">
              мистические карты
            </span>
          </h1>
        </div>

        <nav className="flex justify-center space-x-2">
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "home"
                ? "bg-purple-700 text-white"
                : "bg-purple-900/50 text-white/70 hover:bg-purple-800/70"
            }`}
            onClick={() => onTabChange("home")}
          >
            Главная
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "readings"
                ? "bg-purple-700 text-white"
                : "bg-purple-900/50 text-white/70 hover:bg-purple-800/70"
            }`}
            onClick={() => onTabChange("readings")}
          >
            История раскладов
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "info"
                ? "bg-purple-700 text-white"
                : "bg-purple-900/50 text-white/70 hover:bg-purple-800/70"
            }`}
            onClick={() => onTabChange("info")}
          >
            О Таро
          </button>
        </nav>
      </div>
    </header>
  );
}
