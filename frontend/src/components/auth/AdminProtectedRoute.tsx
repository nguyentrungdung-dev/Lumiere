import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useEffect, useState } from 'react';
import { adminPlatformApi } from '../../services/adminApi';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!isLoading && isAuthenticated) {
        try {
          // Verify the token is still valid by making an API call
          await adminPlatformApi.getStats();
          setIsValid(true);
        } catch (error: any) {
          console.error('Token verification failed:', error);
          // Token is invalid - clear auth state
          logout();
          setIsValid(false);
        }
      }
      setIsVerifying(false);
    };

    if (!isLoading) {
      if (isAuthenticated) {
        verifyToken();
      } else {
        setIsVerifying(false);
      }
    }
  }, [isLoading, isAuthenticated, logout]);

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isValid) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;

