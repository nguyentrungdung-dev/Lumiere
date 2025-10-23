import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../services/userApi';
import type { User, UserCreate, UserLogin, UserUpdate, AuthContextType } from '../types';

const UserAuthContext = createContext<AuthContextType | undefined>(undefined);

interface UserAuthProviderProps {
  children: ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const register = async (userData: UserCreate) => {
    try {
      await authApi.register(userData);
      // Auto-login after registration
      await login({ username: userData.username, password: userData.password });
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials: UserLogin) => {
    try {
      await authApi.login(credentials);
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateUser = async (_userData: UserUpdate) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = await authApi.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};

// Custom hook to use auth context
export const useUserAuth = (): AuthContextType => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

