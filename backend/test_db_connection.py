#!/usr/bin/env python3
"""
Test database connection
"""

import asyncio
from app.db.session import engine
from app.db.models import Base

async def test_db_connection():
    """Test database connection and table creation"""
    try:
        print("Testing database connection...")
        
        # Test connection
        async with engine.begin() as conn:
            print("✅ Database connection successful!")
            
            # Test table creation
            await conn.run_sync(Base.metadata.create_all)
            print("✅ Tables created successfully!")
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
    
    finally:
        await engine.dispose()
    
    return True

if __name__ == "__main__":
    success = asyncio.run(test_db_connection())
    if success:
        print("🎉 Database setup completed successfully!")
    else:
        print("💥 Database setup failed!")
