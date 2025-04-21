import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header';
import SearchFilter from '../components/SearchFilter';

const RecipeListScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, marginHorizontal: 16 }}>
            {/* render header */}
            <Header headerText={"Hi, John"} headerIcon='bell-o'/>
            <SearchFilter icon="search" placeholder="Enter your favorite recipe"/>
        </SafeAreaView>
    )
}
export default RecipeListScreen;

const styles = StyleSheet. create({});