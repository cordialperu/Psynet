#!/bin/bash

echo "🚂 Setting up Railway deployment for PsyNet"
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
else
    echo "✅ Railway CLI already installed"
fi

echo ""
echo "🔐 Logging in to Railway..."
echo "   (A browser window will open for authentication)"
railway login

echo ""
echo "🎯 Creating new Railway project..."
railway init

echo ""
echo "⚙️  Setting environment variables..."
echo ""

# Read from .env file
if [ -f .env ]; then
    DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2-)
    WHATSAPP=$(grep "^VITE_WHATSAPP_PHONE_NUMBER=" .env | cut -d '=' -f2-)
    SESSION_SECRET=$(grep "^SESSION_SECRET=" .env | cut -d '=' -f2-)
    MASTER_CODE=$(grep "^MASTER_CODE=" .env | cut -d '=' -f2-)

    echo "Setting DATABASE_URL..."
    railway variables set DATABASE_URL="$DATABASE_URL"
    
    echo "Setting VITE_WHATSAPP_PHONE_NUMBER..."
    railway variables set VITE_WHATSAPP_PHONE_NUMBER="$WHATSAPP"
    
    echo "Setting SESSION_SECRET..."
    railway variables set SESSION_SECRET="$SESSION_SECRET"
    
    echo "Setting MASTER_CODE..."
    railway variables set MASTER_CODE="$MASTER_CODE"
    
    echo "Setting PORT..."
    railway variables set PORT="5001"
    
    echo "Setting NODE_ENV..."
    railway variables set NODE_ENV="production"
else
    echo "⚠️  No .env file found. You'll need to set variables manually:"
    echo ""
    echo "railway variables set DATABASE_URL=<your-database-url>"
    echo "railway variables set VITE_WHATSAPP_PHONE_NUMBER=<your-whatsapp>"
    echo "railway variables set SESSION_SECRET=<your-secret>"
    echo "railway variables set MASTER_CODE=333"
    echo "railway variables set PORT=5001"
    echo "railway variables set NODE_ENV=production"
fi

echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 To view your app:"
echo "   railway open"
echo ""
echo "📝 To view logs:"
echo "   railway logs"
echo ""
echo "🌐 To add a custom domain:"
echo "   railway domain"
echo ""
echo "🎉 Your app is now running with ALL your publications!"
