"use client";

import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-white mb-4">
              🔒 Политика конфиденциальности
            </h1>
            <p className="text-white/70">
              Порядок обработки и защиты персональных данных
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                1. Общие положения
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>1.1.</strong> Настоящая Политика определяет порядок
                  обработки и защиты персональных данных Пользователей сайта
                  <span className="text-purple-300">
                    {" "}
                    https://ashat-taro.ru/
                  </span>
                  .
                </p>
                <p>
                  <strong>1.2.</strong> Исполнителем и оператором персональных
                  данных является самозанятый гражданин РФ:
                  <span className="text-white">
                    {" "}
                    Пронягин Юрий Максимович, ИНН 524926143433
                  </span>
                  .
                </p>
                <p>
                  <strong>1.3.</strong> Цель Политики — защита прав и свобод
                  Пользователей при обработке их персональных данных.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                2. Какие данные собираются
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>2.1.</strong> При пользовании сайтом и оформлении
                  заказа могут собираться следующие данные:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>имя (или никнейм, если указан)</li>
                  <li>электронная почта</li>
                  <li>дата и время регистрации / входа</li>
                  <li>
                    сведения о транзакциях (дата, сумма, способ оплаты — без
                    реквизитов карт)
                  </li>
                  <li>
                    техническая информация (IP-адрес, cookie, данные браузера)
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                3. Цели обработки данных
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>3.1.</strong> Персональные данные обрабатываются для:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>регистрации и идентификации Пользователя</li>
                  <li>предоставления доступа к премиум-функциям</li>
                  <li>связи с Пользователем по вопросам обслуживания</li>
                  <li>
                    исполнения требований законодательства РФ (например,
                    налоговый учёт)
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                4. Хранение и защита данных
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>4.1.</strong> Данные хранятся в защищённых системах с
                  ограниченным доступом.
                </p>
                <p>
                  <strong>4.2.</strong> Данные не передаются третьим лицам, за
                  исключением:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>случаев, предусмотренных законодательством РФ</li>
                  <li>
                    случаев передачи данных платёжным системам для проведения
                    оплаты
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                5. Права Пользователя
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>5.1.</strong> Пользователь имеет право:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>запрашивать информацию об обработке своих данных</li>
                  <li>
                    требовать уточнения или удаления данных (если это не
                    противоречит закону РФ)
                  </li>
                </ul>
                <p className="mt-4">
                  Для реализации своих прав обращайтесь по адресу:
                  <a
                    href="mailto:pronagin2@gmail.com"
                    className="text-purple-300 hover:text-white transition-colors ml-1"
                  >
                    pronagin2@gmail.com
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                6. Использование cookie
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>6.1.</strong> Сайт может использовать cookie для
                  улучшения работы и анализа посещаемости.
                </p>
                <p>
                  <strong>6.2.</strong> Пользователь может отключить cookie в
                  настройках браузера.
                </p>
                <div className="bg-purple-900/20 border border-purple-400/20 rounded-lg p-4 mt-4">
                  <p className="text-purple-300">
                    <strong>Информация:</strong> При первом посещении сайта вы
                    увидите уведомление о использовании cookie-файлов, которое
                    можно закрыть.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                7. Заключительные положения
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>7.1.</strong> Настоящая Политика может быть изменена.
                  Новая редакция размещается на сайте.
                </p>
                <p>
                  <strong>7.2.</strong> Применяется законодательство Российской
                  Федерации.
                </p>
              </div>
            </section>

            <div className="border-t border-purple-400/20 pt-6 mt-8">
              <div className="text-center space-y-2">
                <p className="text-white/60 text-sm">
                  Оператор персональных данных: ИП Пронягин Юрий Максимович
                </p>
                <p className="text-white/60 text-sm">ИНН: 524926143433</p>
                <p className="text-white/60 text-sm">
                  Email: pronagin2@gmail.com
                </p>
                <p className="text-white/60 text-sm">
                  Дата последнего обновления:{" "}
                  {new Date().toLocaleDateString("ru-RU")}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 space-y-2">
            <Link
              href="/premium"
              className="block text-purple-300 hover:text-white transition-colors"
            >
              ← Вернуться к выбору тарифа
            </Link>
            <Link
              href="/terms"
              className="block text-purple-300 hover:text-white transition-colors"
            >
              📄 Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
