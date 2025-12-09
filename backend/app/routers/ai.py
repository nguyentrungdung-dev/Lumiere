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
    GeneralChatRequest,
    GeneralChatResponse,
)
from app.schemas.chart_insight import (
    ChartGenerationRequest,
    ChartGenerationResponse,
    InsightGenerationRequest,
    InsightGenerationResponse,
)
from app.services.llm_service import LLMService


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
    
    return await service.execute_ai_query(query_request, current_user)


@router.get("/queries", response_model=QueryHistoryResponse)
async def get_query_history(
    skip: int = QueryParam(0, ge=0, description="Number of records to skip"),
    limit: int = QueryParam(20, ge=1, le=100, description="Number of records to return"),
    data_source_id: Optional[int] = QueryParam(None, description="Filter by data source"),
    current_user: User = Depends(get_current_user),
    service: QueryService = Depends(get_query_service)
):
   
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
    
    return service.get_query_detail(query_id, current_user)


@router.post("/query/{query_id}/rerun", response_model=AIQueryResponse)
async def rerun_query(
    query_id: int,
    current_user: User = Depends(get_current_user),
    service: QueryService = Depends(get_query_service)
):
  
    return await service.rerun_query(query_id, current_user)


@router.delete("/query/{query_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_query(
    query_id: int,
    current_user: User = Depends(get_current_user),
    service: QueryService = Depends(get_query_service)
):
    
    service.delete_query(query_id, current_user)
    return None


@router.post("/chart", response_model=ChartGenerationResponse)
async def generate_chart(
    request: ChartGenerationRequest,
    current_user: User = Depends(get_current_user),
    service: AnalysisService = Depends(get_analysis_service)
):
    
    return await service.generate_chart(request.query_id, current_user)


@router.post("/insight", response_model=InsightGenerationResponse)
async def generate_insight(
    request: InsightGenerationRequest,
    current_user: User = Depends(get_current_user),
    service: AnalysisService = Depends(get_analysis_service)
):
    
    return await service.generate_insight(request.query_id, current_user)


@router.post("/chat", response_model=GeneralChatResponse)
async def general_chat(
    request: GeneralChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    General AI chat endpoint for non-data-specific conversations.
    Allows users to ask any questions and have general conversations with the AI.
    """
    try:
        llm_service = LLMService()
        response_text = llm_service.general_chat(
            message=request.message,
            conversation_history=request.conversation_history
        )
        
        return GeneralChatResponse(message=response_text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat error: {str(e)}"
        )

