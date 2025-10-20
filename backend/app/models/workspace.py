"""
Workspace related models.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from app.core.database import Base


class Workspace(Base):
    """Workspace model for organizing work items."""
    __tablename__ = "workspaces"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="workspaces")
    items = relationship("WorkspaceItem", back_populates="workspace")
    queries = relationship("Query", back_populates="workspace")


class WorkspaceItem(Base):
    """Workspace item model for items within workspaces."""
    __tablename__ = "workspace_items"
    
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    item_type = Column(String, comment="query, dashboard, chart, insight")
    item_id = Column(Integer)
    position = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    workspace = relationship("Workspace", back_populates="items")

