import React, { useRef } from 'react';

interface NameCardsProps {
  onPlaceMarker: (x: number, y: number) => void;
  data: { id: number; name: string; x: number; y: number }[];
}

const gridSize = 20; // Grid spacing in pixels
const gridWidth = 500; // Total width of the grid
const gridHeight = 500; // Total height of the grid

const NameCards: React.FC<NameCardsProps> = ({ onPlaceMarker, data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left - gridWidth / 2;
      const rawY = e.clientY - rect.top - gridHeight / 2;

      // Snap to grid
      const x = Math.round(rawX / gridSize) * gridSize;
      const y = Math.round(rawY / gridSize) * gridSize;

      // Update the marker position
      onPlaceMarker(x, y);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Allow drop
  };

  return (
    <div
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        position: 'relative',
        width: `${gridWidth}px`,
        height: `${gridHeight}px`,
        border: '1px solid black',
      }}
    >
      {/* Render markers */}
      {data.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            top: item.y + gridHeight / 2 - 5, // Adjust for marker size
            left: item.x + gridWidth / 2 - 5, // Adjust for marker size
            width: '10px',
            height: '10px',
            backgroundColor: 'blue',
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
};

export default NameCards;