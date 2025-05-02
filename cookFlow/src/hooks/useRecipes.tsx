import { useState, useEffect } from 'react';
import axios from 'axios';

// Interface para os dados que vêm da API
export interface ApiRecipe {
  _id: string;
  imagem: string;
  titulo: string;
  categoria: string;
  ingredientes: string[];
  passos: {
    numero: number;
    descricao: string;
    animacao: string;
    tipo: string;
  }[];
  tempoPreparo: string;
  descricao: string;
  dificuldade: string;
  porcoes: number;
}

// Interface para o formato que o app espera
export interface Recipe {
  id: string;
  name: string;
  image: any;
  rating: string;
  ingredients: string[];
  steps: string[];
  time: string;
  difficulty: string;
  calories: string;
  category: string;
  description: string;
}

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Função para buscar receitas da API
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      // Substitua pela URL correta da sua API
      const response = await axios.get<ApiRecipe[]>('https://192.168.15.2:3000/receitas');
      
      // Transformar os dados da API para o formato esperado pelo app
      const transformedRecipes: Recipe[] = response.data.map(recipe => ({
        id: recipe._id,
        name: recipe.titulo,
        image: { uri: recipe.imagem }, // Usando URI para imagens
        rating: "4.5", // Valor padrão se não existir na API
        ingredients: recipe.ingredientes,
        steps: recipe.passos.map(passo => passo.descricao),
        time: recipe.tempoPreparo,
        difficulty: recipe.dificuldade,
        calories: `${recipe.porcoes * 100} cal`, // Calculado com base nas porções
        category: recipe.categoria,
        description: recipe.descricao
      }));
      
      // Extrair categorias únicas para o filtro
      const uniqueCategories = ['All', ...new Set(transformedRecipes.map(recipe => recipe.category))];
      
      setRecipes(transformedRecipes);
      setFilteredRecipes(transformedRecipes);
      setCategories(uniqueCategories);
      setError(null);
    } catch (err) {
      setError(
        axios.isAxiosError(err) 
          ? err.message 
          : 'Erro desconhecido ao buscar receitas'
      );
      console.error('Erro ao buscar receitas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para filtrar receitas por categoria
  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe => recipe.category === category);
      setFilteredRecipes(filtered);
    }
  };

  // Função para pesquisar receitas por nome
  const searchRecipes = (query: string) => {
    if (!query.trim()) {
      // Se a pesquisa estiver vazia, voltar à filtragem por categoria
      filterByCategory(selectedCategory);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const searchResults = recipes.filter(recipe => {
      // Filtrar por categoria (se não for 'All') e por texto de pesquisa
      const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
      const matchesSearch = recipe.name.toLowerCase().includes(lowerCaseQuery) || 
                           recipe.description.toLowerCase().includes(lowerCaseQuery);
      
      return matchesCategory && matchesSearch;
    });
    
    setFilteredRecipes(searchResults);
  };

  // Carregar receitas quando o componente montar
  useEffect(() => {
    fetchRecipes();
  }, []);

  return { 
    recipes: filteredRecipes, 
    allRecipes: recipes,
    categories,
    selectedCategory,
    loading, 
    error,
    filterByCategory,
    searchRecipes,
    refreshRecipes: fetchRecipes
  };
};