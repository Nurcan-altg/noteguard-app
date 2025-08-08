#!/usr/bin/env python3
"""
Hugging Face MCP Server
A Model Context Protocol server for interacting with Hugging Face models and APIs.
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass
import aiohttp
import base64
from io import BytesIO
from PIL import Image
import torch
from transformers import AutoTokenizer, AutoModel, pipeline
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Tool:
    name: str
    description: str
    inputSchema: Dict[str, Any]

class HuggingFaceMCPServer:
    def __init__(self):
        self.tools = [
            Tool(
                name="text_generation",
                description="Generate text using Hugging Face models",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "model": {
                            "type": "string",
                            "description": "Model name from Hugging Face Hub"
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
                            "description": "Sampling temperature",
                            "default": 0.7
                        }
                    },
                    "required": ["model", "prompt"]
                }
            ),
            Tool(
                name="text_classification",
                description="Classify text using Hugging Face models",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "model": {
                            "type": "string",
                            "description": "Model name from Hugging Face Hub"
                        },
                        "text": {
                            "type": "string",
                            "description": "Text to classify"
                        }
                    },
                    "required": ["model", "text"]
                }
            ),
            Tool(
                name="sentiment_analysis",
                description="Analyze sentiment of text",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string",
                            "description": "Text to analyze"
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
                            "description": "Source language code",
                            "default": "en"
                        },
                        "target_lang": {
                            "type": "string",
                            "description": "Target language code",
                            "default": "es"
                        }
                    },
                    "required": ["text"]
                }
            ),
            Tool(
                name="image_classification",
                description="Classify images using Hugging Face models",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "model": {
                            "type": "string",
                            "description": "Model name from Hugging Face Hub"
                        },
                        "image_path": {
                            "type": "string",
                            "description": "Path to image file"
                        }
                    },
                    "required": ["model", "image_path"]
                }
            ),
            Tool(
                name="summarization",
                description="Summarize text using Hugging Face models",
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
                        }
                    },
                    "required": ["text"]
                }
            ),
            Tool(
                name="question_answering",
                description="Answer questions based on context",
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
                name="model_info",
                description="Get information about a Hugging Face model",
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
            )
        ]
        
        self.cached_models = {}
        self.api_token = os.getenv("HUGGINGFACE_API_TOKEN")

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
            elif name == "text_classification":
                return await self._text_classification(arguments)
            elif name == "sentiment_analysis":
                return await self._sentiment_analysis(arguments)
            elif name == "translation":
                return await self._translation(arguments)
            elif name == "image_classification":
                return await self._image_classification(arguments)
            elif name == "summarization":
                return await self._summarization(arguments)
            elif name == "question_answering":
                return await self._question_answering(arguments)
            elif name == "model_info":
                return await self._model_info(arguments)
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

        try:
            # Use pipeline for text generation
            if model_name not in self.cached_models:
                generator = pipeline("text-generation", model=model_name)
                self.cached_models[model_name] = generator
            else:
                generator = self.cached_models[model_name]

            result = generator(prompt, max_length=max_length, temperature=temperature, do_sample=True)
            generated_text = result[0]["generated_text"]

            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Generated text: {generated_text}"
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
                        "text": f"Classification result: {json.dumps(result, indent=2)}"
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

    async def _sentiment_analysis(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze sentiment of text"""
        text = args["text"]
        
        try:
            # Use a pre-trained sentiment analysis model
            model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
            
            if model_name not in self.cached_models:
                classifier = pipeline("sentiment-analysis", model=model_name)
                self.cached_models[model_name] = classifier
            else:
                classifier = self.cached_models[model_name]

            result = classifier(text)
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Sentiment analysis: {json.dumps(result, indent=2)}"
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
            # Use a translation model
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
                        "text": f"Translation ({source_lang} → {target_lang}): {translated_text}"
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

    async def _image_classification(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Classify images using a vision model"""
        model_name = args["model"]
        image_path = args["image_path"]

        try:
            if model_name not in self.cached_models:
                classifier = pipeline("image-classification", model=model_name)
                self.cached_models[model_name] = classifier
            else:
                classifier = self.cached_models[model_name]

            result = classifier(image_path)
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Image classification result: {json.dumps(result, indent=2)}"
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

    async def _summarization(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Summarize text using a summarization model"""
        text = args["text"]
        max_length = args.get("max_length", 150)

        try:
            # Use a pre-trained summarization model
            model_name = "facebook/bart-large-cnn"
            
            if model_name not in self.cached_models:
                summarizer = pipeline("summarization", model=model_name)
                self.cached_models[model_name] = summarizer
            else:
                summarizer = self.cached_models[model_name]

            result = summarizer(text, max_length=max_length, min_length=30, do_sample=False)
            summary = result[0]["summary_text"]
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Summary: {summary}"
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
                        "text": f"Answer: {result['answer']}\nConfidence: {result['score']:.4f}"
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

    async def _model_info(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Get information about a Hugging Face model"""
        model_name = args["model"]

        try:
            async with aiohttp.ClientSession() as session:
                url = f"https://huggingface.co/api/models/{model_name}"
                async with session.get(url) as response:
                    if response.status == 200:
                        model_info = await response.json()
                        return {
                            "content": [
                                {
                                    "type": "text",
                                    "text": f"Model Information:\n{json.dumps(model_info, indent=2)}"
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

async def main():
    """Main function to run the MCP server"""
    server = HuggingFaceMCPServer()
    
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

if __name__ == "__main__":
    asyncio.run(main()) 