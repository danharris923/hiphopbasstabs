# Hip Hop Bass Tabs

A full-stack web application showcasing hip-hop tracks alongside their original samples with synchronized bass tablature display. Built with schema-first development using Pydantic v2, FastAPI, and Next.js.

## Features

- **8 Classic Hip-Hop Tracks** with bass samples and tablature
- **YouTube Video Integration** with synchronized playback
- **ASCII Bass Tabs** with bright green terminal styling
- **Sample Information** showing original tracks and artists
- **Schema-First Development** with Pydantic v2 models
- **Automated Content Generation** via scraping infrastructure

## Tech Stack

- **Backend**: FastAPI, Pydantic v2, Python 3.11+
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Infrastructure**: Docker, Nginx
- **Data**: In-memory database with sample data

## Current Tracks

1. **Notorious B.I.G. - Juicy** → Mtume - Juicy Fruit
2. **Dr. Dre - Nuthin' But a 'G' Thang** → Leon Haywood - I Want'a Do Something Freaky to You
3. **Public Enemy - Fight the Power** → James Brown - Funky President
4. **Sugarhill Gang - Rapper's Delight** → Chic - Good Times
5. **2Pac - California Love** → Zapp - Dance Floor
6. **2Pac - I Get Around** → Zapp & Roger - Computer Love
7. **Wu-Tang Clan - C.R.E.A.M.** → The Charmels - As Long As I've Got You
8. **Wu-Tang Clan - Protect Ya Neck** → David Axelrod - Holy Thursday

## Quick Start

### Local Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

### Docker

```bash
# Start all services
docker-compose up --build

# Access the site
http://localhost
```

## API Endpoints

- `GET /api/pairs/` - List all track pairs
- `GET /api/pairs/{slug}` - Get specific track pair
- `GET /docs` - FastAPI documentation
- `GET /schemas/` - JSON schemas export

## Content Generation

The project includes automated scraping infrastructure:

```bash
cd scripts
python bass_sample_scraper.py --batch tracks_to_scrape.txt
```

### Track Database

- **100+ Classic Tracks** from 1990-2005 golden era
- **Multiple Regional Scenes** (East Coast, West Coast, South, Underground)
- **Chart Hits and Cultural Classics** with bass-heavy production

## Architecture

```
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── schemas.py # Pydantic models
│   │   ├── models.py  # In-memory database
│   │   └── main.py    # FastAPI app
│   └── Dockerfile
├── frontend/          # Next.js application
│   ├── app/           # App Router
│   ├── components/    # React components
│   └── Dockerfile
├── scripts/           # Content generation
│   └── bass_sample_scraper.py
└── docker-compose.yml
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add new tracks using the scraper infrastructure
4. Submit a pull request

## License

MIT License - See LICENSE file for details.

---

Built with Claude Code 🎵