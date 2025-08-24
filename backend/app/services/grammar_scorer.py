"""
Grammar scoring and suggestions
"""

from typing import List
from app.models.responses import GrammarError


class GrammarScorer:
    """Grammar scoring and suggestions"""
    
    def __init__(self):
        self.penalty_per_error = 8.0  # Increased penalty for more realistic scores
    
    def calculate_score(self, text: str, errors: List[GrammarError]) -> float:
        """
        Calculate grammar score based on errors
        
        Args:
            text: Original text
            errors: List of grammar errors
            
        Returns:
            Grammar score (0-100)
        """
        if not text.strip():
            return 0.0
        
        # Better scoring method: based on error count rather than error length
        total_chars = len(text)
        error_count = len(errors)
        
        # Calculate score based on error count per character
        # More errors = lower score
        if error_count == 0:
            return 100.0
        
        # Penalty per error (reduced for better scores)
        total_penalty = error_count * self.penalty_per_error
        
        # Calculate score
        score = max(0.0, 100.0 - total_penalty)
        
        return round(score, 2)
    
    def get_suggestions(self, errors: List[GrammarError]) -> List[str]:
        """
        Generate detailed suggestions based on grammar errors
        
        Args:
            errors: List of grammar errors
            
        Returns:
            List of detailed suggestions
        """
        suggestions = []
        
        if not errors:
            suggestions.append("🎉 Dilbilgisi açısından metniniz çok iyi durumda!")
            return suggestions

        # Count error types
        error_types = {}
        for error in errors:
            error_types[error.rule_id] = error_types.get(error.rule_id, 0) + 1
        
        # Generate detailed suggestions based on error types
        if 'CAPITALIZATION' in error_types:
            count = error_types['CAPITALIZATION']
            suggestions.append(f"🔤 {count} büyük/küçük harf hatası:")
            suggestions.append("   • Cümle başlarında büyük harf kullanın")
            suggestions.append("   • Özel isimlerde büyük harf kullanın")
            suggestions.append("   • Tutarlı büyük/küçük harf kullanımı yapın")
        
        if 'SPELLING' in error_types:
            count = error_types['SPELLING']
            suggestions.append(f"📝 {count} yazım hatası:")
            suggestions.append("   • Yazım hatalarını düzeltin")
            suggestions.append("   • TDK yazım kılavuzunu kontrol edin")
            suggestions.append("   • Otomatik yazım denetimi kullanın")
        
        if 'TURKISH_DE_DA' in error_types:
            count = error_types['TURKISH_DE_DA']
            suggestions.append(f"🔗 {count} 'de/da' yazım hatası:")
            suggestions.append("   • Bağlaç olan 'de/da' ayrı yazılır")
            suggestions.append("   • Ek olan '-de/-da' bitişik yazılır")
            suggestions.append("   • Örnek: 'Evde' (ek) vs 'Ev de' (bağlaç)")
        
        if 'TURKISH_KI' in error_types:
            count = error_types['TURKISH_KI']
            suggestions.append(f"🔗 {count} 'ki' yazım hatası:")
            suggestions.append("   • Bağlaç olan 'ki' ayrı yazılır")
            suggestions.append("   • Örnek: 'Öyle ki', 'Demek ki'")
        
        if 'PUNCTUATION_SPACING' in error_types:
            count = error_types['PUNCTUATION_SPACING']
            suggestions.append(f"📏 {count} noktalama işareti boşluk hatası:")
            suggestions.append("   • Noktalama işaretlerinden önce boşluk olmaz")
            suggestions.append("   • Noktalama işaretlerinden sonra boşluk olur")
            suggestions.append("   • Örnek: 'Doğru: Merhaba! Nasılsın?'")
        
        if 'MULTIPLE_SPACES' in error_types:
            count = error_types['MULTIPLE_SPACES']
            suggestions.append(f"📏 {count} çoklu boşluk hatası:")
            suggestions.append("   • Kelimeler arasında tek boşluk olmalı")
            suggestions.append("   • Gereksiz boşlukları temizleyin")
        
        if 'SENTENCE_STRUCTURE' in error_types:
            count = error_types['SENTENCE_STRUCTURE']
            suggestions.append(f"📄 {count} cümle yapısı sorunu:")
            suggestions.append("   • Uzun cümleleri kısaltın")
            suggestions.append("   • Cümle yapısını basitleştirin")
            suggestions.append("   • Anlaşılır cümleler kurun")
        
        if 'VERB_CONJUGATION' in error_types:
            count = error_types['VERB_CONJUGATION']
            suggestions.append(f"🔤 {count} fiil çekimi sorunu:")
            suggestions.append("   • Fiil çekimlerini kontrol edin")
            suggestions.append("   • Kişi ve zaman uyumuna dikkat edin")
        
        # Summary
        total_errors = len(errors)
        if total_errors <= 3:
            suggestions.append(f"✅ Toplam {total_errors} hata - Metniniz genel olarak iyi!")
        elif total_errors <= 8:
            suggestions.append(f"⚠️ Toplam {total_errors} hata - Biraz daha dikkat edin.")
        else:
            suggestions.append(f"❌ Toplam {total_errors} hata - Metninizi gözden geçirin.")
        
        return suggestions
