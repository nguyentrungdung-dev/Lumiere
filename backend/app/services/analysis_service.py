"""
Analysis Service - Chart and Insight generation from query results.
Uses LLM to generate visualizations and insights.
"""

import pandas as pd
from typing import Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.query import Query
from app.models.data_source import DataSource
from app.models.user import User
from app.services.llm_service import LLMService
from app.schemas.chart_insight import (
    ChartConfig,
    ChartDataset,
    ChartGenerationResponse,
    InsightGenerationResponse,
)


class AnalysisService:
    """Service for generating charts and insights"""
    
    def __init__(self, db: Session):
        self.db = db
        self.llm_service = LLMService()
    
    async def generate_chart(
        self,
        query_id: int,
        user: User
    ) -> ChartGenerationResponse:
        """
        Generate a chart configuration from query results.
        
        Args:
            query_id: ID of the query to visualize
            user: Current user
        
        Returns:
            ChartGenerationResponse with Chart.js config
        """
        # Get query
        query = self.db.query(Query).filter(
            Query.id == query_id,
            Query.user_id == user.id
        ).first()
        
        if not query:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Query not found"
            )
        
        if query.status != "success":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only generate charts for successful queries"
            )
        
        # Re-execute query to get fresh results
        # (In production, you might cache results)
        data_source = self.db.query(DataSource).filter(
            DataSource.id == query.data_source_id
        ).first()
        
        if not data_source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data source not found"
            )
        
        # Load data and execute SQL
        try:
            df = pd.read_csv(data_source.connection_string)
            from pandasql import sqldf
            data = df
            result_df = sqldf(query.sql_query, locals())
            
            # Convert to dict format
            query_results = {
                "columns": result_df.columns.tolist(),
                "rows": result_df.to_dict('records'),
                "row_count": len(result_df)
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to execute query: {str(e)}"
            )
        
        # Generate chart config using LLM
        try:
            chart_config_raw = self.llm_service.generate_chart_config(
                question=query.question,
                sql=query.sql_query,
                query_results=query_results
            )
            
            # Parse into ChartConfig schema
            datasets = []
            for ds in chart_config_raw.get("datasets", []):
                datasets.append(ChartDataset(
                    label=ds.get("label", "Data"),
                    data=ds.get("data", []),
                    backgroundColor=ds.get("backgroundColor"),
                    borderColor=ds.get("borderColor")
                ))
            
            chart_config = ChartConfig(
                type=chart_config_raw.get("type", "bar"),
                title=chart_config_raw.get("title", "Chart"),
                labels=chart_config_raw.get("labels", []),
                datasets=datasets,
                explanation=chart_config_raw.get("explanation", "")
            )
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate chart: {str(e)}"
            )
        
        return ChartGenerationResponse(
            query_id=query.id,
            config=chart_config,
            created_at=query.created_at
        )
    
    async def generate_insight(
        self,
        query_id: int,
        user: User
    ) -> InsightGenerationResponse:
        """
        Generate textual insights from query results.
        
        Args:
            query_id: ID of the query to analyze
            user: Current user
        
        Returns:
            InsightGenerationResponse with insights
        """
        # Get query
        query = self.db.query(Query).filter(
            Query.id == query_id,
            Query.user_id == user.id
        ).first()
        
        if not query:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Query not found"
            )
        
        if query.status != "success":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only generate insights for successful queries"
            )
        
        # Re-execute query to get fresh results
        data_source = self.db.query(DataSource).filter(
            DataSource.id == query.data_source_id
        ).first()
        
        if not data_source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data source not found"
            )
        
        # Load data and execute SQL
        try:
            df = pd.read_csv(data_source.connection_string)
            from pandasql import sqldf
            data = df
            result_df = sqldf(query.sql_query, locals())
            
            # Convert to dict format
            query_results = {
                "columns": result_df.columns.tolist(),
                "rows": result_df.to_dict('records'),
                "row_count": len(result_df)
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to execute query: {str(e)}"
            )
        
        # Generate insights using LLM
        try:
            insight_text = self.llm_service.generate_insight(
                question=query.question,
                sql=query.sql_query,
                query_results=query_results
            )
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate insights: {str(e)}"
            )
        
        return InsightGenerationResponse(
            query_id=query.id,
            insight_text=insight_text,
            key_findings=None,  # Could be extracted from insight_text
            created_at=query.created_at
        )

