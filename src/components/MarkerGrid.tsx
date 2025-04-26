import { useRef, useState } from 'react';
import { Box, Paper } from '@mui/material';

// Grid settings
const gridSize = 20; // Grid spacing in pixels
const gridWidth = 500; // Total width of the grid
const gridHeight = 500; // Total height of the grid

interface MarkerGridProps {
  onPlaceMarker: (x: number, y: number) => void;
  markerPosition: { x: number, y: number } | null;
  disabled?: boolean;
  data: { id: number; name: string; x: number; y: number }[]; // Define the data prop
}

const MarkerGrid: React.FC<MarkerGridProps> = ({ onPlaceMarker, markerPosition, disabled = false, data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  // Handle click on grid to place marker
  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate position relative to grid center
      const rawX = e.clientX - rect.left - gridWidth / 2;
      const rawY = e.clientY - rect.top - gridHeight / 2;
      
      // Snap to grid and align to the exact center of the nearest dot
      const x = Math.round(rawX / gridSize) * gridSize;
      const y = Math.round(rawY / gridSize) * gridSize;
      
      onPlaceMarker(x, y);
    }
  };

  // Handle mouse move to track position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left - gridWidth / 2) / gridSize) * gridSize;
      const y = Math.round((e.clientY - rect.top - gridHeight / 2) / gridSize) * gridSize;
      setMousePosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition(null); // Clear position when mouse leaves the grid
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mb: 4
    }}>
      {/* Grid container */}
      <Box
        sx={{ position: 'relative', width: `${gridWidth}px`, height: `${gridHeight}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid */}
        <Paper
          ref={containerRef}
          onClick={handleGridClick}
          sx={{
            position: 'absolute',
            width: `${gridWidth}px`,
            height: `${gridHeight}px`,
            border: '1px solid black',
            backgroundColor: 'white',
            cursor: disabled ? 'default' : 'crosshair'
          }}
        >
          {/* Grid dots */}
          {Array.from({ length: gridWidth / gridSize }).map((_, xIndex) =>
            Array.from({ length: gridHeight / gridSize }).map((_, yIndex) => {
              const x = xIndex * gridSize - gridWidth / 2; // Adjusted to align with the center
              const y = yIndex * gridSize - gridHeight / 2; // Adjusted to align with the center
              return (
                <Box
                  key={`${xIndex}-${yIndex}`}
                  sx={{
                    position: 'absolute',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'gray',
                    top: y + gridHeight / 2 + gridSize/2, // Adjusted for alignment (1px correction and 31px offset)
                    left: x + gridWidth / 2 + gridSize/2, // Adjusted for alignment (30px correction and 31px offset)
                  }}
                />
              );
            })
          )}

          {/* Render axis lines */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '1px',
              backgroundColor: 'black',
              top: gridHeight / 2, // Centered horizontally
              left: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: '1px',
              height: '100%',
              backgroundColor: 'black',
              top: 0,
              left: gridWidth / 2, // Centered vertically
            }}
          />

          {/* Placed marker */}
          {markerPosition && (
            <Box
              sx={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'red',
                // Align to the center of the nearest grid dot
                top: markerPosition.y + gridHeight / 2 - 10 + gridSize / 2, // Adjusted for marker size and grid alignment
                left: markerPosition.x + gridWidth / 2 - 10 + gridSize / 2, // Adjusted for marker size and grid alignment
                zIndex: 10,
              }}
            />
          )}

          {/* Render markers based on the data prop */}
          {data.map((item) => (
            <Box
              key={item.id}
              sx={{
                position: 'absolute',
                // Align to the center of the nearest grid dot
                top: item.y + gridHeight / 2 - 5 + gridSize / 2, // Adjusted for marker size and grid alignment
                left: item.x + gridWidth / 2 - 5 + gridSize / 2, // Adjusted for marker size and grid alignment
                transform: 'translate(-50%, -50%)', // Center the marker
                backgroundColor: 'blue',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
              }}
            />
          ))}

          {/* Example usage of mousePosition */}
          {mousePosition && (
            <Box
              sx={{
                position: 'absolute',
                top: mousePosition.y + gridHeight / 2,
                left: mousePosition.x + gridWidth / 2,
                width: '10px',
                height: '10px',
                backgroundColor: 'green',
                borderRadius: '50%',
              }}
            />
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default MarkerGrid;