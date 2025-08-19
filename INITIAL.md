## FEATURE:
Build a WhoSampled-style bass tab site with **schema-first development**:
- Show a hip-hop track and its original sampled track side-by-side.
- Two **timestamped YouTube embeds** (original + sampled) with “Jump to riff” buttons.
- **ASCII bass tabs** synced bar-by-bar to timestamps.
- Define all payloads with **Pydantic v2** (Python). Export JSON Schema → **generate TypeScript types** for the Next.js frontend.
- Stack: **FastAPI (Python) + Pydantic v2**, **Postgres + Prisma**, **Next.js (TypeScript, App Router) + Tailwind + shadcn/ui**, **YouTube IFrame + Data API**, **Spotify Web API**, **WhoSampled API** (licensed).

## EXAMPLES:
### 1) Pydantic v2 models (server, `schemas.py`)
```python
from typing import Literal, List, Optional
from pydantic import BaseModel, Field

class Track(BaseModel):
    title: str
    artist: str
    year: int
    youtube_id: str
    spotify_id: Optional[str] = None

class Original(BaseModel):
    title: str
    artist: str
    year: int
    youtube_id: str
    spotify_id: Optional[str] = None

class SampleMap(BaseModel):
    is_bass_sample: bool = True
    sample_type: Literal["direct","interpolation","replay"] = "direct"
    track_start_sec: float = Field(ge=0)
    original_start_sec: float = Field(ge=0)
    notes: Optional[str] = None

class BarMarker(BaseModel):
    bar: int = Field(ge=1)
    start_sec: float = Field(ge=0)

class Tab(BaseModel):
    tuning: Literal["EADG","BEADG"] = "EADG"
    difficulty: int = Field(ge=1, le=5)
    tab_text: str
    bars: List[BarMarker]

class PagePayload(BaseModel):
    track: Track
    original: Original
    sample_map: SampleMap
    tab: Tab

2) FastAPI endpoint returning a page payload (main.py)

from fastapi import FastAPI
from schemas import PagePayload, Track, Original, SampleMap, Tab, BarMarker

app = FastAPI()

@app.get("/api/pairs/{slug}", response_model=PagePayload)
def get_pair(slug: str) -> PagePayload:
    # TODO: fetch from DB (by slug) and validate before returning
    return PagePayload(
        track=Track(title="Juicy", artist="The Notorious B.I.G.", year=1994, youtube_id="_JZom_gVfuw"),
        original=Original(title="Juicy Fruit", artist="Mtume", year=1983, youtube_id="vG0ZvhD6YKI"),
        sample_map=SampleMap(is_bass_sample=True, sample_type="direct", track_start_sec=12.0, original_start_sec=0.0),
        tab=Tab(
            tuning="EADG",
            difficulty=2,
            tab_text=(
                "G|----------------|----------------|\n"
                "D|----------------|----------------|\n"
                "A|--5-5--3-3--1-1-|--0----1--3-----|\n"
                "E|----------------|----------------|"
            ),
            bars=[BarMarker(bar=1, start_sec=0.0), BarMarker(bar=2, start_sec=4.1)],
        ),
    )

3) Export JSON Schema & generate TypeScript types (build step)


# Export JSON Schema for PagePayload
python - <<'PY'
import json
from schemas import PagePayload
print(json.dumps(PagePayload.model_json_schema(), indent=2))
PY > schema/page_payload.schema.json

# Generate TS types from JSON Schema
pip install datamodel-code-generator
datamodel-code-generator \
  --input schema/page_payload.schema.json \
  --input-file-type jsonschema \
  --target typescript \
  --output web/types/schema.d.ts


4) Minimal Prisma schema (DB tables) — prisma/schema.prisma
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
generator client { provider = "prisma-client-js" }

model Track {
  id         Int     @id @default(autoincrement())
  slug       String  @unique
  title      String
  artist     String
  year       Int
  youtubeId  String
  spotifyId  String?
  samples    Sample[]
}

model Original {
  id         Int     @id @default(autoincrement())
  title      String
  artist     String
  year       Int
  youtubeId  String
  spotifyId  String?
  samples    Sample[]
}

model Sample {
  id               Int     @id @default(autoincrement())
  trackId          Int
  originalId       Int
  isBassSample     Boolean @default(true)
  sampleType       String  // "direct" | "interpolation" | "replay"
  trackStartSec    Float
  originalStartSec Float
  notes            String?
  track            Track   @relation(fields: [trackId], references: [id])
  original         Original @relation(fields: [originalId], references: [id])
  tab              Tab?
}

model Tab {
  id        Int    @id @default(autoincrement())
  sampleId  Int    @unique
  tuning    String // "EADG" | "BEADG"
  difficulty Int
  tabText   String
  barsJson  Json   // [{bar:1,start_sec:0.0}, ...]
  sample    Sample @relation(fields: [sampleId], references: [id])
}

5) Next.js page: fetch typed payload & render two embeds + tab (TS/React)
// app/pairs/[slug]/page.tsx
import type { PagePayload } from "@/types/schema";

async function getData(slug: string): Promise<PagePayload> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/pairs/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

const ytWatchAt = (id: string, sec: number) => `https://www.youtube.com/watch?v=${id}&t=${Math.floor(sec)}s`;
const ytEmbedAt = (id: string, sec: number) => `https://www.youtube.com/embed/${id}?start=${Math.floor(sec)}`;

export default async function PairPage({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{data.track.title} — {data.track.artist}</h1>
        <p className="text-sm opacity-80">
          Samples: <strong>{data.original.title}</strong> — {data.original.artist}
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded-xl"
            src={ytEmbedAt(data.track.youtube_id, data.sample_map.track_start_sec)}
            title="Sampled track"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <a className="text-xs underline" href={ytWatchAt(data.track.youtube_id, data.sample_map.track_start_sec)} target="_blank">
            Jump to sample ({Math.floor(data.sample_map.track_start_sec)}s)
          </a>
        </div>

        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded-xl"
            src={ytEmbedAt(data.original.youtube_id, data.sample_map.original_start_sec)}
            title="Original track"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <a className="text-xs underline" href={ytWatchAt(data.original.youtube_id, data.sample_map.original_start_sec)} target="_blank">
            Hear original riff ({Math.floor(data.sample_map.original_start_sec)}s)
          </a>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="font-semibold">Bass Tab (tuning {data.tab.tuning})</h2>
        <pre className="bg-black text-green-200 p-4 rounded-lg overflow-auto text-sm leading-5">
{data.tab.tab_text}
        </pre>
        <div className="flex flex-wrap gap-2">
          {data.tab.bars.map(b => (
            <a key={b.bar}
               className="px-2 py-1 border rounded hover:bg-gray-100"
               href={ytWatchAt(data.original.youtube_id, b.start_sec)}
               target="_blank">
              Bar {b.bar}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}


6) Lightweight YouTube IFrame API control (optional seek buttons)


// components/YTPlayer.tsx
import { useEffect, useRef } from "react";

declare global { interface Window { YT:any; onYouTubeIframeAPIReady:() => void; } }

export function YTPlayer({ videoId, start=0 }:{ videoId:string; start?:number }) {
  const ref = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const load = () => {
      playerRef.current = new window.YT.Player(ref.current!, {
        videoId, playerVars: { start, rel: 0 }, events: {}
      });
    };
    if (!window.YT) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(s);
      window.onYouTubeIframeAPIReady = load;
    } else load();
  }, [videoId, start]);

  return <div className="aspect-video"><div ref={ref} /></div>;
}


7) Timestamp link helpers (TS)

export const ytWatchAt = (id: string, sec: number) =>
  `https://www.youtube.com/watch?v=${id}&t=${Math.floor(sec)}s`;

export const ytEmbedAt = (id: string, sec: number) =>
  `https://www.youtube.com/embed/${id}?start=${Math.floor(sec)}`;



## DOCUMENTATION:

Pydantic v2: https://docs.pydantic.dev/latest/

datamodel-code-generator: https://github.com/koxudaxi/datamodel-code-generator

pydantic2ts: https://pypi.org/project/pydantic2ts/

JSON Schema: https://json-schema.org/

WhoSampled API/Business: https://www.whosampled.com/business/ | https://www.whosampled.com/api/

YouTube IFrame Player API: https://developers.google.com/youtube/iframe_api_reference

YouTube Player Parameters: https://developers.google.com/youtube/player_parameters

YouTube Data API v3: https://developers.google.com/youtube/v3

Spotify Web API: https://developer.spotify.com/documentation/web-api | https://developer.spotify.com/console

Next.js App Router: https://nextjs.org/docs/app

Prisma ORM: https://www.prisma.io/docs

Tailwind CSS: https://tailwindcss.com/docs

shadcn/ui: https://ui.shadcn.com/docs

Model Context Protocol (Claude tools): https://modelcontextprotocol.io/

Anthropic/Claude docs: https://docs.anthropic.com/claude/docs

##OTHER CONSIDERATIONS

LLM agent best practices

System-first constraints: declare stack + non-goals up top. Keep one canonical schema (Pydantic).

Schema-first I/O: validate all tool outputs against Pydantic; reject/repair on mismatch.

Deterministic blocks: require machine outputs in ```json with no prose when updating data.

Small, idempotent tools: Spotify lookup, YT resolver, DB insert as separate tools with strict schemas.

Self-check: model restates assumptions, verifies against schema, lists side-effects before commit.

Caching & quotas: centralize API calls server-side; cache; backoff on 429; log tool durations.

Security: sanitize any HTML; whitelist outbound domains.

Legal/ToS: use official YouTube/Spotify embeds; do not scrape WhoSampled—use licensed API and attribute sources.

Transpose control: add ± semitone for pitched samples.

Crowdsourced timestamps: store proposals in a moderated timestamps queue (source URL + seconds).

::contentReference[oaicite:0]{index=0}