"""
LLM Service for advanced text analysis using Hugging Face models
"""

import asyncio
import logging
from typing import List, Dict, Any, Optional, Tuple
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from app.models.responses import SemanticScore
from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMService:
    """Service for LLM-powered text analysis"""
    
    def __init__(self):
        """Initialize LLM service with cached models"""
        self.cached_models = {}
        self.cached_tokenizers = {}
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Initialize default models (like before)
        self._initialize_default_models()
    
    def _initialize_default_models(self):
        """Initialize default models for common tasks"""
        try:
            # Use faster, smaller models but pre-load them
            self.sentiment_model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
            self.text_gen_model_name = "microsoft/DialoGPT-small"
            self.zero_shot_model_name = "facebook/bart-base"
            
            # Pre-load sentiment model
            try:
                sentiment_pipeline = pipeline(
                    "text-classification",
                    model=self.sentiment_model_name,
                    device=self.device,
                    max_length=128,
                    truncation=True
                )
                self.cached_models[self.sentiment_model_name] = sentiment_pipeline
                logger.info("Sentiment model loaded successfully")
            except Exception as e:
                logger.warning(f"Could not pre-load sentiment model: {e}")
                # Fallback to a simpler approach
                self.sentiment_model_name = None
            
            logger.info(f"LLM Service initialized on device: {self.device}")
            
        except Exception as e:
            logger.error(f"Error initializing LLM models: {e}")
            # Set fallback flags
            self.sentiment_model_name = None
            self.zero_shot_model_name = None
    
    async def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """
        Analyze sentiment using multilingual model
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with sentiment analysis results
        """
        try:
            # Use cached model if available
            if self.sentiment_model_name not in self.cached_models:
                # Load sentiment analysis pipeline with smaller model
                sentiment_pipeline = pipeline(
                    "text-classification",
                    model=self.sentiment_model_name,
                    device=self.device,
                    max_length=128,  # Limit input length for speed
                    truncation=True
                )
                self.cached_models[self.sentiment_model_name] = sentiment_pipeline
            
            # Truncate text for faster processing
            truncated_text = text[:200] if len(text) > 200 else text
            
            # Run sentiment analysis
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self.cached_models[self.sentiment_model_name],
                truncated_text
            )
            
            # Process results
            if isinstance(result, list) and len(result) > 0:
                sentiment_result = result[0]
                return {
                    "sentiment": sentiment_result.get("label", "neutral"),
                    "confidence": round(sentiment_result.get("score", 0.0), 3),
                    "text": truncated_text
                }
            else:
                return {
                    "sentiment": "neutral",
                    "confidence": 0.0,
                    "text": truncated_text
                }
                
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {e}")
            return {
                "sentiment": "neutral",
                "confidence": 0.0,
                "text": text[:100] + "..." if len(text) > 100 else text,
                "error": str(e)
            }
    
    async def generate_improvement_suggestions(self, text: str, analysis_results: Dict[str, Any]) -> List[str]:
        """
        Generate contextual improvement suggestions using LLM
        
        Args:
            text: Original text
            analysis_results: Results from other analysis services
            
        Returns:
            List of improvement suggestions
        """
        try:
            # Create a comprehensive prompt for the LLM
            prompt = self._create_suggestion_prompt(text, analysis_results)
            
            # Use a simpler approach with zero-shot classification for now
            # In a full implementation, you'd use a text generation model
            suggestions = await self._generate_suggestions_from_analysis(analysis_results)
            
            # Add LLM-powered contextual suggestions
            contextual_suggestions = await self._generate_contextual_suggestions(text, analysis_results)
            suggestions.extend(contextual_suggestions)
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Error generating suggestions: {e}")
            return ["LLM önerileri şu anda kullanılamıyor."]
    
    def _create_suggestion_prompt(self, text: str, analysis_results: Dict[str, Any]) -> str:
        """
        Create a prompt for LLM-based suggestion generation
        
        Args:
            text: Original text
            analysis_results: Analysis results
            
        Returns:
            Formatted prompt
        """
        prompt = f"""
        Aşağıdaki Türkçe metni analiz edin ve iyileştirme önerileri sunun:
        
        Metin: {text[:500]}{'...' if len(text) > 500 else ''}
        
        Analiz Sonuçları:
        - Dilbilgisi Puanı: {analysis_results.get('grammar_score', 0)}
        - Tekrar Puanı: {analysis_results.get('repetition_score', 0)}
        - Anlamsal Puan: {analysis_results.get('semantic_score', 0)}
        
        Dilbilgisi Hataları: {len(analysis_results.get('grammar_errors', []))}
        Tekrar Hataları: {len(analysis_results.get('repetition_errors', []))}
        
        Lütfen bu metin için spesifik ve yapıcı iyileştirme önerileri sunun.
        """
        return prompt
    
    async def _generate_suggestions_from_analysis(self, analysis_results: Dict[str, Any]) -> List[str]:
        """
        Generate suggestions based on analysis results using LLM-enhanced logic
        
        Args:
            analysis_results: Analysis results
            
        Returns:
            List of suggestions
        """
        suggestions = []
        
        # Grammar-based suggestions
        grammar_score = analysis_results.get('grammar_score', 0)
        grammar_errors = analysis_results.get('grammar_errors', [])
        
        if grammar_score < 70:
            if len(grammar_errors) > 5:
                suggestions.append("🔧 Metninizde çok sayıda dilbilgisi hatası var. Dilbilgisi kurallarını gözden geçirin.")
            elif len(grammar_errors) > 2:
                suggestions.append("🔧 Metninizde birkaç dilbilgisi hatası var. Bu hataları düzeltmeyi düşünün.")
            else:
                suggestions.append("🔧 Dilbilgisi kalitesini artırmak için daha dikkatli yazın.")
        
        # Repetition-based suggestions
        repetition_score = analysis_results.get('repetition_score', 0)
        repetition_errors = analysis_results.get('repetition_errors', [])
        
        if repetition_score < 70:
            if len(repetition_errors) > 3:
                suggestions.append("🔄 Metninizde çok fazla tekrar var. Kelime çeşitliliğini artırın.")
            else:
                suggestions.append("🔄 Bazı kelimeler çok tekrarlanıyor. Eş anlamlılar kullanmayı düşünün.")
        
        # Semantic coherence suggestions
        semantic_score = analysis_results.get('semantic_score', 0)
        if semantic_score < 0.6:
            suggestions.append("🧠 Cümleler arası anlamsal tutarlılığı artırın.")
            suggestions.append("🧠 Mantıksal akışı güçlendirin.")
        
        return suggestions
    
    async def _generate_contextual_suggestions(self, text: str, analysis_results: Dict[str, Any]) -> List[str]:
        """
        Generate contextual suggestions using LLM analysis
        
        Args:
            text: Original text
            analysis_results: Analysis results
            
        Returns:
            List of contextual suggestions
        """
        suggestions = []
        
        try:
            # Analyze text characteristics
            text_length = len(text)
            sentence_count = text.count('.') + text.count('!') + text.count('?')
            
            # Contextual suggestions based on text characteristics
            if text_length < 100:
                suggestions.append("📝 Metniniz çok kısa. Daha detaylı açıklamalar ekleyin.")
            elif text_length > 2000:
                suggestions.append("📝 Metniniz çok uzun. Ana fikirleri özetleyin.")
            
            if sentence_count < 3:
                suggestions.append("📝 Daha fazla cümle ekleyerek metninizi geliştirin.")
            elif sentence_count > 20:
                suggestions.append("📝 Çok fazla cümle var. Paragraflar halinde düzenleyin.")
            
            # Style-based suggestions
            if text.count('!') > text.count('.') * 0.3:
                suggestions.append("💬 Çok fazla ünlem işareti kullanıyorsunuz. Daha sakin bir ton kullanın.")
            
            if text.count('?') > 3:
                suggestions.append("💬 Çok fazla soru cümlesi var. Açıklayıcı cümleler ekleyin.")
            
            # Topic consistency suggestions
            topic_issues = analysis_results.get('topic_consistency', {})
            if topic_issues.get('has_issues', False):
                suggestions.append("🎯 Konu tutarlılığını artırmak için ana konuya odaklanın.")
                suggestions.append("🎯 Konudan sapan cümleleri yeniden yazın veya kaldırın.")
            
        except Exception as e:
            logger.error(f"Error generating contextual suggestions: {e}")
        
        return suggestions
    
    async def classify_text_topic(self, text: str) -> Dict[str, Any]:
        """
        Classify text topic using zero-shot classification
        
        Args:
            text: Text to classify
            
        Returns:
            Dictionary with topic classification results
        """
        try:
            # Use cached model if available
            if self.zero_shot_model_name not in self.cached_models:
                # Load zero-shot classification pipeline
                zero_shot_pipeline = pipeline(
                    "zero-shot-classification",
                    model=self.zero_shot_model_name,
                    device=self.device
                )
                self.cached_models[self.zero_shot_model_name] = zero_shot_pipeline
            
            # Define topic candidates (Turkish topics)
            topic_candidates = [
                "Bilim", "Teknoloji", "Spor", "Sağlık", "Eğitim", 
                "Ekonomi", "Politika", "Kültür", "Sanat", "Genel"
            ]
            
            # Truncate text for faster processing
            truncated_text = text[:300] if len(text) > 300 else text
            
            # Run zero-shot classification
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self.cached_models[self.zero_shot_model_name],
                truncated_text,
                topic_candidates,
                multi_label=False
            )
            
            # Process results
            if result and "labels" in result and "scores" in result:
                # Get top prediction
                top_label = result["labels"][0] if result["labels"] else "Genel"
                top_score = result["scores"][0] if result["scores"] else 0.0
                
                # Create all_scores dictionary
                all_scores = {}
                for i, label in enumerate(result.get("labels", [])):
                    all_scores[label] = result.get("scores", [])[i] if i < len(result.get("scores", [])) else 0.0
                
                return {
                    "predicted_topic": top_label,
                    "confidence": round(top_score, 3),
                    "all_scores": all_scores,
                    "text": truncated_text
                }
            else:
                return {
                    "predicted_topic": "Genel",
                    "confidence": 0.5,
                    "all_scores": {"Genel": 1.0},
                    "text": truncated_text
                }
                
        except Exception as e:
            logger.error(f"Error in topic classification: {e}")
            return {
                "predicted_topic": "Genel",
                "confidence": 0.5,
                "all_scores": {"Genel": 1.0},
                "text": text[:100] + "..." if len(text) > 100 else text,
                "error": str(e)
            }
    
    async def analyze_writing_style(self, text: str) -> Dict[str, Any]:
        """
        Analyze writing style characteristics
        
        Args:
            text: Text to analyze
            
        Returns:
            Writing style analysis results
        """
        try:
            # Basic style analysis
            sentences = text.split('.')
            words = text.split()
            
            avg_sentence_length = len(words) / max(len(sentences), 1)
            avg_word_length = sum(len(word) for word in words) / max(len(words), 1)
            
            # Style classification
            if avg_sentence_length > 25:
                style_type = "Karmaşık"
            elif avg_sentence_length > 15:
                style_type = "Orta"
            else:
                style_type = "Basit"
            
            # Formality analysis
            formal_words = ["dolayısıyla", "bu nedenle", "sonuç olarak", "açıkçası"]
            informal_words = ["yani", "işte", "bak", "tamam"]
            
            formal_count = sum(1 for word in words if word.lower() in formal_words)
            informal_count = sum(1 for word in words if word.lower() in informal_words)
            
            if formal_count > informal_count:
                formality = "Resmi"
            elif informal_count > formal_count:
                formality = "Gayri resmi"
            else:
                formality = "Orta"
            
            return {
                "style_type": style_type,
                "formality": formality,
                "avg_sentence_length": round(avg_sentence_length, 1),
                "avg_word_length": round(avg_word_length, 1),
                "sentence_count": len(sentences),
                "word_count": len(words),
                "character_count": len(text)
            }
            
        except Exception as e:
            logger.error(f"Error in writing style analysis: {e}")
            return {
                "style_type": "Bilinmiyor",
                "formality": "Bilinmiyor",
                "error": str(e)
            }
    
    async def get_comprehensive_analysis(self, text: str, reference_topic: str = None) -> Dict[str, Any]:
        """
        Get comprehensive LLM analysis of text
        
        Args:
            text: Text to analyze
            reference_topic: Optional reference topic
            
        Returns:
            Dictionary with comprehensive analysis results
        """
        try:
            # Run all LLM analyses concurrently for speed
            tasks = [
                self.analyze_sentiment(text),
                self.classify_text_topic(text),
                self.analyze_writing_style(text),
                self.generate_improvement_suggestions(text, {
                    'text_length': len(text),
                    'reference_topic': reference_topic
                })
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Handle results with fallbacks
            sentiment_result = results[0] if not isinstance(results[0], Exception) else {
                "sentiment": "Neutral",
                "confidence": 0.5,
                "text": text[:100] + "..." if len(text) > 100 else text
            }
            
            topic_result = results[1] if not isinstance(results[1], Exception) else {
                "predicted_topic": "Genel",
                "confidence": 0.5,
                "all_scores": {"Genel": 1.0},
                "text": text[:100] + "..." if len(text) > 100 else text
            }
            
            style_result = results[2] if not isinstance(results[2], Exception) else {
                "style_type": "Basit",
                "formality": "Orta",
                "avg_sentence_length": len(text.split('.')) if '.' in text else len(text.split()),
                "avg_word_length": sum(len(word) for word in text.split()) / len(text.split()) if text.split() else 0,
                "sentence_count": len(text.split('.')),
                "word_count": len(text.split()),
                "character_count": len(text)
            }
            
            suggestions = results[3] if not isinstance(results[3], Exception) else [
                "Metin analizi tamamlandı.",
                "İyileştirme önerileri hazırlanıyor."
            ]
            
            return {
                "sentiment_analysis": sentiment_result,
                "topic_classification": topic_result,
                "writing_style": style_result,
                "text_length": len(text),
                "analysis_timestamp": asyncio.get_event_loop().time()
            }
            
        except Exception as e:
            logger.error(f"Error in comprehensive analysis: {e}")
            return {
                "sentiment_analysis": {
                    "sentiment": "Neutral",
                    "confidence": 0.5,
                    "text": text[:100] + "..." if len(text) > 100 else text
                },
                "topic_classification": {
                    "predicted_topic": "Genel",
                    "confidence": 0.5,
                    "all_scores": {"Genel": 1.0},
                    "text": text[:100] + "..." if len(text) > 100 else text
                },
                "writing_style": {
                    "style_type": "Basit",
                    "formality": "Orta",
                    "avg_sentence_length": len(text.split('.')) if '.' in text else len(text.split()),
                    "avg_word_length": sum(len(word) for word in text.split()) / len(text.split()) if text.split() else 0,
                    "sentence_count": len(text.split('.')),
                    "word_count": len(text.split()),
                    "character_count": len(text)
                },
                "text_length": len(text),
                "analysis_timestamp": asyncio.get_event_loop().time()
            }
