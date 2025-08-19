"""
Database models and data access layer.

For this implementation, we'll use in-memory data storage to demonstrate
the full functionality without requiring complex database setup.
In a production environment, this would integrate with Prisma ORM.
"""

from typing import Dict, List, Optional
from app.schemas import PagePayload, Track, Original, SampleMap, Tab, BarMarker


class InMemoryDatabase:
    """
    Simple in-memory database for demonstration purposes.
    
    In production, this would be replaced with actual database operations
    using Prisma ORM or similar.
    """
    
    def __init__(self):
        """Initialize with sample data."""
        self._data: Dict[str, PagePayload] = {}
        self._load_sample_data()
    
    def _load_sample_data(self) -> None:
        """Load sample track pairs for demonstration."""
        
        # Sample 1: Notorious B.I.G. - Juicy sampling Mtume - Juicy Fruit
        juicy_data = PagePayload(
            track=Track(
                title="Juicy",
                artist="The Notorious B.I.G.",
                year=1994,
                youtube_id="_JZom_gVfuw",
                spotify_id="5ByAIlEEnxYdvpnezg7HTX"
            ),
            original=Original(
                title="Juicy Fruit",
                artist="Mtume",
                year=1983,
                youtube_id="vG0ZvhD6YKI",
                spotify_id="4xdBrk0nCOAhFDEQ21T0W1"
            ),
            sample_map=SampleMap(
                is_bass_sample=True,
                sample_type="direct",
                track_start_sec=12.0,
                original_start_sec=0.0,
                notes="Classic direct bass line loop from Mtume's original"
            ),
            tab=Tab(
                tuning="EADG",
                difficulty=2,
                tab_text=(
                    "G|----------------|----------------|\n"
                    "D|----------------|----------------|\n"
                    "A|--5-5--3-3--1-1-|--0----1--3-----|\n"
                    "E|----------------|----------------|"
                ),
                bars=[
                    BarMarker(bar=1, start_sec=0.0),
                    BarMarker(bar=2, start_sec=4.1)
                ]
            )
        )
        
        # Sample 2: Dr. Dre - Nuthin' But a 'G' Thang sampling Leon Haywood
        gthang_data = PagePayload(
            track=Track(
                title="Nuthin' But a 'G' Thang",
                artist="Dr. Dre ft. Snoop Dogg",
                year=1992,
                youtube_id="QZXc39hT8t4",
                spotify_id="6Lt7CjLG67MShj6ht5s1ZX"
            ),
            original=Original(
                title="I Want'a Do Something Freaky to You",
                artist="Leon Haywood",
                year=1975,
                youtube_id="37VTcnKrFNI"
            ),
            sample_map=SampleMap(
                is_bass_sample=True,
                sample_type="interpolation", 
                track_start_sec=8.5,
                original_start_sec=15.2,
                notes="Bass line interpolated and filtered from Leon Haywood original"
            ),
            tab=Tab(
                tuning="EADG",
                difficulty=3,
                tab_text=(
                    "G|----------------------|----------------------|\n"
                    "D|----------------------|----------------------|\n"
                    "A|--7-7-5-5--3-3-1-1----|--5-5-3-3--1-1--------|\n"
                    "E|--------------------3-|----------------3--1--|"
                ),
                bars=[
                    BarMarker(bar=1, start_sec=15.2),
                    BarMarker(bar=2, start_sec=19.3)
                ]
            )
        )
        
        # Sample 3: Public Enemy - Fight the Power sampling James Brown
        power_data = PagePayload(
            track=Track(
                title="Fight the Power",
                artist="Public Enemy",
                year=1989,
                youtube_id="mmo3HFa2vjg",
                spotify_id="3RzqE5PPM9CfpYMp3A4ICF"
            ),
            original=Original(
                title="Funky Drummer",
                artist="James Brown",
                year=1970,
                youtube_id="dNP8tbDMZNE"
            ),
            sample_map=SampleMap(
                is_bass_sample=True,
                sample_type="replay",
                track_start_sec=45.0,
                original_start_sec=120.5,
                notes="Re-recorded bass line inspired by James Brown's original"
            ),
            tab=Tab(
                tuning="EADG", 
                difficulty=4,
                tab_text=(
                    "# Main Verse (based on James Brown 'Funky President' sample):\n"
                    "G|————————————————————————————————|\n"
                    "D|———————14—12—14————————16—17—18—|\n"
                    "A|————————————————————————————————|\n"
                    "E|—12——————————————12—————————————|\n"
                    "\n"
                    "# Bridge/Break:\n"
                    "G|————————————————————————————————|\n"
                    "D|————14————13————12————11————————|\n"
                    "A|————————————————————————————————|\n"
                    "E|—12————11————10—————9———————————|\n"
                    "\n"
                    "# Chorus Hook:\n"
                    "G|—————————————————————————|\n"
                    "D|—————————————————————————|\n"
                    "A|—————————————————————————|\n"
                    "E|——8——8——8——8——6—8————————|"
                ),
                bars=[
                    BarMarker(bar=1, start_sec=120.5),
                    BarMarker(bar=2, start_sec=124.7),
                    BarMarker(bar=3, start_sec=128.9),
                    BarMarker(bar=4, start_sec=133.1)
                ]
            )
        )
        
        # Sample 4: Clone the working Juicy track structure exactly
        rappers_delight_data = PagePayload(
            track=Track(
                title="Rapper's Delight",
                artist="The Sugarhill Gang",
                year=1979,
                youtube_id="rKTUAESacQM",
                spotify_id="3Yk0ST4UVPGj7CEOoHCF15"
            ),
            original=Original(
                title="Good Times",
                artist="Chic",
                year=1979,
                youtube_id="B4c_SkROzzo",
                spotify_id="2dLLR6qNWfIdaho6ueuC4J"
            ),
            sample_map=SampleMap(
                is_bass_sample=True,
                sample_type="direct",
                track_start_sec=12.0,
                original_start_sec=0.0,
                notes="First mainstream hip-hop hit using Bernard Edwards' iconic bass line"
            ),
            tab=Tab(
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
        )

        # Sample 5: 2Pac - California Love sampling Zapp - Dance Floor
        california_love_data = PagePayload(
            track=Track(
                title="California Love",
                artist="2Pac",
                year=1995,
                youtube_id="5wBTdfAkqGU",
                spotify_id="2pacCaliforniaLoveAbcd"
            ),
            original=Original(
                title="Dance Floor",
                artist="Zapp",
                year=1982,
                youtube_id="kYPo3HCkYd8",
                spotify_id="zappDanceFloorAbcdefgh"
            ),
            sample_map=SampleMap(
                is_bass_sample=True,
                sample_type="direct",
                track_start_sec=12.0,
                original_start_sec=25.0,
                notes="Roger Troutman's talk box and Zapp's signature bass funk"
            ),
            tab=Tab(
                tuning="EADG",
                difficulty=3,
                tab_text=(
                    "# Zapp's signature talk-box funk bass:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|——————————————————————7—5—3—————|\n"
                    "E|—5—5—5—5—5—5—5—5—5—5—————————5—3—|"
                ),
                bars=[
                    BarMarker(bar=1, start_sec=25.0),
                    BarMarker(bar=2, start_sec=29.0)
                ]
            )
        )
        
        # Sample 6: 2Pac - I Get Around sampling Zapp & Roger - Computer Love
        i_get_around_data = PagePayload(
            track=Track(
                title="I Get Around",
                artist="2Pac",
                year=1993,
                youtube_id="YqJAnQTwmJs",
                spotify_id="2pacIGetAroundAbcdefgh"
            ),
            original=Original(
                title="Computer Love",
                artist="Zapp & Roger",
                year=1985,
                youtube_id="iqAj3UfEqpA",
                spotify_id="zappComputerLoveAbcdef"
            ),
            sample_map=SampleMap(
                is_bass_sample=True,
                sample_type="direct",
                track_start_sec=5.0,
                original_start_sec=30.0,
                notes="Zapp's robotic funk bass drives the digital soul movement"
            ),
            tab=Tab(
                tuning="EADG",
                difficulty=4,
                tab_text=(
                    "# Digital funk bass with synth bass elements:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|—————————————————————————5—7—5—3|\n"
                    "E|—3—3—0—3—3—0—3—3—0—3—3—0—————————|"
                ),
                bars=[
                    BarMarker(bar=1, start_sec=30.0),
                    BarMarker(bar=2, start_sec=32.5)
                ]
            )
        )
        
        # Sample 7: Wu-Tang Clan - C.R.E.A.M. sampling The Charmels - As Long As I've Got You
        cream_data = PagePayload(
            track=Track(
                title="C.R.E.A.M.",
                artist="Wu-Tang Clan",
                year=1993,
                youtube_id="PBwAxmrE194",
                spotify_id="wuTangCreamAbcdefghijk"
            ),
            original=Original(
                title="As Long As I've Got You",
                artist="The Charmels",
                year=1967,
                youtube_id="74X5GEF8qzM",
                spotify_id="charmelsAsLongAbcdefgh"
            ),
            sample_map=SampleMap(
                is_bass_sample=True,
                sample_type="direct",
                track_start_sec=8.0,
                original_start_sec=15.0,
                notes="Classic soul bass line from The Charmels' deep cut"
            ),
            tab=Tab(
                tuning="EADG",
                difficulty=2,
                tab_text=(
                    "# Classic 60s soul bass groove:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|————————————————————————————————|\n"
                    "E|—3————————3————————3————————3————|"
                ),
                bars=[
                    BarMarker(bar=1, start_sec=15.0),
                    BarMarker(bar=2, start_sec=19.0)
                ]
            )
        )
        
        # Sample 8: Wu-Tang Clan - Protect Ya Neck sampling David Axelrod - Holy Thursday
        protect_ya_neck_data = PagePayload(
            track=Track(
                title="Protect Ya Neck",
                artist="Wu-Tang Clan",
                year=1992,
                youtube_id="R0IUR4gkPIE",
                spotify_id="wuTangProtectAbcdefghi"
            ),
            original=Original(
                title="Holy Thursday",
                artist="David Axelrod",
                year=1968,
                youtube_id="bGAB11ZiPew",
                spotify_id="axelrodHolyThursdayAbc"
            ),
            sample_map=SampleMap(
                is_bass_sample=True,
                sample_type="interpolation",
                track_start_sec=0.0,
                original_start_sec=45.0,
                notes="Psychedelic orchestral bass transformed into raw hip-hop"
            ),
            tab=Tab(
                tuning="EADG",
                difficulty=3,
                tab_text=(
                    "# Orchestral bass with psychedelic edge:\n"
                    "G|————————————————————————————————|\n"
                    "D|————————————————————————————————|\n"
                    "A|————————————————3—5—3—1—————————|\n"
                    "E|—1————————1——————————————1—3—1—0|"
                ),
                bars=[
                    BarMarker(bar=1, start_sec=45.0),
                    BarMarker(bar=2, start_sec=51.0)
                ]
            )
        )

        # Store with slug keys
        self._data["notorious-big-juicy"] = juicy_data
        self._data["dr-dre-nuthin-but-g-thang"] = gthang_data
        self._data["public-enemy-fight-the-power"] = power_data
        self._data["sugarhill-gang-rappers-delight"] = rappers_delight_data
        self._data["2pac-california-love"] = california_love_data
        self._data["2pac-i-get-around"] = i_get_around_data
        self._data["wu-tang-clan-cream"] = cream_data
        self._data["wu-tang-clan-protect-ya-neck"] = protect_ya_neck_data
    
    def get_pair_by_slug(self, slug: str) -> Optional[PagePayload]:
        """
        Retrieve a track pair by slug.
        
        Args:
            slug: URL-friendly identifier for the track pair
            
        Returns:
            PagePayload if found, None otherwise
        """
        return self._data.get(slug)
    
    def list_all_pairs(self) -> List[str]:
        """
        Get list of all available track pair slugs.
        
        Returns:
            List of slug identifiers
        """
        return list(self._data.keys())
    
    def add_pair(self, slug: str, data: PagePayload) -> bool:
        """
        Add a new track pair.
        
        Args:
            slug: URL-friendly identifier
            data: Complete track pair data
            
        Returns:
            True if added successfully, False if slug already exists
        """
        if slug in self._data:
            return False
        
        self._data[slug] = data
        return True


# Global database instance
db = InMemoryDatabase()


def get_database() -> InMemoryDatabase:
    """
    Get database instance.
    
    This function provides dependency injection for FastAPI endpoints.
    In production, this would return a proper database connection.
    
    Returns:
        Database instance
    """
    return db


# For production use with actual Prisma integration:
"""
# This is what the Prisma schema would look like:

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Artist {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  slug      String   @unique @db.VarChar(120)
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  tracks    Track[]
  originals Original[]
  
  @@index([name])
}

model Track {
  id         Int      @id @default(autoincrement())
  slug       String   @unique @db.VarChar(150)
  title      String   @db.VarChar(200)
  artistId   Int
  year       Int      @db.SmallInt
  youtubeId  String   @db.VarChar(11)
  spotifyId  String?  @db.VarChar(22)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  artist     Artist   @relation(fields: [artistId], references: [id])
  samples    Sample[]
  
  @@index([artistId, year])
  @@index([youtubeId])
}

model Original {
  id         Int      @id @default(autoincrement())
  title      String   @db.VarChar(200)
  artistId   Int
  year       Int      @db.SmallInt
  youtubeId  String   @db.VarChar(11)
  spotifyId  String?  @db.VarChar(22)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  artist     Artist   @relation(fields: [artistId], references: [id])
  samples    Sample[]
  
  @@index([artistId, year])
}

model Sample {
  id               Int      @id @default(autoincrement())
  trackId          Int
  originalId       Int
  isBassSample     Boolean  @default(true)
  sampleType       String   @db.VarChar(20)
  trackStartSec    Float    @db.Real
  originalStartSec Float    @db.Real
  notes            String?  @db.Text
  verified         Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  track            Track    @relation(fields: [trackId], references: [id])
  original         Original @relation(fields: [originalId], references: [id])
  tab              Tab?
  
  @@unique([trackId, originalId])
  @@index([isBassSample])
}

model Tab {
  id         Int      @id @default(autoincrement())
  sampleId   Int      @unique
  tuning     String   @db.VarChar(10)
  difficulty Int      @db.SmallInt
  tabText    String   @db.Text
  barsJson   Json     // [{bar:1,start_sec:0.0}, ...]
  verified   Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  sample     Sample   @relation(fields: [sampleId], references: [id])
  
  @@index([difficulty])
  @@index([tuning])
}
"""