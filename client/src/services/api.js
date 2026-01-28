// API service for all backend communication
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to handle API requests
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// User API endpoints
export const userAPI = {
  register: (name, email, password) =>
    apiCall('/user/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    apiCall('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getUser: () => apiCall('/user/user', { method: 'GET' }),

  updateUser: (updates) =>
    apiCall('/user/update', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};

// Chat API endpoints
export const chatAPI = {
  getChats: () => apiCall('/chat/chats', { method: 'GET' }),

  createChat: (title) =>
    apiCall('/chat/create', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  deleteChat: (chatId) =>
    apiCall(`/chat/${chatId}`, { method: 'DELETE' }),

  getChatMessages: (chatId) =>
    apiCall(`/chat/${chatId}`, { method: 'GET' }),
};

// Message API endpoints
export const messageAPI = {
  sendMessage: (chatId, text) =>
    apiCall('/message/add', {
      method: 'POST',
      body: JSON.stringify({ chatId, text }),
    }),

  getMessage: (messageId) =>
    apiCall(`/message/${messageId}`, { method: 'GET' }),

  deleteMessage: (messageId) =>
    apiCall(`/message/${messageId}`, { method: 'DELETE' }),
};

// Credit API endpoints
export const creditAPI = {
  getCredits: () => apiCall('/credit/get', { method: 'GET' }),

  buyCredits: (credits) =>
    apiCall('/credit/buy', {
      method: 'POST',
      body: JSON.stringify({ credits }),
    }),
};

export default apiCall;
