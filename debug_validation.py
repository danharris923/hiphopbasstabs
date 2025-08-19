#!/usr/bin/env python3
"""
Debug script to test the validation of the Rapper's Delight track data
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.schemas import PagePayload, Track, Original, SampleMap, Tab, BarMarker
from pydantic import ValidationError

def test_rappers_delight():
    print("=== TESTING RAPPER'S DELIGHT VALIDATION ===\n")
    
    try:
        # Recreate the exact data from models.py
        track_data = Track(
            title="Rapper's Delight",
            artist="The Sugarhill Gang",
            year=1979,
            youtube_id="rKTUAESacQM",
            spotify_id="3Yk0ST4UVPGj7CEOoHCF15"
        )
        print("[OK] Track validation passed")
        print(f"   Title: {track_data.title}")
        print(f"   Artist: {track_data.artist}")
        print(f"   YouTube ID: {track_data.youtube_id}")
        print(f"   Spotify ID: {track_data.spotify_id}")
        
    except ValidationError as e:
        print("[ERROR] Track validation failed:")
        print(f"   Error: {e}")
        return False
    
    try:
        original_data = Original(
            title="Good Times",
            artist="Chic",
            year=1979,
            youtube_id="B4c_SkROzzo",
            spotify_id="2dLLR6qNWfIdaho6ueuC4J"
        )
        print("\n[OK] Original validation passed")
        print(f"   Title: {original_data.title}")
        print(f"   Artist: {original_data.artist}")
        
    except ValidationError as e:
        print("\n[ERROR] Original validation failed:")
        print(f"   Error: {e}")
        return False
    
    try:
        sample_map_data = SampleMap(
            is_bass_sample=True,
            sample_type="direct",
            track_start_sec=12.0,
            original_start_sec=0.0,
            notes="First mainstream hip-hop hit using Bernard Edwards' iconic bass line"
        )
        print("\n[OK] SampleMap validation passed")
        
    except ValidationError as e:
        print("\n[ERROR] SampleMap validation failed:")
        print(f"   Error: {e}")
        return False
    
    try:
        tab_data = Tab(
            tuning="EADG",
            difficulty=2,
            tab_text=(
                "G|————————————————————————————————|\n"
                "D|————————————————————————————————|\n"
                "A|—7——————————————5—6—7——————————|\n"
                "E|——————0—3—5—7————————————5—3—0—|"
            ),
            bars=[
                BarMarker(bar=1, start_sec=0.0),
                BarMarker(bar=2, start_sec=4.1)
            ]
        )
        print("\n[OK] Tab validation passed")
        print(f"   Tuning: {tab_data.tuning}")
        print(f"   Difficulty: {tab_data.difficulty}")
        print(f"   Tab text preview: {repr(tab_data.tab_text[:50])}...")
        
    except ValidationError as e:
        print("\n[ERROR] Tab validation failed:")
        print(f"   Error: {e}")
        return False
    
    try:
        # Test the full PagePayload
        full_data = PagePayload(
            track=track_data,
            original=original_data,
            sample_map=sample_map_data,
            tab=tab_data
        )
        print("\n[OK] Full PagePayload validation passed!")
        print("   All components validated successfully")
        return True
        
    except ValidationError as e:
        print("\n[ERROR] Full PagePayload validation failed:")
        print(f"   Error: {e}")
        for error in e.errors():
            print(f"   - {error['loc']}: {error['msg']}")
        return False

if __name__ == "__main__":
    success = test_rappers_delight()
    if success:
        print("\n[SUCCESS] All validation tests passed - the issue is not with data validation!")
    else:
        print("\n[FAIL] Found validation issues that need to be fixed!")