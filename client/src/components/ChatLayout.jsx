import React, { useRef, useEffect } from 'react';
import logoLight from '../assets/logo.svg';
import logoDark from '../assets/logo.svg';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import './Chat.css';

const ChatLayout = ({ theme, chatId, messages = [], onSendMessage, onCreateChat, onShareImage }) => {
  const listRef = useRef(null);

  useEffect(() => {
    // scroll to bottom when new message
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (payload) => {
    // If no chat is selected, create a new chat and let parent set selectedChatId
    if (!chatId) {
      const newChat = onCreateChat ? onCreateChat(payload) : null;
      return;
    }

    if (typeof onSendMessage === 'function') onSendMessage(chatId, payload);
  };

  const isEmpty = !Array.isArray(messages) || messages.length === 0;

  return (
    <div className={`chat-main ${theme === 'dark' ? 'dark' : 'light'}`}>
      <div className="chat-center-container">
        {isEmpty ? (
          <div className="chat-hero">
            <img src={theme === 'dark' ? logoDark : logoLight} alt="QuickGPT logo" className="chat-logo" />
            <div className="chat-title">QuickGPT</div>
            <div className="chat-subtitle">Intelligent AI Assistant</div>
            <div className="chat-ask">Ask me anything.</div>
          </div>
        ) : (
          <div ref={listRef} className="chat-list">
            {messages.map(m => <MessageBubble key={m.id} role={m.role} text={m} onShare={onShareImage} />)}
          </div>
        )}
      </div>

      <ChatInput onSend={(t) => handleSend(t)} theme={theme} />
    </div>
  );
};

export default ChatLayout;
