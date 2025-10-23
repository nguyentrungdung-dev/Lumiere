import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserAuthProvider } from './context/UserAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// User Pages
import UserLoginPage from './pages/user/UserLoginPage';
import UserRegisterPage from './pages/user/UserRegisterPage';
import UserDashboardPage from './pages/user/UserDashboardPage';
import UserProfilePage from './pages/user/UserProfilePage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Components
import UserProtectedRoute from './components/auth/UserProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={
            <AdminAuthProvider>
              <AdminLoginPage />
            </AdminAuthProvider>
          } />
          <Route path="/admin/dashboard" element={
            <AdminAuthProvider>
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            </AdminAuthProvider>
          } />
          <Route path="/admin/*" element={
            <AdminAuthProvider>
              <AdminProtectedRoute>
                <Navigate to="/admin/dashboard" replace />
              </AdminProtectedRoute>
            </AdminAuthProvider>
          } />

          {/* User Portal Routes */}
          <Route path="/login" element={
            <UserAuthProvider>
              <UserLoginPage />
            </UserAuthProvider>
          } />
          <Route path="/register" element={
            <UserAuthProvider>
              <UserRegisterPage />
            </UserAuthProvider>
          } />
          <Route path="/app/dashboard" element={
            <UserAuthProvider>
              <UserProtectedRoute>
                <UserDashboardPage />
              </UserProtectedRoute>
            </UserAuthProvider>
          } />
          <Route path="/app/profile" element={
            <UserAuthProvider>
              <UserProtectedRoute>
                <UserProfilePage />
              </UserProtectedRoute>
            </UserAuthProvider>
          } />
          <Route path="/app/*" element={
            <UserAuthProvider>
              <UserProtectedRoute>
                <Navigate to="/app/dashboard" replace />
              </UserProtectedRoute>
            </UserAuthProvider>
          } />

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
