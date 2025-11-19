"""
Data Service - Business logic for data upload and management.
Handles CSV and Excel file parsing, file storage, and data source operations.
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
    
    # Supported file extensions and their types
    SUPPORTED_EXTENSIONS = {
        '.csv': 'csv',
        '.xlsx': 'excel',
        '.xls': 'excel'
    }
    
    def __init__(self, db: Session):
        self.db = db
        self.upload_dir = "uploads/csv"  # Directory for all data files
        self._ensure_upload_dir()
    
    def _ensure_upload_dir(self):
        """Create upload directory if it doesn't exist"""
        os.makedirs(self.upload_dir, exist_ok=True)
    
    def _get_file_extension(self, filename: str) -> str:
        """Get file extension in lowercase"""
        return os.path.splitext(filename)[1].lower()
    
    def _is_supported_file(self, filename: str) -> tuple[bool, Optional[str]]:
        """
        Check if file is supported and return its type.
        Returns: (is_supported, file_type)
        """
        ext = self._get_file_extension(filename)
        if ext in self.SUPPORTED_EXTENSIONS:
            return True, self.SUPPORTED_EXTENSIONS[ext]
        return False, None
    
    async def upload_csv(
        self, 
        file: UploadFile, 
        user: User,
        name: Optional[str] = None
    ) -> CSVUploadResponse:
        """
        Upload and parse CSV or Excel file.
        Stores file on disk and creates database record.
        Supports: .csv, .xlsx, .xls formats
        """
        # Validate file extension (more reliable than content_type)
        is_supported, file_type = self._is_supported_file(file.filename or '')
        
        if not is_supported:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only CSV (.csv) and Excel (.xlsx, .xls) files are allowed."
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
            
            # Parse file based on type
            if file_type == 'csv':
                df = pd.read_csv(io.BytesIO(contents))
            else:  # Excel file
                try:
                    df = pd.read_excel(io.BytesIO(contents), engine='openpyxl')
                except Exception as excel_error:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Failed to parse Excel file: {str(excel_error)}. Make sure openpyxl is installed."
                    )
            
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
                owner_user_id=user.id,
                name=name or file.filename,
                source_type=file_type,  # Store actual file type (csv or excel)
                connection_string=file_path,  # Store file path
                row_count=row_count,
                column_count=column_count,
                file_size=file_size,
                config={"columns": columns, "file_extension": self._get_file_extension(file.filename or '')},
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
                detail="File is empty or invalid"
            )
        except pd.errors.ParserError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse file: {str(e)}"
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
        query = self.db.query(DataSource).filter(DataSource.owner_user_id == user.id)
        
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
            DataSource.owner_user_id == user.id
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
            DataSource.owner_user_id == user.id
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
            DataSource.owner_user_id == user.id
        ).first()
        
        if not data_source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data source not found"
            )
        
        # Delete file from disk if it's a CSV or Excel file
        if data_source.source_type in ["csv", "excel"] and data_source.connection_string:
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
            DataSource.owner_user_id == user.id
        ).first()
        
        if not data_source:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data source not found"
            )
        
        if data_source.source_type in ["csv", "excel"]:
            return self._preview_file(data_source, limit, offset)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Preview not supported for source type: {data_source.source_type}"
            )
    
    def _preview_file(
        self,
        data_source: DataSource,
        limit: int,
        offset: int
    ) -> DataPreviewResponse:
        """Preview data from a CSV or Excel file"""
        file_path = data_source.connection_string
        
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data file not found on disk"
            )
        
        try:
            # Read file based on source type
            if data_source.source_type == "csv":
                df = pd.read_csv(file_path)
            elif data_source.source_type == "excel":
                # Get file extension from config if available
                file_ext = data_source.config.get('file_extension', '.xlsx') if data_source.config else '.xlsx'
                df = pd.read_excel(file_path, engine='openpyxl')
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported file type: {data_source.source_type}"
                )
            
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

