"""
RAG (Retrieval Augmented Generation) related models.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from app.core.database import Base


class RAGDocument(Base):
    """RAG document model for retrieval."""
    __tablename__ = "rag_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    datasource_id = Column(Integer, ForeignKey("data_sources.id"))
    title = Column(String)
    content = Column(Text)
    content_hash = Column(String)
    metadata_ = Column('metadata', JSON)  # Use metadata_ to avoid conflict with SQLAlchemy's metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    datasource = relationship("DataSource", back_populates="rag_documents")
    embeddings = relationship("Embedding", back_populates="document")


class Embedding(Base):
    """Embedding model for vector storage."""
    __tablename__ = "embeddings"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("rag_documents.id"))
    vector = Column(JSON, comment="Depends on DB support - placeholder")
    model = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    document = relationship("RAGDocument", back_populates="embeddings")


class RetrievalSession(Base):
    """Retrieval session model for tracking document retrieval."""
    __tablename__ = "retrieval_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    query_id = Column(Integer, ForeignKey("queries.id"))
    retrieved_doc_ids = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    conversation = relationship("Conversation", back_populates="retrieval_sessions")
    query = relationship("Query", back_populates="retrieval_sessions")

