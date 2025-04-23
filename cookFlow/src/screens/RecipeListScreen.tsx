import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import SearchFilter from '../components/SearchFilter';
import CategoriesFilter from '../components/CategoriesFilter';
import RecipeCard from '../components/RecipeCard';

const RecipeListScreen: React.FC = () => {
    return (
        <SafeAreaView style={{ flex: 1, marginHorizontal: 16 }}>
            {/* render header */}
            <Header headerText={"Hi, John"} headerIcon='bell-o'/>
            <SearchFilter icon="search" placeholder="Enter your favorite recipe"/>
            
            {/*Categories filter*/}
            <View style={{ marginTop: 22 }}>   
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Categories</Text>
                <CategoriesFilter />                                                                            
            </View>

             {/*Recepes List filter*/}
            <View style={{ marginTop: 22 }}>   
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Recipes</Text>                                    
                {/*Recepes List*/}

                <RecipeCard />                                               
            </View>


        </SafeAreaView>
    );
};

export default RecipeListScreen;

const styles = StyleSheet.create({});