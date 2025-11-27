import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useSidebarStore } from '../../../stores/sidebarStore';
import Avatar from '../../common/Avatar';
import lumiereIcon from '../../../assets/lumiere-icon.svg';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const UserSidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { userSidebarOpen, toggleUserSidebar } = useSidebarStore();

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/app/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Data Sources',
      path: '/app/data',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
    },
    {
      name: 'AI Query',
      path: '/app/query',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Charts',
      path: '/app/charts',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Insights',
      path: '/app/insights',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      className={`
        flex flex-col h-full bg-white border-r border-gray-100 shadow-soft 
        transition-all duration-300 ease-in-out
        ${userSidebarOpen ? 'w-72' : 'w-20'}
      `}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-gray-50">
        {userSidebarOpen ? (
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="p-1.5 bg-primary-100 rounded-lg">
              <img src={lumiereIcon} alt="Lumiere" className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Lumiere</span>
          </div>
        ) : (
          <div className="mx-auto">
            <img src={lumiereIcon} alt="Lumiere" className="w-8 h-8" />
          </div>
        )}
        <button
          onClick={toggleUserSidebar}
          className={`
            p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors
            ${!userSidebarOpen ? 'hidden' : ''}
          `}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              title={!userSidebarOpen ? item.name : undefined}
              className={`
                group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200
                ${userSidebarOpen ? 'justify-between' : 'justify-center'}
                ${
                  active
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className={`flex items-center ${userSidebarOpen ? 'space-x-3' : ''}`}>
                <div className={`
                  ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}
                  transition-colors duration-200
                `}>
                  {item.icon}
                </div>
                {userSidebarOpen && (
                  <span className={`font-medium ${active ? 'font-semibold' : ''}`}>
                    {item.name}
                  </span>
                )}
              </div>
              {userSidebarOpen && item.badge && (
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Collapse Button (when sidebar is collapsed) */}
      {!userSidebarOpen && (
        <div className="px-4 py-4">
          <button
            onClick={toggleUserSidebar}
            className="w-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl transition-colors"
            title="Expand sidebar"
          >
            <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* User Section */}
      <div className="p-4 border-t border-gray-50">
        {userSidebarOpen ? (
          <div className="flex flex-col gap-2">
            <Link
              to="/app/profile"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <Avatar
                name={user?.full_name || user?.username || 'User'}
                size="md"
                status="online"
              />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </Link>
            
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Link
              to="/app/profile"
              title="Profile"
              className="flex items-center justify-center p-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Avatar
                name={user?.full_name || user?.username || 'User'}
                size="sm"
                status="online"
              />
            </Link>
            <button
              onClick={logout}
              title="Logout"
              className="flex items-center justify-center p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSidebar;

