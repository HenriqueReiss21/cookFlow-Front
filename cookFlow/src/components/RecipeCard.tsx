import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRecipes } from '../hooks/useRecipes';
import { FontAwesome } from '@expo/vector-icons';

// Define o tipo para a navegação
type RootStackParamList = {
  RecipeDetail: { recipeId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RecipeCard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recipes, loading, error } = useRecipes();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f96163" />
        <Text>Carregando receitas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <FontAwesome name="exclamation-circle" size={40} color="#f96163" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noRecipesText}>Nenhuma receita encontrada</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('RecipeDetail', { recipeId: item.id });
            }}
            style={styles.card}
          >
            <Image
              source={item.image}
              style={styles.cardImage}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.cardDetails}>
                <View style={styles.detailItem}>
                  <FontAwesome name="star" size={14} color="#FFD700" />
                  <Text style={styles.detailText}>{item.rating}</Text>
                </View>
                <View style={styles.detailItem}>
                  <FontAwesome name="clock-o" size={14} color="#f96163" />
                  <Text style={styles.detailText}>{item.time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <FontAwesome name="fire" size={14} color="#FF8C00" />
                  <Text style={styles.detailText}>{item.calories}</Text>
                </View>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
};

export default RecipeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: 120,
    height: 120,
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    position: 'relative',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3c444c',
    marginBottom: 6,
  },
  cardDetails: {
    flexDirection: 'row',
    marginTop: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#606060',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#f96163',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
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
  },
});