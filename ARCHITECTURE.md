# QuickGPT Architecture Diagrams

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    QUICKGPT APPLICATION                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
│                 (React/Vite - Port 5173)                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Components                            │   │
│  │  ┌────────────────┬──────────────────┬────────────────┐  │   │
│  │  │  Login Page    │  Chat Page       │  Credits Page  │  │   │
│  │  └────────────────┴──────────────────┴────────────────┘  │   │
│  └────────────────────────────┬─────────────────────────────┘   │
│                               │                                   │
│  ┌────────────────────────────▼─────────────────────────────┐   │
│  │         AppContext (Global State)                        │   │
│  │  • user, chats, selectedChat, theme                      │   │
│  └────────────────────────────┬─────────────────────────────┘   │
│                               │                                   │
│  ┌────────────────────────────▼─────────────────────────────┐   │
│  │         API Service (api.js)                             │   │
│  │  • userAPI, chatAPI, messageAPI, creditAPI               │   │
│  │  • Auto token injection                                   │   │
│  │  • Error handling                                         │   │
│  └────────────────────────────┬─────────────────────────────┘   │
│                               │                                   │
│  ┌────────────────────────────▼─────────────────────────────┐   │
│  │         Fetch API                                        │   │
│  │  (Browser HTTP Client)                                   │   │
│  └────────────────────────────┬─────────────────────────────┘   │
└──────────────────────────────────┼─────────────────────────────┘
                                   │
                                   │ HTTP Requests
                                   │ JSON Responses
                                   │
┌──────────────────────────────────▼─────────────────────────────┐
│                        BACKEND LAYER                            │
│                    (Express - Port 3000)                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Express Server (server.js)                    │  │
│  │  • CORS Configuration                                    │  │
│  │  • Route Definitions                                     │  │
│  │  • Middleware Setup                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               API Routes                                 │  │
│  │  ┌────────────┬──────────────┬─────────────┐             │  │
│  │  │ /api/user  │ /api/chat    │ /api/message│             │  │
│  │  └────────────┴──────────────┴─────────────┘             │  │
│  └────────────────────────┬───────────────────────────────┘  │
│                           │                                    │
│  ┌────────────────────────▼───────────────────────────────┐  │
│  │           Controllers (Business Logic)                 │  │
│  │  ┌────────────┬──────────────┬─────────────┐           │  │
│  │  │ User       │ Chat         │ Message     │           │  │
│  │  │ Controller │ Controller   │ Controller  │           │  │
│  │  └────────────┴──────────────┴─────────────┘           │  │
│  └────────────────────────┬───────────────────────────────┘  │
│                           │                                    │
│  ┌────────────────────────▼───────────────────────────────┐  │
│  │            Authentication & Validation                 │  │
│  │  • JWT Token Verification                              │  │
│  │  • Password Hashing (bcryptjs)                          │  │
│  │  • Data Validation                                      │  │
│  └────────────────────────┬───────────────────────────────┘  │
│                           │                                    │
│  ┌────────────────────────▼───────────────────────────────┐  │
│  │            Models (Data Schema)                        │  │
│  │  ┌────────────┬──────────────┬─────────────┐           │  │
│  │  │ User       │ Chat         │ Message     │           │  │
│  │  │ Model      │ Model        │ Model       │           │  │
│  │  └────────────┴──────────────┴─────────────┘           │  │
│  └────────────────────────┬───────────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │
                               │ Database Queries
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    DATA LAYER                                │
│              (MongoDB Atlas - Cloud)                         │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MongoDB Collections                                 │   │
│  │  ┌──────────┬──────────┬──────────────────────────┐  │   │
│  │  │ users    │ chats    │ messages                 │  │   │
│  │  │ (auth)   │ (groups) │ (conversation history)   │  │   │
│  │  └──────────┴──────────┴──────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## 2. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                   USER AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────┐
│  User Opens    │
│  Application   │
└────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  App Initialization (App.jsx)                                   │
│  ↓                                                               │
│  AppContext loads from localStorage                            │
│  ├─ Check for 'token'                                          │
│  ├─ Check for 'user' data                                      │
│  └─ Call fetchUser() if token exists                           │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────┐        ┌───────────────────────┐
│   Token Found?           │        │  No Token Found       │
├──────────────────────────┤        ├───────────────────────┤
│  YES                     │        │  Redirect to Login    │
└──────────────────────────┘        └───────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  API Call: userAPI.getUser()                                    │
│  ├─ Send GET /api/user/user                                     │
│  └─ Add Authorization Header: Bearer {token}                    │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────┐        ┌─────────────────────────┐
│  Valid Token?        │        │  Invalid/Expired Token  │
├──────────────────────┤        ├─────────────────────────┤
│  YES                 │        │  Clear localStorage     │
└──────────────────────┘        │  Redirect to Login      │
        │                       └─────────────────────────┘
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  User Authenticated ✓                                           │
│  ├─ Set user in AppContext                                      │
│  ├─ Fetch user's chats                                          │
│  ├─ Grant access to protected pages                             │
│  └─ Store token in Authorization header                         │
└─────────────────────────────────────────────────────────────────┘

REGISTRATION/LOGIN FLOW:

┌─────────────────────┐
│  User Submits Form  │
│  (email, password)  │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Validate Input                  │
│  ├─ Email format                 │
│  ├─ Password strength            │
│  └─ Required fields              │
└──────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│  API Call: userAPI.register() or userAPI.login()               │
│  ├─ POST /api/user/register                                     │
│  │   { name, email, password }                                  │
│  │                                                              │
│  └─ POST /api/user/login                                        │
│      { email, password }                                        │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────┐        ┌──────────────────────────┐
│  Success?            │        │  Error Response          │
├──────────────────────┤        ├──────────────────────────┤
│  YES                 │        │  Display error message   │
│                      │        │  to user                 │
│  Backend returns:    │        └──────────────────────────┘
│  {                   │
│    success: true,    │
│    token: "jwt..."   │
│  }                   │
└──────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Save to localStorage                                            │
│  ├─ localStorage.token = "jwt..."                               │
│  └─ localStorage.user = { name, email, ... }                    │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│  Redirect to /app                                            │
│  ├─ AppContext auto-fetches user                            │
│  ├─ Chats are loaded                                        │
│  └─ User is fully authenticated                             │
└──────────────────────────────────────────────────────────────┘
```

## 3. API Request/Response Flow

```
┌─────────────────────────────────────────────────────────┐
│           TYPICAL API REQUEST/RESPONSE                  │
└─────────────────────────────────────────────────────────┘

FRONTEND:
┌─────────────────────────────────────────────────────┐
│ Component Code:                                     │
│ const result = await chatAPI.getChats();            │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ API Service (api.js):                              │
│ • Build URL: http://localhost:3000/api/chat/chats   │
│ • Add headers:                                      │
│   - Content-Type: application/json                  │
│   - Authorization: Bearer {token}                   │
│ • Make fetch request                               │
└─────────────────────────────────────────────────────┘
        │
        ▼
        │ HTTP GET /api/chat/chats
        │ Headers: {
        │   Authorization: Bearer eyJhbGc...
        │   Content-Type: application/json
        │ }
        │
BACKEND:
┌─────────────────────────────────────────────────────┐
│ Route Handler (server.js):                          │
│ app.get('/api/chat/chats', authMiddleware, ...)     │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ Auth Middleware:                                    │
│ • Extract token from Authorization header           │
│ • Verify JWT signature                              │
│ • Decode user ID from token                         │
│ • Attach user to request                            │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ Controller (chatController.js):                     │
│ export const getChats = async (req, res) => {       │
│   const userId = req.user.id;                       │
│   const chats = await Chat.find({ userId });       │
│   res.json({ success: true, chats });              │
│ }                                                   │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ MongoDB Query:                                      │
│ Chat.find({ userId: "user123" })                    │
│ ↓                                                   │
│ Returns: [{ id, title, messages }, ...]            │
└─────────────────────────────────────────────────────┘
        │
        ▼
        │ HTTP Response 200 OK
        │ {
        │   "success": true,
        │   "chats": [
        │     { "id": "123", "title": "Chat 1" },
        │     { "id": "456", "title": "Chat 2" }
        │   ]
        │ }
        │
FRONTEND:
┌─────────────────────────────────────────────────────┐
│ API Service:                                        │
│ • Check response status (200)                       │
│ • Parse JSON                                        │
│ • Check data.success                                │
│ • Return data to component                          │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ Component:                                          │
│ const result = await chatAPI.getChats();            │
│ if (result.success) {                              │
│   setChats(result.chats);                           │
│   // UI updates with new chats                      │
│ }                                                   │
└─────────────────────────────────────────────────────┘
```

## 4. Database Schema

```
┌──────────────────────────────────────────────────────────────────────┐
│                      MONGODB COLLECTIONS                             │
└──────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────┐
│        users Collection           │
├───────────────────────────────────┤
│ {                                 │
│   _id: ObjectId                   │
│   name: String                    │
│   email: String (unique)          │
│   password: String (hashed)       │
│   credits: Number                 │
│   createdAt: Date                 │
│   updatedAt: Date                 │
│ }                                 │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│       chats Collection            │
├───────────────────────────────────┤
│ {                                 │
│   _id: ObjectId                   │
│   userId: ObjectId (ref: users)   │
│   title: String                   │
│   createdAt: Date                 │
│   updatedAt: Date                 │
│ }                                 │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│      messages Collection          │
├───────────────────────────────────┤
│ {                                 │
│   _id: ObjectId                   │
│   chatId: ObjectId (ref: chats)   │
│   userId: ObjectId (ref: users)   │
│   text: String                    │
│   role: String (user/assistant)   │
│   createdAt: Date                 │
│ }                                 │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│      transactions Collection      │
├───────────────────────────────────┤
│ {                                 │
│   _id: ObjectId                   │
│   userId: ObjectId (ref: users)   │
│   credits: Number                 │
│   amount: Number (in currency)    │
│   type: String (purchase/usage)   │
│   createdAt: Date                 │
│ }                                 │
└───────────────────────────────────┘
```

## 5. File Organization

```
quickgpt/
│
├── server/
│   ├── server.js                    ← Express app entry point
│   ├── .env                         ← Configuration (PORT, KEYS, etc.)
│   ├── package.json
│   │
│   ├── configs/                     ← Configuration files
│   │   ├── db.js                    ← MongoDB connection
│   │   ├── openai.js                ← OpenAI API setup
│   │   └── imageKit.js              ← ImageKit setup
│   │
│   ├── routes/                      ← API routes
│   │   ├── userRoutes.js            ← /api/user
│   │   ├── chatRoutes.js            ← /api/chat
│   │   ├── messageRoutes.js         ← /api/message
│   │   └── creditRoutes.js          ← /api/credit
│   │
│   ├── controllers/                 ← Business logic
│   │   ├── userController.js
│   │   ├── chatController.js
│   │   ├── messageController.js
│   │   ├── creditController.js
│   │   └── webhooks.js              ← Stripe webhooks
│   │
│   ├── middlewares/                 ← Middleware functions
│   │   └── auth.js                  ← JWT authentication
│   │
│   ├── models/                      ← MongoDB schemas
│   │   ├── User.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   └── Transaction.js
│   │
│   └── thunder-tests/               ← API testing configs
│       └── thunderclient.json
│
├── client/
│   ├── .env.local                   ← Frontend config
│   ├── .env.example                 ← Example env
│   ├── package.json
│   ├── vite.config.js               ← Vite config
│   │
│   └── src/
│       ├── main.jsx                 ← React entry point
│       ├── App.jsx                  ← Root component
│       │
│       ├── services/                ← API services
│       │   └── api.js               ← All API calls
│       │
│       ├── context/                 ← Global state
│       │   └── AppContext.jsx       ← State management
│       │
│       ├── pages/                   ← Page components
│       │   ├── Login.jsx
│       │   ├── Community.jsx
│       │   └── Credits.jsx
│       │
│       ├── components/              ← Reusable components
│       │   ├── ChatBox.jsx
│       │   ├── ChatInput.jsx
│       │   ├── ChatWindow.jsx
│       │   ├── Message.jsx
│       │   └── SideBar.jsx
│       │
│       ├── assets/                  ← Images & data
│       │   ├── assets.js
│       │   └── images...
│       │
│       └── data/                    ← Static data
│           └── imageMap.json
│
├── CONNECTION_GUIDE.md              ← Setup instructions
├── SETUP_CHECKLIST.md               ← Verification steps
├── INTEGRATION_SUMMARY.md           ← Architecture overview
├── QUICK_REFERENCE.md               ← Quick reference
├── start.bat                        ← Windows startup script
├── start.sh                         ← Linux/Mac startup script
└── README.md
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Scalable and maintainable code
✅ Secure authentication
✅ Proper error handling
✅ Easy to test and extend
