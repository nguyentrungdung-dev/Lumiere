from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.password_reset_service import PasswordResetService
from app.schemas.password_reset import (
    PasswordResetRequest,
    PasswordResetVerify,
    PasswordResetResponse,
)

router = APIRouter(prefix="/password-reset", tags=["Password Reset"])


def get_password_reset_service(db: Session = Depends(get_db)) -> PasswordResetService:
    return PasswordResetService(db)


@router.post("/request", response_model=PasswordResetResponse)
async def request_password_reset(
    request: PasswordResetRequest,
    service: PasswordResetService = Depends(get_password_reset_service),
):
    """Request a password reset token"""
    success, message = service.request_password_reset(request.email)
    return PasswordResetResponse(message=message)


@router.post("/verify", response_model=PasswordResetResponse)
async def verify_reset_token(
    token: str,
    service: PasswordResetService = Depends(get_password_reset_service),
):
    """Verify if a reset token is valid"""
    user = service.verify_reset_token(token)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    return PasswordResetResponse(message="Token is valid")


@router.post("/reset", response_model=PasswordResetResponse)
async def reset_password(
    reset_data: PasswordResetVerify,
    service: PasswordResetService = Depends(get_password_reset_service),
):
    """Reset password using valid token"""
    success, message = service.reset_password(reset_data.token, reset_data.new_password)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    return PasswordResetResponse(message=message)

