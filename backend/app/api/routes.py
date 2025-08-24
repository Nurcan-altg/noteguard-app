"""
API routes for NoteGuard
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Query
from typing import Optional
from uuid import UUID

from app.models.requests import AnalyzeRequest
from app.models.responses import AnalyzeResponse, AnalysisResponse, AnalysisListResponse
from app.models.database import FileResponse
from app.services.analysis_service import AnalysisService
from app.services.llm_service import LLMService
from app.db.session import get_db_session
from app.db.repository import AnalysisRepository, FileRepository
from app.api.auth import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

# Initialize analysis service
analysis_service = AnalysisService()
llm_service = LLMService()


@router.post("/analyze/demo", response_model=AnalyzeResponse)
async def analyze_text_demo(
    request: AnalyzeRequest
):
    """
    Demo endpoint for text analysis without authentication
    """
    try:
        result = await analysis_service.analyze_text(
            text=request.text,
            reference_topic=request.reference_topic,
        )
        
        # Debug: Print result information
        print(f"API Debug: Grammar errors count: {len(result.result.grammar_errors)}")
        print(f"API Debug: Grammar score: {result.result.grammar_score}")
        for error in result.result.grammar_errors:
            print(f"API Debug: Error: {error.message}")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(
    request: AnalyzeRequest,
    db_session: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze text for grammar, repetition, and semantic coherence
    """
    try:
        result = await analysis_service.analyze_text(
            text=request.text,
            reference_topic=request.reference_topic,
        )
        
        # Debug: Print result information
        print(f"API Debug: Grammar errors count: {len(result.result.grammar_errors)}")
        print(f"API Debug: Grammar score: {result.result.grammar_score}")
        for error in result.result.grammar_errors:
            print(f"API Debug: Error: {error.message}")
        
        # Save to database
        analysis_repo = AnalysisRepository(db_session)
        analysis_data = {
            "user_id": current_user.get("sub"),
            "source_type": "text",
            "text_excerpt": request.text[:200] + ("..." if len(request.text) > 200 else ""),
            "full_text": request.text,
            "reference_topic": request.reference_topic,
            "overall_score": result.result.overall_score,
            "grammar_score": result.result.grammar_score,
            "repetition_score": result.result.repetition_score,
            "semantic_score": result.result.semantic_score.score * 100,  # Convert to percentage
            "grammar_errors": [error.dict() for error in result.result.grammar_errors] if result.result.grammar_errors else None,
            "repetition_errors": [error.dict() for error in result.result.repetition_errors] if result.result.repetition_errors else None,
            "semantic_coherence": result.result.semantic_coherence.dict() if result.result.semantic_coherence else None,
            "suggestions": result.result.suggestions if result.result.suggestions else None,
            "processing_time": result.processing_time,
        }
        
        await analysis_repo.create(analysis_data)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analyses", response_model=AnalysisListResponse)
async def get_analysis_history(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    order_by: str = Query("created_at", regex="^(created_at|overall_score|grammar_score|repetition_score|semantic_score)$"),
    order_desc: bool = Query(True),
    db_session: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Get analysis history for the current user
    """
    try:
        analysis_repo = AnalysisRepository(db_session)
        analyses = await analysis_repo.get_by_user_id(
            user_id=current_user.get("sub"),
            limit=limit,
            offset=offset,
            order_by=order_by,
            order_desc=order_desc
        )
        
        total = await analysis_repo.count_by_user_id(current_user.get("sub"))
        
        # Convert database models to response models
        analysis_responses = []
        for analysis in analyses:
            analysis_dict = {
                "id": str(analysis.id),
                "user_id": analysis.user_id,
                "source_type": analysis.source_type,
                "text_excerpt": analysis.text_excerpt,
                "full_text": analysis.full_text,
                "reference_topic": analysis.reference_topic,
                "overall_score": analysis.overall_score,
                "grammar_score": analysis.grammar_score,
                "repetition_score": analysis.repetition_score,
                "semantic_score": analysis.semantic_score,
                "grammar_errors": analysis.grammar_errors,
                "repetition_errors": analysis.repetition_errors,
                "semantic_coherence": analysis.semantic_coherence,
                "suggestions": analysis.suggestions,
                "processing_time": analysis.processing_time,
                "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
                "updated_at": analysis.updated_at.isoformat() if analysis.updated_at else None,
            }
            analysis_responses.append(AnalysisResponse(**analysis_dict))
        
        return AnalysisListResponse(
            analyses=analysis_responses,
            total=total,
            limit=limit,
            offset=offset,
            has_more=(offset + limit) < total
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis_by_id(
    analysis_id: UUID,
    db_session: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Get specific analysis by ID
    """
    try:
        analysis_repo = AnalysisRepository(db_session)
        analysis = await analysis_repo.get_by_id(analysis_id)
        
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        # Check if the analysis belongs to the current user
        if analysis.user_id != current_user.get("sub"):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Convert database model to response model
        analysis_dict = {
            "id": str(analysis.id),
            "user_id": analysis.user_id,
            "source_type": analysis.source_type,
            "text_excerpt": analysis.text_excerpt,
            "full_text": analysis.full_text,
            "reference_topic": analysis.reference_topic,
            "overall_score": analysis.overall_score,
            "grammar_score": analysis.grammar_score,
            "repetition_score": analysis.repetition_score,
            "semantic_score": analysis.semantic_score,
            "grammar_errors": analysis.grammar_errors,
            "repetition_errors": analysis.repetition_errors,
            "semantic_coherence": analysis.semantic_coherence,
            "suggestions": analysis.suggestions,
            "processing_time": analysis.processing_time,
            "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
            "updated_at": analysis.updated_at.isoformat() if analysis.updated_at else None,
        }
        return AnalysisResponse(**analysis_dict)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/analyses/{analysis_id}")
async def delete_analysis(
    analysis_id: str,  # Change to string first to debug
    db_session: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete analysis by ID
    """
    try:
        print(f"DELETE Debug: Attempting to delete analysis {analysis_id}")
        print(f"DELETE Debug: Analysis ID type: {type(analysis_id)}")
        print(f"DELETE Debug: Current user ID: {current_user.get('sub')}")
        
        # Parse UUID
        try:
            analysis_uuid = UUID(analysis_id)
        except ValueError as e:
            raise HTTPException(status_code=400, detail="Invalid analysis ID format")
        
        # Get analysis and verify ownership
        analysis_repo = AnalysisRepository(db_session)
        analysis = await analysis_repo.get_by_id(analysis_uuid)
        
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        # Check if the analysis belongs to the current user
        if analysis.user_id != current_user.get("sub"):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Delete the analysis
        await analysis_repo.delete(analysis_uuid)
        return {"message": "Analysis deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"DELETE Debug: Exception occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/llm")
async def analyze_text_with_llm(
    request: AnalyzeRequest,
    db_session: AsyncSession = Depends(get_db_session)
):
    """
    Analyze text using LLM-powered analysis for advanced insights
    """
    try:
        # Get comprehensive LLM analysis
        llm_analysis = await llm_service.get_comprehensive_analysis(
            text=request.text,
            reference_topic=request.reference_topic
        )
        
        # Get sentiment analysis
        sentiment_result = await llm_service.analyze_sentiment(request.text)
        
        # Get topic classification
        topic_result = await llm_service.classify_text_topic(request.text)
        
        # Get writing style analysis
        style_result = await llm_service.analyze_writing_style(request.text)
        
        # Generate LLM-powered suggestions
        suggestions = await llm_service.generate_improvement_suggestions(
            request.text, {
                'text_length': len(request.text),
                'reference_topic': request.reference_topic
            }
        )
        
        return {
            "success": True,
            "llm_analysis": llm_analysis,
            "sentiment_analysis": sentiment_result,
            "topic_classification": topic_result,
            "writing_style": style_result,
            "suggestions": suggestions,
            "text_length": len(request.text),
            "reference_topic": request.reference_topic
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/sentiment")
async def analyze_sentiment(
    request: AnalyzeRequest
):
    """
    Analyze text sentiment using LLM
    """
    try:
        sentiment_result = await llm_service.analyze_sentiment(request.text)
        
        return {
            "success": True,
            "sentiment_analysis": sentiment_result,
            "text": request.text[:100] + "..." if len(request.text) > 100 else request.text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/topic")
async def classify_topic(
    request: AnalyzeRequest,
    candidate_topics: Optional[str] = Query(None, description="Comma-separated list of candidate topics")
):
    """
    Classify text topic using LLM
    """
    try:
        topics = None
        if candidate_topics:
            topics = [topic.strip() for topic in candidate_topics.split(",")]
        
        topic_result = await llm_service.classify_text_topic(request.text, topics)
        
        return {
            "success": True,
            "topic_classification": topic_result,
            "text": request.text[:100] + "..." if len(request.text) > 100 else request.text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/style")
async def analyze_writing_style(
    request: AnalyzeRequest
):
    """
    Analyze writing style using LLM
    """
    try:
        style_result = await llm_service.analyze_writing_style(request.text)
        
        return {
            "success": True,
            "writing_style": style_result,
            "text": request.text[:100] + "..." if len(request.text) > 100 else request.text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/file", response_model=AnalyzeResponse)
async def analyze_file(
    file: UploadFile = File(...),
    reference_topic: Optional[str] = None,
    db_session: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze uploaded file for grammar, repetition, and semantic coherence
    """
    try:
        # Validate file type
        if not file.filename.endswith(('.txt', '.docx')):
            raise HTTPException(
                status_code=400,
                detail="Only .txt and .docx files are supported"
            )
        
        # Read file content
        content = await file.read()
        
        if file.filename.endswith('.txt'):
            text = content.decode('utf-8')
        else:  # .docx
            from app.utils.file_utils import extract_text_from_docx
            text = extract_text_from_docx(content)
        
        result = await analysis_service.analyze_text(
            text=text,
            reference_topic=reference_topic,
        )
        
        # Save file to disk
        import os
        from pathlib import Path
        
        # Create uploads directory if it doesn't exist
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(exist_ok=True)
        
        # Generate unique filename
        import uuid
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = uploads_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Save file metadata
        file_repo = FileRepository(db_session)
        file_data = {
            "user_id": current_user.get("sub"),
            "filename": file.filename,
            "file_size": len(content),
            "mime_type": file.content_type or "application/octet-stream",
            "file_path": str(file_path),
        }
        file_record = await file_repo.create(file_data)
        
        # Save analysis to database
        analysis_repo = AnalysisRepository(db_session)
        analysis_data = {
            "user_id": current_user.get("sub"),
            "source_type": "file",
            "text_excerpt": text[:200] + ("..." if len(text) > 200 else ""),
            "full_text": text,
            "reference_topic": reference_topic,
            "overall_score": result.result.overall_score,
            "grammar_score": result.result.grammar_score,
            "repetition_score": result.result.repetition_score,
            "semantic_score": result.result.semantic_score.score * 100,  # Convert to percentage
            "grammar_errors": [error.dict() for error in result.result.grammar_errors] if result.result.grammar_errors else None,
            "repetition_errors": [error.dict() for error in result.result.repetition_errors] if result.result.repetition_errors else None,
            "semantic_coherence": result.result.semantic_coherence.dict() if result.result.semantic_coherence else None,
            "suggestions": result.result.suggestions if result.result.suggestions else None,
            "processing_time": result.processing_time,
        }
        
        analysis_record = await analysis_repo.create(analysis_data)
        
        # Link file to analysis
        await file_repo.update_analysis_id(file_record.id, analysis_record.id)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """
    Health check endpoint for API
    """
    return {"status": "healthy", "service": "analysis-api"}





 