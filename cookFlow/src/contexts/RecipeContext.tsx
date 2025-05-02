import React, { createContext, useContext, ReactNode } from 'react';
import { useRecipes, Recipe } from '../hooks/useRecipes';

// Interface para o contexto
interface RecipeContextData {
  recipes: Recipe[];
  allRecipes: Recipe[];
  categories: string[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
  filterByCategory: (category: string) => void;
  searchRecipes: (query: string) => void;
  refreshRecipes: () => Promise<void>;
}

// Criando o contexto
const RecipeContext = createContext<RecipeContextData>({} as RecipeContextData);

// Props para o provider
interface RecipeProviderProps {
  children: ReactNode;
}

// Provider component
export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  const recipeData = useRecipes();

  return (
    <RecipeContext.Provider value={recipeData}>
      {children}
    </RecipeContext.Provider>
  );
};

// Hook para usar o contexto
export function useRecipeContext(): RecipeContextData {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }

  return context;
}