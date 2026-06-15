import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppStateContext = createContext({
  currentList: null,
  setCurrentList: () => {},
  mobileDrawerOpen: false,
  setMobileDrawerOpen: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
});

const DARK_MODE_KEY = 'todo-app-dark-mode';

function getInitialDarkMode() {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
  } catch {
    // localStorage unavailable, fall back to system preference
  }
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  );
}

export function AppState({ children }) {
  const [currentList, setCurrentList] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    try {
      localStorage.setItem(DARK_MODE_KEY, String(darkMode));
    } catch {
      // ignore if localStorage is unavailable
    }
  }, [darkMode]);

  const value = useMemo(
    () => ({
      currentList,
      setCurrentList,
      mobileDrawerOpen,
      setMobileDrawerOpen,
      darkMode,
      toggleDarkMode: () => setDarkMode(prev => !prev),
    }),
    [currentList, mobileDrawerOpen, darkMode]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (context === undefined) {
    throw new Error('useAppState must be used within a AppStateProvider');
  }

  return context;
}