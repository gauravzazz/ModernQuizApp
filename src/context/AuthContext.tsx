import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, AuthUser, AuthState } from '../services/authService';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  sendPasswordResetEmail: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check if user is already authenticated
    const loadAuthState = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        const token = await AuthService.getAuthToken();
        const user = await AuthService.getCurrentUser();
        
        setState({
          user,
          token,
          isAuthenticated: !!token && !!user,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to load authentication state',
        });
      }
    };

    loadAuthState();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const user = await AuthService.signUp({ email, password, name });
      const token = await AuthService.getAuthToken();
      
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const user = await AuthService.signIn({ email, password });
      const token = await AuthService.getAuthToken();
      
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const user = await AuthService.signInWithGoogle();
      const token = await AuthService.getAuthToken();
      
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await AuthService.signOut();
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await AuthService.sendPasswordResetEmail(email);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        sendPasswordResetEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};