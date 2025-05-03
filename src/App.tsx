import { Button } from '@mui/material';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Theme from './theme';
import DatabaseTest from './components/DatabaseTest';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import FreeGrid from './pages/FreeGrid';
import FreeLocale from './pages/FreeLocale';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import ContainedPage from './pages/containedPage';

function App() {
  type User = {
    email: string;
    uid: string;
  } | null;

  const [loggedInUser, setLoggedInUser] = useState<User>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser({
          email: user.email || '',
          uid: user.uid,
        });
      } else {
        setLoggedInUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={Theme}>
        <BrowserRouter basename="/MuuuuuuM">
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  MuuuuuuM App
                </Typography>
                {loggedInUser && (
                  <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Typography variant="body1">
                      Welcome, {loggedInUser.email.split('@')[0]}!
                    </Typography>
                    <Typography variant="body2">
                      UID: {loggedInUser.uid}
                    </Typography>
                  </Box>
                )}
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/game">Game</Button>
                <Button color="inherit" component={Link} to="/db-test">DB</Button>
                <Button color="inherit" component={Link} to="/contain">Contain</Button>
              </Toolbar>
            </AppBar>
          </Box>
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/db-test" element={<DatabaseTest />} />
            <Route path="/grid" element={<FreeGrid />} />
            <Route path="/locale" element={<FreeLocale />} />
            <Route path="/contain" element={<ContainedPage />} />
            
            
            {/* Add other routes as needed */}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;