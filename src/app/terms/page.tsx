"use client";

import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-white mb-4">
              📄 Пользовательское соглашение (оферта)
            </h1>
            <p className="text-white/70">
              Условия использования сайта и приобретения услуг
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                1. Общие положения
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>1.1.</strong> Настоящее Соглашение (оферта) определяет
                  условия использования сайта{" "}
                  <span className="text-purple-300">
                    https://ashat-taro.ru/
                  </span>{" "}
                  и приобретения платного доступа к материалам и услугам.
                </p>
                <p>
                  <strong>1.2.</strong> Исполнителем является самозанятый
                  гражданин РФ:
                  <span className="text-white">
                    {" "}
                    Пронягин Юрий Максимович, ИНН 524926143433
                  </span>
                  .
                </p>
                <p>
                  <strong>1.3.</strong> Пользуясь сайтом и оформляя платный
                  доступ, Пользователь подтверждает согласие с условиями данного
                  Соглашения.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                2. Услуга
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>2.1.</strong> Исполнитель предоставляет Пользователю
                  доступ к онлайн-раскладам карт Таро с использованием
                  алгоритмов и технологий искусственного интеллекта.
                </p>
                <p>
                  <strong>2.2.</strong> Услуги носят информационный,
                  развлекательный и познавательный характер.
                </p>
                <p>
                  <strong>2.3.</strong> Услуги не являются медицинской,
                  юридической, финансовой или иной профессиональной
                  консультацией.
                </p>
                <div className="bg-purple-900/20 border border-purple-400/20 rounded-lg p-4 mt-4">
                  <p className="text-purple-300">
                    <strong>Важно:</strong> Наш ИИ-ассистент обучен на
                    традиционных значениях карт Таро и мнениях опытных
                    практиков. Это современный инструмент для размышлений и
                    самопознания.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                3. Оплата и возвраты
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>3.1.</strong> Стоимость доступа указывается на сайте.
                </p>
                <p>
                  <strong>3.2.</strong> Оплата осуществляется через платёжные
                  системы.
                </p>
                <p>
                  <strong>3.3.</strong> Услуга считается оказанной в момент
                  предоставления доступа к разделам сайта.
                </p>
                <p>
                  <strong>3.4.</strong> Возврат денежных средств после
                  предоставления доступа не производится.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                4. Ограничение ответственности
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>4.1.</strong> Результаты раскладов являются
                  сгенерированными алгоритмом на основе традиционных значений
                  карт Таро и предназначены для самопознания и размышлений.
                </p>
                <p>
                  <strong>4.2.</strong> Исполнитель не несёт ответственности за
                  решения, принятые Пользователем на основе материалов сайта.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                5. Персональные данные
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>5.1.</strong> Все данные обрабатываются в соответствии
                  с
                  <Link
                    href="/privacy"
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    Политикой конфиденциальности
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">
                6. Заключительные положения
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>6.1.</strong> Применяется законодательство Российской
                  Федерации.
                </p>
                <p>
                  <strong>6.2.</strong> Все споры решаются в досудебном порядке,
                  в случае невозможности — в судебных органах по месту
                  регистрации Исполнителя.
                </p>
              </div>
            </section>

            <div className="border-t border-purple-400/20 pt-6 mt-8">
              <div className="text-center space-y-2">
                <p className="text-white/60 text-sm">
                  Исполнитель: ИП Пронягин Юрий Максимович
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

          <div className="text-center mt-8">
            <Link
              href="/premium"
              className="text-purple-300 hover:text-white transition-colors"
            >
              ← Вернуться к выбору тарифа
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
