#!/bin/bash

# Ensure we're in the project root
echo "🚀 Starting deployment process..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🛠️ Building project..."
npm run build

# Create deployment zip
echo "📦 Creating deployment package..."
cd dist
zip -r ../deploy.zip .
cd ..

echo "✅ Deployment package ready!"
echo "📋 Next steps:"
echo "1. Upload deploy.zip to Hostinger"
echo "2. Extract the contents to public_html"
echo "3. Ensure .htaccess file is present"
echo "4. Clear Hostinger's cache if needed" 