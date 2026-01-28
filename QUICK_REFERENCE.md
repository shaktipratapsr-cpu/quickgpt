# QuickGPT - Quick Reference Card

## 🚀 Start Application (Windows)
```bash
double-click start.bat
```

Or manually:
```bash
# Terminal 1
cd server && npm run server

# Terminal 2 (new terminal)
cd client && npm run dev
```

## 🌐 URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Base**: http://localhost:3000/api

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `server/server.js` | Backend entry point |
| `client/src/services/api.js` | All API calls |
| `client/src/context/AppContext.jsx` | Global state |
| `client/src/pages/Login.jsx` | Authentication |
| `server/.env` | Backend config |
| `client/.env.local` | Frontend config |

## 🔐 Authentication

```javascript
// Login
const result = await userAPI.login(email, password);
localStorage.setItem('token', result.token);

// Get current user
const user = await userAPI.getUser();

// Logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

## 💬 Chat Operations

```javascript
// Get all chats
const chats = await chatAPI.getChats();

// Create new chat
const newChat = await chatAPI.createChat('Chat Title');

// Send message
const message = await messageAPI.sendMessage(chatId, 'Hello!');

// Get chat messages
const messages = await chatAPI.getChatMessages(chatId);
```

## 💳 Credits

```javascript
// Get credits balance
const credits = await creditAPI.getCredits();

// Buy credits
await creditAPI.buyCredits(100);
```

## 🐛 Debugging

### Backend Issues
- Check terminal for errors
- Verify MongoDB connection
- Check .env file is loaded
- Port 3000 should be free

### Frontend Issues
- Check browser console (F12)
- Verify .env.local has API_URL
- Clear localStorage if auth issues
- Hard refresh page (Ctrl+Shift+R)

### API Issues
- Backend must be running
- Check network tab in DevTools
- Verify token in localStorage
- Check request headers

## 📝 Common Tasks

### Add a new API endpoint
1. Create controller function in `server/controllers/`
2. Add route in `server/routes/`
3. Add function to API service in `client/src/services/api.js`
4. Import and use in component

### Handle API error
```javascript
try {
  const result = await userAPI.login(email, password);
  if (!result.success) {
    setError(result.message);
  }
} catch (error) {
  setError(error.message);
}
```

### Make protected API call
```javascript
// Token automatically added by api.js
const user = await userAPI.getUser();
// No need to add Authorization header manually
```

## 🔄 Environment Variables

**Backend (.env)**
```
PORT=3000
JWT_SECRET=shakti#secret
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=...
STRIPE_SECRET_KEY=...
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:3000/api
```

## ✅ Health Check

```bash
# Check backend is running
curl http://localhost:3000

# Should return: "Server is Live!"
```

## 📊 Project Structure

```
quickgpt/
├── server/
│   ├── server.js (main entry)
│   ├── .env (config)
│   ├── routes/ (API routes)
│   ├── controllers/ (business logic)
│   ├── models/ (database schemas)
│   └── configs/ (database, APIs)
│
└── client/
    ├── .env.local (config)
    ├── src/
    │   ├── services/api.js (API client)
    │   ├── context/AppContext.jsx (state)
    │   ├── pages/ (page components)
    │   ├── components/ (UI components)
    │   └── assets/ (images, styles)
    └── package.json
```

## 🎯 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔗 Important Links

- [CONNECTION_GUIDE.md](CONNECTION_GUIDE.md) - Full setup guide
- [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Verification steps
- [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) - Architecture overview

## 💡 Tips

1. **Always check browser console (F12)** for errors
2. **Monitor backend terminal** for request logs
3. **Clear localStorage** if auth issues: `localStorage.clear()`
4. **Hard refresh** browser if styles not updating: `Ctrl+Shift+R`
5. **Check MongoDB Atlas** network access if DB errors

## 🚨 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Port 3000 in use | Change PORT in .env or kill process using port |
| CORS error | Check corsOptions in server.js |
| Auth failing | Verify JWT_SECRET, clear localStorage, restart servers |
| API 404 | Check route path matches in routes/ and api.js |
| DB connection | Verify MONGODB_URI, check MongoDB Atlas |

---

**Ready to develop!** Start with `start.bat` and begin building. 🚀
