"""
API endpoints for track pairs.

Handles requests for track/sample pairs with bass tab information.
"""

from typing import Annotated, List
from fastapi import APIRouter, HTTPException, Depends, Path
from pydantic import ValidationError

from app.schemas import PagePayload, ErrorDetail
from app.models import InMemoryDatabase, get_database
from app.core.security import SecurityUtils
from app.core.config import settings

# Create router for pairs endpoints
router = APIRouter(prefix="/api/pairs", tags=["pairs"])


@router.get(
    "/{slug}",
    response_model=PagePayload,
    summary="Get track pair by slug",
    description="Retrieve a complete track pair with sample information and bass tab",
    responses={
        404: {"model": ErrorDetail, "description": "Track pair not found"},
        422: {"model": ErrorDetail, "description": "Invalid slug format"}
    }
)
async def get_pair(
    slug: Annotated[str, Path(
        description="URL-friendly identifier for the track pair",
        pattern=r"^[a-z0-9-]+$",
        max_length=100
    )],
    db: InMemoryDatabase = Depends(get_database)
) -> PagePayload:
    """
    Get a track pair by slug identifier.
    
    Returns complete information including:
    - Hip-hop track details (title, artist, YouTube ID, etc.)
    - Original sampled track details
    - Sample mapping with timestamps
    - ASCII bass tab with bar markers
    
    Args:
        slug: URL-friendly track pair identifier
        db: Database dependency
        
    Returns:
        Complete PagePayload with all track pair information
        
    Raises:
        HTTPException: 404 if track pair not found, 422 if invalid slug
    """
    try:
        # Sanitize the slug for security
        clean_slug = SecurityUtils.sanitize_slug(slug)
        
        # Retrieve from database
        pair_data = db.get_pair_by_slug(clean_slug)
        
        if pair_data is None:
            raise HTTPException(
                status_code=404,
                detail=f"Track pair not found: {clean_slug}"
            )
        
        # Validate data before returning (ensure data integrity)
        return PagePayload.model_validate(pair_data.model_dump())
        
    except ValueError as e:
        # Invalid slug format
        raise HTTPException(
            status_code=422,
            detail=SecurityUtils.get_safe_error_message(e, settings.debug)
        )
    except ValidationError as e:
        # Data validation failed
        raise HTTPException(
            status_code=500,
            detail="Internal data validation error"
        )
    except Exception as e:
        # Unexpected error
        raise HTTPException(
            status_code=500,
            detail=SecurityUtils.get_safe_error_message(e, settings.debug)
        )


@router.get(
    "/",
    response_model=List[str],
    summary="List all available track pairs",
    description="Get list of all track pair slug identifiers"
)
async def list_pairs(
    db: InMemoryDatabase = Depends(get_database)
) -> List[str]:
    """
    List all available track pair slugs.
    
    Returns:
        List of slug identifiers for available track pairs
    """
    try:
        return db.list_all_pairs()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=SecurityUtils.get_safe_error_message(e, settings.debug)
        )