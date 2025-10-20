"""
Pydantic schemas for Data Source API endpoints.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DataSourceBase(BaseModel):
    """Base data source schema."""
    name: str
    type: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    database_name: Optional[str] = None
    username: Optional[str] = None


class DataSourceCreate(DataSourceBase):
    """Schema for creating a new data source."""
    password: Optional[str] = None
    connection_string: Optional[str] = None
    ssl_mode: Optional[str] = None


class DataSourceUpdate(BaseModel):
    """Schema for updating a data source."""
    name: Optional[str] = None
    is_active: Optional[bool] = None


class DataSourceOut(DataSourceBase):
    """Schema for data source output."""
    id: int
    is_active: bool
    owner_user_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

