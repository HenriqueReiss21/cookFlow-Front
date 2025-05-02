import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, LogBox } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import React, { useEffect } from 'react';
import { AuthProvider } from './src/contexts/AuthContext';

// Ignorar warnings específicos que podem atrapalhar o desenvolvimento
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'AsyncStorage has been extracted from react-native core'
]);

export default function App() {
  // Log para verificar se o App está sendo renderizado corretamente
  useEffect(() => {
    console.log('App initialized');
  }, []);

  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <AppNavigator />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});