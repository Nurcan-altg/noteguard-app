"""
Repetition detection service using n-gram analysis
"""

import re
from typing import List, Dict, Tuple
from collections import Counter, defaultdict
from app.models.responses import RepetitionError


class RepetitionService:
    """Service for detecting repetitions in text"""
    
    def __init__(self):
        """Initialize repetition detection service"""
        self.min_word_count = 2  # Minimum words for phrase repetition
        self.max_word_count = 5   # Maximum words for phrase repetition
        self.max_threshold = 5    # Maximum threshold regardless of text length
    
    async def analyze_repetitions(self, text: str) -> List[RepetitionError]:
        """
        Analyze text for repetitions
        
        Args:
            text: Text to analyze
            
        Returns:
            List of repetition errors found
        """
        # Clean and tokenize text
        words = self._tokenize_text(text)
        
        # Find word repetitions
        word_repetitions = self._find_word_repetitions(words)
        
        # Find phrase repetitions
        phrase_repetitions = self._find_phrase_repetitions(words)
        
        # Combine and filter results
        all_repetitions = word_repetitions + phrase_repetitions
        
        # Convert to RepetitionError objects
        repetition_errors = []
        for repetition in all_repetitions:
            error = RepetitionError(
                word=repetition['word'],
                count=repetition['count'],
                positions=repetition['positions'],
                suggestion=repetition['suggestion']
            )
            repetition_errors.append(error)
        
        return repetition_errors
    
    def _tokenize_text(self, text: str) -> List[str]:
        """
        Tokenize text into words
        
        Args:
            text: Input text
            
        Returns:
            List of words
        """
        # Remove punctuation and convert to lowercase
        text = re.sub(r'[^\w\s]', ' ', text.lower())
        
        # Split into words and filter out empty strings
        words = [word.strip() for word in text.split() if word.strip()]
        
        return words
    
    def _find_word_repetitions(self, words: List[str]) -> List[Dict]:
        """
        Find repeated words with dynamic threshold based on text length
        
        Args:
            words: List of words
            
        Returns:
            List of word repetition dictionaries
        """
        word_positions = defaultdict(list)
        
        # Find positions of each word
        for i, word in enumerate(words):
            word_positions[word].append(i)
        
        # Calculate dynamic threshold based on text length
        text_length = len(words)
        if text_length < 50:
            threshold = 2  # Short texts: 2 repetitions
        elif text_length < 100:
            threshold = 2  # Medium-short texts: 2 repetitions
        elif text_length < 200:
            threshold = 3  # Medium texts: 3 repetitions
        elif text_length < 500:
            threshold = 4  # Long texts: 4 repetitions
        else:
            threshold = 5  # Very long texts: 5 repetitions
        
        # Cap threshold at maximum value
        threshold = min(threshold, self.max_threshold)
        
        repetitions = []
        
        for word, positions in word_positions.items():
            if len(positions) >= threshold:
                # Skip very short words (likely articles, prepositions)
                if len(word) <= 2:
                    continue
                
                # Skip common words that are expected to repeat
                common_words = {'ve', 'veya', 'ile', 'için', 'bu', 'bir', 'da', 'de', 'mi', 'mu', 'mü'}
                if word.lower() in common_words and len(positions) < threshold + 1:
                    continue
                
                repetition = {
                    'word': word,
                    'count': len(positions),
                    'positions': positions,
                    'suggestion': f'"{word}" kelimesini farklı kelimelerle değiştirin'
                }
                repetitions.append(repetition)
        
        return repetitions
    
    def _find_phrase_repetitions(self, words: List[str]) -> List[Dict]:
        """
        Find repeated phrases using n-grams with dynamic threshold
        
        Args:
            words: List of words
            
        Returns:
            List of phrase repetition dictionaries
        """
        repetitions = []
        
        # Calculate dynamic threshold based on text length
        text_length = len(words)
        if text_length < 50:
            threshold = 2  # Short texts: 2 repetitions
        elif text_length < 100:
            threshold = 2  # Medium-short texts: 2 repetitions
        elif text_length < 200:
            threshold = 3  # Medium texts: 3 repetitions
        elif text_length < 500:
            threshold = 4  # Long texts: 4 repetitions
        else:
            threshold = 5  # Very long texts: 5 repetitions
        
        # Cap threshold at maximum value
        threshold = min(threshold, self.max_threshold)
        
        # Check different phrase lengths
        for phrase_length in range(self.min_word_count, self.max_word_count + 1):
            if len(words) < phrase_length:
                continue
            
            # Generate n-grams
            ngrams = []
            for i in range(len(words) - phrase_length + 1):
                phrase = ' '.join(words[i:i + phrase_length])
                ngrams.append((phrase, i))
            
            # Count phrase occurrences
            phrase_counter = Counter(phrase for phrase, _ in ngrams)
            
            # Find repeated phrases
            for phrase, count in phrase_counter.items():
                if count >= threshold:
                    # Find all positions of this phrase
                    positions = [pos for p, pos in ngrams if p == phrase]
                    
                    repetition = {
                        'word': phrase,
                        'count': count,
                        'positions': positions,
                        'suggestion': f"'{phrase}' ifadesini farklı şekillerde ifade edin"
                    }
                    repetitions.append(repetition)
        
        return repetitions
    
    async def get_repetition_score(self, text: str, errors: List[RepetitionError]) -> float:
        """
        Calculate repetition score based on errors
        
        Args:
            text: Original text
            errors: List of repetition errors
            
        Returns:
            Repetition score (0-100)
        """
        if not text.strip():
            return 0.0
        
        # Calculate repetition density
        total_words = len(text.split())
        repetition_words = sum(error.count for error in errors)
        
        # Score based on repetition density (lower is better)
        repetition_ratio = repetition_words / total_words if total_words > 0 else 1.0
        
        # Convert to score (0-100, higher is better)
        score = max(0.0, 100.0 - (repetition_ratio * 100.0))
        
        # Bonus for no repetitions
        if not errors:
            score = min(100.0, score + 10.0)
        
        return round(score, 2)
    
    def get_repetition_suggestions(self, errors: List[RepetitionError]) -> List[str]:
        """
        Generate general suggestions based on repetition errors
        
        Args:
            errors: List of repetition errors
            
        Returns:
            List of general suggestions
        """
        suggestions = []
        
        if not errors:
            suggestions.append("Metninizde önemli tekrarlar bulunmuyor.")
            return suggestions
        
        # Count different types of repetitions
        word_repetitions = sum(1 for e in errors if len(e.word.split()) == 1)
        phrase_repetitions = sum(1 for e in errors if len(e.word.split()) > 1)
        
        if word_repetitions > 0:
            suggestions.append(f"{word_repetitions} kelime tekrarı azaltılmalı.")
        
        if phrase_repetitions > 0:
            suggestions.append(f"{phrase_repetitions} ifade tekrarı azaltılmalı.")
        
        if len(errors) > 3:
            suggestions.append("Metninizde çok sayıda tekrar var. Çeşitliliği artırın.")
        
        return suggestions 