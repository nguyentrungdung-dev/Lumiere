import React, { useEffect, useState } from 'react';
import UserLayout from '../../components/user/layout/UserLayout';
import WelcomeSection from '../../components/user/dashboard/WelcomeSection';
import StatsCard from '../../components/user/dashboard/StatsCard';
import QuickActions from '../../components/user/dashboard/QuickActions';
import RecentActivity from '../../components/user/dashboard/RecentActivity';
import { dashboardApi } from '../../services/dataApi';
import type { DashboardResponse } from '../../services/dataApi';

const UserDashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardApi.getDashboardStats();
      setDashboardData(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Default stats for loading state
  const stats = dashboardData?.stats || {
    data_sources_count: 0,
    total_queries: 0,
    active_conversations: 0,
    insights_generated: 0,
    data_sources_trend: 0,
    queries_trend: 0,
    conversations_trend: 0,
    insights_trend: 0,
  };

  return (
    <UserLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Data Sources"
            value={isLoading ? "..." : String(stats.data_sources_count)}
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            }
            color="blue"
            trend={{ value: stats.data_sources_trend || 0, isPositive: (stats.data_sources_trend || 0) >= 0 }}
          />
          <StatsCard
            title="Total Queries"
            value={isLoading ? "..." : String(stats.total_queries)}
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            color="green"
            trend={{ value: stats.queries_trend || 0, isPositive: (stats.queries_trend || 0) >= 0 }}
          />
          <StatsCard
            title="Active Conversations"
            value={isLoading ? "..." : String(stats.active_conversations)}
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            color="purple"
            trend={{ value: Math.abs(stats.conversations_trend || 0), isPositive: (stats.conversations_trend || 0) >= 0 }}
          />
          <StatsCard
            title="Insights Generated"
            value={isLoading ? "..." : String(stats.insights_generated)}
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            color="orange"
            trend={{ value: stats.insights_trend || 0, isPositive: (stats.insights_trend || 0) >= 0 }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - 2 columns */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>

          {/* Recent Activity - 1 column */}
          <div>
            <RecentActivity 
              activities={dashboardData?.recent_activities || []}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Trends</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Chart coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Distribution</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Chart coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboardPage;
