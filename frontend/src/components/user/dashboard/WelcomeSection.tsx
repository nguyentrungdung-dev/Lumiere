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
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, {user?.full_name || user?.username}! 👋
          </h1>
          <p className="text-primary-100 text-lg">
            {getFormattedDate()}
          </p>
          <p className="mt-4 text-primary-50 max-w-2xl">
            Welcome to your AI-powered data analysis dashboard. Start by uploading data or continue your conversations.
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors shadow-md">
            Upload New Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;

