# QuickGPT - Frontend & Backend Connection Guide

## Overview
Your QuickGPT application is now fully connected with proper API communication between the frontend (React/Vite) and backend (Node.js/Express).

## Project Structure

```
quickgpt/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js     # API service file (NEW)
│   │   ├── context/
│   │   │   └── AppContext.jsx  # Updated with API calls
│   │   ├── pages/
│   │   │   └── Login.jsx   # Updated with backend auth
│   │   └── ...
│   ├── .env.local         # Frontend environment variables (NEW)
│   └── package.json
└── server/                # Express Backend
    ├── .env              # Backend environment variables (UPDATED)
    ├── server.js         # Main server file (UPDATED with CORS)
    ├── routes/
    ├── controllers/
    └── models/
```

## Setup Instructions

### 1. Backend Setup

#### Step 1: Install Dependencies
```bash
cd server
npm install
```

#### Step 2: Verify Environment Variables
The `.env` file already contains all required configuration:
- `PORT=3000` (listening port)
- `JWT_SECRET` (for authentication)
- `MONGODB_URI` (database connection)
- API keys for Gemini, ImageKit, Stripe, etc.

#### Step 3: Start Backend Server
```bash
npm run server
```

You should see:
```
Server is running on port 3000
```

### 2. Frontend Setup

#### Step 1: Install Dependencies
```bash
cd client
npm install
```

#### Step 2: Verify Environment Variables
The `.env.local` file is already configured:
```
VITE_API_URL=http://localhost:3000/api
```

If you need to change the backend URL, edit this file.

#### Step 3: Start Frontend Development Server
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`

## API Endpoints

### User Routes (`/api/user`)
- **POST** `/register` - Register a new user
  ```
  Body: { name, email, password }
  Response: { success, token }
  ```
- **POST** `/login` - Login user
  ```
  Body: { email, password }
  Response: { success, token, user }
  ```
- **GET** `/user` - Get current user (requires auth)
  ```
  Headers: Authorization: Bearer <token>
  Response: { success, user }
  ```
- **PUT** `/update` - Update user (requires auth)
  ```
  Body: { name, email, ... }
  Response: { success, user }
  ```

### Chat Routes (`/api/chat`)
- **GET** `/chats` - Get all user chats (requires auth)
- **POST** `/create` - Create new chat (requires auth)
- **GET** `/:chatId` - Get chat messages (requires auth)
- **DELETE** `/:chatId` - Delete chat (requires auth)

### Message Routes (`/api/message`)
- **POST** `/add` - Send a message (requires auth)
- **GET** `/:messageId` - Get message
- **DELETE** `/:messageId` - Delete message (requires auth)

### Credit Routes (`/api/credit`)
- **GET** `/get` - Get user credits (requires auth)
- **POST** `/buy` - Purchase credits (requires auth)

## API Service Usage

The frontend uses a centralized API service (`src/services/api.js`) for all backend communication.

### Example Usage:

```javascript
import { userAPI, chatAPI, messageAPI, creditAPI } from '../services/api';

// User authentication
const loginResult = await userAPI.login('user@example.com', 'password');
if (loginResult.success) {
  localStorage.setItem('token', loginResult.token);
}

// Get chats
const chatsResult = await chatAPI.getChats();
const chats = chatsResult.chats;

// Send message
const messageResult = await messageAPI.sendMessage(chatId, 'Hello!');
```

## Authentication Flow

1. **Registration/Login**: User submits credentials via Login component
2. **Token Storage**: Backend returns JWT token, stored in localStorage
3. **Auto-authentication**: AppContext fetches user data on app load
4. **API Requests**: Token automatically included in Authorization header
5. **Error Handling**: Invalid tokens trigger logout

## Features Implemented

✅ **User Authentication**
- Registration with validation
- JWT-based login
- Automatic token persistence
- Protected API routes

✅ **API Service Layer**
- Centralized API communication
- Automatic token injection
- Error handling
- Request/response management

✅ **Context API Integration**
- User state management
- Chat management
- Theme persistence
- Loading & error states

✅ **CORS Configuration**
- Development environment setup
- Supports localhost:5173 (Vite default)
- Ready for production deployment

## Running Both Servers Simultaneously

### Option 1: Two Terminal Windows
Terminal 1 (Backend):
```bash
cd server
npm run server
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

### Option 2: Using npm-run-all (optional)
Install globally: `npm install -g npm-run-all`

Then from root directory:
```bash
npm-run-all --parallel "npm run server" "npm run dev"
```

## Testing the Connection

1. Open `http://localhost:5173` in your browser
2. Go to Login page
3. Register a new account
4. Should successfully create account and redirect to app
5. Check browser console for any API errors

## Troubleshooting

### "Cannot POST /api/user/register"
- Ensure backend server is running on port 3000
- Check that CORS is properly configured
- Verify routes are correctly defined in server

### "Network Error" or "Failed to fetch"
- Backend not running
- Check firewall settings
- Verify VITE_API_URL in `.env.local`

### "Invalid token"
- Token may be expired
- Clear localStorage and login again
- Check JWT_SECRET matches between frontend and backend

### CORS Error
- Backend CORS configuration may be blocking frontend origin
- Check server.js corsOptions
- Verify localhost:5173 is in allowed origins

## Database

MongoDB connection is configured in `.env`:
```
MONGODB_URI = mongodb+srv://shaktipratapsr_db_user:13Shaktidb4@cluster0.docn6c8.mongodb.net/
```

Ensure your MongoDB Atlas account is active and network access is allowed.

## Next Steps

1. **Test Authentication**: Verify login/register works
2. **Implement Chat Features**: Use chatAPI for real-time chat
3. **Add Message Handling**: Implement message sending/receiving
4. **Credit System**: Integrate payment processing
5. **Error Boundaries**: Add React error boundaries for better UX
6. **Loading States**: Implement skeleton loading screens
7. **Deployment**: Prepare for production deployment

## Environment Variables Cheat Sheet

### Backend (.env)
```
PORT=3000
JWT_SECRET=your_secret
MONGODB_URI=your_mongodb_url
GEMINI_API_KEY=your_key
STRIPE_SECRET_KEY=your_key
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_key
```

## Support

For detailed API responses and error handling, check the backend route files in `server/routes/` directory.
