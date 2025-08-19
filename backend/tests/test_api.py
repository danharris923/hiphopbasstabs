"""
Test FastAPI endpoints and integration.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data


def test_root_endpoint():
    """Test root endpoint returns API information."""
    response = client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert data["name"] == "Bass Tab Site API"
    assert "endpoints" in data
    assert "features" in data


def test_list_pairs():
    """Test listing all available pairs."""
    response = client.get("/api/pairs/")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3  # Should have our sample data
    
    # Check for expected slugs
    expected_slugs = [
        "notorious-big-juicy",
        "dr-dre-nuthin-but-g-thang", 
        "public-enemy-fight-the-power"
    ]
    for slug in expected_slugs:
        assert slug in data


def test_get_valid_pair():
    """Test retrieving a valid track pair."""
    response = client.get("/api/pairs/notorious-big-juicy")
    assert response.status_code == 200
    
    data = response.json()
    
    # Validate response structure
    assert "track" in data
    assert "original" in data
    assert "sample_map" in data
    assert "tab" in data
    
    # Validate track data
    track = data["track"]
    assert track["title"] == "Juicy"
    assert track["artist"] == "The Notorious B.I.G."
    assert track["year"] == 1994
    assert track["youtube_id"] == "_JZom_gVfuw"
    
    # Validate original data  
    original = data["original"]
    assert original["title"] == "Juicy Fruit"
    assert original["artist"] == "Mtume"
    assert original["year"] == 1983
    
    # Validate sample map
    sample_map = data["sample_map"]
    assert sample_map["sample_type"] == "direct"
    assert sample_map["is_bass_sample"] is True
    
    # Validate tab structure
    tab = data["tab"]
    assert tab["tuning"] == "EADG"
    assert tab["difficulty"] == 2
    assert "tab_text" in tab
    assert "bars" in tab
    assert len(tab["bars"]) >= 1


def test_get_nonexistent_pair():
    """Test retrieving a non-existent track pair returns 404."""
    response = client.get("/api/pairs/nonexistent-track")
    assert response.status_code == 404


def test_invalid_slug_format():
    """Test that invalid slug formats are rejected."""
    # Test with invalid characters
    response = client.get("/api/pairs/invalid..slug")
    assert response.status_code == 422
    
    # Test with path traversal attempt
    response = client.get("/api/pairs/../../../etc/passwd")
    assert response.status_code == 422


def test_cors_headers():
    """Test that CORS headers are properly set."""
    response = client.options("/api/pairs/")
    
    # Should allow requests from localhost:3000
    assert response.status_code in [200, 204]


def test_api_error_responses():
    """Test that API errors return proper JSON format."""
    response = client.get("/api/pairs/nonexistent")
    assert response.status_code == 404
    
    # Should return JSON even for errors
    assert response.headers["content-type"] == "application/json"