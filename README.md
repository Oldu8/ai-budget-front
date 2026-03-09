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

## Internationalization (i18n) & Vocabulary

- **Библиотеки**: используется `i18next` + `react-i18next`. Английский (`en`) — язык по умолчанию и fallback.
- **Где лежат словари**:
  - `i18n/index.ts` — инициализация i18n, экспорт `setLanguage` (на будущее).
  - `i18n/locales/en.ts` — основной словарь (английский, всегда заполняется первым).
  - `i18n/locales/es.ts` — испанский (ключи совпадают с `en`, значения пока дублируют английский).
  - `i18n/locales/uk.ts` — украинский (аналогично).
- **Подключение в приложение**:
  - В `app/_layout.tsx` импортируется `@/i18n`, поэтому словарь доступен во всём дереве React.

### Как добавить новый текст в словарь

1. **Придумай ключ** в формате `section.subsection.name`, например:
   - `home.title`, `home.description`
   - `add.title`, `add.description`
   - `nav.home`, `buttons.save` и т.д.
2. **Добавь ключ в английский словарь** `i18n/locales/en.ts`:
   ```ts
   export const en = {
     home: {
       title: 'AI Budget',
       description: 'This is the home screen. Here you can see your budget and your operations.',
     },
     // ...
   } as const;
   ```
3. **Продублируй ключи** в `i18n/locales/es.ts` и `i18n/locales/uk.ts` (можно временно оставить английский текст и пометить TODO для переводов).

### Как использовать словарь в компоненте

1. Импортируй хук `useTranslation`:
   ```ts
   import { useTranslation } from 'react-i18next';
   ```
2. Получи функцию `t` внутри компонента:
   ```ts
   const { t } = useTranslation();
   ```
3. Используй ключи вместо хардкода:
   ```tsx
   <ThemedText type="title">
     {t('home.title')}
   </ThemedText>
   <ThemedText>
     {t('home.description')}
   </ThemedText>
   ```

### Правила

- **Все пользовательские тексты** (заголовки экранов, описания, подписи на кнопках, навигация и т.д.) должны идти **через словарь**, а не как захардкоженные строки.
- **Английский словарь (`en`) — источник истины**: сначала добавляем ключ туда, затем синхронизируем `es` и `uk`.
