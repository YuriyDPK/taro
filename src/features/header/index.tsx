"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SignInButton } from "@/components/auth/SignInButton";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="relative z-40">
      <div className="flex justify-between items-center lg:w-[80%] mx-auto p-4 px-8 lg:px-0 gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-2xl md:text-3xl lg:text-[38px] text-white font-light hover:text-white/90 transition-colors"
            onClick={closeMenu}
          >
            Асхат
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link
            href="/spreads"
            className="text-[26px] text-white font-light hover:text-white/90 transition-colors"
          >
            Расклады
          </Link>
          <Link
            href="/history"
            className="text-[26px] text-white font-light hover:text-white/90 transition-colors"
          >
            История раскладов
          </Link>
          <Link
            href="/donations"
            className="text-[26px] text-white font-light hover:text-white/90 transition-colors"
          >
            Благодарность
          </Link>
          <SignInButton />
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Открыть меню"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-4 border-b border-purple-400/30">
              <Link
                href="/"
                className="text-2xl text-white font-light hover:text-white/90 transition-colors"
                onClick={closeMenu}
              >
                Асхат
              </Link>
              <button
                onClick={closeMenu}
                className="text-white p-2 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Закрыть меню"
              >
                <X size={28} />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <nav className="flex flex-col gap-6 p-6 flex-1">
              <Link
                href="/spreads"
                className="text-2xl text-white font-light hover:text-purple-300 transition-colors border-b border-purple-400/30 pb-4"
                onClick={closeMenu}
              >
                🔮 Расклады
              </Link>
              <Link
                href="/history"
                className="text-2xl text-white font-light hover:text-purple-300 transition-colors border-b border-purple-400/30 pb-4"
                onClick={closeMenu}
              >
                📜 История раскладов
              </Link>
              <Link
                href="/donations"
                className="text-2xl text-white font-light hover:text-purple-300 transition-colors border-b border-purple-400/30 pb-4"
                onClick={closeMenu}
              >
                💝 Благодарность
              </Link>

              {/* Auth кнопка под пунктами меню */}
              <div className="border-b border-purple-400/30 pb-4">
                <SignInButton onClose={closeMenu} />
              </div>
            </nav>

            {/* Footer text in mobile menu */}
            <div className="p-6 text-center text-white/60 text-sm border-t border-purple-400/30">
              Мудрость карт всегда с вами
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
