"""
Main analysis service that coordinates all analysis modules
"""

import time
from typing import List, Optional, Tuple
from app.services.grammar_service import GrammarService
from app.services.repetition_service import RepetitionService
from app.services.semantic_service import SemanticService
from app.services.llm_service import LLMService
from app.models.responses import (
    AnalyzeResponse,
    AnalysisResult,
    GrammarError,
    RepetitionError,
    SemanticScore,
    LLMAnalysis,
    SentimentAnalysis,
    TopicClassification,
    WritingStyle
)


class AnalysisService:
    """Main service for coordinating all text analysis"""
    
    def __init__(self):
        """Initialize analysis service with all sub-services"""
        self.grammar_service = GrammarService()
        self.repetition_service = RepetitionService()
        self.semantic_service = SemanticService()
        self.llm_service = LLMService()
    
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
            grammar_errors, repetition_errors, semantic_score, topic_issues, llm_analysis = await self._run_analyses(
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
                grammar_errors, repetition_errors, semantic_score, topic_issues
            )
            
            # Add detailed topic consistency suggestions
            detailed_topic_suggestions = self.semantic_service.generate_topic_improvement_suggestions(
                topic_issues, reference_topic
            )
            suggestions.extend(detailed_topic_suggestions)
            
            # Add LLM-powered suggestions
            llm_suggestions = await self.llm_service.generate_improvement_suggestions(
                text, {
                    'grammar_score': grammar_score,
                    'repetition_score': repetition_score,
                    'semantic_score': semantic_score.score,
                    'grammar_errors': grammar_errors,
                    'repetition_errors': repetition_errors,
                    'topic_consistency': topic_issues
                }
            )
            suggestions.extend(llm_suggestions)
            
            # Convert topic issues to Pydantic models
            from app.models.responses import TopicIssue, FlowDisruption, TopicConsistencyResult
            
            off_topic_sentences = [
                TopicIssue(
                    sentence=issue["sentence"],
                    index=issue["index"],
                    issue=issue["issue"],
                    topic_relevance=issue.get("topic_relevance")
                )
                for issue in topic_issues.get("off_topic_sentences", [])
            ]
            
            flow_disruptions = [
                FlowDisruption(
                    sentence_index=issue["sentence_index"],
                    next_sentence_index=issue["next_sentence_index"],
                    sentence=issue["sentence"],
                    next_sentence=issue["next_sentence"],
                    similarity=issue["similarity"],
                    issue=issue["issue"]
                )
                for issue in topic_issues.get("flow_disruptions", [])
            ]
            
            topic_consistency_result = TopicConsistencyResult(
                has_issues=topic_issues.get("has_issues", False),
                off_topic_sentences=off_topic_sentences,
                flow_disruptions=flow_disruptions,
                total_sentences=topic_issues.get("total_sentences", 0),
                issue_count=topic_issues.get("issue_count", 0)
            )
            
            # Convert LLM analysis results to Pydantic models
            llm_analysis_result = None
            if llm_analysis and not isinstance(llm_analysis, Exception):
                sentiment_analysis = None
                if llm_analysis.get("sentiment_analysis"):
                    sentiment_data = llm_analysis["sentiment_analysis"]
                    sentiment_analysis = SentimentAnalysis(
                        sentiment=sentiment_data.get("sentiment", "neutral"),
                        confidence=sentiment_data.get("confidence", 0.0),
                        text=sentiment_data.get("text", "")
                    )
                
                topic_classification = None
                if llm_analysis.get("topic_classification"):
                    topic_data = llm_analysis["topic_classification"]
                    topic_classification = TopicClassification(
                        predicted_topic=topic_data.get("predicted_topic", "Genel"),
                        confidence=topic_data.get("confidence", 0.0),
                        all_scores=topic_data.get("all_scores", {}),
                        text=topic_data.get("text", "")
                    )
                
                writing_style = None
                if llm_analysis.get("writing_style"):
                    style_data = llm_analysis["writing_style"]
                    writing_style = WritingStyle(
                        style_type=style_data.get("style_type", "Bilinmiyor"),
                        formality=style_data.get("formality", "Bilinmiyor"),
                        avg_sentence_length=style_data.get("avg_sentence_length", 0.0),
                        avg_word_length=style_data.get("avg_word_length", 0.0),
                        sentence_count=style_data.get("sentence_count", 0),
                        word_count=style_data.get("word_count", 0),
                        character_count=style_data.get("character_count", 0)
                    )
                
                llm_analysis_result = LLMAnalysis(
                    sentiment_analysis=sentiment_analysis,
                    topic_classification=topic_classification,
                    writing_style=writing_style,
                    text_length=llm_analysis.get("text_length", len(text)),
                    analysis_timestamp=llm_analysis.get("analysis_timestamp")
                )
            
            # Create analysis result
            result = AnalysisResult(
                grammar_errors=grammar_errors,
                repetition_errors=repetition_errors,
                semantic_score=semantic_score,
                grammar_score=grammar_score,
                repetition_score=repetition_score,
                semantic_coherence=semantic_score,  # Use same semantic score for coherence
                topic_consistency=topic_consistency_result,
                overall_score=overall_score,
                suggestions=suggestions,
                llm_analysis=llm_analysis_result
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
                    suggestions=["Analiz sırasında hata oluştu"],
                    llm_analysis=None
                ),
                processing_time=round(processing_time, 3)
            )
    
    async def _run_analyses(
        self,
        text: str,
        reference_topic: Optional[str] = None
    ) -> Tuple[List[GrammarError], List[RepetitionError], SemanticScore, dict, Optional[dict]]:
        """
        Run all analyses concurrently
        
        Args:
            text: Text to analyze
            reference_topic: Optional reference topic
            
        Returns:
            Tuple of (grammar_errors, repetition_errors, semantic_score, topic_issues, llm_analysis)
        """
        import asyncio
        
        # Run core analyses concurrently (faster)
        tasks = [
            self.grammar_service.analyze_grammar(text),
            self.repetition_service.analyze_repetitions(text),
            self.semantic_service.analyze_semantic_coherence(text, reference_topic),
            self.semantic_service.detect_topic_consistency_issues(text, reference_topic)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle exceptions gracefully
        grammar_errors = results[0] if not isinstance(results[0], Exception) else []
        repetition_errors = results[1] if not isinstance(results[1], Exception) else []
        semantic_score = results[2] if not isinstance(results[2], Exception) else SemanticScore(
            score=0.0, explanation="Anlamsal analiz hatası"
        )
        topic_issues = results[3] if not isinstance(results[3], Exception) else {
            "has_issues": False,
            "issues": [],
            "off_topic_sentences": [],
            "flow_disruptions": []
        }
        
        # LLM analysis - run only sentiment for speed
        llm_analysis = None
        try:
            # Run only fast LLM analyses
            sentiment_result = await self.llm_service.analyze_sentiment(text)
            
            # Simple writing style analysis without models
            word_count = len(text.split())
            sentence_count = len([s for s in text.split('.') if s.strip()])
            avg_sentence_length = word_count / sentence_count if sentence_count > 0 else 0
            
            llm_analysis = {
                "sentiment_analysis": sentiment_result,
                "topic_classification": {
                    "predicted_topic": "Genel",
                    "confidence": 0.5,
                    "all_scores": {"Genel": 1.0},
                    "text": text[:100] + "..." if len(text) > 100 else text
                },
                "writing_style": {
                    "style_type": "Basit" if avg_sentence_length < 10 else "Karmaşık",
                    "formality": "Orta",
                    "avg_sentence_length": round(avg_sentence_length, 1),
                    "avg_word_length": round(sum(len(word) for word in text.split()) / word_count, 1) if word_count > 0 else 0,
                    "sentence_count": sentence_count,
                    "word_count": word_count,
                    "character_count": len(text)
                },
                "text_length": len(text),
                "analysis_timestamp": asyncio.get_event_loop().time()
            }
        except Exception as e:
            print(f"LLM analysis failed: {e}")
            llm_analysis = None
        
        return grammar_errors, repetition_errors, semantic_score, topic_issues, llm_analysis
    
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
        semantic_score: SemanticScore,
        topic_issues: dict
    ) -> List[str]:
        """
        Generate comprehensive suggestions based on all analysis results
        
        Args:
            grammar_errors: Grammar errors found
            repetition_errors: Repetition errors found
            semantic_score: Semantic coherence score
            topic_issues: Topic consistency issues found
            
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
        
        # Topic consistency suggestions
        if topic_issues.get("has_issues", False):
            if topic_issues.get("off_topic_sentences"):
                suggestions.append(f"{len(topic_issues['off_topic_sentences'])} cümle ana konudan sapıyor.")
                suggestions.append("Konudan sapan cümleleri yeniden yazın veya kaldırın.")
            
            if topic_issues.get("flow_disruptions"):
                suggestions.append(f"{len(topic_issues['flow_disruptions'])} yerde anlam akışı kopuk.")
                suggestions.append("Anlam akışını düzeltmek için geçiş cümleleri ekleyin.")
            
            if topic_issues.get("issues"):
                suggestions.append("Konudan ani sapmalar tespit edildi.")
                suggestions.append("Konu tutarlılığını artırın.")
            
            # General topic consistency improvement suggestions
            suggestions.append("Konu tutarlılığını artırmak için ana konuya odaklanın.")
            suggestions.append("Cümleler arası mantıksal bağlantıları güçlendirin.")
        elif semantic_score.score < 0.7:
            suggestions.append("Anlamsal tutarlılığı biraz daha geliştirebilirsiniz.")
        
        # Overall suggestions
        total_errors = len(grammar_errors) + len(repetition_errors)
        if total_errors > 15:
            suggestions.append("Metninizde çok sayıda hata var. Daha dikkatli yazmanızı öneririz.")
        elif total_errors > 5:
            suggestions.append("Metninizde birkaç hata var. Bunları düzeltmeyi düşünün.")
        
        return suggestions 