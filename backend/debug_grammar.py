import asyncio
import re
from app.services.grammar_service import GrammarService

async def debug_grammar():
    service = GrammarService()
    text = "Yapay zeka, öğrencilere bireysel öğrenme imakanları sunar. Örneğin, bir ogrencinin hatalarını analiz ederek kişisel öneriler verir. Ancak bazen yanliş önerileride getirebilir. Öğretmenlerin rolü tamamen ortadan kalkmıyacaktır."
    
    print(f"Testing text: {text}")
    print(f"Language detected: {service._detect_language(text)}")
    
    # Test regex patterns directly
    patterns = [
        r'\b(imakanları)\b',
        r'\b(ogrencinin)\b',
        r'\b(yanliş)\b',
        r'\b(önerileride)\b',
        r'\b(kalkmıyacaktır)\b'
    ]
    
    for pattern in patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            print(f"Pattern {pattern} matched: '{match.group()}' at position {match.start()}")
    
    # Test the actual analysis
    errors = await service.analyze_grammar(text)
    print(f"Found {len(errors)} grammar errors:")
    for error in errors:
        print(f"  - {error.message} at position {error.offset}")

if __name__ == "__main__":
    asyncio.run(debug_grammar())
