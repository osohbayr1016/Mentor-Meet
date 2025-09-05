#!/bin/bash

# Build script for Mentor Meet deployment
echo "🚀 Starting Mentor Meet build process..."

# Navigate to server directory
cd server

# Install dependencies
echo "📦 Installing server dependencies..."
npm install

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Verify build output
if [ -f "dist/index.js" ]; then
    echo "✅ Build successful! dist/index.js created."
    echo "📁 Build output:"
    ls -la dist/
else
    echo "❌ Build failed! dist/index.js not found."
    exit 1
fi

echo "🎉 Build process completed successfully!"
