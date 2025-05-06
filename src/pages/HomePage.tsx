import  { useState } from 'react';
import { Button } from '@mui/material';
import ContainedPage from './containedPage'; // Adjust the import path as necessary
import fullList from '../content/fullList.json'; // Import the JSON file

const HomePage = () => {
  
  const [positions, setPositions] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePositionsUpdate = (updatedPositions: { id: number; x: number; y: number }[]) => {
    setPositions(updatedPositions); // Update positions in HomePage
  };

  const handleSave = () => {
    console.log('Saved Positions:', positions); // Log saved positions
  };

  const handleReset = () => {
    setPositions([]); // Clear positions
    console.log('Reset Positions');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ContainedPage items={fullList} onPositionsUpdate={handlePositionsUpdate} /> {/* Pass fullList */}

      {/* Tracker display */}
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
        }}
      >
        {positions.map((pos) => (
          <div key={pos.id} style={{ textAlign: 'center' }}>
            <div>Item {pos.id}</div>
            <div>
              ({Math.round(pos.x)}, {Math.round(pos.y)})
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" color="primary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
