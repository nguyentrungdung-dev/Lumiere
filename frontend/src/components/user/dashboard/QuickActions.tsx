import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../common/Card';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      title: 'Upload Data',
      description: 'Import CSV or Excel files',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
      color: 'text-blue-600 bg-blue-100',
      path: '/app/data',
    },
    {
      title: 'Ask Question',
      description: 'Query data with AI',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-violet-600 bg-violet-100',
      path: '/app/query',
    },
    {
      title: 'Create Chart',
      description: 'Visualize your data',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-emerald-600 bg-emerald-100',
      path: '/app/charts',
    },
    {
      title: 'Get Insights',
      description: 'AI-powered analysis',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'text-amber-600 bg-amber-100',
      path: '/app/insights',
    },
  ];

  return (
    <Card className="h-full">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="group flex items-start space-x-4 p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-soft hover:bg-primary-50/50 transition-all duration-200 text-left bg-gray-50/30"
          >
            <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1 group-hover:text-gray-600">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;

