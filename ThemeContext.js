import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme', error);
      // If AsyncStorage fails, we'll use the default theme (light mode)
    } finally {
      setIsThemeLoaded(true);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme', error);
      // If saving fails, we'll at least update the state for the current session
    }
  };

  const lightTheme = {
    background: '#F3F4F6',
    text: '#1F2937',
    secondaryText: '#6B7280',
    cardBackground: '#FFFFFF',
    borderColor: '#E5E7EB',
  };

  const darkTheme = {
    background: '#1F2937',
    text: '#F9FAFB',
    secondaryText: '#D1D5DB',
    cardBackground: '#374151',
    borderColor: '#4B5563',
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, isThemeLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);