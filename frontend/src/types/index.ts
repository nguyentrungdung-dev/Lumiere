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

