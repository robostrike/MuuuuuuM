import React, { useState } from 'react';
import '../CSS/FreeLocale.css'; // External CSS for styling

type Dot = {
  x: number;
  y: number;
  color: string;
};

const FreeLocale = () => {
  const dotSize = 18; // Dot dimensions
  const [dots, setDots] = useState<Dot[]>([]); // Define the type for the dots array

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const canvas = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvas.left - dotSize / 2; // Adjust for dot's width
    const y = e.clientY - canvas.top - dotSize / 2;  // Adjust for dot's height
    const color = e.dataTransfer.getData('color'); // Get the color of the dragged dot
    setDots([...dots, { x, y, color }]);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, color: string) => {
    e.dataTransfer.setData('color', color); // Pass the color of the dot being dragged
  };

  return (
    <div>
      <div className="dot-selection">
        <div
          className="dot red"
          draggable
          onDragStart={(e) => handleDragStart(e, 'red')}
        ></div>
        <div
          className="dot blue"
          draggable
          onDragStart={(e) => handleDragStart(e, 'blue')}
        ></div>
        <div
          className="dot green"
          draggable
          onDragStart={(e) => handleDragStart(e, 'green')}
        ></div>
      </div>
      <div
        className="canvas-container"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {dots.map((dot, index) => (
          <div
            key={index}
            className={`dot ${dot.color}`}
            style={{
              left: `${dot.x}px`,
              top: `${dot.y}px`,
            }}
          ></div>
        ))}
      </div>
      <div className="position-display">
        {dots.map((dot, index) => (
          <div key={index}>
            {dot.color.charAt(0).toUpperCase() + dot.color.slice(1)} Dot: (
            {Math.round(dot.x)}, {Math.round(dot.y)})
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeLocale;
