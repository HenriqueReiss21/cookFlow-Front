import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import WelcomeScreen from "../screens/WelcomeScreen";
import RecipeListScreen from "../screens/RecipeListScreen";
import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { useAuth } from '../contexts/AuthContext';
import { RecipeProvider } from "../contexts/RecipeContext";

// Define the navigation param list types
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Welcome: undefined;
  ReceipeList: undefined;
  RecipeDetail: { recipeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  console.log('AppNavigator - Auth state:', { user, isLoading });

  // Adicionar useEffect para monitorar mudanças no estado de autenticação
  useEffect(() => {
    console.log('Auth state changed:', { user, isLoading });
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f96163" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
      >
        {!user ? (
          // Auth routes
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          // App routes
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="ReceipeList">
              {() => (
                <RecipeProvider>
                  <RecipeListScreen />
                </RecipeProvider>
              )}
            </Stack.Screen>
            <Stack.Screen name="RecipeDetail">
              {(props) => (
                <RecipeProvider>
                  <RecipeDetailsScreen {...props} />
                </RecipeProvider>
              )}
          </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#f96163'
  }
});