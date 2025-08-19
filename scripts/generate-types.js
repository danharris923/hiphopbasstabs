#!/usr/bin/env node

/**
 * Generate TypeScript types from JSON Schema
 * 
 * This script reads the JSON schemas exported by the backend
 * and generates TypeScript type definitions for the frontend.
 */

const fs = require('fs');
const path = require('path');

// Schema file paths
const BACKEND_SCHEMAS_DIR = path.join(__dirname, '..', 'backend', 'schemas');
const FRONTEND_TYPES_DIR = path.join(__dirname, '..', 'frontend', 'types');
const FRONTEND_SCHEMAS_DIR = path.join(__dirname, '..', 'frontend', 'schemas');

// Ensure frontend directories exist
if (!fs.existsSync(FRONTEND_TYPES_DIR)) {
  fs.mkdirSync(FRONTEND_TYPES_DIR, { recursive: true });
}

if (!fs.existsSync(FRONTEND_SCHEMAS_DIR)) {
  fs.mkdirSync(FRONTEND_SCHEMAS_DIR, { recursive: true });
}

/**
 * Convert JSON Schema to TypeScript interface
 */
function jsonSchemaToTypeScript(schema, typeName) {
  let tsInterface = `export interface ${typeName} {\n`;
  
  const properties = schema.properties || {};
  const required = schema.required || [];
  
  for (const [propName, propSchema] of Object.entries(properties)) {
    const isOptional = !required.includes(propName);
    const optionalMarker = isOptional ? '?' : '';
    
    let propType = getTypeScriptType(propSchema);
    
    // Add JSDoc comment if description exists
    if (propSchema.description) {
      tsInterface += `  /** ${propSchema.description} */\n`;
    }
    
    tsInterface += `  ${propName}${optionalMarker}: ${propType};\n`;
  }
  
  tsInterface += '}\n\n';
  return tsInterface;
}

/**
 * Convert JSON Schema property to TypeScript type
 */
function getTypeScriptType(propSchema) {
  // Handle union types (anyOf)
  if (propSchema.anyOf) {
    const types = propSchema.anyOf.map(subSchema => {
      if (subSchema.type === 'null') return 'null';
      return getTypeScriptType(subSchema);
    });
    return types.join(' | ');
  }
  
  // Handle references
  if (propSchema.$ref) {
    const refName = propSchema.$ref.split('/').pop();
    return refName;
  }
  
  // Handle arrays
  if (propSchema.type === 'array') {
    const itemType = getTypeScriptType(propSchema.items);
    return `${itemType}[]`;
  }
  
  // Handle enums
  if (propSchema.enum) {
    return propSchema.enum.map(val => `"${val}"`).join(' | ');
  }
  
  // Handle basic types
  switch (propSchema.type) {
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      return 'object';
    case 'null':
      return 'null';
    default:
      return 'any';
  }
}

/**
 * Process all schema files
 */
function generateTypes() {
  console.log('🔄 Generating TypeScript types from JSON Schema...');
  
  try {
    // Read the combined schema file
    const allSchemaPath = path.join(BACKEND_SCHEMAS_DIR, 'all.schema.json');
    
    if (!fs.existsSync(allSchemaPath)) {
      console.error('❌ Combined schema file not found. Run backend server first to generate schemas.');
      process.exit(1);
    }
    
    const allSchemaContent = fs.readFileSync(allSchemaPath, 'utf8');
    const allSchema = JSON.parse(allSchemaContent);
    
    // Copy schema files to frontend
    const schemaFiles = fs.readdirSync(BACKEND_SCHEMAS_DIR);
    for (const file of schemaFiles) {
      if (file.endsWith('.schema.json')) {
        const srcPath = path.join(BACKEND_SCHEMAS_DIR, file);
        const destPath = path.join(FRONTEND_SCHEMAS_DIR, file);
        fs.copyFileSync(srcPath, destPath);
        console.log(`📋 Copied ${file}`);
      }
    }
    
    // Generate TypeScript definitions
    let tsContent = `// Auto-generated TypeScript types from JSON Schema
// Generated on ${new Date().toISOString()}
// Do not edit manually - regenerate using npm run generate-types

`;
    
    // Process each schema definition
    const definitions = allSchema.definitions || {};
    for (const [typeName, schema] of Object.entries(definitions)) {
      tsContent += jsonSchemaToTypeScript(schema, typeName);
    }
    
    // Add utility types
    tsContent += `// Utility types
export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type ApiError = {
  error: string;
  detail?: string;
  timestamp: string;
};

// YouTube player types
export interface YouTubePlayer {
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  getCurrentTime(): number;
  getPlayerState(): number;
  destroy(): void;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string | HTMLElement, config: any) => YouTubePlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}
`;
    
    // Write TypeScript definitions
    const tsFilePath = path.join(FRONTEND_TYPES_DIR, 'schema.d.ts');
    fs.writeFileSync(tsFilePath, tsContent);
    
    console.log('✅ TypeScript types generated successfully!');
    console.log(`📁 Schema files copied to: ${FRONTEND_SCHEMAS_DIR}`);
    console.log(`🔧 Type definitions written to: ${tsFilePath}`);
    
  } catch (error) {
    console.error('❌ Error generating types:', error.message);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  generateTypes();
}

module.exports = { generateTypes };