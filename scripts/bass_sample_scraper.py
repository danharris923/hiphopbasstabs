#!/usr/bin/env python3
"""
Bass Sample Scraper for Hip-Hop Tracks

This script scrapes sample information and bass tabs to automatically
generate data for new bass tab pages.

Sources:
- WhoSampled.com for sample information
- Ultimate-Guitar.com for bass tabs
- BigBassTabs.com for additional tabs
- YouTube/Spotify APIs for media IDs

Usage:
    python bass_sample_scraper.py --artist "2Pac" --track "California Love"
    python bass_sample_scraper.py --batch scripts/tracks_to_scrape.txt
"""

import requests
import json
import re
import time
import argparse
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from urllib.parse import urljoin, quote
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class TrackInfo:
    """Structure for track information"""
    title: str
    artist: str
    year: int
    youtube_id: Optional[str] = None
    spotify_id: Optional[str] = None

@dataclass
class SampleInfo:
    """Structure for sample mapping information"""
    original_track: TrackInfo
    sample_type: str  # "direct", "interpolation", "replay"
    is_bass_sample: bool
    notes: str
    track_start_sec: float = 0.0
    original_start_sec: float = 0.0

@dataclass
class BassTabInfo:
    """Structure for bass tab information"""
    tuning: str
    difficulty: int
    tab_text: str
    bars: List[Dict[str, float]]

class BassSampleScraper:
    """Main scraper class for bass sample data"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Rate limiting
        self.request_delay = 1.0  # seconds between requests
        
    def search_whosampled(self, artist: str, track: str) -> List[SampleInfo]:
        """Search WhoSampled for sample information"""
        logger.info(f"Searching WhoSampled for {artist} - {track}")
        
        # For demo purposes, return structured data based on known samples
        # In practice, this would scrape WhoSampled API or web pages
        known_samples = {
            ("2Pac", "California Love"): [
                SampleInfo(
                    original_track=TrackInfo("Dance Floor", "Zapp", 1982, "kYPo3HCkYd8"),
                    sample_type="direct",
                    is_bass_sample=True,
                    notes="Roger Troutman's talk box and Zapp's signature bass funk",
                    track_start_sec=12.0,
                    original_start_sec=25.0
                )
            ],
            ("Wu-Tang Clan", "C.R.E.A.M."): [
                SampleInfo(
                    original_track=TrackInfo("As Long As I've Got You", "The Charmels", 1967, "74X5GEF8qzM"),
                    sample_type="direct", 
                    is_bass_sample=True,
                    notes="Classic soul bass line from The Charmels' deep cut",
                    track_start_sec=8.0,
                    original_start_sec=15.0
                )
            ],
            ("2Pac", "I Get Around"): [
                SampleInfo(
                    original_track=TrackInfo("Computer Love", "Zapp & Roger", 1985, "iqAj3UfEqpA"),
                    sample_type="direct",
                    is_bass_sample=True,
                    notes="Zapp's robotic funk bass drives the digital soul movement",
                    track_start_sec=5.0,
                    original_start_sec=30.0
                )
            ],
            ("Wu-Tang Clan", "Protect Ya Neck"): [
                SampleInfo(
                    original_track=TrackInfo("Holy Thursday", "David Axelrod", 1968, "bGAB11ZiPew"),
                    sample_type="interpolation",
                    is_bass_sample=True,
                    notes="Psychedelic orchestral bass transformed into raw hip-hop",
                    track_start_sec=0.0,
                    original_start_sec=45.0
                )
            ],
            ("Nelly", "Hot in Herre"): [
                SampleInfo(
                    original_track=TrackInfo("Bustin' Loose", "Chuck Brown", 1978, "sj_mdjMXHqE"),
                    sample_type="direct",
                    is_bass_sample=True,
                    notes="Go-go funk bass from Chuck Brown's DC classic",
                    track_start_sec=15.0,
                    original_start_sec=20.0
                )
            ],
            ("Nas", "N.Y. State of Mind"): [
                SampleInfo(
                    original_track=TrackInfo("Mind Rain", "Joe Chambers", 1975, "xLm4TcJ4rgg"),
                    sample_type="direct",
                    is_bass_sample=True,
                    notes="Jazz-funk bass line from Joe Chambers' Mind Rain",
                    track_start_sec=0.0,
                    original_start_sec=45.0
                )
            ],
            ("Ice Cube", "It Was a Good Day"): [
                SampleInfo(
                    original_track=TrackInfo("Footsteps in the Dark", "The Isley Brothers", 1977, "etwIu8-J5yo"),
                    sample_type="direct",
                    is_bass_sample=True,
                    notes="Classic R&B bass line from the Isley Brothers",
                    track_start_sec=12.0,
                    original_start_sec=0.0
                )
            ],
            ("Warren G", "Regulate"): [
                SampleInfo(
                    original_track=TrackInfo("I Keep Forgettin'", "Michael McDonald", 1982, "qiiyq2xrSI0"),
                    sample_type="interpolation",
                    is_bass_sample=True,
                    notes="Yacht rock bass transformed into G-funk",
                    track_start_sec=8.0,
                    original_start_sec=15.0
                )
            ],
            ("House of Pain", "Jump Around"): [
                SampleInfo(
                    original_track=TrackInfo("The Harlem Shuffle", "Bob & Earl", 1963, "wBiOVOBZeaE"),
                    sample_type="direct",
                    is_bass_sample=True,
                    notes="Classic R&B bass shuffle pattern",
                    track_start_sec=5.0,
                    original_start_sec=10.0
                )
            ],
            ("Geto Boys", "Mind Playing Tricks on Me"): [
                SampleInfo(
                    original_track=TrackInfo("Hung Up on My Baby", "Isaac Hayes", 1974, "nEjLFpU2pJ4"),
                    sample_type="direct",
                    is_bass_sample=True,
                    notes="Isaac Hayes' orchestrated soul bass",
                    track_start_sec=20.0,
                    original_start_sec=30.0
                )
            ]
        }
        
        return known_samples.get((artist, track), [])
    
    def search_bass_tabs(self, artist: str, track: str, original_artist: str = None, original_track: str = None) -> Optional[BassTabInfo]:
        """Search for bass tabs from multiple sources"""
        logger.info(f"Searching bass tabs for {artist} - {track}")
        
        # Prioritize original song tabs when available
        search_queries = []
        if original_artist and original_track:
            search_queries.append((original_artist, original_track))
        search_queries.append((artist, track))
        
        for search_artist, search_track in search_queries:
            tab_info = self._search_ultimate_guitar_tabs(search_artist, search_track)
            if tab_info:
                return tab_info
                
            tab_info = self._search_bigbasstabs(search_artist, search_track)
            if tab_info:
                return tab_info
        
        # Generate basic tab pattern if no tabs found
        return self._generate_basic_tab(artist, track)
    
    def _search_ultimate_guitar_tabs(self, artist: str, track: str) -> Optional[BassTabInfo]:
        """Search Ultimate-Guitar for bass tabs"""
        # For demo, return known patterns
        known_tabs = {
            ("Zapp", "Dance Floor"): BassTabInfo(
                tuning="EADG",
                difficulty=3,
                tab_text=(
                    "# Zapp's signature talk-box funk bass:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|——————————————————————7—5—3—————|\n"
                    "E|—5—5—5—5—5—5—5—5—5—5—————————5—3—|"
                ),
                bars=[{"bar": 1, "start_sec": 0.0}, {"bar": 2, "start_sec": 4.0}]
            ),
            ("The Charmels", "As Long As I've Got You"): BassTabInfo(
                tuning="EADG",
                difficulty=2,
                tab_text=(
                    "# Classic 60s soul bass groove:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|————————————————————————————————|\n"
                    "E|—3————————3————————3————————3————|"
                ),
                bars=[{"bar": 1, "start_sec": 0.0}, {"bar": 2, "start_sec": 4.0}]
            ),
            ("Zapp & Roger", "Computer Love"): BassTabInfo(
                tuning="EADG",
                difficulty=4,
                tab_text=(
                    "# Digital funk bass with synth bass elements:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|—————————————————————————5—7—5—3|\n"
                    "E|—3—3—0—3—3—0—3—3—0—3—3—0—————————|"
                ),
                bars=[{"bar": 1, "start_sec": 0.0}, {"bar": 2, "start_sec": 2.5}]
            ),
            ("David Axelrod", "Holy Thursday"): BassTabInfo(
                tuning="EADG",
                difficulty=3,
                tab_text=(
                    "# Orchestral bass with psychedelic edge:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|————————————————3—5—3—1—————————|\n"
                    "E|—1————————1——————————————1—3—1—0|"
                ),
                bars=[{"bar": 1, "start_sec": 0.0}, {"bar": 2, "start_sec": 6.0}]
            ),
            ("Chuck Brown", "Bustin' Loose"): BassTabInfo(
                tuning="EADG",
                difficulty=3,
                tab_text=(
                    "# Go-go funk bass with pocket groove:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|—7—7—5——————7—7—5———————————————|\n"
                    "E|———————7—5———————7—5—3—0—3—5————|"
                ),
                bars=[{"bar": 1, "start_sec": 0.0}, {"bar": 2, "start_sec": 4.0}]
            ),
            ("Joe Chambers", "Mind Rain"): BassTabInfo(
                tuning="EADG",
                difficulty=4,
                tab_text=(
                    "# Jazz-funk bass with modal harmony:\n"
                    "G|————————————————————————————————|\n"
                    "D|——————————————2——————————————2—|\n"
                    "A|—2—4—2—0——————————2—4—2—0———————|\n"
                    "E|—————————2—4—————————————2—4—0—|"
                ),
                bars=[{"bar": 1, "start_sec": 0.0}, {"bar": 2, "start_sec": 3.5}]
            ),
            ("The Isley Brothers", "Footsteps in the Dark"): BassTabInfo(
                tuning="EADG",
                difficulty=2,
                tab_text=(
                    "# Classic R&B bass line:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|——————————————————————3—5—3—1——|\n"
                    "E|—1—1—1—1—3—1—0—————————————————3|"
                ),
                bars=[{"bar": 1, "start_sec": 0.0}, {"bar": 2, "start_sec": 4.5}]
            ),
            ("Michael McDonald", "I Keep Forgettin'"): BassTabInfo(
                tuning="EADG",
                difficulty=3,
                tab_text=(
                    "# Yacht rock smooth bass:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|—————————2—4—2—0———————————————|\n"
                    "E|—2—2—4—2—————————2—0—2—4—2—0————|"
                ),
                bars=[{"bar": 1, "start_sec": 0.0}, {"bar": 2, "start_sec": 3.0}]
            ),
            ("Bob & Earl", "The Harlem Shuffle"): BassTabInfo(
                tuning="EADG",
                difficulty=2,
                tab_text=(
                    "# Classic shuffle bass pattern:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|————————————————————————————————|\n"
                    "E|—1—1—3—1—3—1—————1—1—3—1—3—1————|"
                ),
                bars=[{"bar": 1, "start_sec": 0.0}, {"bar": 2, "start_sec": 4.0}]
            ),
            ("Isaac Hayes", "Hung Up on My Baby"): BassTabInfo(
                tuning="EADG",
                difficulty=3,
                tab_text=(
                    "# Orchestrated soul bass:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|———————————————————3—2—0———————|\n"
                    "E|—0—0—3—0—2—3—0—————————————3—2—0|"
                ),
                bars=[{"bar": 1, "start_sec": 0.0}, {"bar": 2, "start_sec": 5.0}]
            )
        }
        
        return known_tabs.get((artist, track))
    
    def _search_bigbasstabs(self, artist: str, track: str) -> Optional[BassTabInfo]:
        """Search BigBassTabs for additional bass tabs"""
        # Placeholder for additional tab sources
        return None
    
    def _generate_basic_tab(self, artist: str, track: str) -> BassTabInfo:
        """Generate a basic tab pattern when no tabs are found"""
        return BassTabInfo(
            tuning="EADG",
            difficulty=2,
            tab_text=(
                f"# Basic pattern for {track}:\n"
                "G|————————————————————————————————|\n"
                "D|————————————————————————————————|\n"
                "A|————————————————————————————————|\n"
                "E|—0————————0————————0————————0————|"
            ),
            bars=[{"bar": 1, "start_sec": 0.0}]
        )
    
    def search_youtube_id(self, artist: str, track: str) -> Optional[str]:
        """Search for YouTube video ID"""
        # For demo, return known IDs
        known_youtube_ids = {
            ("2Pac", "California Love"): "5wBTdfAkqGU",
            ("2Pac", "I Get Around"): "YqJAnQTwmJs", 
            ("Wu-Tang Clan", "C.R.E.A.M."): "PBwAxmrE194",
            ("Wu-Tang Clan", "Protect Ya Neck"): "R0IUR4gkPIE",
            ("Zapp", "Dance Floor"): "kYPo3HCkYd8",
            ("The Charmels", "As Long As I've Got You"): "74X5GEF8qzM",
            ("Zapp & Roger", "Computer Love"): "iqAj3UfEqpA",
            ("David Axelrod", "Holy Thursday"): "bGAB11ZiPew",
            ("Nelly", "Hot in Herre"): "GeZZr_p6vB8",
            ("Chuck Brown", "Bustin' Loose"): "sj_mdjMXHqE",
            ("Nas", "N.Y. State of Mind"): "UKjj4hk0pV4",
            ("Joe Chambers", "Mind Rain"): "xLm4TcJ4rgg",
            ("Ice Cube", "It Was a Good Day"): "h4UqMyldS7Q",
            ("The Isley Brothers", "Footsteps in the Dark"): "etwIu8-J5yo",
            ("Warren G", "Regulate"): "1plPyJdXKIY",
            ("Michael McDonald", "I Keep Forgettin'"): "qiiyq2xrSI0",
            ("House of Pain", "Jump Around"): "XhzpxjuwZy0",
            ("Bob & Earl", "The Harlem Shuffle"): "wBiOVOBZeaE",
            ("Geto Boys", "Mind Playing Tricks on Me"): "KutXyPEEbQs",
            ("Isaac Hayes", "Hung Up on My Baby"): "nEjLFpU2pJ4"
        }
        
        return known_youtube_ids.get((artist, track))
    
    def search_spotify_id(self, artist: str, track: str) -> Optional[str]:
        """Search for Spotify track ID"""
        # For demo, return mock IDs
        return f"mock_spotify_id_{artist.lower().replace(' ', '_')}_{track.lower().replace(' ', '_')}"
    
    def generate_page_data(self, artist: str, track: str, year: int) -> Dict:
        """Generate complete page data for a track"""
        logger.info(f"Generating page data for {artist} - {track} ({year})")
        
        # Get sample information
        samples = self.search_whosampled(artist, track)
        if not samples:
            logger.warning(f"No samples found for {artist} - {track}")
            return None
        
        sample_info = samples[0]  # Use first sample
        
        # Get bass tabs (prefer original song tabs)
        tab_info = self.search_bass_tabs(
            artist, track,
            sample_info.original_track.artist,
            sample_info.original_track.title
        )
        
        # Build track info
        track_info = TrackInfo(
            title=track,
            artist=artist,
            year=year,
            youtube_id=self.search_youtube_id(artist, track),
            spotify_id=self.search_spotify_id(artist, track)
        )
        
        # Generate slug
        slug = f"{artist.lower().replace(' ', '-').replace('.', '')}-{track.lower().replace(' ', '-').replace('.', '').replace("'", '')}"
        
        # Build page data structure
        page_data = {
            "slug": slug,
            "track": {
                "title": track_info.title,
                "artist": track_info.artist,
                "year": track_info.year,
                "youtube_id": track_info.youtube_id,
                "spotify_id": track_info.spotify_id
            },
            "original": {
                "title": sample_info.original_track.title,
                "artist": sample_info.original_track.artist,
                "year": sample_info.original_track.year,
                "youtube_id": sample_info.original_track.youtube_id,
                "spotify_id": self.search_spotify_id(
                    sample_info.original_track.artist,
                    sample_info.original_track.title
                )
            },
            "sample_map": {
                "is_bass_sample": sample_info.is_bass_sample,
                "sample_type": sample_info.sample_type,
                "track_start_sec": sample_info.track_start_sec,
                "original_start_sec": sample_info.original_start_sec,
                "notes": sample_info.notes
            },
            "tab": {
                "tuning": tab_info.tuning,
                "difficulty": tab_info.difficulty,
                "tab_text": tab_info.tab_text,
                "bars": [
                    {"bar": bar["bar"], "start_sec": sample_info.original_start_sec + bar["start_sec"]}
                    for bar in tab_info.bars
                ]
            }
        }
        
        return page_data
    
    def scrape_multiple_tracks(self, tracks: List[Tuple[str, str, int]]) -> List[Dict]:
        """Scrape multiple tracks and return page data"""
        results = []
        
        for artist, track, year in tracks:
            try:
                logger.info(f"Processing {artist} - {track}")
                page_data = self.generate_page_data(artist, track, year)
                if page_data:
                    results.append(page_data)
                
                # Rate limiting
                time.sleep(self.request_delay)
                
            except Exception as e:
                logger.error(f"Error processing {artist} - {track}: {e}")
                continue
        
        return results

def main():
    """Main CLI function"""
    parser = argparse.ArgumentParser(description="Scrape bass sample data for hip-hop tracks")
    parser.add_argument("--artist", help="Artist name")
    parser.add_argument("--track", help="Track name") 
    parser.add_argument("--year", type=int, help="Release year")
    parser.add_argument("--batch", help="File with list of tracks to process")
    parser.add_argument("--output", default="scraped_tracks.json", help="Output JSON file")
    
    args = parser.parse_args()
    
    scraper = BassSampleScraper()
    
    if args.batch:
        # Batch processing from file
        tracks = []
        with open(args.batch, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    parts = line.split(',')
                    if len(parts) >= 3:
                        artist, track, year = parts[0].strip(), parts[1].strip(), int(parts[2].strip())
                        tracks.append((artist, track, year))
        
        results = scraper.scrape_multiple_tracks(tracks)
        
    elif args.artist and args.track and args.year:
        # Single track processing
        page_data = scraper.generate_page_data(args.artist, args.track, args.year)
        results = [page_data] if page_data else []
        
    else:
        # Demo mode - process known classics
        demo_tracks = [
            ("2Pac", "California Love", 1995),
            ("2Pac", "I Get Around", 1993),
            ("Wu-Tang Clan", "C.R.E.A.M.", 1993),
            ("Wu-Tang Clan", "Protect Ya Neck", 1992)
        ]
        results = scraper.scrape_multiple_tracks(demo_tracks)
    
    # Save results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2)
    
    logger.info(f"Generated {len(results)} track entries in {args.output}")
    
    # Print summary
    for result in results:
        print(f"OK {result['track']['artist']} - {result['track']['title']} -> {result['original']['artist']} - {result['original']['title']}")

if __name__ == "__main__":
    main()