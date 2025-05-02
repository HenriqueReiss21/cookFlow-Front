import axios from 'axios';

// Base URL da API local
const API_BASE_URL = 'http://192.168.15.2:3000'; // Use este para Android Emulator
// Para iOS Simulator, use: 'http://localhost:3000'
// Para dispositivos reais em desenvolvimento, use seu IP local: 'http://{seu-ip}:3000'

// InstÃ¢ncia do axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Endpoints para as receitas
export const recipeApi = {
  // Buscar todas as receitas
  getAll: async () => {
    try {
      const response = await api.get('/receitas');
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },

  // Buscar receita por ID
  getById: async (id: string) => {
    try {
      const response = await api.get(`/receitas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error);
      throw error;
    }
  },

  // Buscar receitas por categoria
  getByCategory: async (category: string) => {
    try {
      const response = await api.get(`/receitas`, {
        params: { category }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipes by category ${category}:`, error);
      throw error;
    }
  },

  // Pesquisar receitas
  search: async (query: string) => {
    try {
      const response = await api.get(`/receitas`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching recipes with query "${query}":`, error);
      throw error;
    }
  },
};

// Endpoints para categorias
export const categoryApi = {
  // Buscar todas as categorias
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};

export default api;