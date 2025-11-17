import axios, { type AxiosInstance } from 'axios';
import type {
  AdminLogin,
  AdminTokenResponse,
  PlatformStats,
  UserListResponse,
  UserDetailResponse,
  UserStatusUpdate,
  ActivityFeedResponse,
  SystemHealth,
  UserGrowthResponse,
  UsagePatternsResponse,
} from '../types';

// Create axios instance for admin
const adminAxios: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE_PATH}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add admin token
adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_access_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Admin Authentication API
export const adminAuthApi = {
  // Admin login
  login: async (credentials: AdminLogin): Promise<AdminTokenResponse> => {
    const { data } = await adminAxios.post<AdminTokenResponse>('/admin/login', credentials);
    localStorage.setItem('admin_access_token', data.access_token);
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('admin_access_token');
  },

  // Check if admin token exists
  hasToken: (): boolean => {
    return !!localStorage.getItem('admin_access_token');
  },
};

// Admin Platform API
export const adminPlatformApi = {
  // Get platform statistics
  getStats: async (): Promise<PlatformStats> => {
    const { data } = await adminAxios.get<PlatformStats>('/admin/stats');
    return data;
  },

  // Get system health
  getHealth: async (): Promise<SystemHealth> => {
    const { data } = await adminAxios.get<SystemHealth>('/admin/health');
    return data;
  },

  // Get user growth analytics
  getUserGrowth: async (period: string = 'month', days: number = 30): Promise<UserGrowthResponse> => {
    const { data } = await adminAxios.get<UserGrowthResponse>(
      `/admin/analytics/user-growth?period=${period}&days=${days}`
    );
    return data;
  },

  // Get usage patterns
  getUsagePatterns: async (): Promise<UsagePatternsResponse> => {
    const { data } = await adminAxios.get<UsagePatternsResponse>('/admin/analytics/usage-patterns');
    return data;
  },
};

// Admin User Management API
export const adminUserApi = {
  // Get all users (paginated)
  getUsers: async (
    page: number = 1,
    pageSize: number = 20,
    search?: string
  ): Promise<UserListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (search) {
      params.append('search', search);
    }

    const { data } = await adminAxios.get<UserListResponse>(`/admin/users?${params}`);
    return data;
  },

  // Get user details by ID
  getUserDetails: async (userId: number): Promise<UserDetailResponse> => {
    const { data } = await adminAxios.get<UserDetailResponse>(`/admin/users/${userId}`);
    return data;
  },

  // Update user status (enable/disable)
  updateUserStatus: async (userId: number, status: UserStatusUpdate): Promise<void> => {
    await adminAxios.put(`/admin/users/${userId}/status`, status);
  },

  // Delete user
  deleteUser: async (userId: number): Promise<void> => {
    await adminAxios.delete(`/admin/users/${userId}`);
  },
};

// Admin Activity API
export const adminActivityApi = {
  // Get recent activity feed
  getActivity: async (
    page: number = 1,
    pageSize: number = 20,
    activityType?: string
  ): Promise<ActivityFeedResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (activityType) {
      params.append('activity_type', activityType);
    }

    const { data} = await adminAxios.get<ActivityFeedResponse>(`/admin/activity?${params}`);
    return data;
  },
};

export default adminAxios;

