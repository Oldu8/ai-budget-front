# AI Budget

Expo (React Native) проект.

## Запуск

```bash
npm install
npx expo start
```

## Переменные окружения (.env)

Expo подхватывает переменные с префиксом `EXPO_PUBLIC_` из файлов:

- **`.env`** — база (можно коммитить дефолты)
- **`.env.local`** — локальные переопределения (в .gitignore)
- **`.env.production`** — для прода (в .gitignore)

Скопируй `.env.example` в `.env` или `.env.local` и заполни значения. В коде используй `constants/env.ts`:

```ts
import { env } from '@/constants/env';

env.apiUrl;   // process.env.EXPO_PUBLIC_API_URL
env.appEnv;   // development | production
```

Для EAS Build переменные задаются в [EAS Environment Variables](https://docs.expo.dev/build-reference/variables/) или в `eas.json`.

## Точка входа и папка приложения

- **Точка входа**: в `package.json` указано `"main": "expo-router/entry"` — старт идёт из пакета expo-router, который монтирует роутинг по папке **app/**.
- **Сам апп** — это папка **`app/`**:
  - `app/_layout.tsx` — корневой layout (провайдеры, Stack).
  - `app/(tabs)/_layout.tsx` — табы (нижняя навигация).
  - `app/(tabs)/index.tsx` — главный экран, `app/(tabs)/explore.tsx` — второй таб.

Добавляй новые экраны как файлы в `app/` — маршруты появятся автоматически (file-based routing).

## Структура

- **app/** — экраны (file-based routing, expo-router)
- **components/** — переиспользуемые компоненты
- **constants/** — тема (светлая), env
- **hooks/** — useThemeColor
