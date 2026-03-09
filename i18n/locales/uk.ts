// Ukrainian translations.
export const uk = {
  home: {
    title: 'AI Budget',
    description: 'Це головний екран. Тут ви можете побачити свій бюджет та свої операції.',
  },
  add: {
    title: 'Додати операцію',
    description: 'Це екран для додавання операції. Тут пізніше буде форма.',
  },
  profile: {
    title: 'Профіль',
    description: 'Це екран профілю. Тут пізніше будуть налаштування акаунта.',
    logout: 'Вийти',
  },
  nav: {
    home: 'Головна',
    add: 'Додати',
    profile: 'Профіль',
  },
  buttons: {
    save: 'Зберегти',
    cancel: 'Скасувати',
    addOperation: 'Додати операцію',
  },
  auth: {
    loginTitle: 'Увійти',
    signupTitle: 'Створити обліковий запис',
    emailLabel: 'Email',
    passwordLabel: 'Пароль',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: '••••••••',
    loginButton: 'Увійти',
    signupButton: 'Створити обліковий запис',
    toSignup: 'Створити обліковий запис',
    toLogin: 'Вже є обліковий запис? Увійти',
    error: {
      invalidCredentials: 'Невірний email або пароль.',
      emailTaken: 'Цей email вже зареєстровано.',
      weakPassword: 'Пароль занадто простий.',
      network: 'Помилка мережі. Перевірте зʼєднання.',
      generic: 'Щось пішло не так. Спробуйте ще раз.',
    },
  },
} as const;

