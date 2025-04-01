import { useRef } from 'react';
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
      <Box sx={{ position: 'relative', width: `${gridWidth}px`, height: `${gridHeight}px` }}>
        {/* Axis Labels */}
        <Box sx={{
          position: 'absolute',
          top: gridHeight / 2 - 10,
          left: gridWidth + 10,
          transform: 'rotate(90deg)',
          textAlign: 'center',
        }}>
          Like
        </Box>
        <Box sx={{
          position: 'absolute',
          top: gridHeight / 2 - 10,
          left: -60,
          transform: 'rotate(-90deg)',
          textAlign: 'center',
        }}>
          Dislike
        </Box>
        <Box sx={{
          position: 'absolute',
          top: -30,
          left: `calc(50% - 30px)`, // Adjusted for proper centering
          textAlign: 'center',
        }}>
          Engaging
        </Box>
        <Box sx={{
          position: 'absolute',
          top: gridHeight + 10,
          left: `calc(50% - 50px)`, // Adjusted for proper centering
          textAlign: 'center',
        }}>
          Disengaging
        </Box>

        {/* Grid */}
        <Paper
          ref={containerRef}
          onClick={handleGridClick}
          sx={{
            position: 'relative',
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
              const x = xIndex * gridSize - gridWidth / 2 + gridSize / 2; // Adjusted to center dots
              const y = yIndex * gridSize - gridHeight / 2 + gridSize / 2; // Adjusted to center dots
              return (
                <Box
                  key={`${xIndex}-${yIndex}`}
                  sx={{
                    position: 'absolute',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'gray',
                    top: y + gridHeight / 2 - 2,
                    left: x + gridWidth / 2 - 2,
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
              top: gridHeight / 2,
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
              left: gridWidth / 2,
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
                top: markerPosition.y + gridHeight / 2 - 10, // Align to center of the dot
                left: markerPosition.x + gridWidth / 2 - 10, // Align to center of the dot
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
                top: item.y + gridHeight / 2, // Removed -5 adjustment
                left: item.x + gridWidth / 2, // Removed -5 adjustment
                transform: 'translate(-50%, -50%)', // Center the marker
                backgroundColor: 'blue',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
              }}
            >
              <span style={{ color: 'white', fontSize: '10px' }}>{item.name}</span>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default MarkerGrid;