import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ displayName: string | null; uid: string } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUser({ displayName: user.displayName, uid: user.uid });
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
      <AppBar position="fixed" color="secondary"> {/* Changed color to secondary */}
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MuuuuuuM
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Add an empty Toolbar to offset the fixed AppBar */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            <ListItem component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem component={Link} to="/single">
              <ListItemText primary="Single" />
            </ListItem>
          </List>
          <Box sx={{ p: 2 }}>
            {loggedInUser ? (
              <>
                <Typography variant="body1">
                  Welcome, {loggedInUser.displayName || 'User'}!
                </Typography>
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
