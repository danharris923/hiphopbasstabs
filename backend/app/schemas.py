"""
Core Pydantic models for the Bass Tab Site.

This module serves as the SINGLE SOURCE OF TRUTH for all data models
across the application stack. These models will be used to:
1. Validate API requests/responses in FastAPI
2. Generate JSON Schema for TypeScript type generation
3. Ensure type safety across Python backend and TypeScript frontend

Following patterns from use-cases/pydantic-ai/examples/structured_output_agent/agent.py
"""

from typing import Literal, List, Optional, Annotated
from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime


class Track(BaseModel):
    """Hip-hop track that samples another song."""
    
    model_config = ConfigDict(
        str_strip_whitespace=True,
        validate_assignment=True,
        json_schema_extra={
            "examples": [{
                "title": "Juicy",
                "artist": "The Notorious B.I.G.",
                "year": 1994,
                "youtube_id": "_JZom_gVfuw",
                "spotify_id": "5ByAIlEEnxYdvpnezg7HTX"
            }]
        }
    )
    
    title: Annotated[str, Field(min_length=1, max_length=200, description="Track title")]
    artist: Annotated[str, Field(min_length=1, max_length=100, description="Artist name")]
    year: Annotated[int, Field(ge=1900, le=2030, description="Release year")]
    youtube_id: Annotated[str, Field(
        min_length=11, 
        max_length=11, 
        description="YouTube video ID (11 characters)"
    )]
    spotify_id: Optional[str] = Field(
        None, 
        min_length=22, 
        max_length=22, 
        description="Spotify track ID (22 characters)"
    )

    @field_validator('youtube_id')
    @classmethod
    def validate_youtube_id(cls, v: str) -> str:
        """Validate YouTube ID format."""
        if not v or len(v) != 11:
            raise ValueError('YouTube ID must be exactly 11 characters')
        # Basic alphanumeric + underscore + hyphen validation
        if not all(c.isalnum() or c in '_-' for c in v):
            raise ValueError('YouTube ID contains invalid characters')
        return v

    @field_validator('spotify_id')
    @classmethod
    def validate_spotify_id(cls, v: Optional[str]) -> Optional[str]:
        """Validate Spotify ID format."""
        if v is None:
            return v
        if len(v) != 22:
            raise ValueError('Spotify ID must be exactly 22 characters')
        if not v.isalnum():
            raise ValueError('Spotify ID must be alphanumeric')
        return v


class Original(BaseModel):
    """Original song that was sampled."""
    
    model_config = ConfigDict(
        str_strip_whitespace=True,
        validate_assignment=True,
        json_schema_extra={
            "examples": [{
                "title": "Juicy Fruit",
                "artist": "Mtume",
                "year": 1983,
                "youtube_id": "vG0ZvhD6YKI",
                "spotify_id": "4xdBrk0nCOAhFDEQ21T0W"
            }]
        }
    )
    
    title: Annotated[str, Field(min_length=1, max_length=200, description="Original track title")]
    artist: Annotated[str, Field(min_length=1, max_length=100, description="Original artist name")]  
    year: Annotated[int, Field(ge=1900, le=2030, description="Original release year")]
    youtube_id: Annotated[str, Field(
        min_length=11,
        max_length=11,
        description="YouTube video ID for original track"
    )]
    spotify_id: Optional[str] = Field(
        None,
        min_length=22,
        max_length=22,
        description="Spotify track ID for original"
    )

    @field_validator('youtube_id')
    @classmethod
    def validate_youtube_id(cls, v: str) -> str:
        """Validate YouTube ID format."""
        if not v or len(v) != 11:
            raise ValueError('YouTube ID must be exactly 11 characters')
        if not all(c.isalnum() or c in '_-' for c in v):
            raise ValueError('YouTube ID contains invalid characters')
        return v

    @field_validator('spotify_id')
    @classmethod
    def validate_spotify_id(cls, v: Optional[str]) -> Optional[str]:
        """Validate Spotify ID format."""
        if v is None:
            return v
        if len(v) != 22:
            raise ValueError('Spotify ID must be exactly 22 characters')
        if not v.isalnum():
            raise ValueError('Spotify ID must be alphanumeric')
        return v


class SampleMap(BaseModel):
    """Mapping between sampled track and original with timing information."""
    
    model_config = ConfigDict(
        validate_assignment=True,
        json_schema_extra={
            "examples": [{
                "is_bass_sample": True,
                "sample_type": "direct",
                "track_start_sec": 12.0,
                "original_start_sec": 0.0,
                "notes": "Direct bass line loop from original"
            }]
        }
    )
    
    is_bass_sample: bool = Field(
        True,
        description="Whether this sample specifically involves bass instruments"
    )
    sample_type: Literal["direct", "interpolation", "replay"] = Field(
        "direct",
        description="Type of sampling: direct loop, interpolation (modified), or replay"
    )
    track_start_sec: Annotated[float, Field(
        ge=0,
        description="Start time in seconds where sample begins in the track"
    )]
    original_start_sec: Annotated[float, Field(
        ge=0, 
        description="Start time in seconds of the sampled section in original"
    )]
    notes: Optional[str] = Field(
        None,
        max_length=500,
        description="Additional notes about the sample"
    )


class BarMarker(BaseModel):
    """Timestamp marker for individual bars in bass tabs."""
    
    model_config = ConfigDict(
        validate_assignment=True,
        json_schema_extra={
            "examples": [{
                "bar": 1,
                "start_sec": 0.0
            }]
        }
    )
    
    bar: Annotated[int, Field(
        ge=1,
        description="Bar number (1-indexed)"
    )]
    start_sec: Annotated[float, Field(
        ge=0,
        description="Start time in seconds for this bar"
    )]

    @field_validator('bar')
    @classmethod
    def validate_bar_number(cls, v: int) -> int:
        """Ensure bar number is positive."""
        if v < 1:
            raise ValueError('Bar number must be >= 1')
        return v


class Tab(BaseModel):
    """ASCII bass tab with timing information and metadata."""
    
    model_config = ConfigDict(
        str_strip_whitespace=True,
        validate_assignment=True,
        json_schema_extra={
            "examples": [{
                "tuning": "EADG",
                "difficulty": 2,
                "tab_text": "G|----------------|----------------|\nD|----------------|----------------|\nA|--5-5--3-3--1-1-|--0----1--3-----|\nE|----------------|----------------|",
                "bars": [
                    {"bar": 1, "start_sec": 0.0},
                    {"bar": 2, "start_sec": 4.1}
                ]
            }]
        }
    )
    
    tuning: Literal["EADG", "BEADG", "DADG", "CGCF"] = Field(
        "EADG",
        description="Bass tuning (standard 4-string EADG, 5-string BEADG, or alternate tunings)"
    )
    difficulty: Annotated[int, Field(
        ge=1,
        le=5, 
        description="Difficulty level from 1 (beginner) to 5 (expert)"
    )]
    tab_text: Annotated[str, Field(
        min_length=10,
        description="ASCII tab notation with line breaks"
    )]
    bars: List[BarMarker] = Field(
        min_length=1,
        description="List of bar timing markers"
    )

    @field_validator('tab_text')
    @classmethod
    def validate_tab_format(cls, v: str) -> str:
        """Basic validation of tab text format."""
        if not v.strip():
            raise ValueError('Tab text cannot be empty')
        
        # Check for basic tab characters (strings, numbers, special notation)
        lines = v.split('\n')
        if not lines:
            raise ValueError('Tab must contain at least one line')
            
        # Look for string indicators (G|, D|, A|, E|, B| for bass)
        string_indicators = ['G|', 'D|', 'A|', 'E|', 'B|']
        has_strings = any(
            any(indicator in line for indicator in string_indicators)
            for line in lines
        )
        
        if not has_strings:
            raise ValueError('Tab text must contain valid string indicators (G|, D|, A|, E|, B|)')
            
        return v

    @field_validator('bars')
    @classmethod
    def validate_bars_order(cls, v: List[BarMarker]) -> List[BarMarker]:
        """Ensure bars are in chronological order."""
        if len(v) < 1:
            raise ValueError('At least one bar marker is required')
            
        # Sort by bar number to ensure proper order
        sorted_bars = sorted(v, key=lambda x: x.bar)
        
        # Check for duplicate bar numbers
        bar_numbers = [bar.bar for bar in sorted_bars]
        if len(bar_numbers) != len(set(bar_numbers)):
            raise ValueError('Duplicate bar numbers are not allowed')
            
        # Ensure timestamps are in ascending order
        for i in range(1, len(sorted_bars)):
            if sorted_bars[i].start_sec <= sorted_bars[i-1].start_sec:
                raise ValueError('Bar timestamps must be in ascending order')
                
        return sorted_bars


class PagePayload(BaseModel):
    """Complete payload for a track/sample pair page."""
    
    model_config = ConfigDict(
        validate_assignment=True,
        json_schema_extra={
            "examples": [{
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
                    "spotify_id": "4xdBrk0nCOAhFDEQ21T0W"
                },
                "sample_map": {
                    "is_bass_sample": True,
                    "sample_type": "direct",
                    "track_start_sec": 12.0,
                    "original_start_sec": 0.0,
                    "notes": "Direct bass line loop"
                },
                "tab": {
                    "tuning": "EADG",
                    "difficulty": 2,
                    "tab_text": "G|--------|\nD|--------|\nA|5-3-1---|\nE|--------|",
                    "bars": [{"bar": 1, "start_sec": 0.0}]
                }
            }]
        }
    )
    
    track: Track = Field(description="The hip-hop track that contains the sample")
    original: Original = Field(description="The original track that was sampled")
    sample_map: SampleMap = Field(description="Information about how the track samples the original")
    tab: Tab = Field(description="Bass tab notation with timing markers")

    @field_validator('tab')
    @classmethod
    def validate_tab_sync(cls, v: Tab, info) -> Tab:
        """Validate that tab timing aligns with sample information."""
        if hasattr(info, 'data') and 'sample_map' in info.data:
            sample_map = info.data['sample_map']
            
            # Ensure first bar starts at or near the sample start time
            if v.bars and len(v.bars) > 0:
                first_bar_time = v.bars[0].start_sec
                sample_start = sample_map.original_start_sec
                
                # Allow small tolerance for timing alignment (within 1 second)
                if abs(first_bar_time - sample_start) > 1.0:
                    raise ValueError(
                        f'First tab bar timing ({first_bar_time}s) should align closely '
                        f'with sample start ({sample_start}s)'
                    )
        
        return v


# Additional utility models for API responses
class ErrorDetail(BaseModel):
    """Standard error response format."""
    
    error: str = Field(description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.now, description="Error timestamp")


class HealthCheck(BaseModel):
    """Health check response model."""
    
    status: Literal["ok", "error"] = Field(description="Service status")
    timestamp: datetime = Field(default_factory=datetime.now, description="Check timestamp")
    version: str = Field("1.0.0", description="API version")