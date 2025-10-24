"""
Admin-related Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# Admin Authentication
class AdminLogin(BaseModel):
    """Admin login request schema."""
    username: str
    password: str


class AdminTokenResponse(BaseModel):
    """Admin login response schema."""
    access_token: str
    token_type: str = "bearer"
    admin: 'AdminInfo'


class AdminInfo(BaseModel):
    """Admin user information."""
    username: str
    is_admin: bool = True
    
    class Config:
        from_attributes = True


# Platform Statistics
class PlatformStats(BaseModel):
    """Platform-wide statistics."""
    total_users: int
    total_data_sources: int
    total_conversations: int
    total_storage: str  # Human-readable format (e.g., "487 GB")
    user_growth: float  # Percentage change
    data_source_growth: float
    conversation_growth: float
    storage_growth: float


# User Management
class UserListItem(BaseModel):
    """User item in list (with masked data)."""
    id: int
    username: str
    email: str  # Will be masked by service
    phone: Optional[str] = None  # Will be masked by service
    full_name: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None
    
    # Statistics
    data_sources_count: Optional[int] = 0
    conversations_count: Optional[int] = 0
    
    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Paginated user list response."""
    users: List[UserListItem]
    total: int
    page: int
    page_size: int
    total_pages: int


class UserDetail(BaseModel):
    """Detailed user information."""
    id: int
    username: str
    email: str  # Masked
    phone: Optional[str] = None  # Masked
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    locale: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    
    # Statistics
    data_sources_count: int = 0
    conversations_count: int = 0
    queries_count: int = 0
    total_storage: str = "0 B"
    
    class Config:
        from_attributes = True


class UserStatusUpdate(BaseModel):
    """Update user status request."""
    is_active: bool


# Activity Feed
class ActivityItem(BaseModel):
    """Activity feed item."""
    id: int
    type: str  # 'user_register', 'data_upload', 'system', etc.
    description: str
    user_id: Optional[int] = None
    username: Optional[str] = None
    timestamp: datetime
    metadata: Optional[dict] = None
    
    class Config:
        from_attributes = True


class ActivityFeedResponse(BaseModel):
    """Activity feed response."""
    activities: List[ActivityItem]
    total: int
    page: int
    page_size: int


# System Health
class SystemHealth(BaseModel):
    """System health metrics."""
    api_status: str  # 'healthy', 'degraded', 'down'
    database_status: str
    error_rate: str  # e.g., "0.02%"
    avg_response_time: str  # e.g., "245ms"
    uptime: str  # e.g., "99.98%"
    last_backup: Optional[datetime] = None
    disk_usage: Optional[str] = None


# Analytics
class UserGrowthData(BaseModel):
    """User growth analytics data point."""
    date: str  # YYYY-MM-DD format
    count: int
    new_users: int


class UserGrowthResponse(BaseModel):
    """User growth analytics response."""
    data: List[UserGrowthData]
    period: str  # 'day', 'week', 'month'
    total_users: int


class UsagePattern(BaseModel):
    """Usage pattern data."""
    feature: str
    usage_count: int
    percentage: float


class UsagePatternsResponse(BaseModel):
    """Usage patterns response."""
    patterns: List[UsagePattern]
    total_usage: int

