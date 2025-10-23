import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
      const adminToken = localStorage.getItem('admin_token');
      const adminUser = localStorage.getItem('admin_user');
      
      if (adminToken && adminUser) {
        setAdmin(JSON.parse(adminUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    // TODO: Replace with actual API call
    // For now, check against environment variables
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
      const adminUser: AdminUser = {
        username,
        role: 'admin',
      };
      
      // Store admin session
      localStorage.setItem('admin_token', 'admin_token_' + Date.now());
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      setAdmin(adminUser);
    } else {
      throw new Error('Invalid admin credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
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

