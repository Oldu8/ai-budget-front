export const en = {
  home: {
    title: 'AI Budget',
    description: 'This is the home screen. Here you can see your budget and your operations.',
  },
  add: {
    title: 'Add operation',
    description: 'This is the screen for adding an operation. Here a form will appear later.',
  },
  profile: {
    title: 'Profile',
    description: 'This is the profile screen. Here settings of account will appear later.',
    logout: 'Sign out',
  },
  nav: {
    home: 'Home',
    add: 'Add',
    profile: 'Profile',
  },
  buttons: {
    save: 'Save',
    cancel: 'Cancel',
    addOperation: 'Add operation',
  },
  auth: {
    loginTitle: 'Sign in',
    signupTitle: 'Create account',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: '••••••••',
    loginButton: 'Sign in',
    signupButton: 'Create account',
    toSignup: 'Create account',
    toLogin: 'Already have an account? Sign in',
    error: {
      invalidCredentials: 'Invalid email or password.',
      emailTaken: 'This email is already registered.',
      weakPassword: 'Password is too weak.',
      network: 'Network error. Check your connection.',
      generic: 'Something went wrong. Please try again.',
    },
  },
} as const;

