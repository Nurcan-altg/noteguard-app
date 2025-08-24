#!/usr/bin/env python3
"""
Test email verification link generation
"""

import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.services.email_service import EmailService

def test_verification_link():
    """Test verification link generation"""
    
    print("=== Email Verification Link Test ===")
    print(f"APP_URL: {settings.APP_URL}")
    print(f"FROM_EMAIL: {settings.FROM_EMAIL}")
    print("=" * 40)
    
    # Create email service
    email_service = EmailService()
    
    # Test verification link
    test_token = "test-verification-token-123"
    verification_url = f"{settings.APP_URL}/verify-email?token={test_token}"
    
    print(f"Generated verification URL: {verification_url}")
    print()
    print("To test manually:")
    print(f"1. Open your browser")
    print(f"2. Go to: {verification_url}")
    print(f"3. Check if the verification page loads")
    print()
    print("Expected behavior:")
    print("- Should show EmailVerificationPage")
    print("- Should display verification form")
    print("- Should handle the token parameter")

if __name__ == "__main__":
    test_verification_link()
