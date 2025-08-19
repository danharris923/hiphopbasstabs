#!/usr/bin/env python3
"""
Debug script to directly test database loading
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.models import InMemoryDatabase

def test_database():
    print("=== TESTING DATABASE LOADING ===\n")
    
    # Create a fresh database instance
    db = InMemoryDatabase()
    
    # Check what tracks are loaded
    pairs = db.list_all_pairs()
    print(f"Loaded tracks ({len(pairs)}):")
    for pair in pairs:
        print(f"  - {pair}")
    
    print(f"\nExpected: sugarhill-gang-rappers-delight")
    print(f"Found: {'sugarhill-gang-rappers-delight' in pairs}")
    
    # Try to get the specific track
    rapper_track = db.get_pair_by_slug("sugarhill-gang-rappers-delight")
    if rapper_track:
        print(f"\nRapper's Delight track found:")
        print(f"  Title: {rapper_track.track.title}")
        print(f"  Artist: {rapper_track.track.artist}")
    else:
        print(f"\nRapper's Delight track NOT FOUND")
        
    # Test a known working track
    working_track = db.get_pair_by_slug("notorious-big-juicy")
    if working_track:
        print(f"\nWorking track (Juicy) found:")
        print(f"  Title: {working_track.track.title}")
        print(f"  Artist: {working_track.track.artist}")
    else:
        print(f"\nWorking track (Juicy) NOT FOUND - this is bad!")

if __name__ == "__main__":
    test_database()