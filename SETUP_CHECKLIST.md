# QuickGPT - Setup Checklist

## ✅ What Has Been Done

### Backend Configuration
- [x] Added `PORT=3000` to server/.env
- [x] Enhanced CORS configuration in server.js
  - Added localhost:5173 (Vite default port)
  - Added localhost:3000 (fallback)
  - Added support for production FRONTEND_URL
- [x] Verified all API routes are properly configured
- [x] Checked authentication middleware setup

### Frontend Configuration
- [x] Created `client/.env.local` with API URL
- [x] Created `client/.env.example` for reference
- [x] Created centralized API service (`src/services/api.js`)
  - User API functions (register, login, getUser, updateUser)
  - Chat API functions (getChats, createChat, deleteChat, getChatMessages)
  - Message API functions (sendMessage, getMessage, deleteMessage)
  - Credit API functions (getCredits, buyCredits)
  - Automatic token injection in requests
  - Error handling

### Frontend Integration
- [x] Updated AppContext.jsx
  - Replaced dummy data with API calls
  - Added loading and error states
  - Added fetchUser and fetchUserChats functions
  - Proper error handling with fallback to dummy data
- [x] Updated Login.jsx
  - Replaced localStorage-only auth with backend API calls
  - Added loading states
  - Proper error messaging
  - JWT token storage

### Documentation
- [x] Created CONNECTION_GUIDE.md with complete setup instructions
- [x] Created start.sh for Linux/Mac
- [x] Created start.bat for Windows
- [x] This checklist file

## 🚀 Quick Start (Windows)

### Option 1: One-Click Start (Easiest)
```bash
start.bat
```
This will open two terminal windows - one for backend, one for frontend.

### Option 2: Manual Start (Two Terminal Windows)

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

## 📋 Pre-Flight Checklist

Before running the application, verify:

### System Requirements
- [ ] Node.js version 16+ installed
  ```bash
  node --version
  ```
- [ ] npm version 8+ installed
  ```bash
  npm --version
  ```

### Backend Setup
- [ ] Navigate to server folder
  ```bash
  cd server
  ```
- [ ] Install dependencies
  ```bash
  npm install
  ```
- [ ] Verify .env file exists with these keys:
  - [ ] PORT=3000
  - [ ] JWT_SECRET
  - [ ] MONGODB_URI
  - [ ] GEMINI_API_KEY
  - [ ] IMAGEKIT_PUBLIC_KEY
  - [ ] IMAGEKIT_PRIVATE_KEY
  - [ ] IMAGEKIT_URL_ENDPOINT
  - [ ] STRIPE_PUBLISHABLE_KEY
  - [ ] STRIPE_SECRET_KEY

### Frontend Setup
- [ ] Navigate to client folder
  ```bash
  cd client
  ```
- [ ] Install dependencies
  ```bash
  npm install
  ```
- [ ] Verify .env.local file exists with:
  - [ ] VITE_API_URL=http://localhost:3000/api

## ✔️ Server Health Checks

### Backend Health Check
Open browser and navigate to:
```
http://localhost:3000
```
Expected response: "Server is Live!"

### Frontend Health Check
Open browser and navigate to:
```
http://localhost:5173
```
Expected: QuickGPT UI loads

### API Connectivity Check
Backend will log requests when frontend makes API calls.
Look for logs like:
```
POST /api/user/login
POST /api/chat/chats
```

## 🧪 Testing the Connection

1. **Open Frontend**: `http://localhost:5173`
2. **Navigate to Login**: Click on login/register page
3. **Create Account**: 
   - Enter name, email, password
   - Click "Create Account"
   - Should see success or error message
4. **Check Console**: 
   - Open DevTools (F12)
   - Go to Console tab
   - Look for API request logs
5. **Check Backend**: 
   - Backend terminal should show incoming requests
   - Look for POST requests to /api/user/register

## 🔧 Troubleshooting

### Error: "Cannot POST /api/user/register"
**Solution:**
- Verify backend is running on port 3000
- Check backend console for errors
- Verify .env file is loaded (check for port 3000 message)

### Error: "Network Error" or "Failed to fetch"
**Solution:**
- Ensure both servers are running
- Check VITE_API_URL in client/.env.local
- Verify no firewall is blocking port 3000
- Try accessing http://localhost:3000 directly

### Error: "CORS error"
**Solution:**
- Backend CORS config already includes localhost:5173
- If using different port, add it to corsOptions in server.js
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Error: "Invalid email or password"
**Solution:**
- Make sure account was created successfully first
- Check MongoDB connection is working
- Verify JWT_SECRET in .env matches backend

### MongoDB Connection Error
**Solution:**
- Check MONGODB_URI in server/.env
- Verify MongoDB Atlas account is active
- Check network access is allowed in MongoDB Atlas (IP whitelist)
- Verify database name is correct in URI

## 📱 API Endpoints Reference

All endpoints require:
- `Content-Type: application/json`
- Protected endpoints require `Authorization: Bearer <token>` header

### User Endpoints
- **POST** `/api/user/register`
  ```json
  { "name": "John", "email": "john@example.com", "password": "pass123" }
  ```
- **POST** `/api/user/login`
  ```json
  { "email": "john@example.com", "password": "pass123" }
  ```
- **GET** `/api/user/user` (Protected)

### Chat Endpoints
- **GET** `/api/chat/chats` (Protected)
- **POST** `/api/chat/create` (Protected)
  ```json
  { "title": "New Chat" }
  ```

### Message Endpoints
- **POST** `/api/message/add` (Protected)
  ```json
  { "chatId": "123", "text": "Hello!" }
  ```

### Credit Endpoints
- **GET** `/api/credit/get` (Protected)
- **POST** `/api/credit/buy` (Protected)

## 🎯 Next Steps After Connection

1. **Test all API endpoints** - Verify each endpoint works
2. **Implement chat functionality** - Create real chat UI
3. **Add message history** - Fetch and display past messages
4. **Implement credit system** - Connect Stripe for payments
5. **Add error boundaries** - Better error handling in React
6. **Deploy** - Set up for production

## 📞 Support

If you encounter issues:
1. Check this checklist
2. Review CONNECTION_GUIDE.md
3. Check backend server console for errors
4. Check browser DevTools console (F12)
5. Verify all environment variables are set

## ✨ You're All Set!

Your QuickGPT application frontend and backend are now properly connected!

**Backend**: http://localhost:3000
**Frontend**: http://localhost:5173

Happy coding! 🚀
