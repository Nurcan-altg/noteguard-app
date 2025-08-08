"""
API routes for NoteGuard
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Optional

from app.models.requests import AnalyzeRequest
from app.models.responses import AnalyzeResponse
from app.services.analysis_service import AnalysisService

router = APIRouter()

# Initialize analysis service
analysis_service = AnalysisService()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest):
    """
    Analyze text for grammar, repetition, and semantic coherence
    """
    try:
        result = await analysis_service.analyze_text(
            text=request.text,
            reference_topic=request.reference_topic,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/file", response_model=AnalyzeResponse)
async def analyze_file(
    file: UploadFile = File(...),
    reference_topic: Optional[str] = None,
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
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """
    Health check endpoint for API
    """
    return {"status": "healthy", "service": "analysis-api"} 