import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import SearchFilter from '../components/SearchFilter';
import CategoriesFilter from '../components/CategoriesFilter';
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
    const { loading, refreshRecipes } = useRecipes();
    const [refreshing, setRefreshing] = useState(false);
    
    const handleLogout = async () => {
        await signOut();
        // O redirecionamento será tratado pelo AppNavigator, mas podemos adicionar um fallback aqui
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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={{ flex: 1, marginHorizontal: 16 }}>
                    {/* Área superior com saudação e botão de logout */}
                    <View style={styles.topContainer}>
                        {/* render header com nome do usuário */}
                        <Header headerText={`Olá, ${user?.name +'  ' || 'User'}`} headerIcon='bell-o'/>
                        
                        {/* Botão de logout */}
                        <TouchableOpacity 
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <FontAwesome name="sign-out" size={24} color="#f96163" />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <SearchFilter icon="search" placeholder="Enter your favorite recipe"/>
                    
                    {/* Categories filter */}
                    <View style={{ marginTop: 22 }}>   
                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Categories</Text>
                        <CategoriesFilter />                                                                            
                    </View>

                    {/* Recipes List filter */}
                    <View style={{ marginTop: 22, flex: 1 }}>   
                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Recipes</Text>                                    
                        {/* Recipes List */}
                        <RecipeCard />                                               
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
        marginTop: 10
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
    }
});