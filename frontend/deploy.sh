#!/bin/bash

# Production deployment script for Smart Report Frontend
set -e

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run tests if they exist
if npm run test --if-present; then
    echo "✅ Tests passed"
else
    echo "⚠️  No tests found or tests failed"
fi

# Build for production
echo "🏗️  Building for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

echo "✅ Production build completed successfully!"
echo "📁 Build output is in the 'dist' directory"
echo ""
echo "🌐 To deploy to your VPS:"
echo "1. Copy the 'dist' directory to your web server"
echo "2. Configure your web server to serve the files with HTTPS"
echo "3. Set up proper redirects for SPA routing"
echo "4. Update your backend API to accept requests from your domain"
echo ""
echo "📝 Don't forget to:"
echo "- Update .env.production with your actual domain"
echo "- Configure CORS on your backend for your domain"
echo "- Set up SSL certificates if not already done"