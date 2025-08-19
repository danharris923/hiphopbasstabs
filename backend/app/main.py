"""
FastAPI main application.

This is the entry point for the Bass Tab Site API, providing endpoints
for track pairs with sample information and bass tabs.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.schemas import HealthCheck, ErrorDetail
from app.api.pairs import router as pairs_router
from app.utils.schema_export import export_schemas


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan handler.
    
    Handles startup and shutdown tasks including schema export.
    """
    # Startup tasks
    print(f"Starting {settings.app_name} v{settings.app_version}")
    
    # Export JSON schemas for TypeScript generation
    try:
        export_schemas()
        print("OK JSON schemas exported successfully")
    except Exception as e:
        print(f"WARNING Schema export failed: {e}")
    
    yield
    
    # Shutdown tasks
    print("Shutting down Bass Tab Site API")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    WhoSampled-style Bass Tab Site API
    
    This API provides information about hip-hop tracks and their original samples,
    including synchronized bass tabs with timestamp markers for learning and analysis.
    
    ## Features
    
    * **Track Pairs**: Hip-hop tracks paired with their original samples
    * **Bass Tabs**: ASCII bass tab notation with timing information
    * **YouTube Integration**: Video IDs for synchronized playback
    * **Schema-First**: Pydantic models with JSON Schema export for TypeScript
    
    ## Usage
    
    1. Get list of available track pairs: `GET /api/pairs/`
    2. Get specific track pair: `GET /api/pairs/{slug}`
    3. Use the returned data to render synchronized YouTube players and bass tabs
    """,
    contact={
        "name": "Bass Tab Site",
        "url": "https://github.com/your-repo/bass-tab-site",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    lifespan=lifespan
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,  # No authentication required for this demo
    allow_methods=["GET"],    # Only GET requests needed
    allow_headers=["Accept", "Content-Type", "User-Agent"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Include API routers
app.include_router(pairs_router)


@app.get(
    "/health",
    response_model=HealthCheck,
    summary="Health check endpoint",
    description="Check if the API is running and healthy"
)
async def health_check() -> HealthCheck:
    """
    Health check endpoint.
    
    Returns:
        Health status information
    """
    return HealthCheck(status="ok", version=settings.app_version)


@app.get(
    "/",
    summary="API information",
    description="Get basic API information and available endpoints"
)
async def root():
    """
    Root endpoint with API information.
    
    Returns:
        Basic API information and links
    """
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "description": "WhoSampled-style Bass Tab Site API",
        "endpoints": {
            "health": "/health",
            "pairs": "/api/pairs/",
            "docs": "/docs",
            "openapi": "/openapi.json"
        },
        "features": [
            "Track pair information with sample details",
            "ASCII bass tabs with timing markers", 
            "YouTube video integration",
            "Schema-first development with TypeScript generation"
        ]
    }


# Global exception handler for unhandled errors
@app.exception_handler(500)
async def internal_server_error_handler(request, exc):
    """Handle internal server errors gracefully."""
    return JSONResponse(
        status_code=500,
        content=ErrorDetail(
            error="Internal Server Error",
            detail="An unexpected error occurred"
        ).model_dump()
    )


# Custom 404 handler
@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors with consistent format."""
    return JSONResponse(
        status_code=404,
        content=ErrorDetail(
            error="Not Found",
            detail="The requested resource was not found"
        ).model_dump()
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )