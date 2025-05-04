import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ email: string; uid: string } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUser({ email: user.email!, uid: user.uid });
      } else {
        setLoggedInUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('User ID:', user.uid);
        console.log('User Name:', user.displayName);
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out successfully.');
      })
      .catch((error) => {
        console.error('Error during sign out:', error);
      });
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
          </List>
          <Box sx={{ p: 2 }}>
            {loggedInUser ? (
              <>
                <Typography variant="body1">
                  Welcome, {loggedInUser.email.split('@')[0]}!
                </Typography>
                <Typography variant="body2">Email: {loggedInUser.email}</Typography>
                <Typography variant="body2">UID: {loggedInUser.uid}</Typography>
                <Button color="inherit" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button color="inherit" onClick={handleGoogleLogin}>
                Login with Google
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
