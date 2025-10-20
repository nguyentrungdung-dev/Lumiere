"""
Query related models.
"""
from sqlalchemy import BigInteger, Column, Integer, String, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from app.core.database import Base


class Query(Base):
    """Query model for natural language queries and generated SQL."""
    __tablename__ = "queries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    natural_language = Column(Text, comment="Original NL input")
    generated_sql = Column(Text)
    engine = Column(String, comment="Which agent/model generated SQL")
    data_source_id = Column(Integer, ForeignKey("data_sources.id"), comment="Which datasource executed on")
    status = Column(String, default="pending", comment="pending, running, success, failed")
    started_at = Column(DateTime(timezone=True))
    finished_at = Column(DateTime(timezone=True))
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    executed_rows = Column(BigInteger)
    execution_time_ms = Column(Integer)
    
    # Relationships
    user = relationship("User", back_populates="queries")
    workspace = relationship("Workspace", back_populates="queries")
    data_source = relationship("DataSource", back_populates="queries")
    query_history = relationship("QueryHistory", back_populates="query")
    query_results = relationship("QueryResult", back_populates="query")
    query_metrics = relationship("QueryMetric", back_populates="query")
    agent_runs = relationship("AgentRun", back_populates="query")
    retrieval_sessions = relationship("RetrievalSession", back_populates="query")
    insights = relationship("Insight", back_populates="query")
    charts = relationship("Chart", back_populates="query")
    exports = relationship("Export", back_populates="query")


class QueryHistory(Base):
    """Query history model for tracking query actions."""
    __tablename__ = "query_history"
    
    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("queries.id"), nullable=False)
    user_id = Column(Integer)
    action = Column(String, comment="created, executed, edited, saved, shared")
    details = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    query = relationship("Query", back_populates="query_history")


class QueryResult(Base):
    """Query result model for storing query outputs."""
    __tablename__ = "query_results"
    
    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("queries.id"), nullable=False)
    result_location = Column(String, comment="URL or object storage path")
    result_meta = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    query = relationship("Query", back_populates="query_results")


class QueryMetric(Base):
    """Query metrics model for performance and cost tracking."""
    __tablename__ = "query_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("queries.id"))
    cpu_ms = Column(Integer)
    memory_mb = Column(Integer)
    api_calls = Column(Integer)
    token_usage = Column(Integer)
    cost = Column(Numeric, comment="Monetary cost for the query")
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    query = relationship("Query", back_populates="query_metrics")

