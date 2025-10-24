"""
Admin API router for platform administration endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    get_current_user,
    verify_password,
    hash_password
)
from app.models.user import User
from app.services.admin_service import AdminService
from app.schemas.admin import (
    AdminLogin,
    AdminTokenResponse,
    AdminInfo,
    PlatformStats,
    UserListResponse,
    UserDetail,
    UserStatusUpdate,
    ActivityFeedResponse,
    SystemHealth,
    UserGrowthResponse
)

router = APIRouter(prefix="/admin", tags=["admin"])


def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to verify current user is an admin.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User if admin
        
    Raises:
        HTTPException: If user is not an admin
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.post("/login", response_model=AdminTokenResponse)
def admin_login(
    login_data: AdminLogin,
    db: Session = Depends(get_db)
):
    """
    Admin login endpoint.
    
    Authenticates admin user and returns JWT token.
    """
    # Find user by username
    user = db.query(User).filter(User.username == login_data.username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    # Verify password
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    # Check if user is admin
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.username})
    
    return AdminTokenResponse(
        access_token=access_token,
        token_type="bearer",
        admin=AdminInfo(
            username=user.username,
            is_admin=user.is_admin
        )
    )


@router.get("/stats", response_model=PlatformStats)
def get_platform_stats(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin)
):
    """
    Get platform-wide statistics.
    
    Returns total counts and growth metrics for users, data sources,
    conversations, and storage.
    """
    return AdminService.get_platform_stats(db)


@router.get("/users", response_model=UserListResponse)
def get_users_list(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by username or email"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin)
):
    """
    Get paginated list of users.
    
    Returns list of users with masked sensitive data (email, phone).
    Supports search and filtering.
    """
    users, total = AdminService.get_users_list(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        is_active=is_active
    )
    
    total_pages = (total + page_size - 1) // page_size
    
    return UserListResponse(
        users=users,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/users/{user_id}", response_model=UserDetail)
def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin)
):
    """
    Get detailed information about a specific user.
    
    Returns user details with statistics and masked sensitive data.
    """
    user_detail = AdminService.get_user_detail(db, user_id)
    
    if not user_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user_detail


@router.put("/users/{user_id}/status", response_model=dict)
def update_user_status(
    user_id: int,
    status_update: UserStatusUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin)
):
    """
    Update user active status (enable/disable).
    
    Allows admin to activate or deactivate user accounts.
    """
    success = AdminService.update_user_status(db, user_id, status_update.is_active)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "success": True,
        "message": f"User {'activated' if status_update.is_active else 'deactivated'} successfully"
    }


@router.delete("/users/{user_id}", response_model=dict)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin)
):
    """
    Delete a user and all associated data.
    
    Permanently removes user from the system.
    Admin users cannot be deleted through this endpoint.
    """
    success = AdminService.delete_user(db, user_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or cannot be deleted"
        )
    
    return {
        "success": True,
        "message": "User deleted successfully"
    }


@router.get("/activity", response_model=ActivityFeedResponse)
def get_activity_feed(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    activity_type: Optional[str] = Query(None, description="Filter by activity type"),
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin)
):
    """
    Get recent platform activity feed.
    
    Returns paginated list of recent activities on the platform.
    """
    activities, total = AdminService.get_activity_feed(
        db=db,
        page=page,
        page_size=page_size,
        activity_type=activity_type
    )
    
    return ActivityFeedResponse(
        activities=activities,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/health", response_model=SystemHealth)
def get_system_health(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin)
):
    """
    Get system health metrics.
    
    Returns status of API, database, error rates, and other health indicators.
    """
    return AdminService.get_system_health(db)


@router.get("/analytics/user-growth", response_model=UserGrowthResponse)
def get_user_growth_analytics(
    period: str = Query("month", regex="^(day|week|month)$", description="Time period grouping"),
    days: int = Query(30, ge=1, le=365, description="Number of days to include"),
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin)
):
    """
    Get user growth analytics data for charts.
    
    Returns time-series data showing user growth over time.
    """
    growth_data = AdminService.get_user_growth_data(db, period, days)
    
    total_users = db.query(User).filter(User.is_admin == False).count()
    
    return UserGrowthResponse(
        data=growth_data,
        period=period,
        total_users=total_users
    )

