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
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Define the navigation param list types
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Welcome: undefined;
};

// Define props interface for the component
interface SignUpScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { signIn } = useAuth();

  const validateForm = (): boolean => {
    // Reset error message
    setErrorMessage(null);
    
    // Name validation
    if (!name.trim()) {
      setErrorMessage('Por favor insira seu nome');
      return false;
    }
    
    // Email validation
    if (!email.trim()) {
      setErrorMessage('Por favor insira seu email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor insira seu nome');
      return false;
    }
    
    // Password validation
    if (!password.trim()) {
      setErrorMessage('Por favor insira uma senha');
      return false;
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return false;
    }
    
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Configurar URL base para diferentes ambientes
      const baseURL = 'https://cookflow-back.onrender.com'; // ajuste conforme necessário
      
      // Register user with the API
      const response = await axios.post(`${baseURL}/users`, {
        name,
        email,
        password
      });
      
      console.log('Registro realizado com sucesso:', response.data);
      
      // Diminuir o loading antes de mostrar o alerta
      setIsLoading(false);
      
      // Tentar redirecionar diretamente primeiro - antes do alerta
      console.log('Tentando redirecionar para a tela de Login...');
      
      // Usar setTimeout para garantir que a navegação aconteça após a renderização atual
      setTimeout(() => {
        navigation.navigate('Login');
      }, 100);
      
      // Show success message
      Alert.alert(
        'Registro realizado com Sucesso!',
        'Sua conta foi criada com sucesso! Você agora pode realizar o Login',
        [
          { 
            text: 'OK', 
            onPress: () => {
              console.log('Alert OK pressed, navigating to Login again');
              // Forçar navegação novamente quando o alerta for fechado
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } 
          }
        ]
      );
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error responses
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          setErrorMessage(errorData.message || 'Erro na validação. Por favor, cheque as suas informações.');
        } else if (status === 409) {
          setErrorMessage('Esse email já foi cadastrado. Por favor, use outro email.');
        } else {
          setErrorMessage('Falha no registro. Por favor, tente novamente.');
        }
      } else if (error.request) {
        setErrorMessage('Não foi possivel conectar com o servidor. Por favor, cheque sua internet.');
      } else {
        setErrorMessage('Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Crie sua conta para entrar em nossa comunidade de Cozinha</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Insira seu nome completo"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Insira seu email"
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
              placeholder="Crie uma senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity 
            style={styles.signUpButton} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>Criar Con</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Já possui uma conta?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}> Sign in</Text>
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
    marginBottom: 30
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
    marginBottom: 16
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
  signUpButton: {
    backgroundColor: '#f96163',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  loginText: {
    color: '#666',
    fontSize: 14
  },
  loginLink: {
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

export default SignUpScreen;