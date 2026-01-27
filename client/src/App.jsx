
import React, { useState } from 'react';
import Sidebar from './components/SideBar';
import { mockChats } from './mockChats';
import { Routes, Route, Navigate } from 'react-router-dom';
import Community from './pages/Community';
import CommunityGallery from './pages/CommunityGallery';
import Credits from './pages/Credits';
import Login from './pages/Login';
import ChatLayout from './components/ChatLayout';
import ai1 from './assets/ai_image1.jpg';
import ai2 from './assets/ai_image2.jpg';
import ai3 from './assets/ai_image3.jpg';
import ai4 from './assets/ai_image4.jpg';
import ai5 from './assets/ai_image5.jpg';
import ai6 from './assets/ai_image6.jpg';
import ai7 from './assets/ai_image7.jpg';
import ai8 from './assets/ai_image8.jpg';
import ai9 from './assets/ai_image9.jpg';
import ai10 from './assets/ai_image10.jpg';
import ai11 from './assets/ai_image11.jpg';
import ai12 from './assets/ai_image12.jpg';
import imageMap from './data/imageMap.json';

const App = () => {
  // Theme state and persistence
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Simple auth state (demo): read user from localStorage if present
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try { localStorage.removeItem('user'); localStorage.removeItem('token'); } catch (e) {}
  };

  const [chats, setChats] = useState(mockChats || []);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [communityImages, setCommunityImages] = useState(() => {
    try {
      const raw = localStorage.getItem('communityImages');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  });

  const saveCommunityImage = (imagePayload) => {
    if (!imagePayload) return null;
    // imagePayload can be a data URL string or an object { image, text }
    const src = typeof imagePayload === 'string' ? imagePayload : (imagePayload.image || null);
    if (!src) return null;
    const item = {
      id: Date.now().toString(),
      src,
      text: (typeof imagePayload === 'object' && imagePayload.text) ? imagePayload.text : '',
      uploader: 'community',
      createdAt: Date.now(),
    };
    setCommunityImages(prev => {
      const next = [item, ...prev];
      try { localStorage.setItem('communityImages', JSON.stringify(next)); } catch (e) {}
      return next;
    });
    return item;
  };

  // Create a chat entry from a user's first message (title + preview)
  // text may be a string or an object payload from ChatInput ({ text, image, file })
  const createChatFromMessage = (payload) => {
    if (!payload) return null;
    let text = '';
    if (typeof payload === 'string') text = payload;
    else if (typeof payload === 'object') text = payload.text || '';

    const words = text.trim().split(/\s+/).filter(Boolean);
    const title = words.slice(0, 6).join(' ') || (payload && payload.image ? 'Image Chat' : 'New Chat');
    const preview = words.slice(0, 12).join(' ');
    const newChat = { id: Date.now().toString(), title, preview, createdAt: Date.now() };
    setChats(prev => [newChat, ...prev]);

    // set as selected
    setSelectedChatId(newChat.id);

    // initialize messages for this chat and add initial user message if any
    setMessagesByChat(prev => {
      const next = { ...prev };
      next[newChat.id] = [];
      if (typeof payload === 'string' && payload.trim()) {
        next[newChat.id].push({ id: Date.now().toString(), role: 'user', text: payload });
      } else if (typeof payload === 'object') {
        next[newChat.id].push({ id: Date.now().toString(), role: 'user', text: payload.text || '', image: payload.image || null });
      }
      return next;
    });

    // If payload contains an image, also save it to community images
    if (typeof payload === 'object' && (payload.image || typeof payload === 'object')) {
      if (payload.image) saveCommunityImage(payload);
    }

    return newChat;
  };
  const handleNewChat = () => {
    const newChat = { id: Date.now().toString(), title: 'New Chat', preview: '', createdAt: Date.now() };
    setChats(prev => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
    setMessagesByChat(prev => ({ ...prev, [newChat.id]: [] }));
    return newChat;
  };

  const deleteChat = (id) => {
    if (!id) return;
    setChats(prev => prev.filter(c => c.id !== id));
    setMessagesByChat(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (selectedChatId === id) setSelectedChatId(null);
  };

  const openChat = (id) => {
    setSelectedChatId(id);
  };

  const onSendMessage = (chatId, payload) => {
    if (!chatId) return;
    const msgId = Date.now().toString();
    const userMsg = { id: msgId, role: 'user', text: typeof payload === 'string' ? payload : (payload.text || ''), image: typeof payload === 'object' ? payload.image : null };
    setMessagesByChat(prev => {
      const next = { ...prev };
      next[chatId] = Array.isArray(next[chatId]) ? [...next[chatId], userMsg] : [userMsg];
      return next;
    });

    // update chat preview in recent chats list
    try {
      const previewText = typeof payload === 'string' ? payload : (payload.text || '');
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, preview: previewText } : c));
    } catch (e) {}

    // save image to community if provided
    if (typeof payload === 'object' && payload.image) saveCommunityImage(payload);
    // if payload is a prompt request, try to match to one of the ai images
    const aiImages = [ai1, ai2, ai3, ai4, ai5, ai6, ai7, ai8, ai9, ai10, ai11, ai12];

    const matchPromptToImage = (prompt) => {
      if (!prompt || typeof prompt !== 'string') return null;
      const p = prompt.toLowerCase();
      // check for explicit image number e.g., 'image 3' or 'ai_image7' or standalone digit
      const numMatch = p.match(/(?:image|ai_image)?\s*(?:#)?(\b[1-9]\b|1[0-2])/);
      if (numMatch && numMatch[1]) {
        const n = parseInt(numMatch[1], 10);
        if (n >=1 && n <= 12) return aiImages[n-1];
      }

      // simple keyword mapping (tweak as needed)
      // use editable mapping from src/data/imageMap.json
      try {
        // sort keywords by length desc so longer/more specific keywords match first
        const keys = Object.keys(imageMap || {}).sort((a, b) => b.length - a.length);
        const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        for (const kw of keys) {
          if (!kw) continue;
          const pattern = new RegExp('\\b' + escapeRegex(kw.toLowerCase()) + '\\b');
          if (pattern.test(p) || p.includes(kw.toLowerCase())) {
            const idx = Number(imageMap[kw]);
            if (!Number.isNaN(idx) && idx >= 1 && idx <= aiImages.length) return aiImages[idx - 1];
          }
        }
      } catch (e) {
        // fallback: no mapping
      }

      // no match
      return null;
    };

    if (typeof payload === 'object' && payload.mode === 'prompt') {
      const promptText = payload.text || '';
      const matched = matchPromptToImage(promptText);
      setTimeout(() => {
        setMessagesByChat(prev => {
          const next = { ...prev };
          const assistantMsg = matched ? { id: (Date.now()+1).toString(), role: 'assistant', image: matched } : { id: (Date.now()+1).toString(), role: 'assistant', text: "can't generate image" };
          next[chatId] = Array.isArray(next[chatId]) ? [...next[chatId], assistantMsg] : [assistantMsg];
          return next;
        });
      }, 700);
      return;
    }

    // simulate assistant reply for normal messages
    setTimeout(() => {
      const replyText = typeof payload === 'string' ? `Echo: ${payload}` : (payload.text ? `Echo: ${payload.text}` : 'Received image');
      const reply = { id: (Date.now()+1).toString(), role: 'assistant', text: replyText };
      setMessagesByChat(prev => {
        const next = { ...prev };
        next[chatId] = Array.isArray(next[chatId]) ? [...next[chatId], reply] : [reply];
        return next;
      });
    }, 700);
  };

  // If not authenticated, show the login at the landing route '/'
  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', background: theme === 'dark' ? '#18181b' : '#f3f4f6' }}>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    );
  }

  const sidebarName = currentUser?.email ? String(currentUser.email).split('@')[0] : (currentUser?.name || 'User');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: theme === 'dark' ? '#18181b' : '#f3f4f6' }}>
      <Sidebar theme={theme} setTheme={setTheme} chats={chats} onNewChat={handleNewChat} onOpenChat={openChat} onDeleteChat={deleteChat} activeId={selectedChatId} username={sidebarName} onLogout={handleLogout} credits={currentUser?.credits || 0} messagesByChat={messagesByChat} />
      <main style={{ flex: 1, marginLeft: 280, background: 'inherit', padding: 24 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/app" element={<ChatLayout theme={theme} chatId={selectedChatId} messages={messagesByChat[selectedChatId] || []} onSendMessage={onSendMessage} onCreateChat={createChatFromMessage} onShareImage={saveCommunityImage} />} />
          <Route path="/community" element={<Community gallery={communityImages} />} />
          <Route path="/community/gallery/:id" element={<CommunityGallery gallery={communityImages} />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
