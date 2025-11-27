import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatInterface } from '../../components/user/insights/ChatInterface';
import { ChatSidebar } from '../../components/user/insights/ChatSidebar';
import { aiQueryApi, dataSourceApi } from '../../services/dataApi';
import type { AIQuery, DataSource } from '../../types';

// Helper to format messages
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
  timestamp: Date;
  isError?: boolean;
}

export const InsightsPage: React.FC = () => {
  const location = useLocation();
  
  // State
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

  const handleSendMessage = async (text: string) => {
    if (!selectedDataSource) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "Please select a data source first.",
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
      // Call API
      const response = await aiQueryApi.executeQuery({
        data_source_id: selectedDataSource,
        question: text,
        execute: true
      });

      // Add assistant message
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `Here is the SQL I generated:\n\`\`\`sql\n${response.sql}\n\`\`\`\n\n${response.explanation}\n\n${response.result?.rows ? `Found ${response.result.row_count} results.` : ''}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Refresh history
      loadHistory();
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${err.response?.data?.detail || 'Failed to process query'}`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuery = (query: AIQuery) => {
    setSelectedQueryId(query.id);
    // Load this query into the chat view (simulated for now since we don't have full chat persistence)
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
        content: `SQL: ${query.generated_sql}\n\n(Tap "New Analysis" to start a fresh query)`,
        timestamp: new Date(query.created_at),
      }
    ]);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedQueryId(null);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar 
        history={history} 
        onSelectQuery={handleSelectQuery} 
        onNewChat={handleNewChat}
        selectedQueryId={selectedQueryId}
      />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with Data Source Selector */}
          <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white">
            <h2 className="font-bold text-gray-900">AI Assistant</h2>
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

          {/* Chat Interface */}
          <div className="flex-1 p-4 bg-gray-50">
            <ChatInterface 
              messages={messages} 
              isLoading={isLoading} 
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
    </div>
  );
};


