#!/bin/bash

# QuickGPT - Quick Start Script
# Run both frontend and backend servers

echo "╔════════════════════════════════════╗"
echo "║     QuickGPT - Starting Servers    ║"
echo "╚════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

echo -e "${BLUE}Step 1: Starting Backend Server...${NC}"
echo "Backend will run on http://localhost:3000"
echo ""

# Start backend in the background
cd server
npm run server &
BACKEND_PID=$!

# Give backend a moment to start
sleep 2

echo -e "${BLUE}Step 2: Starting Frontend Server...${NC}"
echo "Frontend will run on http://localhost:5173"
echo ""

# Start frontend
cd ../client
npm run dev

# If frontend closes, kill backend too
kill $BACKEND_PID

echo ""
echo -e "${GREEN}Servers stopped${NC}"
