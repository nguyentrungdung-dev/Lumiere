"""
Export and scheduled report related models.
"""
from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from app.core.database import Base


class Export(Base):
    """Export model for exporting data and visualizations."""
    __tablename__ = "exports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    dashboard_id = Column(Integer, ForeignKey("dashboards.id"))
    chart_id = Column(Integer, ForeignKey("charts.id"))
    query_id = Column(Integer, ForeignKey("queries.id"))
    format = Column(String, comment="pdf, xlsx, png, csv")
    file_location = Column(String)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="exports")
    dashboard = relationship("Dashboard", back_populates="exports")
    chart = relationship("Chart", back_populates="exports")
    query = relationship("Query", back_populates="exports")


class ScheduledReport(Base):
    """Scheduled report model for automated reports."""
    __tablename__ = "scheduled_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    cron_expr = Column(String)
    payload = Column(JSON)
    last_run_at = Column(DateTime(timezone=True))
    next_run_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="scheduled_reports")

