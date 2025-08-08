"""
Grammar analysis service using simple rule-based checking
"""

import asyncio
import re
from typing import List, Dict, Any
from app.models.responses import GrammarError


class GrammarService:
    """Service for grammar and spelling analysis using simple rules"""
    
    def __init__(self):
        """Initialize grammar rules"""
        self.grammar_rules = [
            {
                'pattern': r'\b([A-Z][a-z]+)\s+([a-z]+)\b',
                'message': 'Büyük harfle başlayan kelimeden sonra küçük harfle başlayan kelime kullanılmamalı',
                'rule_id': 'CAPITALIZATION',
                'ignore_at_start': True
            },
            {
                'pattern': r'\b([a-z]+)\s+([A-Z][a-z]+)\b',
                'message': 'Küçük harfle başlayan kelimeden sonra büyük harfle başlayan kelime kullanılmamalı',
                'rule_id': 'CAPITALIZATION'
            },
            {
                'pattern': r'\s{2,}',
                'message': 'Birden fazla boşluk kullanılmamalı',
                'rule_id': 'MULTIPLE_SPACES'
            },
            {
                'pattern': r'[.!?]\s*[a-z]',
                'message': 'Cümle sonundan sonra büyük harfle başlanmalı',
                'rule_id': 'SENTENCE_START'
            }
        ]
    
    async def analyze_grammar(self, text: str) -> List[GrammarError]:
        """
        Analyze text for grammar and spelling errors using simple rules
        
        Args:
            text: Text to analyze
            
        Returns:
            List of grammar errors found
        """
        grammar_errors = []
        
        for rule in self.grammar_rules:
            matches = re.finditer(rule['pattern'], text)
            for match in matches:
                # Ignore rule if it's at the start of the text and has the flag
                if rule.get('ignore_at_start') and match.start() == 0:
                    continue

                error = GrammarError(
                    message=rule['message'],
                    offset=match.start(),
                    length=match.end() - match.start(),
                    rule_id=rule['rule_id'],
                    suggestion=None
                )
                grammar_errors.append(error)
        
        return grammar_errors
    
    async def get_grammar_score(self, text: str, errors: List[GrammarError]) -> float:
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
        
        # Calculate error density
        total_chars = len(text)
        error_chars = sum(error.length for error in errors)
        
        # Score based on error density (lower is better)
        error_ratio = error_chars / total_chars if total_chars > 0 else 1.0
        
        # Convert to score (0-100, higher is better)
        score = max(0.0, 100.0 - (error_ratio * 100.0))
        
        # Bonus for no errors
        if not errors:
            score = min(100.0, score + 10.0)
        
        return round(score, 2)
    
    def get_grammar_suggestions(self, errors: List[GrammarError]) -> List[str]:
        """
        Generate general suggestions based on grammar errors
        
        Args:
            errors: List of grammar errors
            
        Returns:
            List of general suggestions
        """
        suggestions = []
        
        if not errors:
            suggestions.append("Dilbilgisi açısından metniniz iyi durumda.")
            return suggestions
        
        # Count error types
        error_types = {}
        for error in errors:
            error_types[error.rule_id] = error_types.get(error.rule_id, 0) + 1
        
        # Generate suggestions based on error types
        if 'CAPITALIZATION' in error_types:
            suggestions.append("Büyük/küçük harf kullanımına dikkat edin.")
        
        if 'MULTIPLE_SPACES' in error_types:
            suggestions.append("Gereksiz boşlukları temizleyin.")
        
        if 'SENTENCE_START' in error_types:
            suggestions.append("Cümle başlarında büyük harf kullanın.")
        
        suggestions.append(f"Toplam {len(errors)} dilbilgisi hatası bulundu.")
        
        return suggestions 