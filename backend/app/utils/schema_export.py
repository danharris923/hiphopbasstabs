"""
JSON Schema export utility for TypeScript type generation.

This module exports Pydantic models to JSON Schema files that can be used
to generate TypeScript types for the frontend, ensuring type safety across
the full stack.
"""

import json
from pathlib import Path
from typing import Dict, Any

from app.schemas import PagePayload, Track, Original, SampleMap, Tab, BarMarker, ErrorDetail, HealthCheck


def export_schemas(output_dir: str = "schemas") -> None:
    """
    Export all Pydantic schemas to JSON Schema files.
    
    Args:
        output_dir: Directory to output schema files (relative to backend root)
    """
    schema_dir = Path(output_dir)
    schema_dir.mkdir(exist_ok=True)
    
    # Define models to export
    models = {
        "page_payload": PagePayload,
        "track": Track,
        "original": Original,
        "sample_map": SampleMap,
        "tab": Tab,
        "bar_marker": BarMarker,
        "error_detail": ErrorDetail,
        "health_check": HealthCheck,
    }
    
    # Export each model
    for name, model in models.items():
        schema = model.model_json_schema()
        
        # Add metadata for better TypeScript generation
        schema["$id"] = f"https://basstabs.com/schemas/{name}"
        schema["title"] = model.__name__
        schema["description"] = model.__doc__ or f"{model.__name__} schema"
        
        # Write schema file
        schema_file = schema_dir / f"{name}.schema.json"
        with open(schema_file, "w", encoding="utf-8") as f:
            json.dump(schema, f, indent=2, ensure_ascii=False)
        
        print(f"Exported schema: {schema_file}")
    
    # Create a combined schema file for all models
    combined_schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://basstabs.com/schemas/all",
        "title": "Bass Tab Site Schemas",
        "description": "All schemas for the Bass Tab Site application",
        "definitions": {}
    }
    
    for name, model in models.items():
        combined_schema["definitions"][name] = model.model_json_schema()
    
    combined_file = schema_dir / "all.schema.json"
    with open(combined_file, "w", encoding="utf-8") as f:
        json.dump(combined_schema, f, indent=2, ensure_ascii=False)
    
    print(f"Exported combined schema: {combined_file}")


def validate_schema_generation() -> bool:
    """
    Validate that all schemas can be generated without errors.
    
    Returns:
        True if all schemas generate successfully, False otherwise
    """
    try:
        models = [PagePayload, Track, Original, SampleMap, Tab, BarMarker, ErrorDetail, HealthCheck]
        
        for model in models:
            schema = model.model_json_schema()
            
            # Basic validation checks
            required_fields = ["type", "properties"]
            for field in required_fields:
                if field not in schema:
                    print(f"ERROR: {model.__name__} schema missing required field: {field}")
                    return False
            
            print(f"OK {model.__name__} schema generated successfully")
        
        return True
        
    except Exception as e:
        print(f"ERROR: Schema validation failed: {e}")
        return False


if __name__ == "__main__":
    print("=== JSON Schema Export ===")
    
    # Validate schemas first
    if validate_schema_generation():
        print("\n=== Exporting Schemas ===")
        export_schemas()
        print("\nOK Schema export completed successfully")
    else:
        print("\nERROR Schema validation failed - export aborted")
        exit(1)