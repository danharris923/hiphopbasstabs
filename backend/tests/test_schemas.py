"""
Test Pydantic schema validation and business logic.
"""

import pytest
from pydantic import ValidationError

from app.schemas import PagePayload, Track, Original, SampleMap, Tab, BarMarker


def test_valid_page_payload():
    """Test complete valid payload creation."""
    payload_data = {
        "track": {
            "title": "Juicy",
            "artist": "The Notorious B.I.G.",
            "year": 1994,
            "youtube_id": "_JZom_gVfuw",
            "spotify_id": "5ByAIlEEnxYdvpnezg7HTX"
        },
        "original": {
            "title": "Juicy Fruit",
            "artist": "Mtume",
            "year": 1983,
            "youtube_id": "vG0ZvhD6YKI",
            "spotify_id": "4xdBrk0nCOAhFDEQ21T0W1"
        },
        "sample_map": {
            "sample_type": "direct",
            "track_start_sec": 12.0,
            "original_start_sec": 0.0
        },
        "tab": {
            "tuning": "EADG",
            "difficulty": 2,
            "tab_text": "G|--------|\nD|--------|\nA|5-3-1---|\nE|--------|",
            "bars": [{"bar": 1, "start_sec": 0.0}]
        }
    }
    
    payload = PagePayload.model_validate(payload_data)
    assert payload.track.title == "Juicy"
    assert payload.original.artist == "Mtume"
    assert payload.sample_map.sample_type == "direct"
    assert len(payload.tab.bars) == 1


def test_invalid_youtube_id_format():
    """Test YouTube ID validation catches invalid formats."""
    with pytest.raises(ValidationError, match="YouTube ID must be exactly 11 characters"):
        Track(
            title="Test", 
            artist="Test", 
            year=2020,
            youtube_id="invalid_id"  # Wrong length
        )


def test_negative_timestamp_validation():
    """Test negative timestamps are rejected."""
    with pytest.raises(ValidationError):
        SampleMap(
            track_start_sec=-5.0,  # Invalid negative time
            original_start_sec=0.0
        )


def test_tab_validation():
    """Test tab text format validation."""
    # Valid tab
    valid_tab = Tab(
        difficulty=2,
        tab_text="G|--------|\nD|--------|\nA|5-3-1---|\nE|--------|",
        bars=[BarMarker(bar=1, start_sec=0.0)]
    )
    assert valid_tab.tuning == "EADG"  # Default value
    
    # Invalid empty tab
    with pytest.raises(ValidationError):
        Tab(
            difficulty=2,
            tab_text="",
            bars=[BarMarker(bar=1, start_sec=0.0)]
        )


def test_bar_marker_chronological_order():
    """Test bars are validated for chronological order."""
    # Valid chronological bars
    valid_bars = [
        BarMarker(bar=1, start_sec=0.0),
        BarMarker(bar=2, start_sec=4.1),
        BarMarker(bar=3, start_sec=8.2)
    ]
    
    tab = Tab(
        difficulty=2,
        tab_text="G|--------|",
        bars=valid_bars
    )
    
    # Should be sorted by bar number
    assert tab.bars[0].bar == 1
    assert tab.bars[1].bar == 2
    assert tab.bars[2].bar == 3


def test_spotify_id_validation():
    """Test Spotify ID length validation."""
    # Valid 22-character ID
    track = Track(
        title="Test",
        artist="Test Artist", 
        year=2020,
        youtube_id="_JZom_gVfuw",
        spotify_id="5ByAIlEEnxYdvpnezg7HTX"
    )
    assert track.spotify_id == "5ByAIlEEnxYdvpnezg7HTX"
    
    # Invalid length
    with pytest.raises(ValidationError):
        Track(
            title="Test",
            artist="Test Artist",
            year=2020, 
            youtube_id="_JZom_gVfuw",
            spotify_id="short_id"  # Too short
        )


def test_sample_types():
    """Test sample type enum validation."""
    # Valid sample types
    for sample_type in ["direct", "interpolation", "replay"]:
        sample_map = SampleMap(
            sample_type=sample_type,
            track_start_sec=10.0,
            original_start_sec=5.0
        )
        assert sample_map.sample_type == sample_type
    
    # Invalid sample type
    with pytest.raises(ValidationError):
        SampleMap(
            sample_type="invalid_type",
            track_start_sec=10.0,
            original_start_sec=5.0
        )


def test_difficulty_range():
    """Test tab difficulty range validation."""
    # Valid difficulties
    for difficulty in [1, 2, 3, 4, 5]:
        tab = Tab(
            difficulty=difficulty,
            tab_text="G|--------|",
            bars=[BarMarker(bar=1, start_sec=0.0)]
        )
        assert tab.difficulty == difficulty
    
    # Invalid difficulties
    for invalid_difficulty in [0, 6, -1]:
        with pytest.raises(ValidationError):
            Tab(
                difficulty=invalid_difficulty,
                tab_text="G|--------|", 
                bars=[BarMarker(bar=1, start_sec=0.0)]
            )