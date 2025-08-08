"""
Semantic coherence analysis service using sentence-transformers
"""

import asyncio
import re
from typing import List, Tuple
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
        self.model = SentenceTransformer(model_name)
    
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
        
        # Get sentence embeddings
        embeddings = await self._get_sentence_embeddings(sentences)
        
        # Calculate pairwise similarities
        similarities = self._calculate_pairwise_similarities(embeddings)
        
        # Calculate overall coherence score
        coherence_score = self._calculate_coherence_score(similarities)
        
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