"""
Data Router - API endpoints for data upload and management.
Handles CSV upload, data source CRUD, and data preview.
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.data_service import DataService
from app.schemas.data_source import (
    CSVUploadResponse,
    DataSourceResponse,
    DataSourceUpdate,
    DataSourceListResponse,
    DataPreviewResponse,
)


router = APIRouter(prefix="/data", tags=["Data Management"])


def get_data_service(db: Session = Depends(get_db)) -> DataService:
    """Dependency to get data service instance"""
    return DataService(db)


@router.post("/upload", response_model=CSVUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_csv_file(
    file: UploadFile = File(..., description="CSV file to upload"),
    name: Optional[str] = Query(None, description="Custom name for the data source"),
    current_user: User = Depends(get_current_user),
    service: DataService = Depends(get_data_service)
):
    """
    Upload a CSV file.
    
    - **file**: CSV file (max 50MB)
    - **name**: Optional custom name for the data source
    
    Returns:
    - Data source details with column information and sample data
    """
    return await service.upload_csv(file=file, user=current_user, name=name)


@router.get("/sources", response_model=DataSourceListResponse)
async def get_data_sources(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    source_type: Optional[str] = Query(None, description="Filter by source type (csv, database, api)"),
    current_user: User = Depends(get_current_user),
    service: DataService = Depends(get_data_service)
):
    """
    Get all data sources for the current user.
    
    - **skip**: Pagination offset (default: 0)
    - **limit**: Number of results (default: 20, max: 100)
    - **source_type**: Filter by type (optional)
    
    Returns:
    - List of data sources with pagination info
    """
    return service.get_data_sources(
        user=current_user,
        skip=skip,
        limit=limit,
        source_type=source_type
    )


@router.get("/source/{data_source_id}", response_model=DataSourceResponse)
async def get_data_source(
    data_source_id: int,
    current_user: User = Depends(get_current_user),
    service: DataService = Depends(get_data_service)
):
    """
    Get details of a specific data source.
    
    - **data_source_id**: ID of the data source
    
    Returns:
    - Data source details
    """
    return service.get_data_source(data_source_id=data_source_id, user=current_user)


@router.patch("/source/{data_source_id}", response_model=DataSourceResponse)
async def update_data_source(
    data_source_id: int,
    update_data: DataSourceUpdate,
    current_user: User = Depends(get_current_user),
    service: DataService = Depends(get_data_service)
):
    """
    Update a data source.
    
    - **data_source_id**: ID of the data source
    - **update_data**: Fields to update (name, description, is_active)
    
    Returns:
    - Updated data source details
    """
    return service.update_data_source(
        data_source_id=data_source_id,
        user=current_user,
        update_data=update_data
    )


@router.delete("/source/{data_source_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_data_source(
    data_source_id: int,
    current_user: User = Depends(get_current_user),
    service: DataService = Depends(get_data_service)
):
    """
    Delete a data source and its associated file.
    
    - **data_source_id**: ID of the data source
    
    Returns:
    - 204 No Content on success
    """
    service.delete_data_source(data_source_id=data_source_id, user=current_user)
    return None


@router.get("/source/{data_source_id}/preview", response_model=DataPreviewResponse)
async def preview_data_source(
    data_source_id: int,
    limit: int = Query(100, ge=1, le=1000, description="Number of rows to return"),
    offset: int = Query(0, ge=0, description="Number of rows to skip"),
    current_user: User = Depends(get_current_user),
    service: DataService = Depends(get_data_service)
):
    """
    Preview data from a data source.
    
    - **data_source_id**: ID of the data source
    - **limit**: Number of rows to return (default: 100, max: 1000)
    - **offset**: Number of rows to skip (default: 0)
    
    Returns:
    - Columns and rows from the data source
    """
    return service.preview_data(
        data_source_id=data_source_id,
        user=current_user,
        limit=limit,
        offset=offset
    )

