"""
File utility functions for handling different file formats
"""

from io import BytesIO
from docx import Document
from typing import Union


def extract_text_from_docx(file_content: bytes) -> str:
    """
    Extract text from .docx file content
    
    Args:
        file_content: Raw bytes of the .docx file
        
    Returns:
        Extracted text as string
    """
    try:
        # Create BytesIO object from file content
        docx_file = BytesIO(file_content)
        
        # Load the document
        doc = Document(docx_file)
        
        # Extract text from all paragraphs
        text_parts = []
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text_parts.append(paragraph.text.strip())
        
        # Join all text parts
        extracted_text = '\n'.join(text_parts)
        
        return extracted_text
        
    except Exception as e:
        raise ValueError(f"Error extracting text from .docx file: {str(e)}")


def validate_file_size(file_content: bytes, max_size: int) -> bool:
    """
    Validate file size
    
    Args:
        file_content: File content in bytes
        max_size: Maximum allowed size in bytes
        
    Returns:
        True if file size is within limits
    """
    return len(file_content) <= max_size


def validate_file_type(filename: str, allowed_extensions: list) -> bool:
    """
    Validate file type based on extension
    
    Args:
        filename: Name of the file
        allowed_extensions: List of allowed file extensions
        
    Returns:
        True if file type is allowed
    """
    return any(filename.lower().endswith(ext.lower()) for ext in allowed_extensions)


def get_file_extension(filename: str) -> str:
    """
    Get file extension from filename
    
    Args:
        filename: Name of the file
        
    Returns:
        File extension (including dot)
    """
    if '.' not in filename:
        return ''
    
    return '.' + filename.split('.')[-1].lower()


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename for safe storage
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    import re
    
    # Remove or replace unsafe characters
    sanitized = re.sub(r'[^\w\s-]', '_', filename)
    
    # Remove extra spaces and dashes
    sanitized = re.sub(r'[-\s]+', '-', sanitized)
    
    # Limit length
    if len(sanitized) > 100:
        name, ext = sanitized.rsplit('.', 1) if '.' in sanitized else (sanitized, '')
        sanitized = name[:95] + ('.' + ext if ext else '')
    
    return sanitized.strip('-') 