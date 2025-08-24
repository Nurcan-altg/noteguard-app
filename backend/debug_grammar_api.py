#!/usr/bin/env python3
"""
Debug script for API grammar analysis
"""

import asyncio
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.analysis_service import AnalysisService


async def test_api_grammar():
    """Test API grammar analysis"""
    print("🔍 Testing API Grammar Analysis...")
    print("=" * 50)
    
    # Initialize analysis service (same as API)
    analysis_service = AnalysisService()
    
    # Test the same text that's failing in API
    text = "yalnış yazım herkez yanlız imakanları ogrencinin"
    
    print(f"Text: {text}")
    print()
    
    # Test direct grammar service
    print("📝 Direct Grammar Service Test:")
    grammar_errors = await analysis_service.grammar_service.analyze_grammar(text)
    print(f"Found {len(grammar_errors)} grammar errors:")
    for i, error in enumerate(grammar_errors, 1):
        print(f"  {i}. {error.message} (Rule: {error.rule_id})")
        if error.suggestion:
            print(f"     Suggestion: {error.suggestion}")
    
    grammar_score = await analysis_service.grammar_service.get_grammar_score(text, grammar_errors)
    print(f"Grammar Score: {grammar_score}")
    print()
    
    # Test full analysis service (like API does)
    print("🔄 Full Analysis Service Test:")
    result = await analysis_service.analyze_text(text, "test")
    
    print(f"API Result - Grammar errors count: {len(result.result.grammar_errors)}")
    print(f"API Result - Grammar score: {result.result.grammar_score}")
    
    for i, error in enumerate(result.result.grammar_errors, 1):
        print(f"  {i}. {error.message} (Rule: {error.rule_id})")
        if error.suggestion:
            print(f"     Suggestion: {error.suggestion}")


if __name__ == "__main__":
    asyncio.run(test_api_grammar())
