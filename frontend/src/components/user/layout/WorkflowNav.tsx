import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const WorkflowNav: React.FC = () => {
  const location = useLocation();
  
  const steps = [
    { name: '1. Data', path: '/app/data', icon: '💾' },
    { name: '2. Query', path: '/app/query', icon: '🔎' },
    { name: '3. Charts', path: '/app/charts', icon: '📊' },
    { name: '4. Insights', path: '/app/insights', icon: '💡' },
  ];

  return (
    <div className="mb-8">
      <nav className="flex items-center justify-between p-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        <ul className="flex items-center w-full min-w-max">
          {steps.map((step) => {
            const isActive = location.pathname === step.path;
            return (
              <li key={step.path} className="flex-1">
                <Link
                  to={step.path}
                  className={`
                    flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="mr-2 text-lg">{step.icon}</span>
                  {step.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default WorkflowNav;

