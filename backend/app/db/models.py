"""
Database models for NoteGuard
"""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, String, Float, DateTime, Text, JSON, Enum, Boolean, ForeignKey, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    """User model for authentication and user management"""
    
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    
    # Email verification
    email_verified = Column(Boolean, default=False, nullable=False)
    email_verification_token = Column(String(255), nullable=True)
    email_verification_expires = Column(DateTime, nullable=True)
    
    # Password reset
    password_reset_token = Column(String(255), nullable=True)
    password_reset_expires = Column(DateTime, nullable=True)
    
    # Account status
    is_active = Column(Boolean, default=True, nullable=False)
    is_premium = Column(Boolean, default=False, nullable=False)
    
    # Usage tracking
    analysis_count = Column(Integer, default=0, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
    files = relationship("File", back_populates="user", cascade="all, delete-orphan")


class Analysis(Base):
    """Analysis model for storing text analysis results"""
    
    __tablename__ = "analyses"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    source_type = Column(String(10), nullable=False)  # 'text' or 'file'
    text_excerpt = Column(Text, nullable=False)  # First 200 characters of analyzed text
    full_text = Column(Text, nullable=False)  # Full analyzed text
    reference_topic = Column(String(200), nullable=True)
    
    # Scores
    overall_score = Column(Float, nullable=False)
    grammar_score = Column(Float, nullable=False)
    repetition_score = Column(Float, nullable=False)
    semantic_score = Column(Float, nullable=False)
    
    # Analysis details (JSON for better performance)
    grammar_errors = Column(JSON, nullable=True)
    repetition_errors = Column(JSON, nullable=True)
    semantic_coherence = Column(JSON, nullable=True)
    suggestions = Column(JSON, nullable=True)
    
    # Metadata
    processing_time = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Audit fields
    request_id = Column(String(50), nullable=True)  # For request tracking
    user_agent = Column(String(500), nullable=True)  # Client information
    ip_address = Column(String(45), nullable=True)   # IPv4 or IPv6
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    files = relationship("File", back_populates="analysis")


class File(Base):
    """File model for storing uploaded file metadata"""
    
    __tablename__ = "files"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=True)
    filename = Column(String(255), nullable=False)
    file_size = Column(Float, nullable=False)  # Size in bytes
    mime_type = Column(String(100), nullable=False)
    file_path = Column(String(500), nullable=False)  # Path to stored file
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="files")
    analysis = relationship("Analysis", back_populates="files")
