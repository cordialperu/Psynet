#!/bin/bash

# Script para copiar el servidor compilado al directorio api para Vercel

echo "📦 Copying server build to api directory..."

# Create api/server directory
mkdir -p api/server

# Copy the compiled server files
cp -r dist/server/* api/server/ 2>/dev/null || echo "No dist/server found, will use source"

# If dist/server doesn't exist, copy source files
if [ ! -d "api/server" ] || [ -z "$(ls -A api/server)" ]; then
    echo "Copying source files instead..."
    cp -r server/* api/server/
fi

echo "✅ Server files ready for Vercel"
ls -la api/server/
