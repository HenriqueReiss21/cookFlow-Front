import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useRecipes } from '../hooks/useRecipes';

const CategoriesFilter: React.FC = () => {
  const { categories, selectedCategory, filterByCategory, loading } = useRecipes();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando categorias...</Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        {categories.map((category, index) => {
          const isSelected = category === selectedCategory;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryItem,
                isSelected && styles.selectedCategory
              ]}
              onPress={() => filterByCategory(category)}
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
};

export default CategoriesFilter;

const styles = StyleSheet.create({
  container: {
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
  loadingContainer: {
    paddingVertical: 15,
  }
});