// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  locale: string | null;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserUpdate {
  full_name?: string;
  avatar_url?: string;
  locale?: string;
}

// Auth Types
export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
  updateUser: (userData: UserUpdate) => Promise<void>;
}

// API Response Types
export interface ApiError {
  detail: string | Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// Data Source Types
export interface DataSource {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  source_type: 'csv' | 'excel' | 'database' | 'api';
  file_path: string | null;
  file_size: number | null;
  row_count: number | null;
  column_count: number | null;
  columns: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DataSourceCreate {
  name: string;
  description?: string;
}

export interface DataSourceUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface DataSourceListResponse {
  data_sources: DataSource[];
  total: number;
  skip: number;
  limit: number;
}

export interface ColumnInfo {
  name: string;
  dtype: string;
  sample_values: any[];
}

export interface DataPreviewResponse {
  columns: ColumnInfo[];
  rows: Record<string, any>[];
  total_rows: number;
  offset: number;
  limit: number;
}

// AI Query Types
export interface AIQuery {
  id: number;
  user_id: number;
  data_source_id: number;
  question: string;
  generated_sql: string | null;
  result_data: any;
  error_message: string | null;
  execution_time: number | null;
  status: 'pending' | 'success' | 'error';
  created_at: string;
}

export interface AIQueryRequest {
  data_source_id: number;
  question: string;
  execute?: boolean;
}

export interface AIQueryResponse {
  query_id: number;
  question: string;
  generated_sql: string;
  result_data?: any;
  error_message?: string;
  execution_time?: number;
  status: string;
}

export interface QueryHistoryResponse {
  queries: AIQuery[];
  total: number;
  skip: number;
  limit: number;
}

// Chart Types
export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'doughnut' | 'area';
  data: any;
  options?: any;
}

export interface ChartGenerationRequest {
  query_id: number;
}

export interface ChartGenerationResponse {
  chart_type: string;
  chart_config: ChartConfig;
  reasoning: string;
}

// Insight Types
export interface InsightGenerationRequest {
  query_id: number;
}

export interface InsightGenerationResponse {
  query_id: number;
  insights: string;
  key_findings: string[];
  recommendations: string[];
}

// Admin Types
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface AdminLogin {
  username: string;
  password: string;
}

export interface AdminTokenResponse {
  access_token: string;
  token_type: string;
  admin: AdminUser;
}

export interface PlatformStats {
  total_users: number;
  active_users: number;
  total_data_sources: number;
  total_queries: number;
  total_storage_bytes: number;
  queries_today: number;
  new_users_today: number;
}

export interface UserListItem {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
  data_sources_count: number;
  queries_count: number;
}

export interface UserListResponse {
  users: UserListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface UserDetailResponse {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
  data_sources_count: number;
  queries_count: number;
  total_storage_bytes: number;
  recent_queries: Array<{
    id: number;
    question: string;
    status: string;
    created_at: string;
  }>;
}

export interface UserStatusUpdate {
  is_active: boolean;
}

export interface ActivityLog {
  id: number;
  user_id: number | null;
  username: string | null;
  activity_type: string;
  description: string;
  ip_address: string | null;
  created_at: string;
}

export interface ActivityFeedResponse {
  activities: ActivityLog[];
  total: number;
  page: number;
  page_size: number;
}

export interface SystemHealth {
  status: string;
  database: {
    status: string;
    response_time_ms: number;
  };
  api: {
    status: string;
    uptime_seconds: number;
  };
  storage: {
    used_bytes: number;
    used_mb: number;
    used_gb: number;
  };
}

export interface UserGrowthData {
  date: string;
  new_users: number;
  total_users: number;
}

export interface UserGrowthResponse {
  period: string;
  data: UserGrowthData[];
  total_new_users: number;
  growth_rate: number;
}

export interface UsagePattern {
  feature: string;
  usage_count: number;
  unique_users: number;
  percentage: number;
}

export interface UsagePatternsResponse {
  patterns: UsagePattern[];
  most_used_feature: string;
  total_actions: number;
}

export interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: AdminLogin) => Promise<void>;
  logout: () => void;
}

