"""
Pydantic schemas for Data Source module.
Handles CSV upload, database connections, and data source management.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum


class DataSourceType(str, Enum):
    """Type of data source"""
    CSV = "csv"
    DATABASE = "database"
    API = "api"


class ConnectionType(str, Enum):
    """Database connection type"""
    POSTGRESQL = "postgresql"
    MYSQL = "mysql"
    SQLITE = "sqlite"


# --- CSV Upload Schemas ---

class CSVUploadResponse(BaseModel):
    """Response after successful CSV upload"""
    id: int
    name: str
    source_type: str
    row_count: int
    column_count: int
    file_size: int
    columns: List[str]
    sample_data: List[Dict[str, Any]] = Field(..., description="First 5 rows")
    created_at: datetime
    
    class Config:
        from_attributes = True


class DataSourceBase(BaseModel):
    """Base schema for data source"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    source_type: DataSourceType


class DataSourceCreate(DataSourceBase):
    """Schema for creating a data source (used internally after file upload)"""
    connection_string: Optional[str] = None
    config: Optional[Dict[str, Any]] = None


class DataSourceUpdate(BaseModel):
    """Schema for updating a data source"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class DataSourceResponse(BaseModel):
    """Response schema for data source"""
    id: int
    user_id: int
    name: str
    description: Optional[str]
    source_type: str
    connection_string: Optional[str]
    config: Optional[Dict[str, Any]]
    row_count: Optional[int]
    column_count: Optional[int]
    file_size: Optional[int]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    last_synced_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class DataSourceListResponse(BaseModel):
    """Response for list of data sources"""
    data_sources: List[DataSourceResponse]
    total: int
    page: int = 1
    page_size: int = 20


# --- Database Connection Schemas ---

class DatabaseConnectionRequest(BaseModel):
    """Request to connect to external database"""
    name: str = Field(..., min_length=1, max_length=255)
    connection_type: ConnectionType
    host: str
    port: int = Field(..., gt=0, lt=65536)
    database: str
    username: str
    password: str
    description: Optional[str] = None
    
    @field_validator('password')
    @classmethod
    def password_not_empty(cls, v: str) -> str:
        if not v or v.strip() == "":
            raise ValueError("Password cannot be empty")
        return v


class DatabaseConnectionTestResponse(BaseModel):
    """Response after testing database connection"""
    success: bool
    message: str
    tables: Optional[List[str]] = None
    error: Optional[str] = None


class DatabaseConnectionResponse(BaseModel):
    """Response after creating database connection"""
    id: int
    name: str
    source_type: str
    connection_type: str
    host: str
    database: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# --- Data Preview Schemas ---

class DataPreviewRequest(BaseModel):
    """Request to preview data from a source"""
    limit: int = Field(default=100, gt=0, le=1000)
    offset: int = Field(default=0, ge=0)


class DataPreviewResponse(BaseModel):
    """Response with data preview"""
    columns: List[str]
    rows: List[Dict[str, Any]]
    total_rows: int
    returned_rows: int


# --- File Upload Validation ---

class FileUploadMetadata(BaseModel):
    """Metadata about uploaded file"""
    filename: str
    content_type: str
    file_size: int
    
    @field_validator('content_type')
    @classmethod
    def validate_content_type(cls, v: str) -> str:
        allowed_types = ['text/csv', 'application/vnd.ms-excel', 'application/csv']
        if v not in allowed_types:
            raise ValueError(f"Invalid file type. Must be CSV. Got: {v}")
        return v
    
    @field_validator('file_size')
    @classmethod
    def validate_file_size(cls, v: int) -> int:
        max_size = 50 * 1024 * 1024  # 50MB
        if v > max_size:
            raise ValueError(f"File size too large. Maximum: 50MB, Got: {v / 1024 / 1024:.2f}MB")
        if v == 0:
            raise ValueError("File is empty")
        return v


# --- Error Responses ---

class DataSourceError(BaseModel):
    """Error response for data source operations"""
    error: str
    detail: Optional[str] = None
    field: Optional[str] = None
