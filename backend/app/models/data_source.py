"""
Data source related models.
"""
from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from app.core.database import Base


class DataSource(Base):
    """Data source model for database connections and CSV uploads."""
    __tablename__ = "data_sources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, comment="PostgreSQL, MySQL, BigQuery, ERP, CRM, S3, etc.")
    source_type = Column(String, comment="csv, excel, database, api")  # Added for file uploads
    host = Column(String)
    port = Column(Integer)
    database_name = Column(String)
    username = Column(String)
    password_encrypted = Column(Text, comment="Encrypted credentials")
    connection_string = Column(Text, comment="Optional full DSN or file path")
    ssl_mode = Column(String)
    owner_user_id = Column(Integer, ForeignKey("users.id"))
    
    # File upload specific fields
    row_count = Column(Integer, comment="Number of rows in uploaded file")
    column_count = Column(Integer, comment="Number of columns in uploaded file")
    file_size = Column(BigInteger, comment="File size in bytes")
    config = Column(JSON, comment="Additional configuration (columns, etc.)")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    owner = relationship("User", back_populates="data_sources")
    configs = relationship("DataSourceConfig", back_populates="data_source")
    queries = relationship("Query", back_populates="data_source")
    rag_documents = relationship("RAGDocument", back_populates="datasource")


class DataSourceConfig(Base):
    """Additional configuration for data sources."""
    __tablename__ = "data_source_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    data_source_id = Column(Integer, ForeignKey("data_sources.id"), nullable=False)
    key = Column(String)
    value = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    data_source = relationship("DataSource", back_populates="configs")

