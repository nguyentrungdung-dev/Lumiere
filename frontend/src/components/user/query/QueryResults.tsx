import React from 'react';
import type { AIQueryResponse } from '../../../types';

interface QueryResultsProps {
  result: AIQueryResponse;
  onGenerateChart?: (queryId: number) => void;
  onGenerateInsight?: (queryId: number) => void;
}

export const QueryResults: React.FC<QueryResultsProps> = ({
  result,
  onGenerateChart,
  onGenerateInsight,
}) => {
  const renderTable = () => {
    if (!result.result || !result.result.rows || result.result.rows.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No results returned from query
        </div>
      );
    }

    const columns = result.result.columns;
    const rows = result.result.rows;

    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row: any, rowIdx: number) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* Query Status */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <span className="w-2 h-6 bg-primary-500 rounded-full mr-3"></span>
          Analysis Results
        </h3>
        <div className="flex items-center space-x-3">
          {result.result?.execution_time_ms && (
            <span className="text-xs text-gray-400 font-medium">
              {result.result.execution_time_ms.toFixed(2)}ms
            </span>
          )}
          <span
            className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
              ${result.status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}
            `}
          >
            {result.status}
          </span>
        </div>
      </div>

      {/* Question Context */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-start">
          <span className="text-lg mr-3">🤔</span>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Question</p>
            <p className="text-gray-900 font-medium">{result.question}</p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      {result.explanation && (
        <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-100">
          <div className="flex items-start">
            <span className="text-lg mr-3">🤖</span>
            <div>
              <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-1">AI Analysis</p>
              <p className="text-primary-900 leading-relaxed">{result.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generated SQL */}
      <div className="group relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            Generated SQL
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(result.sql)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Copy Code
          </button>
        </div>
        <div className="relative">
          <pre className="p-4 bg-slate-900 text-gray-100 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed shadow-inner">
            <code>{result.sql}</code>
          </pre>
          <div className="absolute top-0 right-0 p-2">
            <span className="text-[10px] text-slate-500 font-mono">SQL</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {result.error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start">
          <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-bold text-red-800 mb-1">Execution Error</p>
            <p className="text-sm text-red-600">{result.error}</p>
          </div>
        </div>
      )}

      {/* Results Table */}
      {result.status === 'success' && result.result && (
        <>
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7-8v8m6-8v8" />
                </svg>
                Result Data
              </p>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
                {result.result.row_count} rows
              </span>
            </div>
            {renderTable()}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
            {onGenerateChart && (
              <button
                onClick={() => onGenerateChart(result.query_id)}
                className="flex items-center justify-center px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
              >
                <span className="p-1.5 bg-purple-100 text-purple-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                <span className="font-medium">Visualize Data</span>
              </button>
            )}
            {onGenerateInsight && (
              <button
                onClick={() => onGenerateInsight(result.query_id)}
                className="flex items-center justify-center px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
              >
                <span className="p-1.5 bg-amber-100 text-amber-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <span className="font-medium">Get AI Insights</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

