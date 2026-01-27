// chatStore.js - handles chat data persistence in localStorage

export const CHAT_KEY = 'quickgpt_chats';

export function getChats() {
  const data = localStorage.getItem(CHAT_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveChats(chats) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(chats));
}

export function addChat(chat) {
  const chats = getChats();
  chats.unshift(chat);
  saveChats(chats);
}

export function updateChat(id, update) {
  const chats = getChats().map(chat => chat.id === id ? { ...chat, ...update } : chat);
  saveChats(chats);
}

export function deleteChat(id) {
  const chats = getChats().filter(chat => chat.id !== id);
  saveChats(chats);
}
