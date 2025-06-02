# Таро - Познай свою судьбу

Интерактивный сайт для проведения раскладов карт Таро с красивыми анимациями и сохранением истории.

## Особенности

- Красивый мистический дизайн с анимациями
- Интерактивные карты с эффектом переворачивания
- Различные типы раскладов (три карты, кельтский крест, любовный расклад)
- Детальное описание значений карт в прямом и перевернутом положении
- Сохранение истории раскладов в браузере
- Возможность просмотра ранее сделанных раскладов
- Информация о картах и раскладах Таро

## Технологии

- React
- Next.js 15
- TypeScript
- Tailwind CSS
- LocalStorage для сохранения данных

## Установка и запуск

1. Клонируйте репозиторий:

```bash
git clone https://github.com/your-username/taro.git
cd taro
```

2. Установите зависимости:

```bash
npm install
```

3. Запустите приложение в режиме разработки:

```bash
npm run dev
```

4. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Подготовка изображений

Для полноценной работы приложения потребуются изображения карт Таро:

1. Поместите изображения карт в папку `public/cards/`
2. Поместите фоновое изображение и иконку в папку `public/images/`

Примеры имен файлов для карт:

- `/cards/fool.jpg` - Шут
- `/cards/magician.jpg` - Маг
- `/cards/high-priestess.jpg` - Верховная Жрица
- `/cards/empress.jpg` - Императрица
- `/cards/emperor.jpg` - Император
- `/cards/back.jpg` - Рубашка карты

## Компоненты приложения

- **Navbar**: Навигационное меню
- **Welcome**: Приветственный экран
- **SpreadSelector**: Выбор типа расклада
- **TarotTable**: Интерактивный стол для расклада карт
- **TarotCard**: Компонент карты с анимацией
- **CardDetails**: Детальная информация о карте
- **ReadingsHistory**: История раскладов
- **TarotInfo**: Информация о Таро

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
