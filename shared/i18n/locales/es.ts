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
  onboarding: {
    preferences: {
      title: 'Personaliza tu presupuesto',
      description:
        'Elige qué secciones quieres seguir. Puedes cambiarlo más tarde en Ajustes.',
      continue: 'Continuar',
      skip: 'Omitir por ahora',
      has_children: {
        title: 'Gastos de hijos',
        description: 'Sigue los gastos relacionados con tus hijos',
      },
      has_car: {
        title: 'Gastos de coche',
        description: 'Combustible, aparcamiento, mantenimiento y reparaciones',
      },
      pays_rent: {
        title: 'Alquiler',
        description: 'Pagos mensuales de alquiler',
      },
      insurance: {
        title: 'Seguros',
        description: 'Seguro de salud, coche, hogar',
      },
      has_insurance: {
        title: 'Seguros',
        description: 'Seguro de salud, coche, hogar',
      },
      loan: {
        title: 'Préstamos',
        description: 'Devolución de préstamos',
      },
      has_loans: {
        title: 'Préstamos',
        description: 'Devolución de préstamos',
      },
      mortgage: {
        title: 'Hipoteca',
        description: 'Pagos de hipoteca',
      },
      has_mortgage: {
        title: 'Hipoteca',
        description: 'Pagos de hipoteca',
      },
    },
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
