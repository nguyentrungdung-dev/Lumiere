"""
User management routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.user import UserOut, UserUpdate
from app.services.user_service import get_user_by_id, update_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


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

