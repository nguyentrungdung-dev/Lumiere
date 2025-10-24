"""
Query Service - Execute SQL queries on CSV data and manage query history.
Uses pandasql to run SQL queries on pandas DataFrames.
"""

import time
import pandas as pd
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.query import Query
from app.models.data_source import DataSource
from app.models.user import User
from app.services.llm_service import LLMService
from app.schemas.ai_query import (
    AIQueryRequest,
    AIQueryResponse,
    QueryExecutionResult,
    QueryStatus,
    QueryHistoryResponse,
    QueryHistoryItem,
    QueryDetailResponse,
)


# Pandasql for SQL execution on DataFrames
try:
    from pandasql import sqldf
except ImportError:
    # Fallback if pandasql is not installed
    sqldf = None
    print("Warning: pandasql not installed. Install with: pip install pandasql")


class QueryService:
    """Service for managing AI queries and execution"""
    
    def __init__(self, db: Session):
        self.db = db
        self.llm_service = LLMService()
    
    async def execute_ai_query(
        self,
        query_request: AIQueryRequest,
        user: User
    ) -> AIQueryResponse:
        """
        Execute an AI-powered query:
        1. Load data from data source
        2. Generate SQL using LLM
        3. Execute SQL on the data
        4. Store query in history
        5. Return results
        """
        # Get data source
        data_source = self.db.query(DataSource).filter(
            DataSource.id == query_request.data_source_id,
            DataSource.user_id == user.id
        ).first()
        
        if not data_source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data source not found"
            )
        
        # Load CSV data
        try:
            df = pd.read_csv(data_source.connection_string)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to load data source: {str(e)}"
            )
        
        # Prepare schema info for LLM
        table_schema = {
            "columns": df.columns.tolist(),
            "row_count": len(df),
            "column_types": {col: str(dtype) for col, dtype in df.dtypes.items()}
        }
        
        # Get sample data
        sample_data = df.head(5).to_dict('records')
        
        # Generate SQL using LLM
        try:
            llm_result = self.llm_service.generate_sql(
                question=query_request.question,
                table_schema=table_schema,
                sample_data=sample_data
            )
            
            sql_query = llm_result["sql"]
            explanation = llm_result["explanation"]
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate SQL: {str(e)}"
            )
        
        # Create query record
        query_record = Query(
            user_id=user.id,
            data_source_id=data_source.id,
            question=query_request.question,
            sql_query=sql_query,
            status="pending"
        )
        self.db.add(query_record)
        self.db.commit()
        self.db.refresh(query_record)
        
        # Execute SQL if requested
        result = None
        error = None
        query_status = QueryStatus.SUCCESS
        
        if query_request.execute:
            try:
                result, exec_time = self._execute_sql(df, sql_query)
                query_record.status = "success"
                query_record.execution_time = exec_time
                query_record.result_row_count = result["row_count"]
            except Exception as e:
                error = str(e)
                query_status = QueryStatus.ERROR
                query_record.status = "error"
                query_record.error_message = error
        else:
            query_status = QueryStatus.PENDING
        
        self.db.commit()
        self.db.refresh(query_record)
        
        # Build response
        return AIQueryResponse(
            query_id=query_record.id,
            data_source_id=data_source.id,
            question=query_request.question,
            sql=sql_query,
            explanation=explanation,
            status=query_status,
            result=result,
            error=error,
            created_at=query_record.created_at
        )
    
    def _execute_sql(
        self,
        df: pd.DataFrame,
        sql_query: str
    ) -> tuple[QueryExecutionResult, float]:
        """
        Execute SQL query on DataFrame using pandasql.
        
        Returns:
            Tuple of (QueryExecutionResult, execution_time_ms)
        """
        if sqldf is None:
            raise Exception("pandasql is not installed. Cannot execute SQL queries.")
        
        # Measure execution time
        start_time = time.time()
        
        try:
            # Rename DataFrame to 'data' for query execution
            data = df
            
            # Execute SQL using pandasql
            result_df = sqldf(sql_query, locals())
            
            execution_time = (time.time() - start_time) * 1000  # Convert to ms
            
            # Convert result to dict format
            columns = result_df.columns.tolist()
            rows = result_df.to_dict('records')
            
            # Convert numpy types to Python types for JSON serialization
            rows = self._convert_numpy_types(rows)
            
            return QueryExecutionResult(
                columns=columns,
                rows=rows,
                row_count=len(rows),
                execution_time_ms=round(execution_time, 2)
            ), execution_time
            
        except Exception as e:
            raise Exception(f"SQL execution error: {str(e)}")
    
    def _convert_numpy_types(self, rows: List[Dict]) -> List[Dict]:
        """Convert numpy types to Python types for JSON serialization"""
        import numpy as np
        
        converted_rows = []
        for row in rows:
            converted_row = {}
            for key, value in row.items():
                # Convert numpy types to Python types
                if isinstance(value, (np.integer, np.int64, np.int32)):
                    converted_row[key] = int(value)
                elif isinstance(value, (np.floating, np.float64, np.float32)):
                    converted_row[key] = float(value)
                elif isinstance(value, np.bool_):
                    converted_row[key] = bool(value)
                elif pd.isna(value):
                    converted_row[key] = None
                else:
                    converted_row[key] = value
            converted_rows.append(converted_row)
        
        return converted_rows
    
    def get_query_history(
        self,
        user: User,
        skip: int = 0,
        limit: int = 20,
        data_source_id: Optional[int] = None
    ) -> QueryHistoryResponse:
        """Get query history for a user"""
        query = self.db.query(Query).filter(Query.user_id == user.id)
        
        if data_source_id:
            query = query.filter(Query.data_source_id == data_source_id)
        
        total = query.count()
        queries = query.order_by(Query.created_at.desc()).offset(skip).limit(limit).all()
        
        # Build response
        history_items = []
        for q in queries:
            data_source = self.db.query(DataSource).filter(
                DataSource.id == q.data_source_id
            ).first()
            
            history_items.append(QueryHistoryItem(
                id=q.id,
                data_source_id=q.data_source_id,
                data_source_name=data_source.name if data_source else "Unknown",
                question=q.question,
                sql=q.sql_query,
                status=QueryStatus(q.status),
                row_count=q.result_row_count,
                created_at=q.created_at,
                execution_time_ms=q.execution_time
            ))
        
        return QueryHistoryResponse(
            queries=history_items,
            total=total,
            page=(skip // limit) + 1 if limit > 0 else 1,
            page_size=limit
        )
    
    def get_query_detail(
        self,
        query_id: int,
        user: User
    ) -> QueryDetailResponse:
        """Get detailed query information including results"""
        query = self.db.query(Query).filter(
            Query.id == query_id,
            Query.user_id == user.id
        ).first()
        
        if not query:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Query not found"
            )
        
        data_source = self.db.query(DataSource).filter(
            DataSource.id == query.data_source_id
        ).first()
        
        # If query has results stored, retrieve them
        result = None
        if query.status == "success" and query.result_row_count:
            # For now, we don't store full results in DB
            # In production, you might want to cache results in Redis or similar
            result = None
        
        return QueryDetailResponse(
            id=query.id,
            data_source_id=query.data_source_id,
            data_source_name=data_source.name if data_source else "Unknown",
            user_id=query.user_id,
            question=query.question,
            sql=query.sql_query,
            explanation=None,  # Could be stored in DB if needed
            status=QueryStatus(query.status),
            result=result,
            error=query.error_message,
            created_at=query.created_at,
            execution_time_ms=query.execution_time
        )
    
    async def rerun_query(
        self,
        query_id: int,
        user: User
    ) -> AIQueryResponse:
        """Re-run a previous query"""
        # Get original query
        original_query = self.db.query(Query).filter(
            Query.id == query_id,
            Query.user_id == user.id
        ).first()
        
        if not original_query:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Query not found"
            )
        
        # Re-run the query with same parameters
        query_request = AIQueryRequest(
            data_source_id=original_query.data_source_id,
            question=original_query.question,
            execute=True
        )
        
        return await self.execute_ai_query(query_request, user)
    
    def delete_query(
        self,
        query_id: int,
        user: User
    ) -> bool:
        """Delete a query from history"""
        query = self.db.query(Query).filter(
            Query.id == query_id,
            Query.user_id == user.id
        ).first()
        
        if not query:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Query not found"
            )
        
        self.db.delete(query)
        self.db.commit()
        
        return True

