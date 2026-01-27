import React from 'react';
import './Chat.css';

const MessageBubble = ({ role = 'assistant', text, onShare }) => {
  const isUser = role === 'user';
    // message can be a string or an object { text?, image? }
    const message = typeof text === 'string' ? text : text?.text;
    const image = typeof text === 'object' && text?.image ? text.image : null;

    const handleShare = () => {
      if (!onShare) return;
      const confirmed = typeof window !== 'undefined' ? window.confirm('Share this image to community?') : true;
      if (!confirmed) return;
      try {
        onShare({ image, text: message });
        if (typeof window !== 'undefined') window.alert('Image shared to community');
      } catch (e) {}
    };

    return (
      <div className={`msg-row ${isUser ? 'msg-row-user' : 'msg-row-assistant'}`}>
        <div className={`msg-bubble ${isUser ? 'user' : 'assistant'}`}>
          <div className="msg-content">
            {image ? (
              <div className="msg-image-wrap">
                <img className="msg-image" src={image} alt="attachment" />
                {role !== 'user' ? <button className="msg-share-btn" onClick={handleShare}>Share</button> : null}
              </div>
            ) : null}
            {message ? <div className="msg-text">{message}</div> : null}
          </div>
        </div>
      </div>
    );
};

export default MessageBubble;
