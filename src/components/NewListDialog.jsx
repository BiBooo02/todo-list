import * as Icons from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  ToggleButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useTodoLists } from '../hooks/useTodoLists.js';

export function NewListDialog({ dialogState }) {
  const [name, setName] = useState('');
  const [iconSearch, setIconSearch] = useState('');
  const [icon, setIcon] = useState('');
  const { newList } = useTodoLists();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const [filteredIcons, setFilteredIcons] = useState([]);

  useEffect(() => {
    setFilteredIcons(
      Object.entries(Icons)
        .filter(([iconName]) => !/Outlined$|TwoTone$|Rounded$|Sharp$/.test(iconName))
        .filter(([iconName]) =>
          iconSearch
            ? iconName.toLowerCase().includes(iconSearch.toLowerCase())
            : true
        )
        .slice(0, 9)
    );
  }, [iconSearch]);

  const reset = () => {
    setName('');
    setIconSearch('');
    setIcon('');
  };

  const handleClose = () => {
    reset();
    dialogState.close();
  };

  const handleCreate = () => {
    if (!name.trim()) {
      return;
    }
    void newList(name.trim(), icon);
    handleClose();
  };

  return (
    <Dialog
      open={dialogState.isOpen}
      onClose={handleClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="sm"
    >
      <DialogTitle>Create New List</DialogTitle>
      <DialogContent>
        <DialogContentText>Create a new list</DialogContentText>
        <TextField
          onChange={event => setName(event.target.value)}
          value={name}
          autoFocus
          margin="dense"
          id="new-list-name"
          label="New List"
          type="text"
          fullWidth
          variant="standard"
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleCreate();
            }
          }}
        />
        <TextField
          onChange={event => setIconSearch(event.target.value)}
          value={iconSearch}
          margin="dense"
          id="new-list-icon-search"
          label="Icon Search"
          type="text"
          fullWidth
          variant="standard"
        />
        <Card
          variant="outlined"
          sx={{
            mt: 1,
            p: 1,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {filteredIcons.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
              No icons found
            </Typography>
          ) : (
            filteredIcons.map(([iconName, IconComponent]) => (
              <Box
                sx={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 64,
                }}
                key={iconName}
              >
                <ToggleButton
                  value={iconName}
                  selected={iconName === icon}
                  onClick={() => setIcon(iconName)}
                >
                  <IconComponent />
                </ToggleButton>
                <Typography
                  variant="caption"
                  align="center"
                  noWrap
                  sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                  {iconName}
                </Typography>
              </Box>
            ))
          )}
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!name.trim()} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
