import React from 'react';

const ChatWindow = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#18181b]">
      {messages.length === 0 ? (
        <div className="text-gray-400 text-center mt-20">Start a new conversation...</div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-lg shadow text-sm ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-[#23232a] text-gray-900 dark:text-gray-100'}`}>
                {msg.content}
                <div className="text-[10px] text-right text-gray-400 mt-1">{new Date(msg.time).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
