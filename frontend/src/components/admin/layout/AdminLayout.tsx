import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useSidebarStore } from '../../../stores/sidebarStore';
import lumiereIcon from '../../../assets/lumiere-icon.svg';

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
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-slate-900 flex flex-col transition-all duration-300 shadow-xl z-20 ${adminSidebarOpen ? 'w-72' : 'w-20'}`}>
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800">
          {adminSidebarOpen ? (
            <div className="flex items-center space-x-3 overflow-hidden">
              <img src={lumiereIcon} alt="Lumiere" className="h-8 w-8 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-white font-bold text-lg tracking-tight truncate">Lumiere</h1>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Admin</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <img src={lumiereIcon} alt="Lumiere" className="h-8 w-8" />
            </div>
          )}
          {adminSidebarOpen && (
             <button
              onClick={toggleAdminSidebar}
              className="p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={!adminSidebarOpen ? item.name : undefined}
                className={`
                  group flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${adminSidebarOpen ? 'space-x-3' : 'justify-center'}
                  ${
                    active
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}>
                  {item.icon}
                </div>
                {adminSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        
        {/* Expand Button (when sidebar is collapsed) */}
        {!adminSidebarOpen && (
          <div className="px-4 py-4 border-t border-slate-800">
            <button
              onClick={toggleAdminSidebar}
              className="w-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"
              title="Expand sidebar"
            >
              <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Admin Info & Logout */}
        <div className="p-4 border-t border-slate-800">
          {adminSidebarOpen ? (
            <div className="space-y-3">
              <div className="px-2 py-1">
                <p className="text-sm font-semibold text-white truncate">{admin?.username}</p>
                <p className="text-xs text-slate-500">System Administrator</p>
              </div>
              <a
                href="/login"
                className="flex items-center justify-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/50"
              >
                Switch to User Portal
              </a>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center justify-center"
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
            </div>
          ) : (
            <div className="flex flex-col space-y-3 items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">
                  {admin?.username.substring(0, 1).toUpperCase()}
                </span>
              </div>
              <a
                href="/login"
                title="User Portal"
                className="flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center justify-center p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-5 shadow-sm sticky top-0 z-10">
          {title && (
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
              <div className="mt-2 h-1 w-16 bg-primary-500 rounded-full"></div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-8 py-4">
          <p className="text-center text-xs text-gray-400">
            © 2024 Lumiere Admin Portal. All rights reserved. | Confidential & Restricted Access
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;

