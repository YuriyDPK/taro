# Настройка Google OAuth для приложения Таро

## 1. Создание Google OAuth приложения

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API:
   - Перейдите в "APIs & Services" → "Library"
   - Найдите "Google+ API" и включите его

## 2. Настройка OAuth 2.0

1. Перейдите в "APIs & Services" → "Credentials"
2. Нажмите "Create Credentials" → "OAuth 2.0 Client IDs"
3. Выберите тип приложения: "Web application"
4. Заполните поля:
   - **Name**: Taro App
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://yourdomain.com` (для продакшена)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://yourdomain.com/api/auth/callback/google` (для продакшена)

## 3. Получение учетных данных

После создания OAuth клиента вы получите:

- **Client ID** - добавьте в `GOOGLE_CLIENT_ID `
- **Client Secret** - добавьте в `GOOGLE_CLIENT_SECRET `

## 4. Обновление переменных окружения

Скопируйте `file_env.txt` в `.env.local` и обновите:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here

# NextAuth.js
NEXTAUTH_SECRET=generate-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## 5. Генерация NEXTAUTH_SECRET

Выполните в терминале:

```bash
openssl rand -base64 32
```

Или используйте онлайн генератор случайных строк.

## 6. Запуск базы данных

```bash
# Запустить Docker контейнеры
docker-compose up -d

# Применить миграции базы данных
npx prisma db push

# Просмотр базы данных (опционально)
npx prisma studio
```

## 7. Доступ к phpMyAdmin

После запуска Docker контейнеров:

- Адрес: http://localhost:8080
- Пользователь: `taro_user`
- Пароль: `taro_password_123`

## Готово!

Теперь пользователи смогут входить через Google и их данные будут сохраняться в базе данных.
