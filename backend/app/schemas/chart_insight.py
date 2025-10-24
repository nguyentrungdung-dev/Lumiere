"""
Pydantic schemas for Chart and Insight generation.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


# --- Chart Generation Schemas ---

class ChartGenerationRequest(BaseModel):
    """Request to generate chart configuration"""
    query_id: int = Field(..., description="ID of the query to visualize")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query_id": 1
            }
        }


class ChartDataset(BaseModel):
    """Dataset for a chart"""
    label: str
    data: List[Any]
    backgroundColor: Optional[str] = None
    borderColor: Optional[str] = None


class ChartConfig(BaseModel):
    """Chart.js compatible configuration"""
    type: str = Field(..., description="Chart type: bar, line, pie, doughnut, scatter")
    title: str
    labels: List[str]
    datasets: List[ChartDataset]
    explanation: str = Field(..., description="Why this chart type was chosen")


class ChartGenerationResponse(BaseModel):
    """Response from chart generation"""
    query_id: int
    config: ChartConfig
    created_at: datetime
    
    class Config:
        from_attributes = True


# --- Insight Generation Schemas ---

class InsightGenerationRequest(BaseModel):
    """Request to generate insights"""
    query_id: int = Field(..., description="ID of the query to analyze")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query_id": 1
            }
        }


class InsightGenerationResponse(BaseModel):
    """Response from insight generation"""
    query_id: int
    insight_text: str = Field(..., description="Generated insights")
    key_findings: Optional[List[str]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# --- Combined AI Response Schema ---

class CompleteAIAnalysisRequest(BaseModel):
    """Request for complete AI analysis (SQL + Chart + Insights)"""
    data_source_id: int
    question: str = Field(..., min_length=5, max_length=500)


class CompleteAIAnalysisResponse(BaseModel):
    """Complete AI analysis response"""
    query_id: int
    question: str
    sql: str
    explanation: str
    result: Optional[Dict[str, Any]] = None
    chart_config: Optional[ChartConfig] = None
    insights: Optional[str] = None
    status: str
    error: Optional[str] = None
    created_at: datetime

