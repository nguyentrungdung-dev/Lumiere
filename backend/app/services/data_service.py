"""
Data Service - Business logic for data upload and management.
Handles CSV parsing, file storage, and data source operations.
"""

import pandas as pd
import io
import os
from typing import Optional, List, Dict, Any, BinaryIO
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status

from app.models.data_source import DataSource
from app.models.user import User
from app.schemas.data_source import (
    CSVUploadResponse,
    DataSourceResponse,
    DataSourceUpdate,
    DataSourceListResponse,
    DataPreviewResponse,
)
from app.core.config import settings


class DataService:
    """Service for managing data sources and file uploads"""
    
    def __init__(self, db: Session):
        self.db = db
        self.upload_dir = "uploads/csv"  # Can be moved to settings
        self._ensure_upload_dir()
    
    def _ensure_upload_dir(self):
        """Create upload directory if it doesn't exist"""
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def upload_csv(
        self, 
        file: UploadFile, 
        user: User,
        name: Optional[str] = None
    ) -> CSVUploadResponse:
        """
        Upload and parse CSV file.
        Stores file on disk and creates database record.
        """
        # Validate file type
        if not file.content_type in ['text/csv', 'application/vnd.ms-excel', 'application/csv']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only CSV files are allowed."
            )
        
        # Read file content
        try:
            contents = await file.read()
            file_size = len(contents)
            
            # Validate file size (50MB max)
            max_size = 50 * 1024 * 1024  # 50MB
            if file_size > max_size:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File too large. Maximum size: 50MB, your file: {file_size / 1024 / 1024:.2f}MB"
                )
            
            if file_size == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="File is empty"
                )
            
            # Parse CSV with pandas
            df = pd.read_csv(io.BytesIO(contents))
            
            if df.empty:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="CSV file contains no data"
                )
            
            row_count = len(df)
            column_count = len(df.columns)
            columns = df.columns.tolist()
            
            # Get sample data (first 5 rows)
            sample_data = df.head(5).to_dict('records')
            
            # Generate unique filename
            filename = f"user_{user.id}_{file.filename}"
            file_path = os.path.join(self.upload_dir, filename)
            
            # Save file to disk
            with open(file_path, 'wb') as f:
                f.write(contents)
            
            # Create database record
            data_source = DataSource(
                user_id=user.id,
                name=name or file.filename,
                source_type="csv",
                connection_string=file_path,  # Store file path
                row_count=row_count,
                column_count=column_count,
                file_size=file_size,
                config={"columns": columns},
                is_active=True
            )
            
            self.db.add(data_source)
            self.db.commit()
            self.db.refresh(data_source)
            
            return CSVUploadResponse(
                id=data_source.id,
                name=data_source.name,
                source_type=data_source.source_type,
                row_count=row_count,
                column_count=column_count,
                file_size=file_size,
                columns=columns,
                sample_data=sample_data,
                created_at=data_source.created_at
            )
            
        except pd.errors.EmptyDataError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CSV file is empty or invalid"
            )
        except pd.errors.ParserError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse CSV file: {str(e)}"
            )
        except Exception as e:
            # Clean up file if it was saved
            if 'file_path' in locals() and os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing file: {str(e)}"
            )
    
    def get_data_sources(
        self,
        user: User,
        skip: int = 0,
        limit: int = 20,
        source_type: Optional[str] = None
    ) -> DataSourceListResponse:
        """Get all data sources for a user"""
        query = self.db.query(DataSource).filter(DataSource.user_id == user.id)
        
        if source_type:
            query = query.filter(DataSource.source_type == source_type)
        
        total = query.count()
        data_sources = query.offset(skip).limit(limit).all()
        
        return DataSourceListResponse(
            data_sources=[DataSourceResponse.model_validate(ds) for ds in data_sources],
            total=total,
            page=(skip // limit) + 1 if limit > 0 else 1,
            page_size=limit
        )
    
    def get_data_source(
        self,
        data_source_id: int,
        user: User
    ) -> DataSourceResponse:
        """Get a specific data source by ID"""
        data_source = self.db.query(DataSource).filter(
            DataSource.id == data_source_id,
            DataSource.user_id == user.id
        ).first()
        
        if not data_source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data source not found"
            )
        
        return DataSourceResponse.model_validate(data_source)
    
    def update_data_source(
        self,
        data_source_id: int,
        user: User,
        update_data: DataSourceUpdate
    ) -> DataSourceResponse:
        """Update a data source"""
        data_source = self.db.query(DataSource).filter(
            DataSource.id == data_source_id,
            DataSource.user_id == user.id
        ).first()
        
        if not data_source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data source not found"
            )
        
        # Update fields
        update_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(data_source, key, value)
        
        self.db.commit()
        self.db.refresh(data_source)
        
        return DataSourceResponse.model_validate(data_source)
    
    def delete_data_source(
        self,
        data_source_id: int,
        user: User
    ) -> bool:
        """Delete a data source and its associated file"""
        data_source = self.db.query(DataSource).filter(
            DataSource.id == data_source_id,
            DataSource.user_id == user.id
        ).first()
        
        if not data_source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data source not found"
            )
        
        # Delete file from disk if it's a CSV
        if data_source.source_type == "csv" and data_source.connection_string:
            file_path = data_source.connection_string
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Warning: Failed to delete file {file_path}: {e}")
        
        # Delete database record
        self.db.delete(data_source)
        self.db.commit()
        
        return True
    
    def preview_data(
        self,
        data_source_id: int,
        user: User,
        limit: int = 100,
        offset: int = 0
    ) -> DataPreviewResponse:
        """Preview data from a data source"""
        data_source = self.db.query(DataSource).filter(
            DataSource.id == data_source_id,
            DataSource.user_id == user.id
        ).first()
        
        if not data_source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data source not found"
            )
        
        if data_source.source_type == "csv":
            return self._preview_csv(data_source, limit, offset)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Preview not supported for source type: {data_source.source_type}"
            )
    
    def _preview_csv(
        self,
        data_source: DataSource,
        limit: int,
        offset: int
    ) -> DataPreviewResponse:
        """Preview data from a CSV file"""
        file_path = data_source.connection_string
        
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data file not found on disk"
            )
        
        try:
            # Read CSV with pandas
            df = pd.read_csv(file_path)
            
            total_rows = len(df)
            columns = df.columns.tolist()
            
            # Apply offset and limit
            df_slice = df.iloc[offset:offset + limit]
            rows = df_slice.to_dict('records')
            
            return DataPreviewResponse(
                columns=columns,
                rows=rows,
                total_rows=total_rows,
                returned_rows=len(rows)
            )
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error reading data: {str(e)}"
            )

