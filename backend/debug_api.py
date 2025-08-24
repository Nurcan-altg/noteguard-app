import asyncio
from app.services.analysis_service import AnalysisService

async def debug_analysis_service():
    service = AnalysisService()
    text = "Yapay zeka, öğrencilere bireysel öğrenme imakanları sunar. Örneğin, bir ogrencinin hatalarını analiz ederek kişisel öneriler verir. Ancak bazen yanliş önerileride getirebilir. Öğretmenlerin rolü tamamen ortadan kalkmıyacaktır."
    
    print(f"Testing text: {text}")
    
    # Test grammar service directly
    print("\n=== Testing Grammar Service Directly ===")
    grammar_errors = await service.grammar_service.analyze_grammar(text)
    print(f"Grammar service found {len(grammar_errors)} errors:")
    for error in grammar_errors:
        print(f"  - {error.message} at position {error.offset}")
    
    # Test analysis service
    print("\n=== Testing Analysis Service ===")
    result = await service.analyze_text(text, "yapay zeka eğitimi")
    print(f"Analysis service found {len(result.result.grammar_errors)} grammar errors:")
    for error in result.result.grammar_errors:
        print(f"  - {error.message} at position {error.offset}")
    
    print(f"\nGrammar score: {result.result.grammar_score}")
    print(f"Overall score: {result.result.overall_score}")

if __name__ == "__main__":
    asyncio.run(debug_analysis_service())
