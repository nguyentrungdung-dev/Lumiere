"""
Insight and prompt template related models.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from app.core.database import Base


class Insight(Base):
    """Insight model for AI-generated insights."""
    __tablename__ = "insights"
    
    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("queries.id"))
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    author_agent_id = Column(Integer, ForeignKey("agents.id"))
    title = Column(String)
    content = Column(Text)
    insight_type = Column(String, comment="trend, anomaly, explanation")
    confidence_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    query = relationship("Query", back_populates="insights")
    conversation = relationship("Conversation", back_populates="insights")
    author_agent = relationship("Agent", back_populates="insights")


class PromptTemplate(Base):
    """Prompt template model for reusable prompts."""
    __tablename__ = "prompt_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    template = Column(Text)
    variables = Column(JSON)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    creator = relationship("User", back_populates="created_prompt_templates")

