import React from 'react';
import { useAuth } from '../../../hooks/useAuth';

const WelcomeSection: React.FC = () => {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            {getGreeting()}, {user?.full_name || user?.username}! 👋
          </h1>
          <p className="text-primary-100 text-lg font-medium">
            {getFormattedDate()}
          </p>
          <p className="mt-4 text-primary-50 max-w-2xl leading-relaxed">
            Welcome back to your AI-powered analytics workspace. Your data is ready for insights.
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex-shrink-0">
          <button 
            onClick={() => window.location.href = '/app/data'}
            className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 hover:shadow-lg transition-all duration-200 shadow-md active:scale-95"
          >
            + Upload New Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;

