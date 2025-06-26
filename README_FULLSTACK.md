# 🌟 Fullstack Таро Приложение

Это fullstack приложение для гадания на картах Таро с базой данных MySQL, Google OAuth авторизацией и премиум функциями.

## 🚀 Быстрый запуск

### 1. Запуск базы данных

```bash
# Запустить MySQL и phpMyAdmin
docker-compose up -d

# Применить схему базы данных
npx prisma db push

# Генерировать Prisma клиент
npx prisma generate
```

### 2. Настройка OAuth

Следуйте инструкциям в `SETUP_OAUTH.md` для настройки Google OAuth.

### 3. Переменные окружения

Скопируйте `file_env.txt` в `.env.local` и обновите:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET` (сгенерируйте: `openssl rand -base64 32`)

### 4. Запуск приложения

```bash
npm run dev
```

## 📊 Доступы

- **Приложение**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
  - Пользователь: `taro_user`
  - Пароль: `taro_password_123`
- **Prisma Studio**: `npx prisma studio`

## ✨ Возможности

### Для всех пользователей:

- Вход через Google OAuth
- 1 расклад каждые 5 минут
- 1 сообщение в чате каждые 5 минут на расклад
- Сохранение истории в базе данных

### Premium пользователи:

- Неограниченные расклады
- Неограниченные сообщения в чате
- Статус отображается в профиле

## 🗄️ Структура базы данных

- **users** - пользователи с Premium статусом
- **tarot_readings** - сохраненные расклады
- **chat_messages** - сообщения в чатах
- **accounts/sessions** - NextAuth.js данные
- **rate_limits** - ограничения по времени

## 🛠️ API Endpoints

- `GET/POST /api/readings` - расклады
- `POST /api/messages` - сообщения в чат
- `/api/auth/[...nextauth]` - аутентификация

Все API защищены авторизацией и проверяют лимиты для не-Premium пользователей.
