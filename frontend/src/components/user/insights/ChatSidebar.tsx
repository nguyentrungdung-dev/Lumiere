import React from 'react';
import type { AIQuery } from '../../../types';

interface ChatSidebarProps {
  history: AIQuery[];
  onSelectQuery: (query: AIQuery) => void;
  onNewChat: () => void;
  selectedQueryId: number | null;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  history,
  onSelectQuery,
  onNewChat,
  selectedQueryId,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-80">
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center px-4 py-3 bg-white border border-primary-200 text-primary-600 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm font-medium group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Analysis
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-3">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Recent Queries
        </h3>
        <div className="space-y-1">
          {history.length === 0 ? (
            <p className="px-3 text-sm text-gray-400 italic">No history yet.</p>
          ) : (
            history.map((query) => (
              <button
                key={query.id}
                onClick={() => onSelectQuery(query)}
                className={`
                  w-full text-left px-3 py-3 rounded-lg text-sm transition-colors mb-1
                  ${selectedQueryId === query.id
                    ? 'bg-white shadow-sm border border-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <p className="font-medium truncate">{query.question}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(query.created_at).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

