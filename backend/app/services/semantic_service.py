"""
Semantic coherence analysis service using sentence-transformers
"""

import asyncio
import re
from typing import List, Tuple, Dict, Any
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from app.models.responses import SemanticScore


class SemanticService:
    """Service for semantic coherence analysis"""
    
    def __init__(self, model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"):
        """
        Initialize semantic service with sentence transformer model
        
        Args:
            model_name: Name of the sentence transformer model to use
        """
        # Load model once at initialization
        try:
            self.model = SentenceTransformer(model_name)
            print(f"✅ Semantic model loaded: {model_name}")
        except Exception as e:
            print(f"⚠️ Semantic model loading failed: {e}")
            # Fallback to simple analysis
            self.model = None
        self.model_name = model_name
    
    async def analyze_semantic_coherence(self, text: str, reference_topic: str = None) -> SemanticScore:
        """
        Analyze semantic coherence of text
        
        Args:
            text: Text to analyze
            reference_topic: Optional reference topic for comparison
            
        Returns:
            SemanticScore object with coherence score and explanation
        """
        # Split text into sentences
        sentences = self._split_into_sentences(text)
        
        if len(sentences) < 2:
            return SemanticScore(
                score=1.0,
                explanation="Tek cümle olduğu için anlamsal analiz yapılamadı."
            )
        
        # Use model-based analysis if available, otherwise fallback
        if self.model is not None:
            # Get sentence embeddings
            embeddings = await self._get_sentence_embeddings(sentences)
            
            # Calculate pairwise similarities
            similarities = self._calculate_pairwise_similarities(embeddings)
            
            # Calculate overall coherence score
            coherence_score = self._calculate_coherence_score(similarities)
        else:
            # Fallback to simple heuristic-based analysis
            coherence_score = self._simple_coherence_analysis(sentences)
        
        # Generate explanation
        explanation = self._generate_explanation(coherence_score, len(sentences))
        
        return SemanticScore(
            score=coherence_score,
            explanation=explanation
        )
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences
        
        Args:
            text: Input text
            
        Returns:
            List of sentences
        """
        # Simple sentence splitting (can be improved with more sophisticated NLP)
        sentences = re.split(r'[.!?]+', text)
        
        # Clean and filter sentences
        sentences = [
            sentence.strip() 
            for sentence in sentences 
            if sentence.strip() and len(sentence.strip()) > 10
        ]
        
        return sentences
    
    def _simple_coherence_analysis(self, sentences: List[str]) -> float:
        """
        Simple coherence analysis without model
        
        Args:
            sentences: List of sentences
            
        Returns:
            Coherence score (0-1)
        """
        if len(sentences) <= 1:
            return 1.0
        
        # Simple heuristic: more sentences = slightly lower coherence (for now)
        # This is a placeholder - can be improved with better logic
        base_score = 0.7
        sentence_penalty = 0.05 * (len(sentences) - 1)
        
        return max(0.2, base_score - sentence_penalty)
    
    async def _get_sentence_embeddings(self, sentences: List[str]) -> np.ndarray:
        """
        Get embeddings for sentences
        
        Args:
            sentences: List of sentences
            
        Returns:
            Array of sentence embeddings
        """
        # Run embedding generation in thread pool
        loop = asyncio.get_event_loop()
        embeddings = await loop.run_in_executor(
            None,
            self.model.encode,
            sentences
        )
        
        return embeddings
    
    def _calculate_pairwise_similarities(self, embeddings: np.ndarray) -> List[float]:
        """
        Calculate pairwise similarities between sentence embeddings
        
        Args:
            embeddings: Array of sentence embeddings
            
        Returns:
            List of similarity scores
        """
        similarities = []
        
        for i in range(len(embeddings) - 1):
            for j in range(i + 1, len(embeddings)):
                similarity = cosine_similarity(
                    embeddings[i:i+1], 
                    embeddings[j:j+1]
                )[0][0]
                similarities.append(similarity)
        
        return similarities
    
    def _calculate_coherence_score(self, similarities: List[float]) -> float:
        """
        Calculate overall coherence score from similarities
        
        Args:
            similarities: List of pairwise similarities
            
        Returns:
            Coherence score (0-1)
        """
        if not similarities:
            return 0.0
        
        # Use mean similarity as coherence score
        coherence_score = np.mean(similarities)
        
        # Normalize to 0-1 range
        coherence_score = max(0.0, min(1.0, coherence_score))
        
        return round(coherence_score, 3)
    
    def _generate_explanation(self, score: float, sentence_count: int) -> str:
        """
        Generate explanation for coherence score
        
        Args:
            score: Coherence score
            sentence_count: Number of sentences
            
        Returns:
            Explanation string
        """
        if score >= 0.8:
            return f"Metniniz anlamsal olarak çok tutarlı ({sentence_count} cümle)."
        elif score >= 0.6:
            return f"Metniniz anlamsal olarak tutarlı ({sentence_count} cümle)."
        elif score >= 0.4:
            return f"Metninizde anlamsal tutarlılık orta seviyede ({sentence_count} cümle)."
        else:
            return f"Metninizde anlamsal tutarlılık düşük ({sentence_count} cümle)."
    
    async def compare_with_reference(self, text: str, reference_topic: str) -> SemanticScore:
        """
        Compare text coherence with reference topic
        
        Args:
            text: Text to analyze
            reference_topic: Reference topic for comparison
            
        Returns:
            SemanticScore with topic relevance
        """
        if not reference_topic:
            return await self.analyze_semantic_coherence(text)
        
        # Get text sentences
        text_sentences = self._split_into_sentences(text)
        
        if not text_sentences:
            return SemanticScore(
                score=0.0,
                explanation="Analiz edilecek cümle bulunamadı."
            )
        
        # Create reference sentences (topic + text sentences)
        reference_sentences = [reference_topic] + text_sentences
        
        # Get embeddings
        embeddings = await self._get_sentence_embeddings(reference_sentences)
        
        # Calculate similarities with reference topic
        topic_embeddings = embeddings[0:1]  # Reference topic embedding
        text_embeddings = embeddings[1:]    # Text sentence embeddings
        
        similarities = cosine_similarity(topic_embeddings, text_embeddings)[0]
        
        # Calculate average relevance to topic
        topic_relevance = np.mean(similarities)
        
        # Generate explanation
        if topic_relevance >= 0.7:
            explanation = f"Metniniz '{reference_topic}' konusuyla çok ilgili."
        elif topic_relevance >= 0.5:
            explanation = f"Metniniz '{reference_topic}' konusuyla ilgili."
        else:
            explanation = f"Metniniz '{reference_topic}' konusuyla az ilgili."
        
        return SemanticScore(
            score=round(topic_relevance, 3),
            explanation=explanation
        )

    async def detect_topic_consistency_issues(self, text: str, reference_topic: str = None) -> Dict[str, Any]:
        """
        Detect topic consistency issues and flow disruptions
        
        Args:
            text: Text to analyze
            reference_topic: Optional reference topic
            
        Returns:
            Dictionary with detected issues
        """
        text_sentences = self._split_into_sentences(text)
        
        if len(text_sentences) < 2:
            return {
                "has_issues": False,
                "issues": [],
                "off_topic_sentences": [],
                "flow_disruptions": []
            }
        
        # Get embeddings for all sentences
        embeddings = await self._get_sentence_embeddings(text_sentences)
        
        issues = []
        off_topic_sentences = []
        flow_disruptions = []
        
        # 1. Check topic consistency if reference topic provided
        if reference_topic:
            topic_embedding = await self._get_sentence_embeddings([reference_topic])
            topic_similarities = cosine_similarity(topic_embedding, embeddings)[0]
            
            # Find sentences with low topic relevance
            for i, similarity in enumerate(topic_similarities):
                if similarity < 0.4:  # Threshold for off-topic detection
                    off_topic_sentences.append({
                        "sentence": text_sentences[i],
                        "index": i,
                        "topic_relevance": round(similarity, 3),
                        "issue": "Bu cümle ana konudan sapıyor"
                    })
        
        # 2. Check flow consistency between consecutive sentences
        for i in range(len(embeddings) - 1):
            current_embedding = embeddings[i:i+1]
            next_embedding = embeddings[i+1:i+2]
            
            similarity = cosine_similarity(current_embedding, next_embedding)[0][0]
            
            if similarity < 0.3:  # Threshold for flow disruption
                flow_disruptions.append({
                    "sentence_index": i,
                    "next_sentence_index": i + 1,
                    "sentence": text_sentences[i],
                    "next_sentence": text_sentences[i + 1],
                    "similarity": round(similarity, 3),
                    "issue": "Bu cümleler arasında anlam akışı kopuk"
                })
        
        # 3. Check for abrupt topic shifts
        if len(embeddings) >= 3:
            for i in range(1, len(embeddings) - 1):
                prev_embedding = embeddings[i-1:i]
                current_embedding = embeddings[i:i+1]
                next_embedding = embeddings[i+1:i+2]
                
                # Calculate similarity with previous and next sentences
                prev_similarity = cosine_similarity(prev_embedding, current_embedding)[0][0]
                next_similarity = cosine_similarity(current_embedding, next_embedding)[0][0]
                
                # If current sentence is very different from both neighbors
                if prev_similarity < 0.3 and next_similarity < 0.3:
                    issues.append({
                        "type": "topic_shift",
                        "sentence_index": i,
                        "sentence": text_sentences[i],
                        "issue": "Bu cümle konudan ani bir sapma gösteriyor"
                    })
        
        # Combine all issues
        all_issues = off_topic_sentences + flow_disruptions + issues
        
        return {
            "has_issues": len(all_issues) > 0,
            "issues": all_issues,
            "off_topic_sentences": off_topic_sentences,
            "flow_disruptions": flow_disruptions,
            "total_sentences": len(text_sentences),
            "issue_count": len(all_issues)
        }

    def generate_topic_improvement_suggestions(self, topic_issues: dict, reference_topic: str = None) -> List[str]:
        """
        Generate specific improvement suggestions for topic consistency issues
        
        Args:
            topic_issues: Topic consistency analysis results
            reference_topic: Reference topic if provided
            
        Returns:
            List of specific improvement suggestions
        """
        suggestions = []
        
        if not topic_issues.get("has_issues", False):
            return suggestions
        
        # Suggestions for off-topic sentences
        off_topic_count = len(topic_issues.get("off_topic_sentences", []))
        if off_topic_count > 0:
            suggestions.append(f"🔍 {off_topic_count} cümle ana konudan sapıyor:")
            
            for i, issue in enumerate(topic_issues["off_topic_sentences"][:3], 1):  # Show first 3
                sentence = issue["sentence"][:50] + "..." if len(issue["sentence"]) > 50 else issue["sentence"]
                suggestions.append(f"   {i}. '{sentence}' - Konu ilgililik: %{issue['topic_relevance']*100:.0f}")
            
            if reference_topic:
                suggestions.append(f"💡 Bu cümleleri '{reference_topic}' konusuyla ilgili hale getirin.")
            else:
                suggestions.append("💡 Bu cümleleri ana konuyla ilgili hale getirin veya kaldırın.")
        
        # Suggestions for flow disruptions
        flow_count = len(topic_issues.get("flow_disruptions", []))
        if flow_count > 0:
            suggestions.append(f"🔄 {flow_count} yerde anlam akışı kopuk:")
            
            for i, disruption in enumerate(topic_issues["flow_disruptions"][:2], 1):  # Show first 2
                suggestions.append(f"   {i}. Cümle {disruption['sentence_index']+1} → Cümle {disruption['next_sentence_index']+1}")
                suggestions.append(f"      Benzerlik: %{disruption['similarity']*100:.0f}")
            
            suggestions.append("💡 Bu cümleler arasına geçiş cümleleri ekleyin:")
            suggestions.append("   • 'Ayrıca...', 'Bunun yanında...', 'Öte yandan...'")
            suggestions.append("   • 'Bu durumda...', 'Sonuç olarak...', 'Dolayısıyla...'")
        
        # General improvement strategies
        if topic_issues.get("issue_count", 0) > 2:
            suggestions.append("📝 Genel İyileştirme Stratejileri:")
            suggestions.append("   • Her paragrafın tek bir ana fikre odaklanmasını sağlayın")
            suggestions.append("   • Cümleler arası mantıksal sıralama yapın")
            suggestions.append("   • Konu dışı bilgileri ayıklayın")
            suggestions.append("   • Ana konuya geri dönüş cümleleri ekleyin")
        
        return suggestions 

 