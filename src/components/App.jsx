import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';

import { AppState, useAppState } from '../providers/AppState.jsx';
import { AllTodoLists } from './AllTodoLists.jsx';
import { AppHeader } from './AppHeader.jsx';
import { CurrentTodoList } from './CurrentTodoList.jsx';

function ThemedApp() {
  const { darkMode } = useAppState();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppHeader />
        <AllTodoLists />
        <CurrentTodoList />
      </Box>
    </ThemeProvider>
  );
}

export function App() {
  return (
    <AppState>
      <ThemedApp />
    </AppState>
  );
}