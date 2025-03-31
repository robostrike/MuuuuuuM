import { useState } from 'react';
import CartesianGrid from './CartesianGrid';
import { ThemeProvider } from '@mui/material/styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@mui/material';
import Theme from './theme';

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
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={Theme}>
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
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;