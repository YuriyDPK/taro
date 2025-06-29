"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { SignInButton } from "@/components/auth/SignInButton";
import { AuthModal } from "@/components/auth/AuthModal";

export const Header = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleHoroscopeClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      setShowAuthModal(true);
      closeMenu();
    }
  };

  return (
    <header className="relative z-40" role="banner">
      <div className="flex justify-between items-center  w-full xl:mx-auto p-4 px-8 xl:px-0 gap-4 ">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-2xl md:text-3xl lg:text-[38px] text-white font-light hover:text-white/90 transition-colors"
            onClick={closeMenu}
            aria-label="Главная страница - Асхат Таро"
          >
            Асхат
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden xl:flex items-center gap-10"
          role="navigation"
          aria-label="Основное меню"
        >
          <Link
            href="/spreads"
            className="text-[20px] text-white font-light hover:text-white/90 transition-colors"
            aria-label="Перейти к раскладам Таро"
          >
            Расклады
          </Link>
          <Link
            href="/horoscope"
            onClick={handleHoroscopeClick}
            className="text-[20px] text-white font-light hover:text-white/90 transition-colors"
            aria-label="Гороскопы и совместимость знаков"
          >
            Гороскопы
          </Link>
          <Link
            href="/history"
            className="text-[20px] text-white font-light hover:text-white/90 transition-colors"
            aria-label="Посмотреть историю раскладов"
          >
            История раскладов
          </Link>
          <Link
            href="/support"
            className="text-[20px] text-white font-light hover:text-white/90 transition-colors"
            aria-label="Техническая поддержка"
          >
            Поддержка
          </Link>
          <Link
            href="/donations"
            className="text-[20px] text-white font-light hover:text-white/90 transition-colors"
            aria-label="Поддержать проект"
          >
            Благодарность
          </Link>
          <Link
            href="/premium"
            className="text-[20px] bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-light hover:from-yellow-300 hover:to-orange-300 transition-colors"
            aria-label="Получить Premium доступ"
          >
            ✨ Premium
          </Link>
          <SignInButton />
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="xl:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div
          className="xl:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Мобильное меню"
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-4 border-b border-purple-400/30">
              <Link
                href="/"
                className="text-2xl text-white font-light hover:text-white/90 transition-colors"
                onClick={closeMenu}
                aria-label="Главная страница - Асхат Таро"
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
            <nav
              className="flex flex-col gap-6 p-6 flex-1"
              role="navigation"
              aria-label="Мобильное меню"
            >
              <Link
                href="/spreads"
                className="text-2xl text-white font-light hover:text-purple-300 transition-colors border-b border-purple-400/30 pb-4"
                onClick={closeMenu}
                aria-label="Перейти к раскладам Таро"
              >
                🔮 Расклады
              </Link>
              <Link
                href="/horoscope"
                className="text-2xl text-white font-light hover:text-purple-300 transition-colors border-b border-purple-400/30 pb-4"
                onClick={(e) => {
                  handleHoroscopeClick(e);
                  closeMenu();
                }}
                aria-label="Гороскопы и совместимость знаков"
              >
                ✨ Гороскопы {!session && "🔒"}
              </Link>
              <Link
                href="/history"
                className="text-2xl text-white font-light hover:text-purple-300 transition-colors border-b border-purple-400/30 pb-4"
                onClick={closeMenu}
                aria-label="Посмотреть историю раскладов"
              >
                📜 История раскладов
              </Link>
              <Link
                href="/support"
                className="text-2xl text-white font-light hover:text-purple-300 transition-colors border-b border-purple-400/30 pb-4"
                onClick={closeMenu}
                aria-label="Техническая поддержка"
              >
                🛠️ Поддержка
              </Link>
              <Link
                href="/premium"
                className="text-2xl bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-light hover:from-yellow-300 hover:to-orange-300 transition-colors border-b border-purple-400/30 pb-4"
                onClick={closeMenu}
                aria-label="Получить Premium доступ"
              >
                ✨ Premium доступ
              </Link>
              <Link
                href="/donations"
                className="text-2xl text-white font-light hover:text-purple-300 transition-colors border-b border-purple-400/30 pb-4"
                onClick={closeMenu}
                aria-label="Поддержать проект"
              >
                💝 Благодарность
              </Link>

              {/* Auth кнопка под пунктами меню */}
              <div className="border-b border-purple-400/30 pb-4">
                <SignInButton onClose={closeMenu} />
              </div>
            </nav>

            {/* Footer text in mobile menu */}
            <footer className="p-6 text-center text-white/60 text-sm border-t border-purple-400/30">
              Мудрость карт всегда с вами
            </footer>
          </div>
        </div>
      )}

      {/* Модальное окно авторизации */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
};
