#!/usr/bin/env bash
# Park Snake - Play-to-Earn Game on Celo
# Quick Start Script

echo "🎮 Park Snake - Play-to-Earn Game"
echo "================================="
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

echo "✅ Node $(node --version) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Some dependencies may not have installed correctly"
fi
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo "   ⚠️  IMPORTANT: Add your contract address!"
else
    echo "✅ .env.local already exists"
fi
echo ""

# Build check
echo "🏗️  Building project..."
npm run build 2>&1 | tail -3
echo ""

# Start options
echo "🚀 Ready to start!"
echo ""
echo "Options:"
echo "  npm run dev     - Start development server (http://localhost:3000)"
echo "  npm run build   - Build for production"
echo "  npm start       - Run production build"
echo ""
echo "📚 Documentation:"
echo "  SETUP.md                  - 5-minute quick start"
echo "  CONTRACT_DEPLOY.md        - Deploy smart contract"
echo "  PLAY_TO_EARN.md          - Rewards mechanics"
echo "  CONTROLS.md              - Game controls"
echo "  IMPLEMENTATION_SUMMARY.md - Full feature list"
echo ""
echo "Start with: npm run dev"
echo ""
