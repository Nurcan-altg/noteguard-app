"""
Repository layer for database operations
"""

from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from sqlalchemy.orm import selectinload

from app.db.models import Analysis, File
from app.models.responses import AnalysisResult


class AnalysisRepository:
    """Repository for Analysis model operations"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create(self, analysis_data: Dict[str, Any]) -> Analysis:
        """Create a new analysis record"""
        analysis = Analysis(**analysis_data)
        self.session.add(analysis)
        await self.session.commit()
        await self.session.refresh(analysis)
        return analysis
    
    async def get_by_id(self, analysis_id: UUID) -> Optional[Analysis]:
        """Get analysis by ID"""
        analysis_id_str = str(analysis_id)
        result = await self.session.execute(
            select(Analysis).where(Analysis.id == analysis_id_str)
        )
        return result.scalar_one_or_none()
    
    async def get_all(
        self, 
        limit: int = 50, 
        offset: int = 0,
        order_by: str = "created_at",
        order_desc: bool = True
    ) -> List[Analysis]:
        """Get all analyses with pagination and ordering"""
        query = select(Analysis)
        
        # Add ordering
        if order_by == "created_at":
            query = query.order_by(Analysis.created_at.desc() if order_desc else Analysis.created_at.asc())
        elif order_by == "overall_score":
            query = query.order_by(Analysis.overall_score.desc() if order_desc else Analysis.overall_score.asc())
        
        # Add pagination
        query = query.limit(limit).offset(offset)
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def update(self, analysis_id: UUID, update_data: Dict[str, Any]) -> Optional[Analysis]:
        """Update analysis record"""
        await self.session.execute(
            update(Analysis)
            .where(Analysis.id == analysis_id)
            .values(**update_data)
        )
        await self.session.commit()
        return await self.get_by_id(analysis_id)
    
    async def delete(self, analysis_id: UUID) -> bool:
        """Delete analysis record"""
        # Use UUID as-is for database lookup (keep dashes)
        analysis_id_str = str(analysis_id)
        result = await self.session.execute(
            delete(Analysis).where(Analysis.id == analysis_id_str)
        )
        await self.session.commit()
        return result.rowcount > 0
    
    async def delete_all(self) -> int:
        """Delete all analysis records (with guard)"""
        result = await self.session.execute(delete(Analysis))
        await self.session.commit()
        return result.rowcount
    
    async def count(self) -> int:
        """Get total count of analyses"""
        result = await self.session.execute(select(Analysis.id))
        return len(result.scalars().all())
    
    async def get_by_user_id(
        self, 
        user_id: str,
        limit: int = 50, 
        offset: int = 0,
        order_by: str = "created_at",
        order_desc: bool = True
    ) -> List[Analysis]:
        """Get analyses by user ID with pagination and ordering"""
        query = select(Analysis).where(Analysis.user_id == user_id)
        
        # Add ordering
        if order_by == "created_at":
            query = query.order_by(Analysis.created_at.desc() if order_desc else Analysis.created_at.asc())
        elif order_by == "overall_score":
            query = query.order_by(Analysis.overall_score.desc() if order_desc else Analysis.overall_score.asc())
        elif order_by == "grammar_score":
            query = query.order_by(Analysis.grammar_score.desc() if order_desc else Analysis.grammar_score.asc())
        elif order_by == "repetition_score":
            query = query.order_by(Analysis.repetition_score.desc() if order_desc else Analysis.repetition_score.asc())
        elif order_by == "semantic_score":
            query = query.order_by(Analysis.semantic_score.desc() if order_desc else Analysis.semantic_score.asc())
        
        # Add pagination
        query = query.limit(limit).offset(offset)
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def count_by_user_id(self, user_id: str) -> int:
        """Get total count of analyses for a specific user"""
        result = await self.session.execute(
            select(Analysis.id).where(Analysis.user_id == user_id)
        )
        return len(result.scalars().all())


class FileRepository:
    """Repository for File model operations"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create(self, file_data: Dict[str, Any]) -> File:
        """Create a new file record"""
        file_record = File(**file_data)
        self.session.add(file_record)
        await self.session.commit()
        await self.session.refresh(file_record)
        return file_record
    
    async def get_by_id(self, file_id: UUID) -> Optional[File]:
        """Get file by ID"""
        result = await self.session.execute(
            select(File).where(File.id == file_id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_analysis_id(self, analysis_id: UUID) -> Optional[File]:
        """Get file by analysis ID"""
        result = await self.session.execute(
            select(File).where(File.analysis_id == analysis_id)
        )
        return result.scalar_one_or_none()
    
    async def update_analysis_id(self, file_id: UUID, analysis_id: UUID) -> Optional[File]:
        """Update file's analysis_id reference"""
        await self.session.execute(
            update(File)
            .where(File.id == file_id)
            .values(analysis_id=analysis_id)
        )
        await self.session.commit()
        return await self.get_by_id(file_id)
