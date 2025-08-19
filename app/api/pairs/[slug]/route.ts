import { NextResponse } from 'next/server'

// Same tracks data as in route.ts
const tracks = {
  "notorious-big-juicy": {
    track: {
      title: "Juicy",
      artist: "The Notorious B.I.G.",
      year: 1994,
      youtube_id: "_JZom_gVfuw",
      spotify_id: "5ByAIlEEnxYdvpnezg7HTX"
    },
    original: {
      title: "Juicy Fruit",
      artist: "Mtume",
      year: 1983,
      youtube_id: "vG0ZvhD6YKI",
      spotify_id: "4xdBrk0nCOAhFDEQ21T0W1"
    },
    sample_map: {
      is_bass_sample: true,
      sample_type: "direct",
      track_start_sec: 12.0,
      original_start_sec: 0.0,
      notes: "Classic direct bass line loop from Mtume's original"
    },
    tab: {
      tuning: "EADG",
      difficulty: 2,
      tab_text: "G|----------------|----------------|\nD|----------------|----------------|\nA|--5-5--3-3--1-1-|--0----1--3-----|\nE|----------------|----------------|",
      bars: [
        { bar: 1, start_sec: 0.0 },
        { bar: 2, start_sec: 4.1 }
      ]
    }
  },
  "dr-dre-nuthin-but-g-thang": {
    track: {
      title: "Nuthin' But a 'G' Thang",
      artist: "Dr. Dre ft. Snoop Dogg",
      year: 1992,
      youtube_id: "QZXc39hT8t4",
      spotify_id: "6Lt7CjLG67MShj6ht5s1ZX"
    },
    original: {
      title: "I Want'a Do Something Freaky to You",
      artist: "Leon Haywood",
      year: 1975,
      youtube_id: "37VTcnKrFNI"
    },
    sample_map: {
      is_bass_sample: true,
      sample_type: "interpolation",
      track_start_sec: 8.5,
      original_start_sec: 15.2,
      notes: "Bass line interpolated and filtered from Leon Haywood original"
    },
    tab: {
      tuning: "EADG",
      difficulty: 3,
      tab_text: "G|----------------------|----------------------|\nD|----------------------|----------------------|\nA|--7-7-5-5--3-3-1-1----|--5-5-3-3--1-1--------|\nE|--------------------3-|----------------3--1--|",
      bars: [
        { bar: 1, start_sec: 15.2 },
        { bar: 2, start_sec: 19.3 }
      ]
    }
  },
  "public-enemy-fight-the-power": {
    track: {
      title: "Fight the Power",
      artist: "Public Enemy",
      year: 1989,
      youtube_id: "mmo3HFa2vjg",
      spotify_id: "3RzqE5PPM9CfpYMp3A4ICF"
    },
    original: {
      title: "Funky President",
      artist: "James Brown",
      year: 1970,
      youtube_id: "dNP8tbDMZNE"
    },
    sample_map: {
      is_bass_sample: true,
      sample_type: "replay",
      track_start_sec: 45.0,
      original_start_sec: 120.5,
      notes: "Re-recorded bass line inspired by James Brown's original"
    },
    tab: {
      tuning: "EADG",
      difficulty: 4,
      tab_text: "# Main Verse (based on James Brown 'Funky President' sample):\nG|————————————————————————————————|\nD|———————14—12—14————————16—17—18—|\nA|————————————————————————————————|\nE|—12——————————————12—————————————|\n\n# Bridge/Break:\nG|————————————————————————————————|\nD|————14————13————12————11————————|\nA|————————————————————————————————|\nE|—12————11————10—————9———————————|\n\n# Chorus Hook:\nG|—————————————————————————|\nD|—————————————————————————|\nA|—————————————————————————|\nE|——8——8——8——8——6—8————————|",
      bars: [
        { bar: 1, start_sec: 120.5 },
        { bar: 2, start_sec: 124.7 },
        { bar: 3, start_sec: 128.9 },
        { bar: 4, start_sec: 133.1 }
      ]
    }
  },
  "sugarhill-gang-rappers-delight": {
    track: {
      title: "Rapper's Delight",
      artist: "The Sugarhill Gang",
      year: 1979,
      youtube_id: "rKTUAESacQM",
      spotify_id: "3Yk0ST4UVPGj7CEOoHCF15"
    },
    original: {
      title: "Good Times",
      artist: "Chic",
      year: 1979,
      youtube_id: "B4c_SkROzzo",
      spotify_id: "2dLLR6qNWfIdaho6ueuC4J"
    },
    sample_map: {
      is_bass_sample: true,
      sample_type: "direct",
      track_start_sec: 12.0,
      original_start_sec: 0.0,
      notes: "First mainstream hip-hop hit using Bernard Edwards' iconic bass line"
    },
    tab: {
      tuning: "EADG",
      difficulty: 2,
      tab_text: "G|————————————————————————————————|\nD|————————————————————————————————|\nA|—7——————————————5—6—7——————————|\nE|——————0—3—5—7————————————5—3—0—|",
      bars: [
        { bar: 1, start_sec: 0.0 },
        { bar: 2, start_sec: 4.1 }
      ]
    }
  },
  "2pac-california-love": {
    track: {
      title: "California Love",
      artist: "2Pac",
      year: 1995,
      youtube_id: "5wBTdfAkqGU",
      spotify_id: "2pacCaliforniaLoveAbcd"
    },
    original: {
      title: "Dance Floor",
      artist: "Zapp",
      year: 1982,
      youtube_id: "kYPo3HCkYd8",
      spotify_id: "zappDanceFloorAbcdefgh"
    },
    sample_map: {
      is_bass_sample: true,
      sample_type: "direct",
      track_start_sec: 12.0,
      original_start_sec: 25.0,
      notes: "Roger Troutman's talk box and Zapp's signature bass funk"
    },
    tab: {
      tuning: "EADG",
      difficulty: 3,
      tab_text: "# Zapp's signature talk-box funk bass:\nG|————————————————————————————————|\nD|————————————————————————————————|\nA|——————————————————————7—5—3—————|\nE|—5—5—5—5—5—5—5—5—5—5—————————5—3—|",
      bars: [
        { bar: 1, start_sec: 25.0 },
        { bar: 2, start_sec: 29.0 }
      ]
    }
  },
  "2pac-i-get-around": {
    track: {
      title: "I Get Around",
      artist: "2Pac",
      year: 1993,
      youtube_id: "YqJAnQTwmJs",
      spotify_id: "2pacIGetAroundAbcdefgh"
    },
    original: {
      title: "Computer Love",
      artist: "Zapp & Roger",
      year: 1985,
      youtube_id: "iqAj3UfEqpA",
      spotify_id: "zappComputerLoveAbcdef"
    },
    sample_map: {
      is_bass_sample: true,
      sample_type: "direct",
      track_start_sec: 5.0,
      original_start_sec: 30.0,
      notes: "Zapp's robotic funk bass drives the digital soul movement"
    },
    tab: {
      tuning: "EADG",
      difficulty: 4,
      tab_text: "# Digital funk bass with synth bass elements:\nG|————————————————————————————————|\nD|————————————————————————————————|\nA|—————————————————————————5—7—5—3|\nE|—3—3—0—3—3—0—3—3—0—3—3—0—————————|",
      bars: [
        { bar: 1, start_sec: 30.0 },
        { bar: 2, start_sec: 32.5 }
      ]
    }
  },
  "wu-tang-clan-cream": {
    track: {
      title: "C.R.E.A.M.",
      artist: "Wu-Tang Clan",
      year: 1993,
      youtube_id: "PBwAxmrE194",
      spotify_id: "wuTangCreamAbcdefghijk"
    },
    original: {
      title: "As Long As I've Got You",
      artist: "The Charmels",
      year: 1967,
      youtube_id: "74X5GEF8qzM",
      spotify_id: "charmelsAsLongAbcdefgh"
    },
    sample_map: {
      is_bass_sample: true,
      sample_type: "direct",
      track_start_sec: 8.0,
      original_start_sec: 15.0,
      notes: "Classic soul bass line from The Charmels' deep cut"
    },
    tab: {
      tuning: "EADG",
      difficulty: 2,
      tab_text: "# Classic 60s soul bass groove:\nG|————————————————————————————————|\nD|————————————————————————————————|\nA|————————————————————————————————|\nE|—3————————3————————3————————3————|",
      bars: [
        { bar: 1, start_sec: 15.0 },
        { bar: 2, start_sec: 19.0 }
      ]
    }
  },
  "wu-tang-clan-protect-ya-neck": {
    track: {
      title: "Protect Ya Neck",
      artist: "Wu-Tang Clan",
      year: 1992,
      youtube_id: "R0IUR4gkPIE",
      spotify_id: "wuTangProtectAbcdefghi"
    },
    original: {
      title: "Holy Thursday",
      artist: "David Axelrod",
      year: 1968,
      youtube_id: "bGAB11ZiPew",
      spotify_id: "axelrodHolyThursdayAbc"
    },
    sample_map: {
      is_bass_sample: true,
      sample_type: "interpolation",
      track_start_sec: 0.0,
      original_start_sec: 45.0,
      notes: "Psychedelic orchestral bass transformed into raw hip-hop"
    },
    tab: {
      tuning: "EADG",
      difficulty: 3,
      tab_text: "# Orchestral bass with psychedelic edge:\nG|————————————————————————————————|\nD|————————————————————————————————|\nA|————————————————3—5—3—1—————————|\nE|—1————————1——————————————1—3—1—0|",
      bars: [
        { bar: 1, start_sec: 45.0 },
        { bar: 2, start_sec: 51.0 }
      ]
    }
  }
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug provided' },
        { status: 400 }
      )
    }

    // Sanitize slug - only allow alphanumeric and hyphens
    const cleanSlug = slug.replace(/[^a-z0-9-]/gi, '').toLowerCase()
    if (!cleanSlug) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      )
    }

    const track = tracks[cleanSlug as keyof typeof tracks]
    
    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(track)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch track pair' },
      { status: 500 }
    )
  }
}