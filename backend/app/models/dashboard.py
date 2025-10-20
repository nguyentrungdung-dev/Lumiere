"""
Dashboard and chart related models.
"""
from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from app.core.database import Base


class Dashboard(Base):
    """Dashboard model for data visualization containers."""
    __tablename__ = "dashboards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String)
    description = Column(Text)
    is_public = Column(Boolean, default=False)
    layout = Column(JSON, comment="Positions, grid settings")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="dashboards")
    shares = relationship("DashboardShare", back_populates="dashboard")
    charts = relationship("Chart", back_populates="dashboard")
    exports = relationship("Export", back_populates="dashboard")


class DashboardShare(Base):
    """Dashboard share model for sharing permissions."""
    __tablename__ = "dashboard_shares"
    
    id = Column(Integer, primary_key=True, index=True)
    dashboard_id = Column(Integer, ForeignKey("dashboards.id"))
    shared_to_user_id = Column(Integer, ForeignKey("users.id"))
    shared_to_role_id = Column(Integer, ForeignKey("roles.id"))
    permission = Column(String, comment="view, edit, manage")
    shared_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    dashboard = relationship("Dashboard", back_populates="shares")
    shared_to_user = relationship("User")
    shared_to_role = relationship("Role", back_populates="dashboard_shares")


class Chart(Base):
    """Chart model for individual visualizations."""
    __tablename__ = "charts"
    
    id = Column(Integer, primary_key=True, index=True)
    dashboard_id = Column(Integer, ForeignKey("dashboards.id"))
    query_id = Column(Integer, ForeignKey("queries.id"))
    name = Column(String)
    type = Column(String, comment="bar, line, pie, table, custom")
    config = Column(JSON, comment="Chart settings, filters, drill-down")
    thumbnail_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    dashboard = relationship("Dashboard", back_populates="charts")
    query = relationship("Query", back_populates="charts")
    exports = relationship("Export", back_populates="chart")

