import React from 'react';
import type { SystemHealth } from '../../../types';

interface SystemHealthPanelProps {
  health: SystemHealth | null;
  isLoading: boolean;
}

export const SystemHealthPanel: React.FC<SystemHealthPanelProps> = ({ health, isLoading }) => {
  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'text-gray-600 bg-gray-100';
    
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'ok':
        return 'text-green-600 bg-green-100';
      case 'degraded':
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy':
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return `${Math.floor(seconds / 60)}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : !health ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Unable to load health status</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Overall Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${getStatusColor(health?.status)}`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Overall Status</p>
                <p className="text-xs text-gray-500">All systems operational</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(health?.status)}`}
            >
              {health?.status || 'Unknown'}
            </span>
          </div>

          {/* Database */}
          {health.database && (
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Database</p>
                  <p className="text-xs text-gray-500">
                    Response: {health.database.response_time_ms?.toFixed(0) || 'N/A'}ms
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(health.database.status)}`}
              >
                {health.database.status || 'Unknown'}
              </span>
            </div>
          )}

          {/* API */}
          {health.api && (
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">API Server</p>
                  <p className="text-xs text-gray-500">
                    Uptime: {health.api.uptime_seconds ? formatUptime(health.api.uptime_seconds) : 'N/A'}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(health.api.status)}`}
              >
                {health.api.status || 'Unknown'}
              </span>
            </div>
          )}

          {/* Storage */}
          {health.storage && (
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Storage</p>
                  <p className="text-xs text-gray-500">
                    {health.storage.used_gb?.toFixed(2) || 'N/A'} GB used
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600">
                Active
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

