


import React, { useState } from 'react';
import logoLight from '../assets/logo_full.svg';
import logoDark from '../assets/logo_full_dark.svg';
import { mockChats } from '../mockChats';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return 'a few seconds ago';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 172800) return 'a day ago';
  return new Date(date).toLocaleDateString();
}

const Sidebar = ({ onNewChat, onOpenChat, activeId, theme, setTheme, username = 'shakti', credits = 2, onLogout, chats, onDeleteChat, messagesByChat = {} }) => {
  const handleLogout = () => {
    try {
      // Clear common auth/session keys (adjust keys as your app uses)
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }

    if (typeof onLogout === 'function') {
      try { onLogout(); } catch (e) { console.error(e); }
    }

    // Redirect to landing (login) page
    try { navigate('/'); } catch (e) {}
  };
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleNewChatClick = () => {
    try {
      if (typeof onNewChat === 'function') onNewChat();
    } catch (e) {}
    try { navigate('/app'); } catch (e) {}
  };

  const handleGoHome = () => {
    try { navigate('/app'); } catch (e) {}
  };

  // Use chats passed from parent (App) or fallback to mockChats
  const chatsList = Array.isArray(chats) ? chats : mockChats;

  // Filtered chats: search title, preview, and full message history
  const q = (search || '').trim().toLowerCase();
  const filteredChats = chatsList.filter((chat) => {
    if (!q) return true;
    if ((chat.title || '').toLowerCase().includes(q)) return true;
    if ((chat.preview || '').toLowerCase().includes(q)) return true;
    try {
      const msgs = messagesByChat && messagesByChat[chat.id];
      if (Array.isArray(msgs)) {
        for (const m of msgs) {
          const txt = (m.text || m.content || m.message || '').toString().toLowerCase();
          if (txt && txt.includes(q)) return true;
        }
      }
    } catch (e) {}
    return false;
  });

  // Theme toggle handler
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside className={`sidebar${theme === 'dark' ? ' dark' : ''}`}> 
      {/* Logo and Title */}
      <div className="sidebar-brand" style={{ width: '100%', marginTop: '18px', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '100%',
          background: theme === 'light' ? '#fff' : 'transparent',
          borderRadius: '18px',
          padding: '8px 0',
          boxSizing: 'border-box',
          boxShadow: theme === 'light' ? '0 2px 8px 0 rgba(80,80,180,0.07)' : 'none',
          border: theme === 'light' ? '1px solid #e5e7eb' : 'none',
          filter: theme === 'light' ? 'drop-shadow(0 0 1px #bbb)' : 'none',
        }}>
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="QuickGPT Logo"
            className="sidebar-logo"
            style={{ width: '100%', height: 'auto', maxWidth: '240px', borderRadius: '18px', margin: '0 auto', display: 'block', cursor: 'pointer' }}
            onClick={handleGoHome}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleGoHome(); }}
          />
        </div>
      </div>
      {/* New Chat Button */}
      <button className="sidebar-newchat" onClick={handleNewChatClick}>
        <span className="sidebar-plus">+</span> New Chat
      </button>
      {/* Search Bar */}
      <div className="sidebar-search">
        <span className="sidebar-searchicon">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#888" strokeWidth="2"/><path d="M20 20l-3-3" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
        </span>
        <input
          className="sidebar-searchinput"
          type="text"
          placeholder="Search conversations"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Recent Chats */}
      <div className="sidebar-chats-section">
        <div className="sidebar-chats-heading">Recent Chats</div>
        <div className="sidebar-chats-list">
          {filteredChats.length === 0 ? (
            <div className="sidebar-chats-empty">No chats found</div>
          ) : (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                className={`sidebar-chatcard${activeId === chat.id ? ' active' : ''}`}
                onClick={() => { try { if (typeof onOpenChat === 'function') onOpenChat(chat.id); } catch (e) {} try { navigate('/app') } catch (e) {} }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { try { if (typeof onOpenChat === 'function') onOpenChat(chat.id); } catch (err) {} try { navigate('/app') } catch (err) {} } }}
              >
                <div className="sidebar-chat-meta">
                  <div className="sidebar-chat-title">{chat.title}</div>
                  {(() => {
                    const source = (chat.preview || chat.title || '').trim();
                    if (!source) return null;
                    const words = source.split(/\s+/);
                    const previewText = words.slice(0, 3).join(' ');
                    const more = words.length > 3 ? '...' : '';
                    return <div className="sidebar-chat-preview">{previewText}{more}</div>;
                  })()}
                </div>

                <div className="sidebar-chat-actions">
                  <div className="sidebar-chat-time">{timeAgo(chat.createdAt)}</div>
                  <button
                    className="sidebar-chat-delete"
                    onClick={(e) => { e.stopPropagation(); if (typeof onDeleteChat === 'function') onDeleteChat(chat.id); }}
                    aria-label={`Delete chat ${chat.title}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <button className="sidebar-bottom-btn" onClick={() => { try { navigate('/community') } catch(e){ } }}>
          <span style={{ fontSize: '1.3rem' }}>🖼️</span> Community Images
        </button>
        <div
          className="sidebar-bottom-credits"
          role="button"
          tabIndex={0}
          onClick={() => { try { navigate('/credits') } catch (e) {} }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { try { navigate('/credits') } catch (err) {} } }}
          aria-label="Open credits page"
        >
          <div>
            <div className="sidebar-bottom-credits-main"><span style={{ fontSize: '1.1rem' }}>💎</span> Credits : {credits}</div>
            <div className="sidebar-bottom-credits-sub">Purchase credits to use quickgpt</div>
          </div>
        </div>
        <div className="sidebar-bottom-toggle">
          <span style={{ fontSize: '1.2rem' }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
          <span className="sidebar-bottom-toggle-label">Dark Mode</span>
          <label className="sidebar-toggle-switch">
            <input type="checkbox" checked={theme === 'dark'} onChange={handleThemeToggle} aria-label="Toggle dark mode" />
            <span className="sidebar-toggle-slider"></span>
          </label>
        </div>
        <div className="sidebar-bottom-profile">
          <div className="sidebar-bottom-avatar">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="2"/><path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="#fff" strokeWidth="2"/></svg>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span className="sidebar-bottom-username">{username}</span>
            <button
              className="sidebar-logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
