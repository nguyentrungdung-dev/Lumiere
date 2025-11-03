import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryInterface } from '../../components/user/query/QueryInterface';
import { QueryResults } from '../../components/user/query/QueryResults';
import { QueryHistory } from '../../components/user/query/QueryHistory';
import { dataSourceApi, aiQueryApi, chartApi, insightApi } from '../../services/dataApi';
import type { DataSource, AIQuery, AIQueryResponse } from '../../types';

export const AIQueryPage: React.FC = () => {
  const navigate = useNavigate();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [queries, setQueries] = useState<AIQuery[]>([]);
  const [currentResult, setCurrentResult] = useState<AIQueryResponse | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadDataSources();
    loadQueryHistory();
  }, []);

  const loadDataSources = async () => {
    try {
      const response = await dataSourceApi.getDataSources(0, 100);
      setDataSources(response.data_sources.filter((ds) => ds.is_active));
    } catch (err: any) {
      setError('Failed to load data sources');
    }
  };

  const loadQueryHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await aiQueryApi.getQueryHistory(0, 20);
      setQueries(response.queries);
    } catch (err: any) {
      console.error('Failed to load query history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleExecuteQuery = async (request: any): Promise<AIQueryResponse> => {
    setIsExecuting(true);
    setError('');
    try {
      const response = await aiQueryApi.executeQuery(request);
      await loadQueryHistory(); // Refresh history
      return response;
    } catch (err: any) {
      throw err;
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSelectQuery = (query: AIQuery) => {
    // Convert AIQuery to AIQueryResponse format for display
    const response: AIQueryResponse = {
      query_id: query.id,
      question: query.question,
      generated_sql: query.generated_sql || '',
      result_data: query.result_data,
      error_message: query.error_message || undefined,
      execution_time: query.execution_time || undefined,
      status: query.status,
    };
    setCurrentResult(response);
  };

  const handleRerunQuery = async (queryId: number) => {
    setIsExecuting(true);
    setError('');
    try {
      const response = await aiQueryApi.rerunQuery(queryId);
      setCurrentResult(response);
      await loadQueryHistory();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to rerun query');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleDeleteQuery = async (queryId: number) => {
    if (!confirm('Are you sure you want to delete this query?')) return;

    try {
      await aiQueryApi.deleteQuery(queryId);
      await loadQueryHistory();
      if (currentResult?.query_id === queryId) {
        setCurrentResult(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete query');
    }
  };

  const handleGenerateChart = async (queryId: number) => {
    try {
      const response = await chartApi.generateChart({ query_id: queryId });
      // Navigate to charts page with the chart data
      navigate('/app/charts', { state: { chartData: response } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate chart');
    }
  };

  const handleGenerateInsight = async (queryId: number) => {
    try {
      const response = await insightApi.generateInsight({ query_id: queryId });
      // Navigate to insights page with the insight data
      navigate('/app/insights', { state: { insightData: response } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate insight');
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Query Assistant</h1>
        <p className="mt-1 text-sm text-gray-600">
          Ask questions in natural language and get SQL-powered insights
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* No Data Sources Warning */}
      {dataSources.length === 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <svg
              className="h-5 w-5 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">No data sources available</p>
              <p className="mt-1 text-sm text-yellow-700">
                Please upload a data source first to start querying.
              </p>
              <button
                onClick={() => navigate('/app/data')}
                className="mt-2 text-sm font-medium text-yellow-800 underline hover:text-yellow-900"
              >
                Go to Data Sources →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Query Interface & Results */}
        <div className="lg:col-span-2 space-y-6">
          <QueryInterface
            dataSources={dataSources}
            onQueryExecute={setCurrentResult}
            isExecuting={isExecuting}
            onExecuteQuery={handleExecuteQuery}
          />

          {currentResult && (
            <QueryResults
              result={currentResult}
              onGenerateChart={handleGenerateChart}
              onGenerateInsight={handleGenerateInsight}
            />
          )}
        </div>

        {/* Right Column: Query History */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <QueryHistory
              queries={queries}
              onSelectQuery={handleSelectQuery}
              onRerunQuery={handleRerunQuery}
              onDeleteQuery={handleDeleteQuery}
              isLoading={isLoadingHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

