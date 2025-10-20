"""
System and monitoring related models.
"""
from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from app.core.database import Base


class SystemLog(Base):
    """System log model for application logging."""
    __tablename__ = "system_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    level = Column(String, comment="info, warn, error, audit")
    component = Column(String)
    action = Column(String)
    details = Column(Text)
    ip_address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="system_logs")
    usage_costs = relationship("UsageCost", back_populates="system_log")


class Notification(Base):
    """Notification model for user notifications."""
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String)
    body = Column(Text)
    channel = Column(String, comment="email, in-app, webhook")
    status = Column(String, comment="sent, failed, read, unread")
    meta = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sent_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="notifications")


class UsageCost(Base):
    """Usage cost model for tracking costs."""
    __tablename__ = "usage_costs"
    
    id = Column(Integer, primary_key=True, index=True)
    metric = Column(String, nullable=False, comment="query_time, token_usage, storage, model_api_calls")
    value = Column(Numeric)
    unit = Column(String)
    recorded_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    system_log_id = Column(Integer, ForeignKey("system_logs.id"))
    
    # Relationships
    system_log = relationship("SystemLog", back_populates="usage_costs")


class Alert(Base):
    """Alert model for configurable alerts."""
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    condition = Column(JSON, comment="JSON rule to evaluate")
    severity = Column(String)
    notification_channel = Column(String)
    is_active = Column(Boolean)
    last_triggered_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="alerts")


class BusinessGlossary(Base):
    """Business glossary model for term definitions."""
    __tablename__ = "business_glossary"
    
    id = Column(Integer, primary_key=True, index=True)
    term = Column(String, unique=True, nullable=False, index=True)
    definition = Column(Text)
    formula = Column(Text)
    examples = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    creator = relationship("User", back_populates="created_glossary_terms")


class AuditTrail(Base):
    """Audit trail model for tracking all actions."""
    __tablename__ = "audit_trails"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)
    object_type = Column(String)
    object_id = Column(Integer)
    diff = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="audit_trails")

