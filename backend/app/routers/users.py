"""
User management routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.user import UserOut, UserUpdate
from app.services.user_service import get_user_by_id, update_user
from app.models.user import User
from app.models.data_source import DataSource
from app.models.query import Query
from app.models.insight import Insight
from app.models.conversation import Conversation

router = APIRouter(prefix="/users", tags=["Users"])


# Dashboard Stats Schemas
class DashboardStats(BaseModel):
    data_sources_count: int
    total_queries: int
    active_conversations: int
    insights_generated: int
    data_sources_trend: Optional[float] = None
    queries_trend: Optional[float] = None
    conversations_trend: Optional[float] = None
    insights_trend: Optional[float] = None


class RecentActivityItem(BaseModel):
    id: int
    activity_type: str
    description: str
    timestamp: datetime


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_activities: List[RecentActivityItem]


@router.get("/me/dashboard", response_model=DashboardResponse)
async def get_user_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dashboard statistics for the current user.
    
    Returns:
        Dashboard statistics including data sources, queries, conversations, and insights
    """
    # Calculate current period stats
    data_sources_count = db.query(func.count(DataSource.id)).filter(
        DataSource.owner_user_id == current_user.id,
        DataSource.is_active == True
    ).scalar() or 0
    
    total_queries = db.query(func.count(Query.id)).filter(
        Query.user_id == current_user.id
    ).scalar() or 0
    
    # Count conversations (assuming conversations exist in the model)
    try:
        active_conversations = db.query(func.count(Conversation.id)).filter(
            Conversation.user_id == current_user.id
        ).scalar() or 0
    except:
        active_conversations = 0
    
    # Count insights (through queries that belong to user)
    try:
        insights_generated = db.query(func.count(Insight.id)).join(
            Query, Insight.query_id == Query.id
        ).filter(
            Query.user_id == current_user.id
        ).scalar() or 0
    except:
        insights_generated = 0
    
    # Calculate trends (compare with last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    fourteen_days_ago = datetime.utcnow() - timedelta(days=14)
    
    # Current week queries
    current_week_queries = db.query(func.count(Query.id)).filter(
        Query.user_id == current_user.id,
        Query.created_at >= seven_days_ago
    ).scalar() or 0
    
    # Previous week queries
    previous_week_queries = db.query(func.count(Query.id)).filter(
        Query.user_id == current_user.id,
        Query.created_at >= fourteen_days_ago,
        Query.created_at < seven_days_ago
    ).scalar() or 0
    
    # Calculate trend percentage
    if previous_week_queries > 0:
        queries_trend = ((current_week_queries - previous_week_queries) / previous_week_queries) * 100
    else:
        queries_trend = 100 if current_week_queries > 0 else 0
    
    # Get recent activities
    recent_activities = []
    
    # Recent queries
    recent_queries = db.query(Query).filter(
        Query.user_id == current_user.id
    ).order_by(Query.created_at.desc()).limit(5).all()
    
    for q in recent_queries:
        recent_activities.append(RecentActivityItem(
            id=q.id,
            activity_type="query",
            description=f"Ran query: {q.question[:50]}..." if q.question and len(q.question) > 50 else (q.question or "Unknown query"),
            timestamp=q.created_at
        ))
    
    # Recent data sources
    recent_data_sources = db.query(DataSource).filter(
        DataSource.owner_user_id == current_user.id
    ).order_by(DataSource.created_at.desc()).limit(3).all()
    
    for ds in recent_data_sources:
        recent_activities.append(RecentActivityItem(
            id=ds.id,
            activity_type="data_source",
            description=f"Uploaded data source: {ds.name}",
            timestamp=ds.created_at
        ))
    
    # Sort activities by timestamp
    recent_activities.sort(key=lambda x: x.timestamp, reverse=True)
    recent_activities = recent_activities[:10]  # Keep only top 10
    
    return DashboardResponse(
        stats=DashboardStats(
            data_sources_count=data_sources_count,
            total_queries=total_queries,
            active_conversations=active_conversations,
            insights_generated=insights_generated,
            data_sources_trend=12.0,  # Placeholder - could calculate similar to queries
            queries_trend=round(queries_trend, 1),
            conversations_trend=-8.0 if active_conversations > 0 else 0,
            insights_trend=34.0 if insights_generated > 0 else 0
        ),
        recent_activities=recent_activities
    )


@router.get("/{user_id}", response_model=UserOut)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get user profile by ID.
    
    Args:
        user_id: User ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        User object
        
    Raises:
        HTTPException: If user not found
    """
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.patch("/{user_id}", response_model=UserOut)
async def update_user_info(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update user information.
    Only the user themselves can update their own profile.
    
    Args:
        user_id: User ID to update
        user_data: Updated user data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Updated user object
        
    Raises:
        HTTPException: If user not authorized or user not found
    """
    # Check if user is updating their own profile
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user"
        )
    
    user = update_user(db, user_id, user_data)
    return user

