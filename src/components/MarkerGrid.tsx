import { useState, useRef, useEffect } from 'react';
import { Box, Paper } from '@mui/material';

// Grid settings
const gridSize = 20; // Grid spacing in pixels
const gridWidth = 500; // Total width of the grid
const gridHeight = 500; // Total height of the grid

interface MarkerGridProps {
  onPlaceMarker: (x: number, y: number) => void;
  markerPosition: { x: number, y: number } | null;
  disabled?: boolean;
}

const MarkerGrid: React.FC<MarkerGridProps> = ({ onPlaceMarker, markerPosition, disabled = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number, y: number } | null>(null);

  // Handle click on grid to place marker
  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate position relative to grid center
      const rawX = e.clientX - rect.left - gridWidth / 2;
      const rawY = e.clientY - rect.top - gridHeight / 2;
      
      // Snap to grid
      const x = Math.round(rawX / gridSize) * gridSize;
      const y = Math.round(rawY / gridSize) * gridSize;
      
      onPlaceMarker(x, y);
    }
  };

  // Track mouse position for hover effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left - gridWidth / 2;
      const rawY = e.clientY - rect.top - gridHeight / 2;
      
      // Snap to grid
      const x = Math.round(rawX / gridSize) * gridSize;
      const y = Math.round(rawY / gridSize) * gridSize;
      
      setHoverPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
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
          top: gridHeight / 2 + 20,
          left: gridWidth / 2 - 50,
          textAlign: 'center',
        }}>
          X Axis: Like / Dislike
        </Box>
        <Box sx={{
          position: 'absolute',
          top: gridHeight / 2 - 50,
          left: gridWidth / 2 + 10,
          transform: 'rotate(-90deg)',
          textAlign: 'center',
        }}>
          Y Axis: Engaging / Disengaging
        </Box>

        {/* Grid */}
        <Paper
          ref={containerRef}
          onClick={handleGridClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
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
          {Array.from({ length: gridWidth / gridSize + 1 }).map((_, xIndex) =>
            Array.from({ length: gridHeight / gridSize + 1 }).map((_, yIndex) => {
              const x = xIndex * gridSize - gridWidth / 2;
              const y = yIndex * gridSize - gridHeight / 2;
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

          {/* Hover position indicator */}
          {hoverPosition && !disabled && !markerPosition && (
            <Box
              sx={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px dashed #666',
                top: hoverPosition.y + gridHeight / 2 - 10,
                left: hoverPosition.x + gridWidth / 2 - 10,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Placed marker */}
          {markerPosition && (
            <Box
              sx={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'red',
                top: markerPosition.y + gridHeight / 2 - 10,
                left: markerPosition.x + gridWidth / 2 - 10,
                zIndex: 10,
              }}
            />
          )}
        </Paper>

        {/* Display coordinates if marker exists */}
        {markerPosition && (
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            Marker at: ({markerPosition.x}, {markerPosition.y})
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MarkerGrid;