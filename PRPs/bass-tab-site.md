name: "WhoSampled-Style Bass Tab Site - Schema-First Implementation"
description: |

## Purpose
Comprehensive PRP for building a WhoSampled-style bass tab site using schema-first development with Pydantic v2, FastAPI, PostgreSQL/Prisma, Next.js App Router, and synchronized YouTube video players showing hip-hop tracks alongside their sampled originals with timestamped ASCII bass tabs.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal
Build a complete WhoSampled-style bass tab site that displays hip-hop tracks alongside their original sampled tracks with synchronized YouTube embeds and timestamped ASCII bass tabs. The implementation must use schema-first development with Pydantic v2 models that export JSON Schema for TypeScript type generation, ensuring type safety across the full stack.

## Why
- **Music Education Value**: Help bass players learn classic hip-hop bass lines by showing the original samples
- **Schema-First Architecture**: Demonstrate modern development with single source of truth for data models
- **Performance & UX**: Provide synchronized playback experience with jump-to-timestamp functionality
- **Integration Showcase**: Connect multiple APIs (YouTube, Spotify, WhoSampled) with proper validation

## What
A full-stack application with:

### User-Visible Behavior
- **Dual Video Display**: Side-by-side YouTube players showing sampled track vs original
- **Synchronized Playback**: "Jump to riff" buttons that seek both videos to relevant timestamps  
- **ASCII Bass Tabs**: Monospace-formatted tabs with bar-by-bar timestamp links
- **Track Information**: Artist, title, year, sample type (direct/interpolation/replay)
- **Responsive Design**: Works on desktop and mobile with Tailwind CSS + shadcn/ui

### Technical Requirements
- **Backend**: FastAPI with Pydantic v2 models, PostgreSQL with Prisma ORM
- **Frontend**: Next.js 14 App Router with TypeScript, auto-generated from JSON Schema
- **APIs**: YouTube IFrame Player API, YouTube Data API v3, Spotify Web API, WhoSampled API
- **Type Safety**: Single Pydantic schema generates TypeScript types for frontend
- **Security**: Content Security Policy for YouTube embeds, input sanitization
- **Performance**: Caching strategy, rate limiting, optimized database queries

### Success Criteria
- [ ] Pydantic models export valid JSON Schema that generates clean TypeScript types
- [ ] FastAPI endpoints validate all inputs/outputs against schemas
- [ ] PostgreSQL schema supports music relationships with proper indexing
- [ ] YouTube videos load and sync properly with timestamp jumping
- [ ] ASCII tabs render correctly in monospace with clickable bar markers
- [ ] All tests pass: unit tests, integration tests, and manual browser testing
- [ ] No security vulnerabilities: CSP headers, input validation, API key protection

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://docs.pydantic.dev/latest/
  why: Pydantic v2 model patterns, validation, JSON Schema export
  section: BaseModel configuration, Field validation, schema_extra

- url: https://fastapi.tiangolo.com/tutorial/
  why: FastAPI patterns, response models, dependency injection
  section: Request/Response models, middleware, error handling

- url: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql
  why: Prisma schema design, migrations, TypeScript client
  section: Relations, JSON fields, database indexing

- url: https://nextjs.org/docs/app
  why: Next.js App Router patterns, server vs client components
  section: Data fetching, TypeScript integration, deployment

- url: https://developers.google.com/youtube/iframe_api_reference
  why: YouTube IFrame Player API for synchronized video control
  section: Player parameters, events, seeking functionality

- url: https://developers.google.com/youtube/player_parameters
  why: YouTube embed parameters for optimal integration
  critical: origin parameter required for API calls

- file: use-cases/pydantic-ai/examples/structured_output_agent/agent.py
  why: Pydantic model patterns with Field validation and BaseModel configuration

- file: use-cases/pydantic-ai/examples/main_agent_reference/models.py  
  why: Complex model relationships, Config classes, type annotations

- file: use-cases/pydantic-ai/examples/testing_examples/test_agent_patterns.py
  why: Pytest patterns for testing complex data models and validation

- file: use-cases/pydantic-ai/CLAUDE.md
  why: Project-specific conventions for Python development, virtual environments

- file: CLAUDE.md
  why: Global project rules, testing requirements, file organization
```

### Current Codebase tree
```bash
D:\git\bassplayers\
├── CLAUDE.md                    # Global project rules
├── INITIAL.md                   # Feature requirements
├── PRPs/
│   ├── templates/
│   │   └── prp_base.md         # PRP template structure
├── use-cases/
│   ├── pydantic-ai/
│   │   ├── CLAUDE.md           # Python/PydanticAI specific rules
│   │   └── examples/
│   │       ├── main_agent_reference/
│   │       │   ├── models.py   # Complex Pydantic model patterns
│   │       │   └── settings.py # Environment configuration patterns
│   │       ├── structured_output_agent/
│   │       │   └── agent.py    # Pydantic validation examples
│   │       └── testing_examples/
│   │           └── test_agent_patterns.py # Pytest testing patterns
```

### Desired Codebase tree with files to be added and responsibility
```bash
bassplayers/
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app, CORS, lifespan
│   │   ├── schemas.py          # All Pydantic models (SINGLE SOURCE)
│   │   ├── models.py           # Prisma model integration
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── pairs.py        # /api/pairs/{slug} endpoint
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py       # Environment settings
│   │   │   └── security.py     # Input validation, sanitization
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── schema_export.py # JSON Schema export utility
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_schemas.py     # Pydantic model validation tests
│   │   ├── test_api.py         # FastAPI endpoint tests
│   │   └── fixtures/
│   │       └── sample_data.py  # Test data fixtures
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   └── pyproject.toml         # Python project configuration
├── frontend/                   # Next.js frontend  
│   ├── app/
│   │   ├── layout.tsx         # Root layout with CSP headers
│   │   ├── page.tsx           # Homepage
│   │   └── pairs/
│   │       └── [slug]/
│   │           └── page.tsx   # Pair detail page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── VideoPlayer.tsx    # YouTube IFrame Player wrapper
│   │   ├── TabDisplay.tsx     # ASCII tab renderer with bar markers
│   │   └── LoadingSkeleton.tsx # Loading states
│   ├── lib/
│   │   ├── utils.ts          # Utility functions
│   │   ├── cache.ts          # Client-side caching
│   │   └── youtube.ts        # YouTube API utilities
│   ├── types/
│   │   └── schema.d.ts       # AUTO-GENERATED from Pydantic schemas
│   ├── schemas/              # JSON Schema files (generated)
│   │   └── page_payload.schema.json
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js        # CSP headers, API proxy
│   └── tsconfig.json
└── scripts/
    ├── generate-types.sh      # Generate TS types from JSON Schema
    └── dev-setup.sh          # Development environment setup
```

### Known Gotchas of our codebase & Library Quirks
```python
# CRITICAL: Virtual environment usage (from CLAUDE.md)
# Always use venv_linux virtual environment for Python commands
# Run: source venv_linux/bin/activate (Linux) or venv_linux\Scripts\activate (Windows)

# CRITICAL: Pydantic v2 differences from v1
from pydantic import BaseModel, Field, ConfigDict  # v2 import style
class MyModel(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)  # v2 config style
    # NOT: class Config: str_strip_whitespace = True  # v1 style

# CRITICAL: FastAPI with Pydantic v2 response models
@app.get("/endpoint", response_model=MyModel)  # This validates output
async def endpoint() -> MyModel:
    return MyModel.model_validate(data)  # v2 method, not .parse_obj()

# CRITICAL: YouTube IFrame API requires origin parameter
playerVars: {
  start: Math.floor(startTime),
  origin: window.location.origin  # REQUIRED for API calls to work
}

# CRITICAL: Prisma JSON fields need type assertion for TypeScript
const data = await prisma.tab.create({
  data: {
    barsJson: validatedBars as any  // Required for complex JSON types
  }
})

# CRITICAL: Next.js App Router - Server vs Client components
# Server components: async functions, database calls, no useState/useEffect  
# Client components: 'use client', hooks, event handlers, YouTube API

# CRITICAL: File length limit (from CLAUDE.md)
# Never create files longer than 500 lines - split into modules if approaching limit
```

## Implementation Blueprint

### Data models and structure

Create the core data models first to ensure type safety and consistency across the stack:

```python
# backend/app/schemas.py - SINGLE SOURCE OF TRUTH for all data models
from typing import Literal, List, Optional, Annotated
from pydantic import BaseModel, Field, ConfigDict, validator
from datetime import datetime

class Track(BaseModel):
    """Hip-hop track that samples another song."""
    model_config = ConfigDict(str_strip_whitespace=True)
    
    title: Annotated[str, Field(min_length=1, max_length=200)]
    artist: Annotated[str, Field(min_length=1, max_length=100)]
    year: Annotated[int, Field(ge=1900, le=2030)]
    youtube_id: Annotated[str, Field(pattern=r'^[a-zA-Z0-9_-]{11}$')]
    spotify_id: Optional[str] = Field(None, pattern=r'^[0-9A-Za-z]{22}$')

class Original(BaseModel):
    """Original song that was sampled."""
    title: str = Field(min_length=1, max_length=200)
    artist: str = Field(min_length=1, max_length=100)
    year: int = Field(ge=1900, le=2030)
    youtube_id: str = Field(pattern=r'^[a-zA-Z0-9_-]{11}$')
    spotify_id: Optional[str] = Field(None, pattern=r'^[0-9A-Za-z]{22}$')

class SampleMap(BaseModel):
    """Mapping between sampled track and original."""
    is_bass_sample: bool = True
    sample_type: Literal["direct", "interpolation", "replay"] = "direct"
    track_start_sec: Annotated[float, Field(ge=0)]
    original_start_sec: Annotated[float, Field(ge=0)]
    notes: Optional[str] = None

class BarMarker(BaseModel):
    """Timestamp marker for tab bars."""
    bar: Annotated[int, Field(ge=1)]
    start_sec: Annotated[float, Field(ge=0)]
    
    @validator('bar')
    @classmethod
    def validate_bar_number(cls, v):
        if v < 1:
            raise ValueError('Bar number must be >= 1')
        return v

class Tab(BaseModel):
    """ASCII bass tab with timing information."""
    tuning: Literal["EADG", "BEADG", "DADG", "CGCF"] = "EADG"
    difficulty: Annotated[int, Field(ge=1, le=5)]
    tab_text: Annotated[str, Field(min_length=10)]
    bars: List[BarMarker] = Field(min_items=1)

class PagePayload(BaseModel):
    """Complete payload for a track/sample pair page."""
    track: Track
    original: Original
    sample_map: SampleMap
    tab: Tab
```

### List of tasks to be completed to fulfill the PRP in the order they should be completed

```yaml
Task 1: "Setup Development Environment"
CREATE backend/requirements.txt:
  - Add FastAPI, Pydantic v2, Prisma, python-dotenv dependencies
  - Follow existing Python dependency patterns from use-cases/

CREATE backend/.env.example:
  - Template for DATABASE_URL, API keys
  - Reference use-cases/pydantic-ai/examples/main_agent_reference/settings.py

CREATE backend/venv_linux/ (virtual environment):
  - python -m venv venv_linux
  - Follow CLAUDE.md virtual environment rules

Task 2: "Create Core Pydantic Schema Models"
CREATE backend/app/schemas.py:
  - MIRROR pattern from: use-cases/pydantic-ai/examples/structured_output_agent/agent.py  
  - Implement all models: Track, Original, SampleMap, BarMarker, Tab, PagePayload
  - Use Pydantic v2 syntax with model_config = ConfigDict()
  - Add comprehensive Field validation and custom validators

Task 3: "Database Schema with Prisma"
CREATE backend/prisma/schema.prisma:
  - Design normalized schema for Artists, Tracks, Originals, Samples, Tabs
  - Use proper indexing for performance (artistId, youtubeId lookups)
  - JSON field for bar markers with proper typing
  - Follow PostgreSQL best practices for music data

CREATE backend/app/models.py:
  - Prisma client integration with FastAPI
  - Database connection management
  - Query builders for complex music relationships

Task 4: "FastAPI Backend with Schema Export"
CREATE backend/app/main.py:
  - MIRROR pattern from: FastAPI tutorial patterns
  - Configure CORS for Next.js integration
  - Add lifespan event for schema export
  - Configure security headers and error handling

CREATE backend/app/api/pairs.py:
  - GET /api/pairs/{slug} endpoint with response_model=PagePayload
  - Input validation with Pydantic slug pattern
  - Database queries using Prisma client
  - Error handling for 404/422 cases

CREATE backend/app/utils/schema_export.py:
  - Export PagePayload.model_json_schema() to JSON file
  - Create build integration for frontend type generation
  - Handle schema versioning and validation

Task 5: "Frontend TypeScript Type Generation"  
CREATE frontend/package.json:
  - Add datamodel-code-generator or pydantic-to-typescript
  - Build scripts for type generation from JSON Schema
  - Next.js, TypeScript, Tailwind, shadcn/ui dependencies

CREATE scripts/generate-types.sh:
  - Parse backend/schemas/*.json files
  - Generate frontend/types/schema.d.ts
  - Validate generated types compile correctly

Task 6: "Next.js App Structure with App Router"
CREATE frontend/app/layout.tsx:
  - Root layout with CSP headers for YouTube embeds
  - Tailwind CSS integration and global styles
  - Meta tags for SEO and social sharing

CREATE frontend/app/pairs/[slug]/page.tsx:
  - Server component for data fetching
  - Validate API response against generated types
  - Pass data to client components for interactivity

Task 7: "YouTube Video Player Components"
CREATE frontend/components/VideoPlayer.tsx:
  - 'use client' component with YouTube IFrame API integration
  - useEffect for API loading and player initialization
  - Synchronized seeking functionality with proper error handling
  - Follow YouTube API best practices from research

CREATE frontend/lib/youtube.ts:
  - YouTube API utilities and rate limiting
  - Video ID validation functions
  - Timestamp URL generation helpers

Task 8: "ASCII Tab Display with Bar Markers"
CREATE frontend/components/TabDisplay.tsx:
  - Monospace ASCII tab rendering with proper spacing
  - Clickable bar markers that trigger YouTube seeking
  - Responsive design for mobile tab scrolling
  - Syntax highlighting for tab notation

CREATE frontend/components/LoadingSkeleton.tsx:
  - Loading states for async video/tab loading
  - Skeleton UI matching final component dimensions

Task 9: "Integration and Security"
CREATE frontend/next.config.js:
  - Content Security Policy headers for YouTube
  - API proxy configuration for backend
  - Image optimization and security headers

CREATE backend/app/core/security.py:
  - Input sanitization for tab text and user inputs
  - YouTube ID validation functions  
  - Rate limiting middleware for API protection

Task 10: "Testing Suite"
CREATE backend/tests/test_schemas.py:
  - MIRROR pattern from: use-cases/pydantic-ai/examples/testing_examples/test_agent_patterns.py
  - Test all Pydantic model validation rules
  - Edge cases: invalid YouTube IDs, negative timestamps
  - JSON Schema export validation

CREATE backend/tests/test_api.py:
  - FastAPI endpoint testing with test client
  - Database integration tests with test fixtures
  - Error case handling (404, 422, 500)

CREATE frontend/__tests__/components.test.tsx:
  - Jest/React Testing Library component tests
  - YouTube player integration testing
  - Tab display rendering and interaction tests
```

### Per task pseudocode as needed added to each task

```python
# Task 2: Core Schema Implementation Pattern
class PagePayload(BaseModel):
    """Main payload following existing model patterns"""
    model_config = ConfigDict(
        str_strip_whitespace=True,
        validate_assignment=True,  # CRITICAL: Re-validate on assignment
        json_schema_extra={
            "examples": [{
                "track": {"title": "Juicy", "artist": "The Notorious B.I.G.", ...},
                "original": {"title": "Juicy Fruit", "artist": "Mtume", ...},
                # ... complete example
            }]
        }
    )
    
    track: Track
    original: Original  
    sample_map: SampleMap
    tab: Tab
    
    @validator('tab')
    @classmethod
    def validate_tab_sync(cls, v, values):
        # BUSINESS LOGIC: Ensure tab bars align with sample timing
        if 'sample_map' in values:
            start_time = values['sample_map'].original_start_sec
            if v.bars[0].start_sec != start_time:
                raise ValueError('First tab bar must align with sample start')
        return v

# Task 4: FastAPI Endpoint Pattern  
@app.get("/api/pairs/{slug}", response_model=PagePayload)
async def get_pair(
    slug: Annotated[str, Field(pattern=r'^[a-z0-9-]+$', max_length=100)]
) -> PagePayload:
    # PATTERN: Always validate input first (see existing API patterns)
    try:
        # GOTCHA: Use Prisma's include for relationships
        db_data = await prisma.sample.find_first_or_raise(
            where={"track": {"slug": slug}},
            include={"track": True, "original": True, "tab": True}
        )
        
        # PATTERN: Transform DB data to Pydantic model
        payload_data = transform_db_to_payload(db_data)
        
        # CRITICAL: Validate before returning
        return PagePayload.model_validate(payload_data)
        
    except RecordNotFoundError:
        raise HTTPException(status_code=404, detail="Track pair not found")
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())

# Task 7: YouTube Player Integration Pattern
useEffect(() => {
    const loadPlayer = () => {
        // PATTERN: Check if API already loaded
        if (!window.YT) {
            const script = document.createElement('script')
            script.src = 'https://www.youtube.com/iframe_api'
            document.body.appendChild(script)
            window.onYouTubeIframeAPIReady = initPlayer
        } else {
            initPlayer()
        }
    }
    
    const initPlayer = () => {
        playerRef.current = new window.YT.Player(containerRef.current, {
            videoId,
            playerVars: {
                start: Math.floor(startTime),
                origin: window.location.origin,  // CRITICAL for API access
                rel: 0,  // No related videos
                modestbranding: 1  // Clean UI
            },
            events: {
                onReady: () => setIsReady(true),
                onError: handlePlayerError  // MUST handle API errors
            }
        })
    }
    
    loadPlayer()
}, [videoId, startTime])
```

### Integration Points
```yaml
DATABASE:
  - migration: "Create music schema with proper indexes"
  - index: "CREATE INDEX idx_track_slug ON tracks(slug)"
  - index: "CREATE INDEX idx_youtube_lookup ON tracks(youtube_id)"
  
CONFIG:
  - add to: backend/app/core/config.py
  - pattern: "DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://...')"
  - env vars: "YOUTUBE_API_KEY, SPOTIFY_CLIENT_ID, WHOSAMPLED_API_KEY"
  
ROUTES:
  - add to: frontend/app routing  
  - pattern: "app/pairs/[slug]/page.tsx for dynamic routing"
  
BUILD:
  - add to: package.json scripts
  - pattern: "generate-types": "datamodel-code-generator --input backend/schemas/ --output frontend/types/"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Backend validation - run in venv_linux
cd backend && source venv_linux/bin/activate
python -m ruff check app/ --fix     # Auto-fix Python style issues
python -m mypy app/                 # Type checking for Python
python -c "from app.schemas import PagePayload; print('✓ Schemas import successfully')"

# Frontend validation  
cd frontend
npm run lint                        # ESLint for TypeScript
npm run type-check                  # TypeScript compiler check
npm run build --dry-run             # Verify build compiles

# Expected: No errors. If errors exist, READ the error message and fix systematically.
```

### Level 2: Unit Tests - create comprehensive test coverage
```python
# CREATE backend/tests/test_schemas.py
import pytest
from pydantic import ValidationError
from app.schemas import PagePayload, Track, SampleMap, BarMarker

def test_valid_page_payload():
    """Test complete valid payload creation"""
    payload_data = {
        "track": {
            "title": "Juicy",
            "artist": "The Notorious B.I.G.",
            "year": 1994,
            "youtube_id": "_JZom_gVfuw"
        },
        "original": {
            "title": "Juicy Fruit", 
            "artist": "Mtume",
            "year": 1983,
            "youtube_id": "vG0ZvhD6YKI"
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
    assert len(payload.tab.bars) == 1

def test_invalid_youtube_id_format():
    """Test YouTube ID validation catches invalid formats"""
    with pytest.raises(ValidationError, match="Invalid YouTube ID format"):
        Track(
            title="Test", artist="Test", year=2020,
            youtube_id="invalid_id"  # Wrong length/format
        )

def test_negative_timestamp_validation():
    """Test negative timestamps are rejected"""
    with pytest.raises(ValidationError):
        SampleMap(
            track_start_sec=-5.0,  # Invalid negative time
            original_start_sec=0.0
        )

def test_tab_bar_synchronization():
    """Test business logic validation for tab timing"""
    # This tests custom validator logic
    pass  # Implement based on business rules

def test_json_schema_export():
    """Verify JSON Schema export works correctly"""
    schema = PagePayload.model_json_schema()
    assert "properties" in schema
    assert "track" in schema["properties"]
    # Validate schema can be used for TypeScript generation
```

```bash
# Run backend tests
cd backend && source venv_linux/bin/activate
python -m pytest tests/ -v --cov=app/

# Run frontend tests  
cd frontend
npm test -- --coverage

# Expected: All tests pass. If failing: Read error, understand root cause, fix code, re-run
# NEVER mock away validation - fix the actual issue
```

### Level 3: Integration Test
```bash
# Start backend server
cd backend && source venv_linux/bin/activate  
python -m uvicorn app.main:app --reload --port 8000

# Start frontend dev server
cd frontend
npm run dev -- --port 3000

# Test the complete flow
curl -X GET http://localhost:8000/api/pairs/notorious-big-juicy \
  -H "Accept: application/json" \
  -H "User-Agent: BassTabSite/1.0"

# Expected Response:
# {
#   "track": {"title": "Juicy", "artist": "The Notorious B.I.G.", ...},
#   "original": {"title": "Juicy Fruit", "artist": "Mtume", ...},
#   "sample_map": {"sample_type": "direct", ...},
#   "tab": {"tuning": "EADG", "difficulty": 2, ...}
# }

# Test frontend integration
# Navigate to: http://localhost:3000/pairs/notorious-big-juicy
# Verify: YouTube videos load, tabs render, bar markers clickable
# If error: Check browser dev tools console, network tab, and backend logs
```

## Final validation Checklist
- [ ] All tests pass: `cd backend && python -m pytest tests/ -v`
- [ ] No linting errors: `cd backend && python -m ruff check app/`
- [ ] No type errors: `cd backend && python -m mypy app/`
- [ ] Frontend builds: `cd frontend && npm run build`
- [ ] Manual test successful: API endpoint returns valid JSON matching schema
- [ ] YouTube players load and seek correctly: Bar markers trigger video seeking
- [ ] ASCII tabs render properly: Monospace formatting preserved
- [ ] Security headers present: CSP allows YouTube embeds, blocks XSS
- [ ] Database queries optimized: Proper indexes, no N+1 queries
- [ ] Error cases handled gracefully: 404 for invalid slugs, validation errors
- [ ] Logs are informative but not verbose: No sensitive data in logs
- [ ] TypeScript types generated: Frontend uses auto-generated types from backend schemas

---

## Anti-Patterns to Avoid
- ❌ Don't skip schema validation - Always validate with Pydantic before database operations
- ❌ Don't create separate type definitions - Use single Pydantic schema as source of truth
- ❌ Don't ignore YouTube API errors - Implement proper error handling and fallbacks
- ❌ Don't hardcode video IDs or API keys - Use environment variables and validation
- ❌ Don't mix server/client components incorrectly - YouTube API needs client-side handling  
- ❌ Don't skip CSP headers - YouTube embeds require proper security configuration
- ❌ Don't create files > 500 lines - Follow CLAUDE.md file length limits
- ❌ Don't ignore virtual environment - Always use venv_linux for Python commands
- ❌ Don't forget database indexes - Music lookup queries need proper performance optimization
- ❌ Don't skip input sanitization - Validate and clean all user inputs including tab text

---

## Quality Assessment

**PRP Confidence Score: 9/10**

**Strengths:**
- Comprehensive context including all relevant documentation and existing code patterns
- Clear task breakdown with specific file creation and validation steps  
- Follows established project conventions (CLAUDE.md, virtual environments, testing)
- Includes both common pitfalls and library-specific gotchas
- Provides complete validation loops with executable commands
- Addresses security, performance, and maintainability concerns

**Potential Challenges:**
- Complex integration between multiple APIs (YouTube, Spotify, WhoSampled)
- YouTube IFrame API timing synchronization complexity
- Database schema optimization for music relationship queries

**Mitigation:**
- Detailed pseudocode for complex integration points
- Comprehensive testing strategy including edge cases
- Progressive implementation with validation at each step
- Extensive research documentation included for reference

This PRP provides sufficient context and validation mechanisms for successful one-pass implementation by an AI agent with access to the Claude Code environment.