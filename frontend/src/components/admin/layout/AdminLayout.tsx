import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useSidebarStore } from '../../../stores/sidebarStore';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAdminAuth();
  const { adminSidebarOpen, toggleAdminSidebar } = useSidebarStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`bg-gray-900 flex flex-col transition-all duration-300 ${adminSidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-gray-800">
          {adminSidebarOpen ? (
            <div className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">Lumiere</h1>
                  <p className="text-gray-400 text-xs">Admin Portal</p>
                </div>
              </div>
              <button
                onClick={toggleAdminSidebar}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              title={!adminSidebarOpen ? item.name : undefined}
              className={`
                flex items-center ${adminSidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg transition-colors
                ${
                  isActive(item.path)
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              {item.icon}
              {adminSidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>
        
        {/* Expand Button (when sidebar is collapsed) */}
        {!adminSidebarOpen && (
          <div className="px-4 py-4 border-t border-gray-800">
            <button
              onClick={toggleAdminSidebar}
              className="w-full p-2 hover:bg-gray-800 rounded transition-colors"
              title="Expand sidebar"
            >
              <svg className="h-6 w-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Admin Info & Logout */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          {adminSidebarOpen ? (
            <>
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-white">{admin?.username}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <a
                href="/login"
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-center"
              >
                User Portal →
              </a>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {admin?.username.substring(0, 1).toUpperCase()}
                  </span>
                </div>
              </div>
              <a
                href="/login"
                title="User Portal"
                className="flex items-center justify-center p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center justify-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          {title && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <div className="mt-1 h-1 w-20 bg-red-600 rounded"></div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2024 Lumiere Admin Portal. All rights reserved. | Confidential & Restricted Access
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;

