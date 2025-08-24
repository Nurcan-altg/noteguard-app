#!/usr/bin/env python3
"""
Test user registration
"""

import asyncio
import json
from app.db.session import async_session_factory
from app.services.auth_service import AuthService

async def test_registration():
    """Test user registration process"""
    try:
        print("Testing user registration...")
        
        # Test user data
        user_data = {
            "email": "test@example.com",
            "password": "testpassword123",
            "first_name": "Test",
            "last_name": "User"
        }
        
        # Get database session
        async with async_session_factory() as db:
            try:
                # Try to create user
                user = await AuthService.create_user(db, user_data)
                
                if user:
                    print(f"✅ User created successfully!")
                    print(f"   User ID: {user.id}")
                    print(f"   Email: {user.email}")
                    print(f"   Name: {user.first_name} {user.last_name}")
                    print(f"   Email Verified: {user.email_verified}")
                    return True
                else:
                    print("❌ User creation failed - email might already exist")
                    return False
            except Exception as e:
                print(f"❌ Error during user creation: {e}")
                return False
                
    except Exception as e:
        print(f"❌ Registration test failed: {e}")
        return False

async def test_login():
    """Test user login process"""
    try:
        print("\nTesting user login...")
        
        # Test credentials (same as registration)
        email = "test@example.com"
        password = "testpassword123"
        
        # Get database session
        async with async_session_factory() as db:
            try:
                # Try to authenticate user
                user = await AuthService.authenticate_user(db, email, password)
                
                if user:
                    print(f"✅ Login successful!")
                    print(f"   User ID: {user.id}")
                    print(f"   Email: {user.email}")
                    print(f"   Last Login: {user.last_login}")
                    return True
                else:
                    print("❌ Login failed - invalid credentials")
                    return False
            except Exception as e:
                print(f"❌ Error during login: {e}")
                return False
                
    except Exception as e:
        print(f"❌ Login test failed: {e}")
        return False

async def test_password_hashing():
    """Test password hashing functionality"""
    try:
        print("\nTesting password hashing...")
        
        password = "testpassword123"
        
        # Test password hashing
        hashed = AuthService.get_password_hash(password)
        print(f"✅ Password hashed successfully: {hashed[:20]}...")
        
        # Test password verification
        is_valid = AuthService.verify_password(password, hashed)
        if is_valid:
            print("✅ Password verification successful!")
            return True
        else:
            print("❌ Password verification failed!")
            return False
            
    except Exception as e:
        print(f"❌ Password hashing test failed: {e}")
        return False

async def cleanup_database():
    """Clean up test data"""
    try:
        print("\nCleaning up test data...")
        
        async with async_session_factory() as db:
            from app.db.models import User
            from sqlalchemy import delete
            
            # Delete test user
            await db.execute(delete(User).where(User.email == "test@example.com"))
            await db.commit()
            print("✅ Test data cleaned up")
            
    except Exception as e:
        print(f"❌ Cleanup failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing NoteGuard Authentication System")
    print("=" * 50)
    
    # Clean up first
    asyncio.run(cleanup_database())
    
    # Test password hashing first
    hash_success = asyncio.run(test_password_hashing())
    
    # Test registration
    reg_success = asyncio.run(test_registration())
    
    # Test login
    login_success = asyncio.run(test_login())
    
    print("\n" + "=" * 50)
    if hash_success and reg_success and login_success:
        print("🎉 All authentication tests passed!")
    else:
        print("💥 Some authentication tests failed!")
