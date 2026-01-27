import { createContext, useContext, useDebugValue, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {dummyChats, dummyUserData} from '../assets/assets'

const AppContext = createContext();


export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Placeholder for user state management
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'light');

  // Persist theme to localStorage and update state
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  } 

  const fetchUser= async () => {
    setUser(dummyUserData)

  }

  const fetchUserChats= async () => {
    setChats(dummyChats)
    setSelectedChat(dummyChats[0])
  }

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme])

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user])
  useEffect(() => {
    fetchUser();
  }, [])
  const value={
    navigate,user, setUser, chats, setChats,
    selectedChat, setSelectedChat,
    theme, setTheme
  }
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )}

  export const useAppContext = () => useContext(AppContext);