import {
  Add,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { usePopupState } from 'material-ui-popup-state/hooks';

import { useAppState } from '../providers/AppState.jsx';
import { NewListDialog } from './NewListDialog.jsx';

export function AppHeader() {
  const dialogState = usePopupState({ variant: 'dialog', popupId: 'new-list' });
  const { setMobileDrawerOpen, darkMode, toggleDarkMode } = useAppState();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  return (
    <>
      <NewListDialog dialogState={dialogState} />
      <AppBar
        position="fixed"
        sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open list menu"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Lists
          </Typography>
          <IconButton
            size="large"
            color="inherit"
            aria-label="toggle dark mode"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="create new list"
            onClick={dialogState.open}
          >
            <Add />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}