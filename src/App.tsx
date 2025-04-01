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

function App() {
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
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/game">Game</Button>
                <Button color="inherit" component={Link} to="/db-test">DB Test</Button>
              </Toolbar>
            </AppBar>
          </Box>
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/db-test" element={<DatabaseTest />} />
            {/* Add other routes as needed */}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;