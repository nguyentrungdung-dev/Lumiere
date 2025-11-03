import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChartRenderer } from '../../components/user/charts/ChartRenderer';
import type { ChartGenerationResponse } from '../../types';

export const ChartsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<ChartGenerationResponse | null>(
    location.state?.chartData || null
  );

  const downloadChart = () => {
    // In a real implementation, this would use html2canvas or similar to export the chart
    alert('Chart export feature coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Visualizations</h1>
          <p className="mt-1 text-sm text-gray-600">
            AI-generated charts from your query results
          </p>
        </div>
        {chartData && (
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/app/query')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              ← Back to Query
            </button>
            <button
              onClick={downloadChart}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              📥 Export Chart
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!chartData ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No chart to display</h3>
          <p className="mt-1 text-sm text-gray-500">
            Execute a query and generate a chart to see visualizations here.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/app/query')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to AI Query →
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* AI Reasoning */}
          {chartData.reasoning && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-600 mt-0.5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">AI Reasoning</p>
                  <p className="mt-1 text-sm text-blue-800">{chartData.reasoning}</p>
                </div>
              </div>
            </div>
          )}

          {/* Chart Display */}
          <ChartRenderer
            config={chartData.chart_config}
            title={`${chartData.chart_type.charAt(0).toUpperCase() + chartData.chart_type.slice(1)} Chart`}
            description="AI-generated visualization based on your query results"
          />

          {/* Chart Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Chart Type:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">
                  {chartData.chart_type}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Data Points:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {chartData.chart_config.data.labels?.length || 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Different chart types work better for different data. The AI selected this chart type based on your data structure and query results.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/app/query')}
                className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Run Another Query</span>
              </button>
              <button
                onClick={() => navigate('/app/insights', { state: { fromChart: true } })}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span className="font-medium">Generate Insights</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

