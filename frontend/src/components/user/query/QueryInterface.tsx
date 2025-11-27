import React, { useState } from 'react';
import type { DataSource, AIQueryRequest, AIQueryResponse } from '../../../types';

interface QueryInterfaceProps {
  dataSources: DataSource[];
  onQueryExecute: (response: AIQueryResponse) => void;
  isExecuting: boolean;
  onExecuteQuery: (request: AIQueryRequest) => Promise<AIQueryResponse>;
}

export const QueryInterface: React.FC<QueryInterfaceProps> = ({
  dataSources,
  onQueryExecute,
  isExecuting,
  onExecuteQuery,
}) => {
  const [selectedDataSource, setSelectedDataSource] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDataSource) {
      setError('Please select a data source');
      return;
    }
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setError('');
    try {
      const response = await onExecuteQuery({
        data_source_id: selectedDataSource,
        question: question.trim(),
        execute: true,
      });
      onQueryExecute(response);
      setQuestion('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to execute query');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900">Ask a Question</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Source Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            1. Select Dataset to Analyze
          </label>
          <div className="relative">
            <select
              value={selectedDataSource || ''}
              onChange={(e) => setSelectedDataSource(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all appearance-none"
              disabled={isExecuting}
            >
              <option value="">Choose a data source...</option>
              {dataSources.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name} ({ds.row_count?.toLocaleString()} rows)
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Selected dataset will be combined with your query
          </p>
        </div>

        {/* Question Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            2. What would you like to know?
          </label>
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Show me the top 10 products by sales revenue in 2023"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none"
              disabled={isExecuting}
            />
            <div className="absolute bottom-3 right-3">
              <button 
                type="button"
                className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                title="Voice input (coming soon)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isExecuting || !selectedDataSource || !question.trim()}
          className={`
            w-full py-3.5 px-4 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center active:scale-[0.98]
            ${
              isExecuting || !selectedDataSource || !question.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-600/30'
            }
          `}
        >
          {isExecuting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing Data...
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Run Analysis
            </>
          )}
        </button>
      </form>

      {/* Example Questions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Example Questions:</p>
        <div className="space-y-1">
          {[
            'What are the top 10 products by sales?',
            'Show me monthly revenue for this year',
            'Which customers have the highest order value?',
            'What is the average order size by region?',
          ].map((example, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(example)}
              disabled={isExecuting}
              className="block text-sm text-blue-600 hover:text-blue-700 hover:underline text-left disabled:opacity-50"
            >
              • {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

