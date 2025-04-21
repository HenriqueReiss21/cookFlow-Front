import React from "react";
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import WelcomeScreen from "../screens/WelcomeScreen";
import RecipeListScreen from "../screens/ReceipeListScreen";

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false}}>
                <Stack.Screen name="Welcome" component={WelcomeScreen}/>
                <Stack.Screen name="ReceipeList" component={RecipeListScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;

const styles = StyleSheet.create({})