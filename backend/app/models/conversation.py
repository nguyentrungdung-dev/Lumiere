"""
Conversation and chat related models.
"""
from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from app.core.database import Base


class Conversation(Base):
    """Conversation model for chat sessions."""
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    language = Column(String, comment="Conversation language")
    session_state = Column(JSON, comment="Short-lived session context")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_message_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("ConversationMessage", back_populates="conversation")
    memory = relationship("ConversationMemory", back_populates="conversation")
    retrieval_sessions = relationship("RetrievalSession", back_populates="conversation")
    insights = relationship("Insight", back_populates="conversation")


class ConversationMessage(Base):
    """Conversation message model for individual messages."""
    __tablename__ = "conversation_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    sender = Column(String, comment="user, assistant, system, agent")
    role = Column(String, comment="Optional role like assistant/insight_agent")
    message_text = Column(Text)
    message_meta = Column(JSON, comment="e.g., embedding_id, attachments")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    token_count = Column(Integer)
    source_ids = Column(JSON, comment="References to RAG source docs")
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")


class ConversationMemory(Base):
    """Conversation memory model for context persistence."""
    __tablename__ = "conversation_memory"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    memory_type = Column(String, comment="short_term, long_term, user_pref")
    key = Column(String)
    value = Column(Text)
    relevance_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    conversation = relationship("Conversation", back_populates="memory")

