#!/usr/bin/env python3
"""
Advanced Hugging Face MCP Server
A comprehensive Model Context Protocol server for Hugging Face models with proper protocol implementation.
"""

import asyncio
import json
import logging
import sys
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass, asdict
import aiohttp
import base64
from io import BytesIO
from PIL import Image
import torch
from transformers import AutoTokenizer, AutoModel, pipeline
import os
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Tool:
    name: str
    description: str
    inputSchema: Dict[str, Any]

class AdvancedHuggingFaceMCPServer:
    def __init__(self):
        self.tools = [
            Tool(
                name="text_generation",
                description="Generate text using Hugging Face language models",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "model": {
                            "type": "string",
                            "description": "Model name from Hugging Face Hub (e.g., 'gpt2', 'microsoft/DialoGPT-medium')"
                        },
                        "prompt": {
                            "type": "string",
                            "description": "Input text prompt"
                        },
                        "max_length": {
                            "type": "integer",
                            "description": "Maximum length of generated text",
                            "default": 100
                        },
                        "temperature": {
                            "type": "number",
                            "description": "Sampling temperature (0.0 to 2.0)",
                            "default": 0.7
                        },
                        "top_p": {
                            "type": "number",
                            "description": "Top-p sampling parameter",
                            "default": 0.9
                        }
                    },
                    "required": ["model", "prompt"]
                }
            ),
            Tool(
                name="sentiment_analysis",
                description="Analyze sentiment of text using pre-trained models",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "description": "Text to analyze"
                        },
                        "model": {
                            "type": "string",
                            "description": "Optional: specific model to use",
                            "default": "cardiffnlp/twitter-roberta-base-sentiment-latest"
                        }
                    },
                    "required": ["text"]
                }
            ),
            Tool(
                name="translation",
                description="Translate text between languages",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "description": "Text to translate"
                        },
                        "source_lang": {
                            "type": "string",
                            "description": "Source language code (e.g., 'en', 'de', 'fr')",
                            "default": "en"
                        },
                        "target_lang": {
                            "type": "string",
                            "description": "Target language code (e.g., 'es', 'fr', 'de')",
                            "default": "es"
                        }
                    },
                    "required": ["text"]
                }
            ),
            Tool(
                name="summarization",
                description="Summarize long text using BART or T5 models",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "description": "Text to summarize"
                        },
                        "max_length": {
                            "type": "integer",
                            "description": "Maximum length of summary",
                            "default": 150
                        },
                        "min_length": {
                            "type": "integer",
                            "description": "Minimum length of summary",
                            "default": 30
                        }
                    },
                    "required": ["text"]
                }
            ),
            Tool(
                name="question_answering",
                description="Answer questions based on provided context",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "question": {
                            "type": "string",
                            "description": "Question to answer"
                        },
                        "context": {
                            "type": "string",
                            "description": "Context for answering the question"
                        }
                    },
                    "required": ["question", "context"]
                }
            ),
            Tool(
                name="text_classification",
                description="Classify text into predefined categories",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "description": "Text to classify"
                        },
                        "model": {
                            "type": "string",
                            "description": "Model name from Hugging Face Hub"
                        }
                    },
                    "required": ["text", "model"]
                }
            ),
            Tool(
                name="image_classification",
                description="Classify images using vision models",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "image_path": {
                            "type": "string",
                            "description": "Path to image file"
                        },
                        "model": {
                            "type": "string",
                            "description": "Model name from Hugging Face Hub",
                            "default": "microsoft/resnet-50"
                        }
                    },
                    "required": ["image_path"]
                }
            ),
            Tool(
                name="zero_shot_classification",
                description="Classify text into custom categories using zero-shot learning",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "description": "Text to classify"
                        },
                        "candidate_labels": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of possible labels"
                        }
                    },
                    "required": ["text", "candidate_labels"]
                }
            ),
            Tool(
                name="model_info",
                description="Get detailed information about a Hugging Face model",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "model": {
                            "type": "string",
                            "description": "Model name from Hugging Face Hub"
                        }
                    },
                    "required": ["model"]
                }
            ),
            Tool(
                name="list_popular_models",
                description="List popular models by task type",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "task": {
                            "type": "string",
                            "description": "Task type (text-generation, sentiment-analysis, translation, etc.)",
                            "enum": ["text-generation", "sentiment-analysis", "translation", "summarization", "question-answering", "text-classification", "image-classification"]
                        }
                    },
                    "required": ["task"]
                }
            )
        ]
        
        self.cached_models = {}
        self.api_token = os.getenv("HUGGINGFACE_API_TOKEN")
        self.session = None

    async def initialize(self):
        """Initialize the server"""
        self.session = aiohttp.ClientSession()

    async def cleanup(self):
        """Cleanup resources"""
        if self.session:
            await self.session.close()

    async def handle_list_tools(self) -> Dict[str, Any]:
        """Handle list_tools request"""
        return {
            "tools": [
                {
                    "name": tool.name,
                    "description": tool.description,
                    "inputSchema": tool.inputSchema
                }
                for tool in self.tools
            ]
        }

    async def handle_call_tool(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Handle call_tool request"""
        try:
            if name == "text_generation":
                return await self._text_generation(arguments)
            elif name == "sentiment_analysis":
                return await self._sentiment_analysis(arguments)
            elif name == "translation":
                return await self._translation(arguments)
            elif name == "summarization":
                return await self._summarization(arguments)
            elif name == "question_answering":
                return await self._question_answering(arguments)
            elif name == "text_classification":
                return await self._text_classification(arguments)
            elif name == "image_classification":
                return await self._image_classification(arguments)
            elif name == "zero_shot_classification":
                return await self._zero_shot_classification(arguments)
            elif name == "model_info":
                return await self._model_info(arguments)
            elif name == "list_popular_models":
                return await self._list_popular_models(arguments)
            else:
                raise ValueError(f"Unknown tool: {name}")
        except Exception as e:
            logger.error(f"Error in tool {name}: {str(e)}")
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error: {str(e)}"
                    }
                ]
            }

    async def _text_generation(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Generate text using a language model"""
        model_name = args["model"]
        prompt = args["prompt"]
        max_length = args.get("max_length", 100)
        temperature = args.get("temperature", 0.7)
        top_p = args.get("top_p", 0.9)

        try:
            if model_name not in self.cached_models:
                generator = pipeline("text-generation", model=model_name)
                self.cached_models[model_name] = generator
            else:
                generator = self.cached_models[model_name]

            result = generator(
                prompt, 
                max_length=max_length, 
                temperature=temperature, 
                top_p=top_p,
                do_sample=True,
                pad_token_id=generator.tokenizer.eos_token_id
            )
            generated_text = result[0]["generated_text"]

            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Generated text:\n{generated_text}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error generating text: {str(e)}"
                    }
                ]
            }

    async def _sentiment_analysis(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze sentiment of text"""
        text = args["text"]
        model_name = args.get("model", "cardiffnlp/twitter-roberta-base-sentiment-latest")
        
        try:
            if model_name not in self.cached_models:
                classifier = pipeline("sentiment-analysis", model=model_name)
                self.cached_models[model_name] = classifier
            else:
                classifier = self.cached_models[model_name]

            result = classifier(text)
            
            # Format the result nicely
            formatted_result = []
            for item in result:
                formatted_result.append({
                    "label": item["label"],
                    "score": f"{item['score']:.4f}",
                    "sentiment": "Positive" if item["label"] in ["POS", "LABEL_1"] else "Negative" if item["label"] in ["NEG", "LABEL_0"] else "Neutral"
                })
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Sentiment Analysis Results:\n{json.dumps(formatted_result, indent=2)}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error analyzing sentiment: {str(e)}"
                    }
                ]
            }

    async def _translation(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Translate text between languages"""
        text = args["text"]
        source_lang = args.get("source_lang", "en")
        target_lang = args.get("target_lang", "es")

        try:
            # Try to find a suitable translation model
            model_name = f"Helsinki-NLP/opus-mt-{source_lang}-{target_lang}"
            
            if model_name not in self.cached_models:
                translator = pipeline("translation", model=model_name)
                self.cached_models[model_name] = translator
            else:
                translator = self.cached_models[model_name]

            result = translator(text)
            translated_text = result[0]["translation_text"]
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Translation ({source_lang} → {target_lang}):\n{translated_text}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error translating text: {str(e)}"
                    }
                ]
            }

    async def _summarization(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Summarize text using a summarization model"""
        text = args["text"]
        max_length = args.get("max_length", 150)
        min_length = args.get("min_length", 30)

        try:
            # Use a pre-trained summarization model
            model_name = "facebook/bart-large-cnn"
            
            if model_name not in self.cached_models:
                summarizer = pipeline("summarization", model=model_name)
                self.cached_models[model_name] = summarizer
            else:
                summarizer = self.cached_models[model_name]

            result = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
            summary = result[0]["summary_text"]
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Summary:\n{summary}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error summarizing text: {str(e)}"
                    }
                ]
            }

    async def _question_answering(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Answer questions based on context"""
        question = args["question"]
        context = args["context"]

        try:
            # Use a pre-trained question answering model
            model_name = "deepset/roberta-base-squad2"
            
            if model_name not in self.cached_models:
                qa_pipeline = pipeline("question-answering", model=model_name)
                self.cached_models[model_name] = qa_pipeline
            else:
                qa_pipeline = self.cached_models[model_name]

            result = qa_pipeline(question=question, context=context)
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Question: {question}\nAnswer: {result['answer']}\nConfidence: {result['score']:.4f}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error answering question: {str(e)}"
                    }
                ]
            }

    async def _text_classification(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Classify text using a classification model"""
        model_name = args["model"]
        text = args["text"]

        try:
            if model_name not in self.cached_models:
                classifier = pipeline("text-classification", model=model_name)
                self.cached_models[model_name] = classifier
            else:
                classifier = self.cached_models[model_name]

            result = classifier(text)
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Classification Results:\n{json.dumps(result, indent=2)}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error classifying text: {str(e)}"
                    }
                ]
            }

    async def _image_classification(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Classify images using a vision model"""
        model_name = args.get("model", "microsoft/resnet-50")
        image_path = args["image_path"]

        try:
            if model_name not in self.cached_models:
                classifier = pipeline("image-classification", model=model_name)
                self.cached_models[model_name] = classifier
            else:
                classifier = self.cached_models[model_name]

            result = classifier(image_path)
            
            # Format the result nicely
            formatted_result = []
            for item in result[:5]:  # Top 5 predictions
                formatted_result.append({
                    "label": item["label"],
                    "score": f"{item['score']:.4f}"
                })
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Image Classification Results:\n{json.dumps(formatted_result, indent=2)}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error classifying image: {str(e)}"
                    }
                ]
            }

    async def _zero_shot_classification(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Classify text using zero-shot learning"""
        text = args["text"]
        candidate_labels = args["candidate_labels"]

        try:
            model_name = "facebook/bart-large-mnli"
            
            if model_name not in self.cached_models:
                classifier = pipeline("zero-shot-classification", model=model_name)
                self.cached_models[model_name] = classifier
            else:
                classifier = self.cached_models[model_name]

            result = classifier(text, candidate_labels)
            
            # Format the result nicely
            formatted_result = []
            for i, (label, score) in enumerate(zip(result["labels"], result["scores"])):
                formatted_result.append({
                    "label": label,
                    "score": f"{score:.4f}",
                    "rank": i + 1
                })
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Zero-shot Classification Results:\n{json.dumps(formatted_result, indent=2)}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error in zero-shot classification: {str(e)}"
                    }
                ]
            }

    async def _model_info(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Get information about a Hugging Face model"""
        model_name = args["model"]

        try:
            url = f"https://huggingface.co/api/models/{model_name}"
            async with self.session.get(url) as response:
                if response.status == 200:
                    model_info = await response.json()
                    
                    # Extract key information
                    key_info = {
                        "id": model_info.get("id"),
                        "author": model_info.get("author", {}).get("name"),
                        "tags": model_info.get("tags", []),
                        "downloads": model_info.get("downloads"),
                        "likes": model_info.get("likes"),
                        "description": model_info.get("description", "No description available"),
                        "model_type": model_info.get("model_type"),
                        "pipeline_tag": model_info.get("pipeline_tag")
                    }
                    
                    return {
                        "content": [
                            {
                                "type": "text",
                                "text": f"Model Information for '{model_name}':\n{json.dumps(key_info, indent=2)}"
                            }
                        ]
                    }
                else:
                    return {
                        "content": [
                            {
                                "type": "text",
                                "text": f"Error fetching model info: HTTP {response.status}"
                            }
                        ]
                    }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error getting model info: {str(e)}"
                    }
                ]
            }

    async def _list_popular_models(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """List popular models by task type"""
        task = args["task"]
        
        # Popular models for each task
        popular_models = {
            "text-generation": [
                "gpt2", "microsoft/DialoGPT-medium", "EleutherAI/gpt-neo-125M",
                "bigscience/bloom-560m", "microsoft/DialoGPT-large"
            ],
            "sentiment-analysis": [
                "cardiffnlp/twitter-roberta-base-sentiment-latest",
                "nlptown/bert-base-multilingual-uncased-sentiment",
                "finiteautomata/bertweet-base-sentiment-analysis"
            ],
            "translation": [
                "Helsinki-NLP/opus-mt-en-es", "Helsinki-NLP/opus-mt-en-de",
                "Helsinki-NLP/opus-mt-en-fr", "Helsinki-NLP/opus-mt-en-tr"
            ],
            "summarization": [
                "facebook/bart-large-cnn", "facebook/bart-base",
                "t5-base", "google/pegasus-large"
            ],
            "question-answering": [
                "deepset/roberta-base-squad2", "distilbert-base-cased-distilled-squad",
                "microsoft/DialoGPT-medium"
            ],
            "text-classification": [
                "bert-base-uncased", "roberta-base",
                "distilbert-base-uncased"
            ],
            "image-classification": [
                "microsoft/resnet-50", "google/vit-base-patch16-224",
                "facebook/deit-base-distilled-patch16-224"
            ]
        }
        
        models = popular_models.get(task, [])
        
        return {
            "content": [
                {
                    "type": "text",
                    "text": f"Popular {task} models:\n{json.dumps(models, indent=2)}"
                }
            ]
        }

async def main():
    """Main function to run the MCP server"""
    server = AdvancedHuggingFaceMCPServer()
    await server.initialize()
    
    try:
        # Simple MCP server implementation
        while True:
            try:
                line = await asyncio.get_event_loop().run_in_executor(None, input)
                request = json.loads(line)
                
                if request["method"] == "tools/list":
                    response = await server.handle_list_tools()
                elif request["method"] == "tools/call":
                    response = await server.handle_call_tool(
                        request["params"]["name"],
                        request["params"]["arguments"]
                    )
                else:
                    response = {"error": f"Unknown method: {request['method']}"}
                
                print(json.dumps({"jsonrpc": "2.0", "id": request.get("id"), "result": response}))
                
            except EOFError:
                break
            except Exception as e:
                logger.error(f"Error processing request: {e}")
                print(json.dumps({"jsonrpc": "2.0", "id": request.get("id"), "error": {"message": str(e)}}))
    finally:
        await server.cleanup()

if __name__ == "__main__":
    asyncio.run(main()) 