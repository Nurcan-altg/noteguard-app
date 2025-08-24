#!/usr/bin/env python3
"""
Test script for improved grammar service
"""

import asyncio
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.grammar_service import GrammarService


async def test_grammar_improvements():
    """Test the improved grammar service"""
    print("🧪 Testing Improved Grammar Service...")
    print("=" * 50)
    
    # Initialize grammar service
    grammar_service = GrammarService()
    
    # Test cases with different scenarios
    test_cases = [
        {
            "name": "Normal Turkish Text (Should have few errors)",
            "text": "Merhaba! Bugün hava çok güzel. Evde oturup kitap okuyorum. Bu kitap çok ilginç.",
            "expected_errors": "low"
        },
        {
            "name": "Text with Common Words (Should not flag correct words)",
            "text": "Evde oturuyorum. Okulda çalışıyorum. İşte yoğunum. Sokakta yürüyorum. Yolda gidiyorum.",
            "expected_errors": "very_low"
        },
        {
            "name": "Text with Actual Errors",
            "text": "yalnış yazım herkez yanlız imakanları ogrencinin",
            "expected_errors": "high"
        },
        {
            "name": "Text with Mixed Case (Should be more lenient)",
            "text": "Bu bir test metni. i.e. örnek cümle. vs. diğer cümle. 123 sayı.",
            "expected_errors": "low"
        },
        {
            "name": "Text with Proper Nouns",
            "text": "İstanbul'da yaşıyorum. Ankara'da çalışıyorum. Türkiye'de doğdum.",
            "expected_errors": "very_low"
        },
        {
            "name": "Text with Natural Language Patterns",
            "text": "Kapıda durdum. Pencerede baktım. Duvarda resim var. Yerde oturdum.",
            "expected_errors": "very_low"
        },
        {
            "name": "Text with Weather/Nature Words",
            "text": "Havada uçuyor. Suda yüzüyor. Ateşte pişiyor. Güneşte ısınıyor.",
            "expected_errors": "very_low"
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📝 Test {i}: {test_case['name']}")
        print(f"Text: {test_case['text']}")
        
        try:
            # Analyze grammar
            errors = await grammar_service.analyze_grammar(test_case['text'])
            
            print(f"Found {len(errors)} grammar errors:")
            
            if errors:
                for j, error in enumerate(errors, 1):
                    print(f"  {j}. {error.message} (Rule: {error.rule_id})")
                    if error.suggestion:
                        print(f"     Suggestion: {error.suggestion}")
            else:
                print("  ✅ No grammar errors found!")
            
            # Calculate score
            score = await grammar_service.get_grammar_score(test_case['text'], errors)
            print(f"  📊 Grammar Score: {score}/100")
            
            # Evaluate results
            if test_case['expected_errors'] == 'very_low' and len(errors) <= 1:
                print("  ✅ PASS: Expected very few errors")
            elif test_case['expected_errors'] == 'low' and len(errors) <= 3:
                print("  ✅ PASS: Expected few errors")
            elif test_case['expected_errors'] == 'high' and len(errors) >= 3:
                print("  ✅ PASS: Expected many errors")
            else:
                print(f"  ⚠️ UNEXPECTED: Got {len(errors)} errors, expected {test_case['expected_errors']}")
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Grammar improvement tests completed!")


async def test_specific_improvements():
    """Test specific improvements"""
    print("\n🔍 Testing Specific Improvements...")
    print("=" * 50)
    
    grammar_service = GrammarService()
    
    # Test context-aware rules
    context_tests = [
        {
            "name": "Sentence Start Context",
            "text": "Merhaba! bugün güzel. i.e. örnek. 123 sayı.",
            "should_flag": ["bugün"],  # Should flag this
            "should_not_flag": ["i.e.", "123"]  # Should not flag these
        },
        {
            "name": "De/Da Context",
            "text": "Evde oturuyorum. Ben de geliyorum. Okulda çalışıyorum. Sen de gel.",
            "should_flag": ["Ben de", "Sen de"],  # Should flag these
            "should_not_flag": ["Evde", "Okulda"]  # Should not flag these
        },
        {
            "name": "Ki Context",
            "text": "Öyle ki güzel. Belki gelir. Çünkü yoğunum. Demek ki doğru.",
            "should_flag": ["Öyle ki", "Demek ki"],  # Should flag these
            "should_not_flag": ["Belki", "Çünkü"]  # Should not flag these
        },
        {
            "name": "Natural Language Patterns",
            "text": "Kapıda durdum. Pencerede baktım. Duvarda resim var. Yerde oturdum.",
            "should_flag": [],  # Should not flag any
            "should_not_flag": ["Kapıda", "Pencerede", "Duvarda", "Yerde"]
        },
        {
            "name": "Weather/Nature Words",
            "text": "Havada uçuyor. Suda yüzüyor. Ateşte pişiyor. Güneşte ısınıyor.",
            "should_flag": [],  # Should not flag any
            "should_not_flag": ["Havada", "Suda", "Ateşte", "Güneşte"]
        }
    ]
    
    for test in context_tests:
        print(f"\n📝 {test['name']}")
        print(f"Text: {test['text']}")
        
        errors = await grammar_service.analyze_grammar(test['text'])
        
        print(f"Found {len(errors)} errors:")
        for error in errors:
            print(f"  - {error.message}")
        
        # Check if expected errors were found
        found_messages = [error.message for error in errors]
        
        for should_flag in test['should_flag']:
            if any(should_flag in msg for msg in found_messages):
                print(f"  ✅ Correctly flagged: {should_flag}")
            else:
                print(f"  ❌ Missed: {should_flag}")
        
        for should_not_flag in test['should_not_flag']:
            if any(should_not_flag in msg for msg in found_messages):
                print(f"  ❌ Incorrectly flagged: {should_not_flag}")
            else:
                print(f"  ✅ Correctly ignored: {should_not_flag}")


async def test_grammar_scoring():
    """Test grammar scoring improvements"""
    print("\n📊 Testing Grammar Scoring Improvements...")
    print("=" * 50)
    
    grammar_service = GrammarService()
    
    scoring_tests = [
        {
            "name": "Perfect Text",
            "text": "Merhaba! Bugün hava çok güzel. Evde oturup kitap okuyorum.",
            "expected_score": "high"
        },
        {
            "name": "Text with Few Errors",
            "text": "merhaba! bugün hava çok güzel. evde oturup kitap okuyorum.",
            "expected_score": "medium"
        },
        {
            "name": "Text with Many Errors",
            "text": "yalnış yazım herkez yanlız imakanları ogrencinin",
            "expected_score": "low"
        }
    ]
    
    for test in scoring_tests:
        print(f"\n📝 {test['name']}")
        print(f"Text: {test['text']}")
        
        errors = await grammar_service.analyze_grammar(test['text'])
        score = await grammar_service.get_grammar_score(test['text'], errors)
        
        print(f"Errors: {len(errors)}")
        print(f"Score: {score}/100")
        
        # Evaluate score
        if test['expected_score'] == 'high' and score >= 80:
            print("  ✅ PASS: Expected high score")
        elif test['expected_score'] == 'medium' and 50 <= score < 80:
            print("  ✅ PASS: Expected medium score")
        elif test['expected_score'] == 'low' and score < 50:
            print("  ✅ PASS: Expected low score")
        else:
            print(f"  ⚠️ UNEXPECTED: Got score {score}, expected {test['expected_score']}")


async def main():
    """Main test function"""
    print("🚀 Starting Grammar Service Improvement Tests")
    print("=" * 60)
    
    await test_grammar_improvements()
    await test_specific_improvements()
    await test_grammar_scoring()
    
    print("\n🎉 All tests completed!")


if __name__ == "__main__":
    asyncio.run(main())
