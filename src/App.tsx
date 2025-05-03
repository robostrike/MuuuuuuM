import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Theme from './theme';
import DatabaseTest from './components/DatabaseTest';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import FreeGrid from './pages/FreeGrid';
import FreeLocale from './pages/FreeLocale';
import Grid from './pages/containPage2';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import ContainedPage from './pages/containedPage';
import Header from './components/Header';

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
          <Header loggedInUser={loggedInUser} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/db-test" element={<DatabaseTest />} />
            <Route path="/grid" element={<FreeGrid />} />
            <Route path="/locale" element={<FreeLocale />} />
            <Route path="/contain" element={<ContainedPage />} />
            <Route path="/grid" element={<Grid />} />
            {/* Add other routes as needed */}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;