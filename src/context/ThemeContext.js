import React, { createContext, useContext } from 'react';

const THEME_VALUES = {
  colors: {
    themeColor: '#1a1a1a',  // Color de fondo negro
    textColor: '#ffffff',   // Texto blanco
    background: '#1a1a1a',  // Color de fondo
    text: '#ffffff'         // Texto
  }
};

export const ThemeContext = createContext(THEME_VALUES);

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={THEME_VALUES}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 