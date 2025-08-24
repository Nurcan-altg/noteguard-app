#!/usr/bin/env python3
"""
Test script for LLM integration with NoteGuard
"""

import asyncio
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.llm_service import LLMService
from app.services.analysis_service import AnalysisService


async def test_llm_service():
    """Test the LLM service functionality"""
    print("🧪 Testing LLM Service Integration...")
    print("=" * 50)
    
    # Initialize LLM service
    llm_service = LLMService()
    
    # Test text
    test_text = """
    Yapay zeka teknolojileri günümüzde hızla gelişmektedir. 
    Bu teknolojiler hayatımızın birçok alanında kullanılmaktadır. 
    Özellikle makine öğrenmesi ve derin öğrenme alanlarında büyük ilerlemeler kaydedilmiştir. 
    Bu gelişmeler sayesinde daha akıllı sistemler geliştirilebilmektedir.
    """
    
    print(f"📝 Test Metni: {test_text.strip()}")
    print()
    
    try:
        # Test sentiment analysis
        print("🔍 Testing Sentiment Analysis...")
        sentiment_result = await llm_service.analyze_sentiment(test_text)
        print(f"   Sentiment: {sentiment_result.get('sentiment', 'N/A')}")
        print(f"   Confidence: {sentiment_result.get('confidence', 0.0):.3f}")
        print()
        
        # Test topic classification
        print("🏷️ Testing Topic Classification...")
        topic_result = await llm_service.classify_text_topic(test_text)
        print(f"   Predicted Topic: {topic_result.get('predicted_topic', 'N/A')}")
        print(f"   Confidence: {topic_result.get('confidence', 0.0):.3f}")
        print(f"   All Scores: {topic_result.get('all_scores', {})}")
        print()
        
        # Test writing style analysis
        print("✍️ Testing Writing Style Analysis...")
        style_result = await llm_service.analyze_writing_style(test_text)
        print(f"   Style Type: {style_result.get('style_type', 'N/A')}")
        print(f"   Formality: {style_result.get('formality', 'N/A')}")
        print(f"   Avg Sentence Length: {style_result.get('avg_sentence_length', 0.0):.1f}")
        print(f"   Word Count: {style_result.get('word_count', 0)}")
        print()
        
        # Test comprehensive analysis
        print("🎯 Testing Comprehensive Analysis...")
        comprehensive_result = await llm_service.get_comprehensive_analysis(test_text)
        print(f"   Analysis completed successfully")
        print(f"   Text Length: {comprehensive_result.get('text_length', 0)}")
        print()
        
        # Test suggestion generation
        print("💡 Testing Suggestion Generation...")
        suggestions = await llm_service.generate_improvement_suggestions(
            test_text, {
                'grammar_score': 85.0,
                'repetition_score': 90.0,
                'semantic_score': 0.8,
                'grammar_errors': [],
                'repetition_errors': [],
                'topic_consistency': {'has_issues': False}
            }
        )
        print(f"   Generated {len(suggestions)} suggestions:")
        for i, suggestion in enumerate(suggestions, 1):
            print(f"   {i}. {suggestion}")
        print()
        
        print("✅ LLM Service tests completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during LLM service testing: {e}")
        import traceback
        traceback.print_exc()


async def test_integrated_analysis():
    """Test the integrated analysis with LLM capabilities"""
    print("🧪 Testing Integrated Analysis with LLM...")
    print("=" * 50)
    
    # Initialize analysis service
    analysis_service = AnalysisService()
    
    # Test text with some issues
    test_text = """
    Yapay zeka teknolojileri günümüzde hızla gelişmektedir. 
    Bu teknolojiler hayatımızın birçok alanında kullanılmaktadır. 
    Yapay zeka teknolojileri çok önemlidir. 
    Bu teknolojiler sayesinde daha akıllı sistemler geliştirilebilmektedir.
    """
    
    print(f"📝 Test Metni: {test_text.strip()}")
    print()
    
    try:
        # Run comprehensive analysis
        print("🔍 Running Comprehensive Analysis...")
        result = await analysis_service.analyze_text(
            text=test_text,
            reference_topic="Yapay Zeka"
        )
        
        print(f"✅ Analysis completed successfully!")
        print(f"   Overall Score: {result.result.overall_score}")
        print(f"   Grammar Score: {result.result.grammar_score}")
        print(f"   Repetition Score: {result.result.repetition_score}")
        print(f"   Semantic Score: {result.result.semantic_score.score:.3f}")
        print(f"   Processing Time: {result.processing_time:.3f}s")
        print()
        
        # Check LLM analysis results
        if result.result.llm_analysis:
            print("🤖 LLM Analysis Results:")
            llm = result.result.llm_analysis
            
            if llm.sentiment_analysis:
                print(f"   Sentiment: {llm.sentiment_analysis.sentiment} ({llm.sentiment_analysis.confidence:.3f})")
            
            if llm.topic_classification:
                print(f"   Topic: {llm.topic_classification.predicted_topic} ({llm.topic_classification.confidence:.3f})")
            
            if llm.writing_style:
                print(f"   Style: {llm.writing_style.style_type}, Formality: {llm.writing_style.formality}")
                print(f"   Avg Sentence Length: {llm.writing_style.avg_sentence_length:.1f}")
        
        print()
        print(f"💡 Generated {len(result.result.suggestions)} suggestions:")
        for i, suggestion in enumerate(result.result.suggestions, 1):
            print(f"   {i}. {suggestion}")
        
        print()
        print("✅ Integrated analysis test completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during integrated analysis testing: {e}")
        import traceback
        traceback.print_exc()


async def main():
    """Main test function"""
    print("🚀 Starting LLM Integration Tests for NoteGuard")
    print("=" * 60)
    print()
    
    # Test LLM service
    await test_llm_service()
    print()
    
    # Test integrated analysis
    await test_integrated_analysis()
    print()
    
    print("🎉 All tests completed!")


if __name__ == "__main__":
    asyncio.run(main())
