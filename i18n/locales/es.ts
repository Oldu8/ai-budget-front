// Spanish translations.
export const es = {
  home: {
    title: 'AI Budget',
    description: 'Esta es la pantalla de inicio. Aquí puedes ver tu presupuesto y tus operaciones.',
  },
  add: {
    title: 'Agregar operación',
    description: 'Esta es la pantalla para agregar una operación. Aquí aparecerá un formulario más adelante.',
  },
  profile: {
    title: 'Perfil',
    description: 'Esta es la pantalla de perfil. Aquí aparecerán más adelante los ajustes de la cuenta.',
    logout: 'Cerrar sesión',
  },
  nav: {
    home: 'Inicio',
    add: 'Añadir',
    profile: 'Perfil',
  },
  buttons: {
    save: 'Guardar',
    cancel: 'Cancelar',
    addOperation: 'Agregar operación',
  },
  auth: {
    loginTitle: 'Iniciar sesión',
    signupTitle: 'Crear cuenta',
    emailLabel: 'Correo electrónico',
    passwordLabel: 'Contraseña',
    emailPlaceholder: 'tu@ejemplo.com',
    passwordPlaceholder: '••••••••',
    loginButton: 'Iniciar sesión',
    signupButton: 'Crear cuenta',
    toSignup: 'Crear cuenta',
    toLogin: '¿Ya tienes cuenta? Iniciar sesión',
    error: {
      invalidCredentials: 'Correo o contraseña incorrectos.',
      emailTaken: 'Este correo ya está registrado.',
      weakPassword: 'La contraseña es demasiado débil.',
      network: 'Error de red. Comprueba tu conexión.',
      generic: 'Algo ha ido mal. Inténtalo de nuevo.',
    },
  },
} as const;

