import * as Icons from '@mui/icons-material';
import { DeleteOutlineRounded } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useTodoLists } from '../hooks/useTodoLists.js';
import { useAppState } from '../providers/AppState.jsx';

const DRAWER_WIDTH = 280;

export function AllTodoLists() {
  const { data, isLoading, deleteList } = useTodoLists();
  const { currentList, setCurrentList, mobileDrawerOpen, setMobileDrawerOpen } =
    useAppState();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const [listPendingDelete, setListPendingDelete] = useState(null);

  useEffect(() => {
    if (!currentList && data.length > 0) {
      setCurrentList(data[0]?.id);
    }
  }, [currentList, data, setCurrentList]);

  const handleConfirmDelete = () => {
    if (!listPendingDelete) {
      return;
    }
    const wasCurrent = currentList === listPendingDelete.id;
    void deleteList(listPendingDelete.id);
    if (wasCurrent) {
      const remaining = data.filter(({ id }) => id !== listPendingDelete.id);
      setCurrentList(remaining[0]?.id ?? null);
    }
    setListPendingDelete(null);
  };

  const listContent = (
    <>
      <Toolbar />
      <List>
        {isLoading ? (
          <ListItem>
            <ListItemText primary="Loading lists…" />
          </ListItem>
        ) : data.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="No lists yet"
              secondary="Tap + to create one"
            />
          </ListItem>
        ) : (
          data.map(({ name, id, icon }) => {
            const Icon = Icons[icon];
            return (
              <ListItem
                key={id}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label={`delete list ${name}`}
                    onClick={event => {
                      event.stopPropagation();
                      setListPendingDelete({ id, name });
                    }}
                  >
                    <DeleteOutlineRounded fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => {
                    setCurrentList(id);
                    setMobileDrawerOpen(false);
                  }}
                  selected={currentList === id}
                  sx={{ pr: 6 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {Icon ? <Icon /> : <Icons.List />}
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            );
          })
        )}
      </List>
    </>
  );

  const deleteConfirmDialog = (
    <Dialog
      open={!!listPendingDelete}
      onClose={() => setListPendingDelete(null)}
    >
      <DialogTitle>Delete list?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Are you sure you want to delete "${listPendingDelete?.name}"? This will permanently delete the list and all its items.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setListPendingDelete(null)}>Cancel</Button>
        <Button onClick={handleConfirmDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (isMobile) {
    return (
      <>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {listContent}
        </Drawer>
        {deleteConfirmDialog}
      </>
    );
  }

  return (
    <>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {listContent}
      </Drawer>
      {deleteConfirmDialog}
    </>
  );
}