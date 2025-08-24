"""
Simple API tests for NoteGuard backend
"""

import pytest
import asyncio
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_endpoint():
    """Test health endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "noteguard-api"


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test root endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data


@pytest.mark.asyncio
async def test_analyze_endpoint():
    """Test analyze endpoint with sample text"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        test_data = {
            "text": "Bu bir test metnidir. Bu metin analiz edilecektir.",
            "reference_topic": "test"
        }
        response = await ac.post("/api/v1/analyze", json=test_data)
        assert response.status_code == 200
        data = response.json()
        assert "result" in data
        assert "processing_time" in data
        assert "success" in data


if __name__ == "__main__":
    # Run tests manually
    asyncio.run(test_health_endpoint())
    print("Health endpoint test passed!")
    
    asyncio.run(test_root_endpoint())
    print("Root endpoint test passed!")
    
    asyncio.run(test_analyze_endpoint())
    print("Analyze endpoint test passed!")
    
    print("All tests passed!")
