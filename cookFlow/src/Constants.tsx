// Arquivo de constantes para o aplicativo CookFlow

// URL base da API - substitua pelo endereço real da sua API
// Para dispositivos físicos, use seu IP local ou uma URL de produção
export const API_BASE_URL = 'https://cookflow-back.onrender.com';

// Cores do tema
export const COLORS = {
  primary: '#000000',
  secondary: '#3b82f6',
  background: '#f9fafb',
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
};

// Constantes de navegação
export const SCREENS = {
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  RECIPE_LIST: 'RecipeList',
  RECIPE_DETAILS: 'RecipeDetails',
  PROFILE: 'Profile',
  FAVORITES: 'Favorites',
  SETTINGS: 'Settings',
};

// Tamanhos padrão
export const SIZES = {
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  font: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

// Categorias de receitas
export const RECIPE_CATEGORIES = [
  { id: 'all', name: 'Todas' },
  { id: 'breakfast', name: 'Café da Manhã' },
  { id: 'lunch', name: 'Almoço' },
  { id: 'dinner', name: 'Jantar' },
  { id: 'dessert', name: 'Sobremesas' },
  { id: 'vegetarian', name: 'Vegetarianas' },
  { id: 'vegan', name: 'Veganas' },
  { id: 'drinks', name: 'Bebidas' },
];

// Textos comuns do aplicativo
export const TEXTS = {
  APP_NAME: 'CookFlow',
  APP_SLOGAN: 'Receitas deliciosas ao seu alcance',
  WELCOME_TEXT: 'Bem-vindo ao CookFlow',
  WELCOME_DESCRIPTION: 'O lugar perfeito para descobrir novas receitas',
  LOGIN_BUTTON: 'Entrar',
  REGISTER_BUTTON: 'Cadastrar',
  ERROR_MESSAGES: {
    INVALID_EMAIL: 'Por favor, insira um email válido',
    INVALID_PASSWORD: 'A senha deve ter pelo menos 6 caracteres',
    PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
    REQUIRED_FIELD: 'Este campo é obrigatório',
    CONNECTION_ERROR: 'Erro ao conectar com o servidor',
  },
};