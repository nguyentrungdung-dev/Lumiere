import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { InsightGenerationResponse } from '../../types';

export const InsightsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [insightData, setInsightData] = useState<InsightGenerationResponse | null>(
    location.state?.insightData || null
  );

  const copyInsights = () => {
    if (!insightData) return;
    
    const text = `
Insights for Query #${insightData.query_id}

${insightData.insights}

Key Findings:
${insightData.key_findings.map((finding, idx) => `${idx + 1}. ${finding}`).join('\n')}

Recommendations:
${insightData.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text);
    alert('Insights copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="mt-1 text-sm text-gray-600">
            Business insights and recommendations powered by AI
          </p>
        </div>
        {insightData && (
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/app/query')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              ← Back to Query
            </button>
            <button
              onClick={copyInsights}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              📋 Copy Insights
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!insightData ? (
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No insights to display</h3>
          <p className="mt-1 text-sm text-gray-500">
            Execute a query and generate insights to see AI-powered analysis here.
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
          {/* Main Insights */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h2>
                <div className="prose prose-sm text-gray-700 whitespace-pre-line">
                  {insightData.insights}
                </div>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <svg
                className="h-6 w-6 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Key Findings</h3>
            </div>
            <ul className="space-y-3">
              {insightData.key_findings.map((finding, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium mr-3">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <svg
                className="h-6 w-6 text-purple-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
            </div>
            <div className="space-y-4">
              {insightData.recommendations.map((recommendation, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-purple-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold mr-3 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-gray-800">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Query Info */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Related Query</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Query ID: #{insightData.query_id}</span>
              <button
                onClick={() => navigate('/app/query')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Query Details →
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <span className="font-medium">New Query</span>
              </button>
              <button
                onClick={() => navigate('/app/charts', { state: { fromInsights: true } })}
                className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="font-medium">View Charts</span>
              </button>
              <button
                onClick={() => navigate('/app/dashboard')}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="font-medium">Dashboard</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

