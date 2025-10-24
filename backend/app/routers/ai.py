"""
AI Router - API endpoints for AI-powered query generation and execution.
Handles natural language to SQL conversion and query history.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query as QueryParam
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.query_service import QueryService
from app.services.analysis_service import AnalysisService
from app.schemas.ai_query import (
    AIQueryRequest,
    AIQueryResponse,
    QueryHistoryResponse,
    QueryDetailResponse,
    RerunQueryRequest,
)
from app.schemas.chart_insight import (
    ChartGenerationRequest,
    ChartGenerationResponse,
    InsightGenerationRequest,
    InsightGenerationResponse,
)


router = APIRouter(prefix="/ai", tags=["AI Query"])


def get_query_service(db: Session = Depends(get_db)) -> QueryService:
    """Dependency to get query service instance"""
    return QueryService(db)


def get_analysis_service(db: Session = Depends(get_db)) -> AnalysisService:
    """Dependency to get analysis service instance"""
    return AnalysisService(db)


@router.post("/query", response_model=AIQueryResponse, status_code=status.HTTP_201_CREATED)
async def execute_ai_query(
    query_request: AIQueryRequest,
    current_user: User = Depends(get_current_user),
    service: QueryService = Depends(get_query_service)
):
    """
    Execute an AI-powered query.
    
    **Workflow**:
    1. User provides natural language question
    2. LLM generates SQL query
    3. SQL is executed on the data source (if execute=true)
    4. Results are returned with explanation
    
    **Request Body**:
    - `data_source_id`: ID of the data source to query
    - `question`: Natural language question (e.g., "What were total sales by region?")
    - `execute`: Whether to execute the SQL (default: true)
    
    **Returns**:
    - Generated SQL query
    - Explanation of what the query does
    - Query results (if executed)
    - Query ID for history
    
    **Example**:
    ```json
    {
      "data_source_id": 1,
      "question": "What were the top 5 products by sales?",
      "execute": true
    }
    ```
    """
    return await service.execute_ai_query(query_request, current_user)


@router.get("/queries", response_model=QueryHistoryResponse)
async def get_query_history(
    skip: int = QueryParam(0, ge=0, description="Number of records to skip"),
    limit: int = QueryParam(20, ge=1, le=100, description="Number of records to return"),
    data_source_id: Optional[int] = QueryParam(None, description="Filter by data source"),
    current_user: User = Depends(get_current_user),
    service: QueryService = Depends(get_query_service)
):
    """
    Get query history for the current user.
    
    **Query Parameters**:
    - `skip`: Pagination offset (default: 0)
    - `limit`: Results per page (default: 20, max: 100)
    - `data_source_id`: Filter by specific data source (optional)
    
    **Returns**:
    - List of previous queries with metadata
    - Pagination information
    """
    return service.get_query_history(
        user=current_user,
        skip=skip,
        limit=limit,
        data_source_id=data_source_id
    )


@router.get("/query/{query_id}", response_model=QueryDetailResponse)
async def get_query_detail(
    query_id: int,
    current_user: User = Depends(get_current_user),
    service: QueryService = Depends(get_query_service)
):
    """
    Get detailed information about a specific query.
    
    **Path Parameters**:
    - `query_id`: ID of the query
    
    **Returns**:
    - Full query details including SQL, status, and metadata
    - Note: Full results are not stored, use rerun to get fresh results
    """
    return service.get_query_detail(query_id, current_user)


@router.post("/query/{query_id}/rerun", response_model=AIQueryResponse)
async def rerun_query(
    query_id: int,
    current_user: User = Depends(get_current_user),
    service: QueryService = Depends(get_query_service)
):
    """
    Re-run a previous query.
    
    **Path Parameters**:
    - `query_id`: ID of the query to re-run
    
    **Returns**:
    - Fresh query results
    - New query ID (creates a new history entry)
    """
    return await service.rerun_query(query_id, current_user)


@router.delete("/query/{query_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_query(
    query_id: int,
    current_user: User = Depends(get_current_user),
    service: QueryService = Depends(get_query_service)
):
    """
    Delete a query from history.
    
    **Path Parameters**:
    - `query_id`: ID of the query to delete
    
    **Returns**:
    - 204 No Content on success
    """
    service.delete_query(query_id, current_user)
    return None


@router.post("/chart", response_model=ChartGenerationResponse)
async def generate_chart(
    request: ChartGenerationRequest,
    current_user: User = Depends(get_current_user),
    service: AnalysisService = Depends(get_analysis_service)
):
    """
    Generate a chart configuration from query results.
    
    **Request Body**:
    - `query_id`: ID of a successful query to visualize
    
    **Returns**:
    - Chart.js compatible configuration
    - Recommended chart type (bar, line, pie, etc.)
    - Labels and datasets
    - Explanation of why this chart was chosen
    
    **Example**:
    ```json
    {
      "query_id": 1
    }
    ```
    
    **Use Case**:
    After running a query, use this endpoint to automatically generate
    the best chart visualization for the results.
    """
    return await service.generate_chart(request.query_id, current_user)


@router.post("/insight", response_model=InsightGenerationResponse)
async def generate_insight(
    request: InsightGenerationRequest,
    current_user: User = Depends(get_current_user),
    service: AnalysisService = Depends(get_analysis_service)
):
    """
    Generate textual insights from query results.
    
    **Request Body**:
    - `query_id`: ID of a successful query to analyze
    
    **Returns**:
    - Natural language insights
    - Key findings
    - Business recommendations
    
    **Example**:
    ```json
    {
      "query_id": 1
    }
    ```
    
    **Use Case**:
    After running a query, use this endpoint to get AI-generated
    insights and recommendations based on the data.
    """
    return await service.generate_insight(request.query_id, current_user)

