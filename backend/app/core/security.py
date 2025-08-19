"""
Security utilities for input validation and sanitization.
"""

import re
from typing import Optional


class SecurityUtils:
    """Security utilities for the Bass Tab Site API."""
    
    @staticmethod
    def sanitize_slug(slug: str) -> str:
        """
        Sanitize URL slug to prevent path traversal and injection attacks.
        
        Args:
            slug: Raw slug from URL path
            
        Returns:
            Sanitized slug
            
        Raises:
            ValueError: If slug contains invalid characters
        """
        # Remove any whitespace
        slug = slug.strip()
        
        if not slug:
            raise ValueError("Slug cannot be empty")
        
        # Only allow lowercase letters, numbers, and hyphens
        if not re.match(r'^[a-z0-9-]+$', slug):
            raise ValueError("Slug can only contain lowercase letters, numbers, and hyphens")
        
        # Prevent path traversal
        if '..' in slug or '/' in slug or '\\' in slug:
            raise ValueError("Slug contains invalid path characters")
        
        # Reasonable length limit
        if len(slug) > 100:
            raise ValueError("Slug too long (max 100 characters)")
        
        return slug
    
    @staticmethod
    def validate_youtube_id(youtube_id: str) -> bool:
        """
        Validate YouTube video ID format.
        
        Args:
            youtube_id: YouTube video ID to validate
            
        Returns:
            True if valid, False otherwise
        """
        if not youtube_id or len(youtube_id) != 11:
            return False
        
        # YouTube IDs are alphanumeric with underscores and hyphens
        return re.match(r'^[a-zA-Z0-9_-]{11}$', youtube_id) is not None
    
    @staticmethod
    def sanitize_tab_text(tab_text: str) -> str:
        """
        Sanitize ASCII tab text to prevent XSS and other attacks.
        
        Args:
            tab_text: Raw tab text input
            
        Returns:
            Sanitized tab text
            
        Raises:
            ValueError: If tab text contains dangerous content
        """
        if not tab_text:
            raise ValueError("Tab text cannot be empty")
        
        # Remove any HTML tags
        tab_text = re.sub(r'<[^>]*>', '', tab_text)
        
        # Remove script-like content
        if re.search(r'(javascript:|data:|vbscript:)', tab_text, re.IGNORECASE):
            raise ValueError("Tab text contains potentially dangerous content")
        
        # Validate tab format characters
        # Allow: letters (for string names), numbers (for frets), 
        # special chars (|, -, h, p, s, ~), whitespace, and newlines
        valid_chars = re.compile(r'^[A-Za-z0-9|\-hps~\s\n\/\\x]+$')
        if not valid_chars.match(tab_text):
            raise ValueError("Tab text contains invalid characters")
        
        return tab_text.strip()
    
    @staticmethod
    def validate_timestamp(timestamp: float) -> bool:
        """
        Validate timestamp is reasonable.
        
        Args:
            timestamp: Timestamp in seconds
            
        Returns:
            True if valid, False otherwise
        """
        # Must be non-negative and less than 1 hour (3600 seconds)
        return 0 <= timestamp <= 3600
    
    @staticmethod
    def get_safe_error_message(error: Exception, debug: bool = False) -> str:
        """
        Get sanitized error message safe for API responses.
        
        Args:
            error: Exception that occurred
            debug: Whether to include debug details
            
        Returns:
            Safe error message string
        """
        if debug:
            return str(error)
        
        # Generic error messages for production
        error_type = type(error).__name__
        
        safe_messages = {
            'ValueError': 'Invalid input data provided',
            'ValidationError': 'Data validation failed', 
            'KeyError': 'Required data missing',
            'TypeError': 'Invalid data type provided',
        }
        
        return safe_messages.get(error_type, 'An error occurred processing your request')