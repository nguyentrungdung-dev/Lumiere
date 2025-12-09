import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UserLayout from '../../components/user/layout/UserLayout';
import { ChatInterface } from '../../components/user/insights/ChatInterface';
import { ChatSidebar } from '../../components/user/insights/ChatSidebar';
import { aiQueryApi, dataSourceApi, insightApi } from '../../services/dataApi';
import { chatApi } from '../../services/userApi';
import type { AIQuery, DataSource, AIQueryResponse } from '../../types';

// Chat mode type
type ChatMode = 'data-analysis' | 'general-chat';

// Helper to format messages
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
  timestamp: Date;
  isError?: boolean;
  queryResult?: AIQueryResponse;
}

export const InsightsPage: React.FC = () => {
  const location = useLocation();
  
  // State
  const [chatMode, setChatMode] = useState<ChatMode>('data-analysis');
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<AIQuery[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState<number | null>(null);

  // Load history and data sources on mount
  useEffect(() => {
    loadHistory();
    loadDataSources();
  }, []);

  // Check for passed state (from Chart or Query page)
  useEffect(() => {
    const state = location.state as { insightData?: any; fromChart?: boolean };
    if (state?.insightData) {
      // If we have insight data passed, add it as a message
      const insight = state.insightData;
      setMessages([
        {
          id: `sys-${Date.now()}`,
          role: 'assistant',
          content: `Here are the insights for your query:\n\n${insight.insight_text}`,
          timestamp: new Date(),
        }
      ]);
    }
  }, [location.state]);

  const loadHistory = async () => {
    try {
      const response = await aiQueryApi.getQueryHistory(0, 50);
      setHistory(response.queries);
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  const loadDataSources = async () => {
    try {
      const response = await dataSourceApi.getDataSources();
      setDataSources(response.data_sources.filter(ds => ds.is_active));
      if (response.data_sources.length > 0) {
        setSelectedDataSource(response.data_sources[0].id);
      }
    } catch (err) {
      console.error('Failed to load data sources', err);
    }
  };

  const formatResultsTable = (result: AIQueryResponse['result']) => {
    if (!result || !result.rows || result.rows.length === 0) {
      return null;
    }

    const columns = result.columns;
    const rows = result.rows.slice(0, 10); // Show max 10 rows
    const hasMore = result.rows.length > 10;

    return (
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row: any, rowIdx: number) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-3 py-2 whitespace-nowrap text-gray-900">
                    {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {hasMore && (
          <p className="mt-2 text-xs text-gray-500 italic">
            Showing first 10 of {result.row_count} results
          </p>
        )}
      </div>
    );
  };

  const handleSendMessage = async (text: string) => {
    // Handle based on chat mode
    if (chatMode === 'general-chat') {
      await handleGeneralChat(text);
    } else {
      await handleDataAnalysis(text);
    }
  };

  const handleGeneralChat = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : 'Complex content'
      }));

      // Call general chat API
      const response = await chatApi.sendMessage(text, conversationHistory);

      // Add assistant message
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `❌ Error: ${err.response?.data?.detail || 'Failed to get response. Please try again.'}`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataAnalysis = async (text: string) => {
    if (!selectedDataSource) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "Please select a data source first to start analyzing your data.",
        timestamp: new Date(),
        isError: true
      }]);
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call API to execute query
      const response = await aiQueryApi.executeQuery({
        data_source_id: selectedDataSource,
        question: text,
        execute: true
      });

      // Format the SQL nicely
      const formattedSQL = response.sql;

      // Build rich response content
      const responseContent = (
        <div className="space-y-4">
          {/* Explanation */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">📊 Analysis</h4>
            <p className="text-gray-700">{response.explanation}</p>
          </div>

          {/* SQL Query */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">🔍 Generated SQL</h4>
            <pre className="bg-slate-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap">
              {formattedSQL}
            </pre>
          </div>

          {/* Results */}
          {response.result && response.result.rows && response.result.rows.length > 0 ? (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                📋 Results ({response.result.row_count} rows, {response.result.execution_time_ms?.toFixed(2)}ms)
              </h4>
              {formatResultsTable(response.result)}
            </div>
          ) : (
            <div className="text-gray-600 italic">No results returned from query.</div>
          )}

          {/* Quick insights based on results */}
          {response.result && response.result.rows && response.result.rows.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 mb-1">💡 Quick Insight</h4>
              <p className="text-blue-700 text-sm">
                Found <strong>{response.result.row_count}</strong> records matching your query.
                {response.result.columns.length > 0 && (
                  <> The data includes columns: <em>{response.result.columns.slice(0, 3).join(', ')}</em>
                  {response.result.columns.length > 3 && ` and ${response.result.columns.length - 3} more`}.</>
                )}
              </p>
            </div>
          )}
        </div>
      );

      // Add assistant message with rich content
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        queryResult: response,
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Refresh history
      loadHistory();

      // Generate additional insights if we have results
      if (response.result && response.result.rows && response.result.rows.length > 0) {
        try {
          // Add a "generating insights" message
          const generatingMsg: Message = {
            id: `gen-${Date.now()}`,
            role: 'assistant',
            content: (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-700 text-sm flex items-center">
                  <span className="mr-2">🧠</span> Generating AI insights...
                </p>
              </div>
            ),
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, generatingMsg]);

          const insightResponse = await insightApi.generateInsight({ query_id: response.query_id });
          
          // Remove the "generating" message and add the actual insight
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== generatingMsg.id);
            return [
              ...filtered,
              {
                id: `insight-${Date.now()}`,
                role: 'assistant',
                content: (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                      <span className="mr-2">🧠</span> AI-Generated Insights
                    </h4>
                    <div className="text-amber-900 text-sm whitespace-pre-wrap leading-relaxed">
                      {insightResponse.insight_text}
                    </div>
                  </div>
                ),
                timestamp: new Date(),
              }
            ];
          });
        } catch (insightErr: any) {
          // Remove the "generating" message
          setMessages(prev => prev.filter(m => !m.id.startsWith('gen-')));
          
          // Check if it's a timeout error
          const isTimeout = insightErr.code === 'ECONNABORTED' || insightErr.message?.includes('timeout');
          
          console.log('Could not generate additional insights:', insightErr);
          
          // Show a subtle message about insight generation failure (optional)
          if (isTimeout) {
            const timeoutMsg: Message = {
              id: `timeout-${Date.now()}`,
              role: 'assistant',
              content: (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-gray-600 text-xs italic">
                    ℹ️ AI insight generation took too long and was skipped. The query results above are still valid.
                  </p>
                </div>
              ),
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, timeoutMsg]);
          }
        }
      }

    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-red-700">❌ Error processing your query</p>
            <p className="text-red-600">{err.response?.data?.detail || 'Failed to process query. Please try rephrasing your question.'}</p>
            <p className="text-sm text-red-500 mt-2">
              💡 Tip: Try asking specific questions like "What is the total sales?" or "Show me the top 10 products by revenue"
            </p>
          </div>
        ),
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuery = async (query: AIQuery) => {
    setSelectedQueryId(query.id);
    setIsLoading(true);
    
    try {
      // Re-run the query to get fresh results
      const response = await aiQueryApi.rerunQuery(query.id);
      
      // Format the response similar to handleSendMessage
      const responseContent = (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">📊 Previous Query Results</h4>
            <p className="text-gray-700">{response.explanation}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-1">🔍 SQL Query</h4>
            <pre className="bg-slate-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap">
              {response.sql}
            </pre>
          </div>

          {response.result && response.result.rows && response.result.rows.length > 0 ? (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                📋 Results ({response.result.row_count} rows)
              </h4>
              {formatResultsTable(response.result)}
            </div>
          ) : (
            <div className="text-gray-600 italic">No results returned from query.</div>
          )}
          
          <p className="text-xs text-gray-400 italic">
            Click "New Analysis" to start a fresh conversation.
          </p>
        </div>
      );

      setMessages([
        {
          id: `q-${query.id}`,
          role: 'user',
          content: query.question,
          timestamp: new Date(query.created_at),
        },
        {
          id: `a-${query.id}`,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(query.created_at),
          queryResult: response,
        }
      ]);
    } catch (err: any) {
      setMessages([
        {
          id: `q-${query.id}`,
          role: 'user',
          content: query.question,
          timestamp: new Date(query.created_at),
        },
        {
          id: `err-${query.id}`,
          role: 'assistant',
          content: `Could not reload query results: ${err.response?.data?.detail || 'Error occurred'}`,
          timestamp: new Date(),
          isError: true,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedQueryId(null);
  };

  const handleModeChange = (mode: ChatMode) => {
    setChatMode(mode);
    setMessages([]);
    setSelectedQueryId(null);
  };

  return (
    <UserLayout title="Insights" fullWidth>
      <div className="flex h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Sidebar - Only show in data analysis mode */}
        {chatMode === 'data-analysis' && (
          <ChatSidebar 
            history={history} 
            onSelectQuery={handleSelectQuery} 
            onNewChat={handleNewChat}
            selectedQueryId={selectedQueryId}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with Mode Toggle and Data Source Selector */}
          <div className="border-b border-gray-100 bg-white">
            {/* Mode Toggle */}
            <div className="px-6 pt-4 pb-2">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleModeChange('data-analysis')}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${chatMode === 'data-analysis'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  📊 Data Analysis
                </button>
                <button
                  onClick={() => handleModeChange('general-chat')}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${chatMode === 'general-chat'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  💬 General Chat
                </button>
              </div>
            </div>

            {/* Data Source Selector - Only show in data analysis mode */}
            {chatMode === 'data-analysis' && (
              <div className="px-6 pb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Ask questions about your data and get SQL-powered insights
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Data Source:</span>
                  <select
                    value={selectedDataSource || ''}
                    onChange={(e) => setSelectedDataSource(Number(e.target.value))}
                    className="text-sm border-none bg-gray-50 rounded-lg py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-primary-500"
                  >
                    {dataSources.length === 0 && <option value="">No data sources</option>}
                    {dataSources.map(ds => (
                      <option key={ds.id} value={ds.id}>{ds.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* General Chat description */}
            {chatMode === 'general-chat' && (
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-500">
                  Ask me anything! I can help with explanations, advice, problem-solving, and more.
                </p>
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <div className="flex-1 p-4 bg-gray-50">
            <ChatInterface 
              messages={messages} 
              isLoading={isLoading} 
              onSendMessage={handleSendMessage}
              placeholder={
                chatMode === 'general-chat'
                  ? "Ask me anything..."
                  : "Ask a question about your data..."
              }
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};


