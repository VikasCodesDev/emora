#!/bin/bash

# EMORA Quick Start Script
# This script helps you get started quickly with EMORA

echo "🌟 ======================================"
echo "    EMORA - Quick Start Setup"
echo "======================================🌟"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if MongoDB is running
echo "Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
else
    echo "⚠️  MongoDB not found locally. You can use MongoDB Atlas instead."
fi

echo ""
echo "📦 Installing Dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend installation failed"
    exit 1
fi

cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

cd ..

echo ""
echo "✨ Installation Complete!"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Setup Environment Variables:"
echo "   - Copy backend/.env.example to backend/.env"
echo "   - Copy frontend/.env.local.example to frontend/.env.local"
echo "   - Add your API keys (OpenAI, Spotify, etc.)"
echo ""
echo "2. Start MongoDB (if running locally):"
echo "   mongod"
echo ""
echo "3. Start Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start Frontend (in new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For detailed setup instructions, see SETUP_GUIDE.md"
echo ""
echo "Happy coding! 🚀"
