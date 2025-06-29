"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black/60 backdrop-blur-sm border-t border-purple-400/30 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Информация о сервисе */}
          <div>
            <h3 className="text-xl font-medium text-white mb-4">
              🔮 Асхат Таро
            </h3>
            <p className="text-white/70 mb-4 text-sm">
              Наш ИИ-ассистент обучен на традиционных значениях карт Таро и
              мнениях опытных практиков. Это современный инструмент для
              размышлений и самопознания.
            </p>
            <p className="text-white/60 text-xs">
              Результаты носят информационный и развлекательный характер. Не
              являются профессиональной консультацией.
            </p>
          </div>

          {/* Контактная информация */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Контакты</h3>
            <div className="space-y-2 text-sm text-white/70">
              <div>
                <span className="text-purple-300">📧 Email:</span>{" "}
                <a
                  href="mailto:pronagin2@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  pronagin2@gmail.com
                </a>
              </div>

              <div className="pt-2">
                <span className="text-purple-300">🌐 Сайт:</span>{" "}
                <span className="text-white">
                  <Link href="/">ashat-taro.ru</Link>
                </span>
              </div>
            </div>
          </div>

          {/* Юридическая информация */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Документы</h3>
            <div className="space-y-2">
              <Link
                href="/premium"
                className="block text-sm text-purple-300 hover:text-white transition-colors"
              >
                ✨ Премиум доступ
              </Link>
              <Link
                href="/terms"
                className="block text-sm text-purple-300 hover:text-white transition-colors"
              >
                📄 Пользовательское соглашение
              </Link>
              <Link
                href="/privacy"
                className="block text-sm text-purple-300 hover:text-white transition-colors"
              >
                🔒 Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="border-t border-purple-400/20 mt-8 pt-6 text-center">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Асхат Таро. Все права защищены.
          </p>
          <p className="text-white/50 text-xs mt-1">
            Сервис предоставляется самозанятым Пронягиным Ю.М. (ИНН:
            524926143433)
          </p>
        </div>
      </div>
    </footer>
  );
}
