import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

type HeaderProps = {
  loggedInUser: { email: string; uid: string } | null;
};

const Header: React.FC<HeaderProps> = ({ loggedInUser }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MuuuuuuM App
          </Typography>
          
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            <ListItem component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem component={Link} to="/game">
              <ListItemText primary="Game" />
            </ListItem>
            <ListItem component={Link} to="/db-test">
              <ListItemText primary="DB" />
            </ListItem>
            <ListItem component={Link} to="/contain">
              <ListItemText primary="Contain" />
            </ListItem>
            <ListItem component={Link} to="/grid">
              <ListItemText primary="Grid" />
            </ListItem>
          </List>
          {loggedInUser && (
            <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Typography variant="body1">
                Welcome, {loggedInUser.email.split('@')[0]}!
              </Typography>
              <Typography variant="body2">UID: {loggedInUser.uid}</Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
