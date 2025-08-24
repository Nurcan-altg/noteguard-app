#!/usr/bin/env python3
"""
Test email sending functionality
"""

import asyncio
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.email_service import EmailService
from app.core.config import settings


async def test_email_sending():
    """Test email sending functionality"""
    
    print("=== Email Service Test ===")
    print(f"SMTP Server: {settings.SMTP_SERVER}")
    print(f"SMTP Port: {settings.SMTP_PORT}")
    print(f"SMTP Username: {settings.SMTP_USERNAME}")
    print(f"From Email: {settings.FROM_EMAIL}")
    print(f"App URL: {settings.APP_URL}")
    print("=" * 30)
    
    # Create email service
    email_service = EmailService()
    
    # Test email
    test_email = "test@example.com"
    test_name = "Test User"
    test_token = "test-verification-token-12345"
    
    print("\n1. Testing welcome email...")
    success = email_service.send_welcome_email(test_email, test_name, test_token)
    print(f"Welcome email result: {'✅ Success' if success else '❌ Failed'}")
    
    print("\n2. Testing verification email...")
    success = email_service.send_verification_email(test_email, test_name, test_token)
    print(f"Verification email result: {'✅ Success' if success else '❌ Failed'}")
    
    print("\n3. Testing password reset email...")
    success = email_service.send_password_reset_email(test_email, test_name, test_token)
    print(f"Password reset email result: {'✅ Success' if success else '❌ Failed'}")
    
    print("\n=== Test Complete ===")
    
    if (settings.SMTP_USERNAME == "your-email@gmail.com" or 
        settings.SMTP_PASSWORD == "your-app-password"):
        print("\n⚠️  WARNING: Using default SMTP credentials!")
        print("Please configure your Gmail SMTP settings in .env file")
        print("See gmail_setup_guide.md for instructions")


if __name__ == "__main__":
    asyncio.run(test_email_sending())
