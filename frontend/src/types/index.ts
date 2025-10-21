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

