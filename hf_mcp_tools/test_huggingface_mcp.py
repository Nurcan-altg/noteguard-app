#!/usr/bin/env python3
"""
Test script for Hugging Face MCP Server
This script demonstrates how to use the MCP server tools.
"""

import asyncio
import json
from huggingface_mcp_advanced import AdvancedHuggingFaceMCPServer

async def test_sentiment_analysis():
    """Test sentiment analysis functionality"""
    print("=== Testing Sentiment Analysis ===")
    server = AdvancedHuggingFaceMCPServer()
    await server.initialize()
    
    try:
        # Test positive sentiment
        result = await server._sentiment_analysis({
            "text": "Bu film gerçekten harikaydı! Çok beğendim."
        })
        print("Positive text result:")
        print(result["content"][0]["text"])
        print()
        
        # Test negative sentiment
        result = await server._sentiment_analysis({
            "text": "Bu film çok kötüydü. Hiç beğenmedim."
        })
        print("Negative text result:")
        print(result["content"][0]["text"])
        print()
        
    finally:
        await server.cleanup()

async def test_text_generation():
    """Test text generation functionality"""
    print("=== Testing Text Generation ===")
    server = AdvancedHuggingFaceMCPServer()
    await server.initialize()
    
    try:
        result = await server._text_generation({
            "model": "gpt2",
            "prompt": "Merhaba, bugün hava nasıl?",
            "max_length": 50,
            "temperature": 0.8
        })
        print("Text generation result:")
        print(result["content"][0]["text"])
        print()
        
    finally:
        await server.cleanup()

async def test_translation():
    """Test translation functionality"""
    print("=== Testing Translation ===")
    server = AdvancedHuggingFaceMCPServer()
    await server.initialize()
    
    try:
        result = await server._translation({
            "text": "Hello, how are you today?",
            "source_lang": "en",
            "target_lang": "es"
        })
        print("Translation result:")
        print(result["content"][0]["text"])
        print()
        
    finally:
        await server.cleanup()

async def test_summarization():
    """Test summarization functionality"""
    print("=== Testing Summarization ===")
    server = AdvancedHuggingFaceMCPServer()
    await server.initialize()
    
    try:
        long_text = """
        Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Colloquially, the term "artificial intelligence" is often used to describe machines (or computers) that mimic "cognitive" functions that humans associate with the human mind, such as "learning" and "problem solving".
        
        As machines become increasingly capable, tasks considered to require "intelligence" are often removed from the definition of AI, a phenomenon known as the AI effect. A quip in Tesler's Theorem says "AI is whatever hasn't been done yet." For instance, optical character recognition is frequently excluded from things considered to be AI, having become a routine technology. Modern machine learning capabilities, however, are generally classified as AI.
        """
        
        result = await server._summarization({
            "text": long_text,
            "max_length": 100,
            "min_length": 30
        })
        print("Summarization result:")
        print(result["content"][0]["text"])
        print()
        
    finally:
        await server.cleanup()

async def test_question_answering():
    """Test question answering functionality"""
    print("=== Testing Question Answering ===")
    server = AdvancedHuggingFaceMCPServer()
    await server.initialize()
    
    try:
        context = "Artificial intelligence (AI) is intelligence demonstrated by machines. It includes machine learning, natural language processing, and computer vision."
        question = "What is artificial intelligence?"
        
        result = await server._question_answering({
            "question": question,
            "context": context
        })
        print("Question answering result:")
        print(result["content"][0]["text"])
        print()
        
    finally:
        await server.cleanup()

async def test_zero_shot_classification():
    """Test zero-shot classification functionality"""
    print("=== Testing Zero-shot Classification ===")
    server = AdvancedHuggingFaceMCPServer()
    await server.initialize()
    
    try:
        result = await server._zero_shot_classification({
            "text": "Bu film gerçekten harikaydı! Çok beğendim.",
            "candidate_labels": ["olumlu", "olumsuz", "nötr"]
        })
        print("Zero-shot classification result:")
        print(result["content"][0]["text"])
        print()
        
    finally:
        await server.cleanup()

async def test_model_info():
    """Test model information functionality"""
    print("=== Testing Model Information ===")
    server = AdvancedHuggingFaceMCPServer()
    await server.initialize()
    
    try:
        result = await server._model_info({
            "model": "gpt2"
        })
        print("Model info result:")
        print(result["content"][0]["text"])
        print()
        
    finally:
        await server.cleanup()

async def test_popular_models():
    """Test popular models list functionality"""
    print("=== Testing Popular Models List ===")
    server = AdvancedHuggingFaceMCPServer()
    await server.initialize()
    
    try:
        result = await server._list_popular_models({
            "task": "text-generation"
        })
        print("Popular models result:")
        print(result["content"][0]["text"])
        print()
        
    finally:
        await server.cleanup()

async def main():
    """Run all tests"""
    print("Starting Hugging Face MCP Server Tests\n")
    
    # Run tests
    await test_sentiment_analysis()
    await test_text_generation()
    await test_translation()
    await test_summarization()
    await test_question_answering()
    await test_zero_shot_classification()
    await test_model_info()
    await test_popular_models()
    
    print("All tests completed!")

if __name__ == "__main__":
    asyncio.run(main()) 