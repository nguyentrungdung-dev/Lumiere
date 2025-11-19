import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { adminAuthApi } from '../services/adminApi';

interface AdminUser {
  username: string;
  role: 'admin';
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('admin_access_token');
      const adminUser = localStorage.getItem('admin_user');
      
      if (adminToken && adminUser) {
        setAdmin(JSON.parse(adminUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await adminAuthApi.login({ username, password });
      const adminUser: AdminUser = {
        username: response.admin.username,
        role: 'admin',
      };
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      setAdmin(adminUser);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Invalid admin credentials';
      throw new Error(message);
    }
  };

  const logout = () => {
    adminAuthApi.logout();
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

// Custom hook to use admin auth context
export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

