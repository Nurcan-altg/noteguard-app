"""
Main analysis service that coordinates all analysis modules
"""

import time
from typing import List
from app.services.grammar_service import GrammarService
from app.services.repetition_service import RepetitionService
from app.services.semantic_service import SemanticService
from app.models.responses import (
    AnalyzeResponse,
    AnalysisResult,
    GrammarError,
    RepetitionError,
    SemanticScore
)


class AnalysisService:
    """Main service for coordinating all text analysis"""
    
    def __init__(self):
        """Initialize analysis service with all sub-services"""
        self.grammar_service = GrammarService()
        self.repetition_service = RepetitionService()
        self.semantic_service = SemanticService()
    
    async def analyze_text(self, text: str, reference_topic: str = None) -> AnalyzeResponse:
        """
        Perform comprehensive text analysis
        
        Args:
            text: Text to analyze
            reference_topic: Optional reference topic for semantic analysis
            
        Returns:
            Complete analysis response
        """
        start_time = time.time()
        
        try:
            # Run all analyses concurrently
            grammar_errors, repetition_errors, semantic_score = await self._run_analyses(
                text, reference_topic
            )
            
            # Calculate overall score
            overall_score = await self._calculate_overall_score(
                text, grammar_errors, repetition_errors, semantic_score
            )
            
            # Get individual scores
            grammar_score = await self.grammar_service.get_grammar_score(text, grammar_errors)
            repetition_score = await self.repetition_service.get_repetition_score(text, repetition_errors)
            semantic_score_value = semantic_score.score * 100  # Convert to 0-100 scale
            
            # Generate suggestions
            suggestions = self._generate_suggestions(
                grammar_errors, repetition_errors, semantic_score
            )
            
            # Create analysis result
            result = AnalysisResult(
                grammar_errors=grammar_errors,
                repetition_errors=repetition_errors,
                semantic_score=semantic_score,
                grammar_score=grammar_score,
                repetition_score=repetition_score,
                semantic_coherence=semantic_score,  # Use same semantic score for coherence
                overall_score=overall_score,
                suggestions=suggestions
            )
            
            processing_time = time.time() - start_time
            
            return AnalyzeResponse(
                success=True,
                result=result,
                processing_time=round(processing_time, 3)
            )
            
        except Exception as e:
            processing_time = time.time() - start_time
            
            return AnalyzeResponse(
                success=False,
                result=AnalysisResult(
                    grammar_errors=[],
                    repetition_errors=[],
                    semantic_score=SemanticScore(score=0.0, explanation="Analiz hatası"),
                    grammar_score=0.0,
                    repetition_score=0.0,
                    semantic_coherence=SemanticScore(score=0.0, explanation="Analiz hatası"),
                    overall_score=0.0,
                    suggestions=["Analiz sırasında hata oluştu"]
                ),
                processing_time=round(processing_time, 3)
            )
    
    async def _run_analyses(self, text: str, reference_topic: str = None):
        """
        Run all analysis modules concurrently
        
        Args:
            text: Text to analyze
            reference_topic: Optional reference topic
            
        Returns:
            Tuple of (grammar_errors, repetition_errors, semantic_score)
        """
        import asyncio
        
        # Run all analyses concurrently
        tasks = [
            self.grammar_service.analyze_grammar(text),
            self.repetition_service.analyze_repetitions(text),
            self.semantic_service.analyze_semantic_coherence(text, reference_topic)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle exceptions gracefully
        grammar_errors = results[0] if not isinstance(results[0], Exception) else []
        repetition_errors = results[1] if not isinstance(results[1], Exception) else []
        semantic_score = results[2] if not isinstance(results[2], Exception) else SemanticScore(
            score=0.0, explanation="Anlamsal analiz hatası"
        )
        
        return grammar_errors, repetition_errors, semantic_score
    
    async def _calculate_overall_score(
        self,
        text: str,
        grammar_errors: List[GrammarError],
        repetition_errors: List[RepetitionError],
        semantic_score: SemanticScore
    ) -> float:
        """
        Calculate overall quality score
        
        Args:
            text: Original text
            grammar_errors: Grammar errors found
            repetition_errors: Repetition errors found
            semantic_score: Semantic coherence score
            
        Returns:
            Overall score (0-100)
        """
        # Get individual scores
        grammar_score = await self.grammar_service.get_grammar_score(text, grammar_errors)
        repetition_score = await self.repetition_service.get_repetition_score(text, repetition_errors)
        semantic_score_value = semantic_score.score * 100  # Convert to 0-100 scale
        
        # Weighted average (can be adjusted based on importance)
        weights = {
            'grammar': 0.4,      # 40% weight for grammar
            'repetition': 0.3,   # 30% weight for repetition
            'semantic': 0.3      # 30% weight for semantic coherence
        }
        
        overall_score = (
            grammar_score * weights['grammar'] +
            repetition_score * weights['repetition'] +
            semantic_score_value * weights['semantic']
        )
        
        return round(overall_score, 2)
    
    def _generate_suggestions(
        self,
        grammar_errors: List[GrammarError],
        repetition_errors: List[RepetitionError],
        semantic_score: SemanticScore
    ) -> List[str]:
        """
        Generate comprehensive suggestions based on all analysis results
        
        Args:
            grammar_errors: Grammar errors found
            repetition_errors: Repetition errors found
            semantic_score: Semantic coherence score
            
        Returns:
            List of suggestions
        """
        suggestions = []
        
        # Grammar suggestions
        grammar_suggestions = self.grammar_service.get_grammar_suggestions(grammar_errors)
        suggestions.extend(grammar_suggestions)
        
        # Repetition suggestions
        repetition_suggestions = self.repetition_service.get_repetition_suggestions(repetition_errors)
        suggestions.extend(repetition_suggestions)
        
        # Semantic suggestions
        if semantic_score.score < 0.5:
            suggestions.append("Cümleler arası anlamsal tutarlılığı artırın.")
        elif semantic_score.score < 0.7:
            suggestions.append("Anlamsal tutarlılığı biraz daha geliştirebilirsiniz.")
        
        # Overall suggestions
        total_errors = len(grammar_errors) + len(repetition_errors)
        if total_errors > 15:
            suggestions.append("Metninizde çok sayıda hata var. Daha dikkatli yazmanızı öneririz.")
        elif total_errors > 5:
            suggestions.append("Metninizde birkaç hata var. Bunları düzeltmeyi düşünün.")
        
        return suggestions 