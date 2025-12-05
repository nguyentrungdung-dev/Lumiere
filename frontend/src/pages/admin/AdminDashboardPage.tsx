import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import { AdminStatsCard } from '../../components/admin/dashboard/AdminStatsCard';
import { ActivityFeed } from '../../components/admin/dashboard/ActivityFeed';
import { SystemHealthPanel } from '../../components/admin/dashboard/SystemHealthPanel';
import { AnalyticsChart } from '../../components/admin/dashboard/AnalyticsChart';
import { adminPlatformApi, adminActivityApi } from '../../services/adminApi';
import type {
  PlatformStats,
  ActivityLog,
  SystemHealth,
  UserGrowthData,
} from '../../types';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [growthData, setGrowthData] = useState<UserGrowthData[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);
  const [isLoadingGrowth, setIsLoadingGrowth] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await Promise.all([loadStats(), loadActivities(), loadHealth(), loadGrowth()]);
  };

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const data = await adminPlatformApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadActivities = async () => {
    setIsLoadingActivities(true);
    try {
      const response = await adminActivityApi.getActivity(1, 10);
      setActivities(response.activities);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const loadHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const data = await adminPlatformApi.getHealth();
      setHealth(data);
    } catch (error) {
      console.error('Failed to load health:', error);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const loadGrowth = async () => {
    setIsLoadingGrowth(true);
    try {
      const response = await adminPlatformApi.getUserGrowth('day', 30);
      setGrowthData(response.data);
    } catch (error) {
      console.error('Failed to load growth data:', error);
    } finally {
      setIsLoadingGrowth(false);
    }
  };

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">Monitor platform metrics and user activity</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Platform Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoadingStats ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
                >
                  <div className="h-20" />
                </div>
              ))}
            </>
          ) : stats ? (
            <>
              <AdminStatsCard
                title="Total Users"
                value={(stats.total_users ?? 0).toLocaleString()}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                }
                color="blue"
              />
              <AdminStatsCard
                title="Data Sources"
                value={(stats.total_data_sources ?? 0).toLocaleString()}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                }
                color="green"
              />
              <AdminStatsCard
                title="Total Queries"
                value={(stats.total_queries ?? 0).toLocaleString()}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
                color="purple"
              />
              <AdminStatsCard
                title="Storage Used"
                value={formatStorage(stats.total_storage_bytes)}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                }
                color="orange"
              />
            </>
          ) : null}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: User Growth Chart (2/3 width) */}
          <div className="lg:col-span-2">
            <AnalyticsChart data={growthData} isLoading={isLoadingGrowth} />
          </div>

          {/* Right Column: System Health (1/3 width) */}
          <div className="lg:col-span-1">
            <SystemHealthPanel health={health} isLoading={isLoadingHealth} />
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed activities={activities} isLoading={isLoadingActivities} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
