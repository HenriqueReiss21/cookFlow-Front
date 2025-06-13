import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Recipe } from '../hooks/useRecipes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define o tipo para a navegação
type RootStackParamList = {
  Login: undefined;
  Welcome: undefined;
  ReceipeList: undefined;
  RecipeDetail: { recipeId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RecipeCardProps {
  recipes: Recipe[];
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipes }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleRecipePress = (recipe: Recipe) => {
  if (!recipe?._id) {
    console.error('Receita inválida ou sem ID:', recipe);
    return;
  }
  console.log('Navegando para RecipeDetail com _id:', recipe._id);
  navigation.navigate('RecipeDetail', { recipeId: recipe._id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleRecipePress(item)}
            style={styles.card}
          >
            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.cardDetails}>
                {/* Removido rating e calories devido à inconsistência com ApiRecipe */}
                <View style={styles.detailItem}>
                  <FontAwesome name="clock-o" size={14} color="#f96163" />
                  <Text style={styles.detailText}>{item.time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <FontAwesome
                    name="circle"
                    size={14}
                    color={
                      item.difficulty === 'Fácil'
                        ? '#4CAF50' // Verde
                        : item.difficulty === 'Mediano'
                        ? '#FF9800' // Laranja
                        : item.difficulty === 'Difícil'
                        ? '#F44336' // Vermelho
                        : '#FFD700' // Amarelo (padrão)
                    }
                  />
                  <Text style={styles.detailText}>{item.difficulty}</Text>
                </View>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
};

export default RecipeCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
    marginBottom: 4,
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
});