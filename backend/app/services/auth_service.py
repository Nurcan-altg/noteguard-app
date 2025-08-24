"""
Authentication service for user management
"""

import uuid
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

from app.db.models import User
from app.core.config import settings
from app.services.email_service import EmailService

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
email_service = EmailService()


class AuthService:
    """Authentication service for user management"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Generate password hash"""
        return pwd_context.hash(password)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError:
            return None
    
    @staticmethod
    async def create_user(db: AsyncSession, user_data: Dict[str, Any]) -> Optional[User]:
        """Create new user with email verification"""
        try:
            # Generate verification token
            verification_token = secrets.token_urlsafe(32)
            verification_expires = datetime.utcnow() + timedelta(hours=24)
            
            # Create user
            user = User(
                email=user_data["email"],
                password_hash=AuthService.get_password_hash(user_data["password"]),
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                email_verification_token=verification_token,
                email_verification_expires=verification_expires
            )
            
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
            # Send welcome email (with error handling)
            try:
                email_service.send_welcome_email(
                    user.email, 
                    user.first_name, 
                    verification_token
                )
            except Exception as e:
                print(f"Email sending failed, but user created: {e}")
                # Don't fail the registration if email fails
            
            return user
            
        except IntegrityError:
            await db.rollback()
            return None
    
    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        if not AuthService.verify_password(password, user.password_hash):
            return None
        if not user.is_active:
            return None
        
        # Update last login
        user.last_login = datetime.utcnow()
        await db.commit()
        
        return user
    
    @staticmethod
    async def verify_email(db: AsyncSession, token: str) -> bool:
        """Verify user email with token"""
        result = await db.execute(
            select(User).filter(
                User.email_verification_token == token,
                User.email_verification_expires > datetime.utcnow()
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return False
        
        user.email_verified = True
        user.email_verification_token = None
        user.email_verification_expires = None
        await db.commit()
        
        return True
    
    @staticmethod
    async def resend_verification_email(db: AsyncSession, email: str) -> bool:
        """Resend email verification"""
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user or user.email_verified:
            return False
        
        # Generate new token
        verification_token = secrets.token_urlsafe(32)
        verification_expires = datetime.utcnow() + timedelta(hours=24)
        
        user.email_verification_token = verification_token
        user.email_verification_expires = verification_expires
        await db.commit()
        
        # Send verification email (with error handling)
        try:
            email_service.send_verification_email(
                user.email, 
                user.first_name, 
                verification_token
            )
        except Exception as e:
            print(f"Verification email sending failed: {e}")
            # Don't fail the operation if email fails
        
        return True
    
    @staticmethod
    async def request_password_reset(db: AsyncSession, email: str) -> bool:
        """Request password reset"""
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            return False
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        reset_expires = datetime.utcnow() + timedelta(hours=1)
        
        user.password_reset_token = reset_token
        user.password_reset_expires = reset_expires
        await db.commit()
        
        # Send reset email (with error handling)
        try:
            email_service.send_password_reset_email(
                user.email, 
                user.first_name, 
                reset_token
            )
        except Exception as e:
            print(f"Password reset email sending failed: {e}")
            # Don't fail the operation if email fails
        
        return True
    
    @staticmethod
    async def reset_password(db: AsyncSession, token: str, new_password: str) -> bool:
        """Reset password with token"""
        result = await db.execute(
            select(User).filter(
                User.password_reset_token == token,
                User.password_reset_expires > datetime.utcnow()
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return False
        
        user.password_hash = AuthService.get_password_hash(new_password)
        user.password_reset_token = None
        user.password_reset_expires = None
        await db.commit()
        
        return True
