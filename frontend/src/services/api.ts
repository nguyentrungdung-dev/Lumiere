import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type { User, UserCreate, UserLogin, UserUpdate, AuthTokens } from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE_PATH}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
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
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  // Register new user
  register: async (userData: UserCreate): Promise<User> => {
    const { data } = await api.post<User>('/auth/register', userData);
    return data;
  },

  // Login user
  login: async (credentials: UserLogin): Promise<AuthTokens> => {
    const { data } = await api.post<AuthTokens>('/auth/login', credentials);
    // Store token in localStorage
    localStorage.setItem('access_token', data.access_token);
    return data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
  },
};

// User API
export const userApi = {
  // Get user by ID
  getUser: async (userId: number): Promise<User> => {
    const { data } = await api.get<User>(`/users/${userId}`);
    return data;
  },

  // Update user profile
  updateUser: async (userId: number, userData: UserUpdate): Promise<User> => {
    const { data } = await api.patch<User>(`/users/${userId}`, userData);
    return data;
  },
};

export default api;

