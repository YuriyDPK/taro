# 🤖 Настройка Telegram авторизации

## 📋 Шаги для настройки Telegram бота @TaroAshatEmpressBot

### 1. **Получение Bot Token от @BotFather**

1. Откройте Telegram и найдите бота **@BotFather**
2. Отправьте команду `/start`
3. Отправьте команду `/newbot`
4. Введите имя бота: `TaroAshatEmpress`
5. Введите username бота: `TaroAshatEmpressBot`
6. Скопируйте полученный **Bot Token** (формат: `123456789:ABCdefGhIJKlmNoPQRSTUVwxyZ`)

### 2. **Настройка домена для Telegram Login Widget**

**🚨 КРИТИЧЕСКИ ВАЖНО для работы авторизации!**

1. Отправьте боту @BotFather команду `/setdomain`
2. Выберите ваш бот `@TaroAshatEmpressBot`
3. Введите ваш домен:
   - Для локальной разработки: `localhost`
   - Для localtunnel: `free-cobras-act.loca.lt`
   - Для продакшена: `yourdomain.com` (без https://)

**Примеры настройки домена:**

```
/setdomain
@TaroAshatEmpressBot
free-cobras-act.loca.lt
```

⚠️ **Без настройки домена авторизация будет возвращать 401 ошибку!**

### 3. **Добавление Bot Token в переменные окружения**

Добавьте в ваш `.env.local` файл:

```bash
# Telegram OAuth
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRSTUVwxyZ
```

Замените `123456789:ABCdefGhIJKlmNoPQRSTUVwxyZ` на ваш реальный токен.

### 4. **Проверка настройки**

1. Запустите приложение: `npm run dev`
2. Откройте http://localhost:3000
3. Нажмите кнопку "Войти"
4. Выберите "Telegram" в выпадающем меню
5. Должна открыться модалка с Telegram Login Widget

## 🔧 Команды для @BotFather

```
/start - начать работу с BotFather
/newbot - создать нового бота
/setdomain - установить домен для Telegram Login Widget
/setdescription - установить описание бота
/setabouttext - установить текст "О боте"
/setuserpic - установить аватар бота
```

## 📝 Рекомендуемые настройки бота

### Описание бота:

```
🔮 Добро пожаловать в мир Таро!

Императрица Асхат поможет вам раскрыть тайны карт и получить мудрые советы. Авторизуйтесь через этого бота для доступа к:

✨ Личным раскладам Таро
💬 Общению с гадалкой Асхат
📚 Истории ваших раскладов
🎯 Персональным толкованиям

Начните свое духовное путешествие прямо сейчас!
```

### О боте:

```
Официальный бот сайта Императрица для авторизации пользователей и доступа к раскладам Таро.
```

## 🛡️ Безопасность

- Bot Token должен быть секретным и не должен попадать в git
- Используйте переменные окружения для хранения токена
- Telegram Login Widget автоматически проверяет подлинность данных
- Дополнительная проверка происходит на сервере через HMAC

## 🚀 Команды для деплоя

### Локальная разработка:

```bash
# 1. Получите Bot Token от @BotFather
# 2. Добавьте токен в .env.local
echo "TELEGRAM_BOT_TOKEN=your-bot-token" >> .env.local

# 3. Перезапустите приложение
npm run dev
```

### Продакшн:

```bash
# 1. Настройте домен в @BotFather
# 2. Добавьте токен в переменные окружения сервера
export TELEGRAM_BOT_TOKEN="your-bot-token"

# 3. Перезапустите приложение
pm2 restart taro-app
```

## 🔍 Отладка

### Если Telegram авторизация не работает:

1. **Проверьте Bot Token:**

   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe
   ```

2. **Проверьте домен в @BotFather:**

   - Отправьте `/setdomain` боту @BotFather
   - Убедитесь что домен указан корректно

3. **Проверьте консоль браузера:**

   - Откройте DevTools → Console
   - Должны быть логи "Telegram auth data:"

4. **Проверьте серверные логи:**
   ```bash
   pm2 logs taro-app
   ```

## 📱 Тестирование

1. Откройте приложение в браузере
2. Нажмите "Войти" → "Telegram"
3. В модалке должен появиться Telegram Login Widget
4. Нажмите "Log in with Telegram"
5. Подтвердите авторизацию в Telegram
6. Вы должны быть авторизованы в приложении

## ⚠️ Известные ограничения

- Telegram не предоставляет email пользователя
- Используется синтетический email формата `{user_id}@telegram.user`
- Telegram Login Widget работает только с зарегистрированными доменами
- Для localhost нужно специально настроить домен в @BotFather
