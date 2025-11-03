import React from 'react';
import type { AIQuery } from '../../../types';

interface QueryHistoryProps {
  queries: AIQuery[];
  onSelectQuery: (query: AIQuery) => void;
  onRerunQuery: (queryId: number) => void;
  onDeleteQuery: (queryId: number) => void;
  isLoading: boolean;
}

export const QueryHistory: React.FC<QueryHistoryProps> = ({
  queries,
  onSelectQuery,
  onRerunQuery,
  onDeleteQuery,
  isLoading,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Query History</h3>
        <p className="mt-1 text-xs text-gray-500">Recent queries and results</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No queries yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {queries.map((query) => (
              <div
                key={query.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectQuery(query)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className={`
                      inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                      ${getStatusColor(query.status)}
                    `}
                  >
                    {query.status}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(query.created_at)}</span>
                </div>
                
                <p className="text-sm text-gray-900 line-clamp-2 mb-2">{query.question}</p>
                
                {query.execution_time && (
                  <p className="text-xs text-gray-500 mb-2">
                    ⚡ {query.execution_time.toFixed(2)}ms
                  </p>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRerunQuery(query.id);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    🔄 Rerun
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteQuery(query.id);
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

