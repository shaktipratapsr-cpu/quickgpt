import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

const ChatInput = ({ onSend, theme }) => {
  const [value, setValue] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // auto-resize
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = '0px';
    ta.style.height = Math.min(160, ta.scrollHeight) + 'px';
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSend();
    }
  };

  const triggerSend = () => {
    if (!value.trim() && !imageFile) return;

    const textVal = value.trim();
    let payload;
    if (imageFile) {
      payload = { mode, text: textVal, image: imagePreview, file: imageFile };
    } else {
      payload = mode === 'prompt' ? { mode: 'prompt', text: textVal } : textVal;
    }
    onSend(payload);
    setValue('');
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSendClick = () => {
    triggerSend();
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setImageFile(f);
    };
    reader.readAsDataURL(f);
  };

  const [mode, setMode] = useState('text');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuDirection, setMenuDirection] = useState('down');
  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen(v => !v);
  const selectMode = (m) => { setMode(m); setMenuOpen(false); };

  // close on outside click and compute menu direction (up/down)
  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuOpen) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const computeDirection = () => {
      if (!dropdownRef.current) return;
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // estimate menu height ~ 120px
      setMenuDirection(spaceBelow < 120 && spaceAbove > spaceBelow ? 'up' : 'down');
    };
    if (menuOpen) computeDirection();
    document.addEventListener('click', onDocClick);
    window.addEventListener('resize', computeDirection);
    return () => {
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('resize', computeDirection);
    };
  }, [menuOpen]);

  return (
    <div className={`chat-input-wrap ${theme === 'dark' ? 'dark' : 'light'}`}>
      <div className="chat-input-inner">
        <div className="input-left-dropdown" ref={dropdownRef}>
          <button className="input-left-btn" onClick={toggleMenu} aria-haspopup="menu" aria-expanded={menuOpen}>
            {mode === 'text' ? 'Text' : 'Prompt'} ▾
          </button>
          {menuOpen && (
            <ul className={`input-left-menu ${menuDirection === 'up' ? 'up' : 'down'}`} role="menu">
              <li role="menuitem"><button onClick={() => selectMode('text')}>Text</button></li>
              <li role="menuitem"><button onClick={() => selectMode('prompt')}>Prompt</button></li>
            </ul>
          )}
        </div>
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder={mode === 'prompt' ? 'enter your prompt' : 'enter your message'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="chat-input-controls">
          <button className="chat-attach-btn" onClick={handleAttachClick} aria-label="Attach image">📎</button>
          <input ref={fileInputRef} type="file" accept="image/*" className="chat-attach-input" onChange={handleFileChange} />
        </div>

        <button
          className="chat-send-btn"
          onClick={handleSendClick}
          disabled={!value.trim() && !imageFile}
          aria-label="Send"
        >
          ➤
        </button>
      </div>

      {imagePreview ? (
        <div className="chat-attach-preview">
          <img src={imagePreview} alt="attachment preview" />
          <button className="chat-attach-remove" onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = null; }}>Remove</button>
        </div>
      ) : null}
    </div>
  );
};

export default ChatInput;
 
