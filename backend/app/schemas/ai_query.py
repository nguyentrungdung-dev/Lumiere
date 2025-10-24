"""
Pydantic schemas for AI Query module.
Handles natural language to SQL conversion and query execution.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class QueryStatus(str, Enum):
    """Status of a query execution"""
    SUCCESS = "success"
    ERROR = "error"
    PENDING = "pending"


# --- AI Query Request/Response Schemas ---

class AIQueryRequest(BaseModel):
    """Request to generate SQL from natural language"""
    data_source_id: int = Field(..., description="ID of the data source to query")
    question: str = Field(..., min_length=5, max_length=500, description="Natural language question")
    execute: bool = Field(default=True, description="Whether to execute the generated SQL")
    
    class Config:
        json_schema_extra = {
            "example": {
                "data_source_id": 1,
                "question": "What were the total sales by region?",
                "execute": True
            }
        }


class SQLGenerationResponse(BaseModel):
    """Response from SQL generation (without execution)"""
    sql: str = Field(..., description="Generated SQL query")
    explanation: str = Field(..., description="Explanation of what the query does")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score 0-1")


class QueryExecutionResult(BaseModel):
    """Results from query execution"""
    columns: List[str]
    rows: List[Dict[str, Any]]
    row_count: int
    execution_time_ms: float


class AIQueryResponse(BaseModel):
    """Complete response from AI query endpoint"""
    query_id: int
    data_source_id: int
    question: str
    sql: str
    explanation: str
    status: QueryStatus
    result: Optional[QueryExecutionResult] = None
    error: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# --- Query History Schemas ---

class QueryHistoryItem(BaseModel):
    """Single item in query history"""
    id: int
    data_source_id: int
    data_source_name: str
    question: str
    sql: str
    status: QueryStatus
    row_count: Optional[int] = None
    created_at: datetime
    execution_time_ms: Optional[float] = None
    
    class Config:
        from_attributes = True


class QueryHistoryResponse(BaseModel):
    """Response for query history list"""
    queries: List[QueryHistoryItem]
    total: int
    page: int
    page_size: int


class QueryDetailResponse(BaseModel):
    """Detailed query response with full results"""
    id: int
    data_source_id: int
    data_source_name: str
    user_id: int
    question: str
    sql: str
    explanation: Optional[str]
    status: QueryStatus
    result: Optional[QueryExecutionResult] = None
    error: Optional[str] = None
    created_at: datetime
    execution_time_ms: Optional[float] = None
    
    class Config:
        from_attributes = True


# --- SQL Validation Schemas ---

class SQLValidationRequest(BaseModel):
    """Request to validate SQL query"""
    sql: str = Field(..., min_length=1, max_length=5000)
    data_source_id: int


class SQLValidationResponse(BaseModel):
    """Response from SQL validation"""
    is_valid: bool
    error: Optional[str] = None
    suggested_fix: Optional[str] = None


# --- Re-run Query Schema ---

class RerunQueryRequest(BaseModel):
    """Request to re-run a previous query"""
    query_id: int = Field(..., description="ID of the query to re-run")


# --- Error Schema ---

class AIQueryError(BaseModel):
    """Error response for AI query operations"""
    error: str
    detail: Optional[str] = None
    sql: Optional[str] = None

