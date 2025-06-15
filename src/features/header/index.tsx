import { Roboto } from "next/font/google";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex justify-between items-center lg:w-[80%] mx-auto p-4">
      <div
        className={`flex items-center gap-2 text-[38px] text-white font-light `}
      >
        <Link
          href="/"
          className="text-[38px] text-white font-light hover:text-white/90"
        >
          Императрица
        </Link>
      </div>
      <nav className="flex items-center gap-10">
        <Link
          href="/"
          className="text-[26px] text-white font-light hover:text-white/90"
        >
          Расклады
        </Link>
        <Link
          href="/history"
          className="text-[26px] text-white font-light hover:text-white/90"
        >
          История раскладов
        </Link>
        <Link
          href="/donation"
          className="text-[26px] text-white font-light hover:text-white/90"
        >
          Благодарность
        </Link>
      </nav>
    </header>
  );
};
