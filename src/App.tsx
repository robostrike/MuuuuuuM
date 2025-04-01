import { useState } from 'react';
import CartesianGrid from './CartesianGrid';
import { ThemeProvider } from '@mui/material/styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@mui/material';
import Theme from './theme';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import DatabaseTest from './components/DatabaseTest';
import GamePage from './pages/GamePage';

function App() {
  const [items, setItems] = useState<{ id: number; name: string; x: number; y: number }[]>([]);
  const [hoveredItem, setHoveredItem] = useState<{ id: number; name: string; x: number; y: number } | null>(null); // Include x and y

  const onSave = () => {
    localStorage.setItem('savedItems', JSON.stringify(items)); // Save items to local storage
    console.log('Items saved to local storage:', items);
  };

  const onReset = () => {
    setItems([]);
  };

  return (
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
        <Route path="/" element={
          <ThemeProvider theme={Theme}>
            <DndProvider backend={HTML5Backend}>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Bridges: Build or Burn</h1>
                <CartesianGrid items={items} setItems={setItems} setHoveredItem={setHoveredItem} /> 
                {/* Pass setHoveredItem */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <Button variant="contained" color="primary" onClick={onSave}>
                    Save
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={onReset}>
                    Reset
                  </Button>
                </div>
                {hoveredItem && (
                  <div style={{ marginTop: '10px', fontSize: '16px', color: 'gray' }}>
                    Hovering over: {hoveredItem.name} (ID: {hoveredItem.id}, X: {hoveredItem.x}, Y: {hoveredItem.y})
                  </div>
                )}
              </div>
            </DndProvider>
          </ThemeProvider>
        } />
        <Route path="/game" element={<GamePage />} />
        <Route path="/db-test" element={<DatabaseTest />} />
        {/* Add other routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;