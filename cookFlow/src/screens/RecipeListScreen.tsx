import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import SearchFilter from '../components/SearchFilter';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRecipes } from '../hooks/useRecipes';

// Define o tipo para a navegação
type RootStackParamList = {
  Login: undefined;
  Welcome: undefined;
  ReceipeList: undefined;
  RecipeDetail: { recipeId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RecipeListScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const { recipes, allRecipes, loading, error, refreshRecipes } = useRecipes();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleLogout = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshRecipes();
    setRefreshing(false);
  }, [refreshRecipes]);

  // Extrair categorias únicas das receitas
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set((allRecipes || recipes).map(recipe => recipe.category).filter(Boolean))
    );
    return ['All', ...uniqueCategories];
  }, [allRecipes, recipes]);

  // Filtrar receitas por categoria
  const filteredRecipes = useMemo(() => {
    const recipesToFilter = allRecipes || recipes;
    if (selectedCategory === 'All') {
      return recipesToFilter;
    }
    return recipesToFilter.filter(recipe => recipe.category === selectedCategory);
  }, [allRecipes, recipes, selectedCategory]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  // Componente CategoriesFilter integrado
  const CategoriesFilterComponent = () => (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category, index) => {
          const isSelected = category === selectedCategory;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryItem,
                isSelected && styles.selectedCategory
              ]}
              onPress={() => handleCategoryFilter(category)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  isSelected && styles.selectedCategoryText
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{ flex: 1, marginHorizontal: 16 }}>
          {/* Área superior com saudação e botão de logout */}
          <View style={styles.topContainer}>
            <Header headerText={`Olá, ${user?.name || 'User'}`} headerIcon="user" />
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <FontAwesome name="sign-out" size={24} color="#f96163" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <SearchFilter icon="search" placeholder="Insira sua receita favorita" />

          {/* Categories filter */}
          <View style={{ marginTop: 22 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Categories</Text>
            <CategoriesFilterComponent />
          </View>

          {/* Recipes List */}
          <View style={{ marginTop: 22, flex: 1 }}>
            <View style={styles.recipesHeader}>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Recipes</Text>
              {selectedCategory && selectedCategory !== 'All' && (
                <Text style={styles.filterIndicator}>
                  Filtrado por: {selectedCategory} ({filteredRecipes.length} receitas)
                </Text>
              )}
            </View>
            
            {error && (
              <View style={styles.centered}>
                <FontAwesome name="exclamation-circle" size={40} color="#f96163" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refreshRecipes}>
                  <Text style={styles.retryText}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {loading && (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color="#f96163" />
                <Text>Carregando receitas...</Text>
              </View>
            )}
            
            {!loading && !error && filteredRecipes.length === 0 && (
              <View style={styles.centered}>
                <Text style={styles.noRecipesText}>
                  {selectedCategory && selectedCategory !== 'All' 
                    ? `Nenhuma receita encontrada para a categoria "${selectedCategory}"`
                    : 'Nenhuma receita encontrada'
                  }
                </Text>
              </View>
            )}
            
            {!loading && !error && filteredRecipes.length > 0 && (
              <RecipeCard recipes={filteredRecipes} />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipeListScreen;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  logoutText: {
    color: '#f96163',
    fontWeight: '600',
    marginLeft: 5,
  },
  recipesHeader: {
    marginBottom: 10,
  },
  filterIndicator: {
    fontSize: 14,
    color: '#f96163',
    fontWeight: '500',
    marginTop: 4,
  },
  categoriesContainer: {
    paddingVertical: 15,
  },
  categoryItem: {
    marginRight: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  selectedCategory: {
    backgroundColor: '#f96163',
  },
  categoryText: {
    fontWeight: '500',
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: 200,
  },
  errorText: {
    color: '#f96163',
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#f96163',
    padding: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  noRecipesText: {
    fontSize: 16,
    color: '#606060',
    textAlign: 'center',
  },
});