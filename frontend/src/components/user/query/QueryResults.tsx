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
    if (!result.result_data || !Array.isArray(result.result_data) || result.result_data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No results returned from query
        </div>
      );
    }

    const columns = Object.keys(result.result_data[0]);

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
            {result.result_data.map((row: any, rowIdx: number) => (
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      {/* Query Status */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Query Results</h3>
        <div className="flex items-center space-x-2">
          {result.execution_time && (
            <span className="text-sm text-gray-500">
              Executed in {result.execution_time.toFixed(2)}ms
            </span>
          )}
          <span
            className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${result.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}
          >
            {result.status}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm font-medium text-blue-900">Question:</p>
        <p className="mt-1 text-sm text-blue-800">{result.question}</p>
      </div>

      {/* Generated SQL */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Generated SQL:</p>
          <button
            onClick={() => navigator.clipboard.writeText(result.generated_sql)}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Copy SQL
          </button>
        </div>
        <pre className="p-3 bg-gray-900 text-gray-100 rounded-md overflow-x-auto text-xs">
          <code>{result.generated_sql}</code>
        </pre>
      </div>

      {/* Error Message */}
      {result.error_message && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm font-medium text-red-900">Error:</p>
          <p className="mt-1 text-sm text-red-800">{result.error_message}</p>
        </div>
      )}

      {/* Results Table */}
      {result.status === 'success' && result.result_data && (
        <>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Results ({Array.isArray(result.result_data) ? result.result_data.length : 0} rows)
            </p>
            {renderTable()}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            {onGenerateChart && (
              <button
                onClick={() => onGenerateChart(result.query_id)}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
              >
                📊 Generate Chart
              </button>
            )}
            {onGenerateInsight && (
              <button
                onClick={() => onGenerateInsight(result.query_id)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                💡 Generate Insights
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

