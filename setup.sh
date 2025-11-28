#!/bin/bash

# Park Snake Game - Quick Start Script
# This script sets up and runs the MiniPay snake game locally

set -e

echo "🎮 Park Snake - MiniPay Game Setup"
echo "================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required (found: v$NODE_VERSION)"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo ""

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi

echo "✅ npm $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local..."
    cat > .env.local << EOF
# Network configuration
NEXT_PUBLIC_NETWORK=testnet

# RPC Endpoints
NEXT_PUBLIC_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_TESTNET_RPC_URL=https://alfajores-forno.celo-testnet.org
EOF
    echo "✅ .env.local created"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo ""
echo "1. Start the dev server:"
echo "   npm run dev"
echo ""
echo "2. Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "3. For MiniPay testing with ngrok:"
echo "   ngrok http 3000"
echo "   Then enter the ngrok URL in MiniPay Developer Settings"
echo ""
echo "4. Read the guides:"
echo "   - README.md: Quick overview"
echo "   - DEVELOPER_GUIDE.md: Complete development guide"
echo "   - DEPLOYMENT.md: Production deployment"
echo ""
echo "🎮 Let's build on Celo!"
