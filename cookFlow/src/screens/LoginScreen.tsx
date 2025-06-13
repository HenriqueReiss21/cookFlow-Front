import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

// Define the navigation param list types
type RootStackParamList = {
  Login: undefined;
  Welcome: undefined;
  SignUp: undefined;
  ReceipeList: undefined;
};

// Define props interface for the component
interface LoginScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, isLoading, error, user } = useAuth();
  
  // Redirecionar se já estiver logado
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        console.log('User already logged in, redirecting to Welcome screen');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      }
      
      // Limpar mensagem de erro ao entrar na tela
      setErrorMessage(null);
    }, [user, navigation])
  );

  const handleLogin = async () => {
    // Limpar mensagens de erro anteriores
    setErrorMessage(null);
    
    // Validação básica de formulário
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor insira seu email e senha.');
      return;
    }

    try {
      console.log('Attempting login with:', email, password);
      const success = await signIn(email, password);
      
      console.log('Login result:', success, 'Error:', error);
      
      if (success) {
        console.log('Login successful, navigating to Welcome screen');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      } else {
        console.log('Login failed, showing error');
        setErrorMessage(error || 'Email ou senha inválidos. Por favor, tente novamente.');
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setErrorMessage('Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.');
    }
  };

  const handleNavigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/salada.png')} 
            style={styles.logo}
          />
          <Text style={styles.appName}>CookFlow</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Realize seu Login para continuar a cozinhar como um verdadeiro chef!</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Insira seu Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Insira sua Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Já possui uma conta? 
            </Text>
            <TouchableOpacity onPress={handleNavigateToSignUp}>
              <Text style={styles.registerLink}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain'
  },
  appName: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f96163'
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3c444c',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24
  },
  inputContainer: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3c444c',
    marginBottom: 8
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8f8f8'
  },
  loginButton: {
    backgroundColor: '#f96163',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  registerText: {
    color: '#666',
    fontSize: 14
  },
  registerLink: {
    color: '#f96163',
    fontSize: 14,
    fontWeight: '600'
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center'
  }
});

export default LoginScreen;