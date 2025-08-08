"""
Simple test script for NoteGuard backend
"""

import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_backend():
    """Test backend functionality"""
    try:
        # Test imports
        print("Testing imports...")
        from app.main import app
        from app.services.analysis_service import AnalysisService
        from app.models.requests import AnalyzeRequest
        print("✅ All imports successful")
        
        # Test analysis service
        print("\nTesting analysis service...")
        analysis_service = AnalysisService()
        
        test_text = "Bu bir test metnidir. Bu metin analiz edilecek."
        result = await analysis_service.analyze_text(test_text)
        
        print(f"✅ Analysis completed successfully")
        print(f"   Success: {result.success}")
        print(f"   Processing time: {result.processing_time}s")
        print(f"   Overall score: {result.result.overall_score}")
        print(f"   Grammar errors: {len(result.result.grammar_errors)}")
        print(f"   Repetition errors: {len(result.result.repetition_errors)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_backend())
    if success:
        print("\n🎉 Backend test completed successfully!")
    else:
        print("\n💥 Backend test failed!")
        sys.exit(1) 