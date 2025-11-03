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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ask a Question</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Data Source Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Data Source
          </label>
          <select
            value={selectedDataSource || ''}
            onChange={(e) => setSelectedDataSource(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isExecuting}
          >
            <option value="">Choose a data source...</option>
            {dataSources.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.name} ({ds.row_count?.toLocaleString()} rows)
              </option>
            ))}
          </select>
        </div>

        {/* Question Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What were the total sales by region last quarter?"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isExecuting}
          />
          <p className="mt-1 text-xs text-gray-500">
            Ask questions in natural language. AI will convert it to SQL and execute the query.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isExecuting || !selectedDataSource || !question.trim()}
          className={`
            w-full py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center
            ${
              isExecuting || !selectedDataSource || !question.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {isExecuting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Executing Query...
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Execute Query
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

