"""
AI Agent related models.
"""
from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from app.core.database import Base


class Agent(Base):
    """Agent model for AI agents."""
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, comment="SQL Agent, Insight Agent, Visualization Agent")
    type = Column(String)
    config = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean)
    
    # Relationships
    agent_runs = relationship("AgentRun", back_populates="agent")
    insights = relationship("Insight", back_populates="author_agent")


class AgentRun(Base):
    """Agent run model for tracking individual agent executions."""
    __tablename__ = "agent_runs"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    query_id = Column(Integer, ForeignKey("queries.id"))
    orchestrator_run_id = Column(Integer, ForeignKey("orchestrator_runs.id"))
    status = Column(String, default="pending")
    input = Column(JSON)
    output = Column(JSON)
    started_at = Column(DateTime(timezone=True))
    finished_at = Column(DateTime(timezone=True))
    error_text = Column(Text)
    
    # Relationships
    agent = relationship("Agent", back_populates="agent_runs")
    query = relationship("Query", back_populates="agent_runs")
    orchestrator_run = relationship("OrchestratorRun", back_populates="agent_runs")


class OrchestratorRun(Base):
    """Orchestrator run model for multi-agent orchestration."""
    __tablename__ = "orchestrator_runs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    description = Column(Text)
    input_spec = Column(JSON)
    result_summary = Column(Text)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    finished_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="orchestrator_runs")
    agent_runs = relationship("AgentRun", back_populates="orchestrator_run")

