#!/usr/bin/env python3
"""
Simple test for user creation
"""

import asyncio
from app.db.session import async_session_factory
from app.db.models import User
from app.services.auth_service import AuthService

async def simple_test():
    """Simple test for user creation"""
    try:
        print("Creating test user...")
        
        async with async_session_factory() as db:
            # Create user directly
            user = User(
                email="test@example.com",
                password_hash=AuthService.get_password_hash("test123"),
                first_name="Test",
                last_name="User"
            )
            
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
            print(f"✅ User created: {user.email}")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(simple_test())
    if success:
        print("🎉 Test passed!")
    else:
        print("💥 Test failed!")
