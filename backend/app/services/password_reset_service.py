import secrets
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password


class PasswordResetService:
    def __init__(self, db: Session):
        self.db = db

    def generate_reset_token(self) -> str:
        """Generate a secure random token"""
        return secrets.token_urlsafe(32)

    def request_password_reset(self, email: str) -> tuple[bool, str]:
        """Request password reset and generate token"""
        user = self.db.query(User).filter(User.email == email).first()
        
        if not user:
            # Return success even if user not found (security best practice)
            return True, "If the email exists, a reset link will be sent."
        
        # Generate token
        token = self.generate_reset_token()
        expiry = datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour
        
        # Store token in user record
        user.reset_token = token
        user.reset_token_expiry = expiry
        self.db.commit()
        
        # TODO: Send email with reset link
        # For now, we'll return the token (in production, this would be sent via email)
        reset_link = f"http://localhost:5173/reset-password?token={token}"
        
        return True, f"Password reset link: {reset_link}"

    def verify_reset_token(self, token: str) -> User | None:
        """Verify reset token and return user if valid"""
        user = self.db.query(User).filter(
            User.reset_token == token,
            User.reset_token_expiry > datetime.utcnow()
        ).first()
        
        return user

    def reset_password(self, token: str, new_password: str) -> tuple[bool, str]:
        """Reset password using valid token"""
        user = self.verify_reset_token(token)
        
        if not user:
            return False, "Invalid or expired reset token"
        
        # Update password
        user.password_hash = hash_password(new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        self.db.commit()
        
        return True, "Password successfully reset"

