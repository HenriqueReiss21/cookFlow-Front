import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  error: string | null;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const loadStoredData = async () => {
      setIsLoading(true);
      
      try {
        console.log('Checking stored authentication data...');
        const storedUser = await AsyncStorage.getItem('@CookFlow:user');
        const storedToken = await AsyncStorage.getItem('@CookFlow:token');
        
        console.log('Stored data found:', { 
          hasUser: !!storedUser, 
          hasToken: !!storedToken 
        });
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log('User restored from storage:', userData);
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          // Garantir que o usuário seja explicitamente definido como null
          setUser(null);
          console.log('No stored user data found');
        }
      } catch (error) {
        console.error('Error loading stored authentication data:', error);
        // Em caso de erro, definir user como null explicitamente
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('Attempting login with:', { email, password });
      
      // Configurar URL base para diferentes ambientes
      // 10.0.2.2 para emulador Android, localhost para iOS, ou IP da sua máquina para dispositivo físico
      const baseURL = 'http://192.168.15.2:3000'; // ajuste conforme necessário
      
      // Authenticate with the API
      const response = await axios.post(`${baseURL}/auth/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      const { access_token } = response.data;
      
      if (access_token) {
        // Set token in axios headers for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        console.log('Token received, fetching user data');
        
        try {
          // Get user data
          const userResponse = await axios.get(`${baseURL}/users`);
          console.log('User data received:', userResponse.data);
          
          // Find current user from users list
          const currentUser = userResponse.data.find((u: User) => u.email === email);
          
          if (currentUser) {
            console.log('Current user found:', currentUser);
            // Store user data and token
            await AsyncStorage.setItem('@CookFlow:user', JSON.stringify(currentUser));
            await AsyncStorage.setItem('@CookFlow:token', access_token);
            
            // Importante: Atualizar o estado após o armazenamento
            setUser(currentUser);
            console.log('User state updated:', currentUser);
            return true;
          } else {
            console.error('User not found in response');
            setError('User not found in response data');
            return false;
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          setError('Failed to fetch user data');
          return false;
        }
      } else {
        console.error('No token received in response');
        setError('No token received');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        const errorMessage = error.response?.data?.message || 'Authentication failed';
        console.error('API error message:', errorMessage);
        setError(errorMessage);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response received from server. Check your connection.');
      } else {
        console.error('Unexpected error during login:', error.message);
        setError('An unexpected error occurred: ' + error.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    
    try {
      // Clear storage
      await AsyncStorage.removeItem('@CookFlow:user');
      await AsyncStorage.removeItem('@CookFlow:token');
      
      // Clear axios headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Reset state
      setUser(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};