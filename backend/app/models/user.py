"""
User and authentication related models.
"""
from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    """User model for authentication and profile management."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    full_name = Column(String)
    avatar_url = Column(String)
    locale = Column(String, comment="User preferred language (e.g., vi, en)")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login_at = Column(DateTime(timezone=True))
    
    # Relationships
    user_roles = relationship("UserRole", back_populates="user")
    api_keys = relationship("APIKey", back_populates="user")
    data_sources = relationship("DataSource", back_populates="owner")
    queries = relationship("Query", back_populates="user")
    orchestrator_runs = relationship("OrchestratorRun", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")
    dashboards = relationship("Dashboard", back_populates="user")
    workspaces = relationship("Workspace", back_populates="user")
    exports = relationship("Export", back_populates="user")
    scheduled_reports = relationship("ScheduledReport", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    alerts = relationship("Alert", back_populates="user")
    password_resets = relationship("PasswordReset", back_populates="user")
    audit_trails = relationship("AuditTrail", back_populates="user")
    created_prompt_templates = relationship("PromptTemplate", back_populates="creator")
    created_glossary_terms = relationship("BusinessGlossary", back_populates="creator")
    system_logs = relationship("SystemLog", back_populates="user")


class Role(Base):
    """Role model for role-based access control."""
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user_roles = relationship("UserRole", back_populates="role")
    dashboard_shares = relationship("DashboardShare", back_populates="shared_to_role")


class UserRole(Base):
    """Many-to-many relationship between users and roles."""
    __tablename__ = "user_roles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    assigned_by = Column(Integer)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")


class APIKey(Base):
    """API key model for programmatic access."""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    key_hash = Column(String, nullable=False)
    name = Column(String)
    allowed_ips = Column(Text)
    scopes = Column(Text, comment="Comma-separated scopes")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    revoked_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="api_keys")


class PasswordReset(Base):
    """Password reset token model."""
    __tablename__ = "password_resets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reset_token_hash = Column(String)
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    used_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="password_resets")

