import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Button } from '@mui/material';

const ContainedPage = () => {
  const gridSize = 50; // Size of each grid cell
  const gridWidth = 10; // Number of columns
  const gridHeight = 10; // Number of rows
  const listDistance = 60;
  const stageWidth = gridWidth * gridSize;
  const stageHeight = gridHeight * gridSize + 100; // Extra space for staging

  // List of items to populate as draggable objects
  const items = [
    { id: 1, label: 'Item 1', color: 'red' },
    { id: 2, label: 'Item 2', color: 'blue' },
    { id: 3, label: 'Item 3', color: 'green' },
    { id: 4, label: 'Item 4', color: 'brown' },
    { id: 5, label: 'Item 5', color: 'yellow' },
  ];

  const listLength = items.length; // Get the size of the list

  const [positions, setPositions] = useState(
    items.map((item, index) => ({
      id: item.id,
      x: stageWidth / 2 - ((listLength-1) * listDistance) / 2 + index * listDistance, // Center items horizontally
      y: 40, // Initial position in the staging area
    }))
  );

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: number) => {
    const { x, y } = e.target.position();

    // Adjust coordinates to use the new origin
    const adjustedX = x - stageWidth / 2;
    const adjustedY = y - (stageHeight / 2 + gridSize);

    const isWithinGrid =
      adjustedX >= -stageWidth / 2 &&
      adjustedX <= stageWidth / 2 - 40 &&
      adjustedY >= -stageHeight / 2 + 100 - gridSize &&
      adjustedY <= stageHeight / 2 - 40;

    // Dynamically get the initial starting position from the state and include 'id'
    const resetPosition = positions.find((pos) => pos.id === id) || { id, x: 0, y: 0 };

    setPositions((prev) =>
      prev.map((pos) =>
        pos.id === id
          ? isWithinGrid
            ? { ...pos, x, y } // Update position if within grid
            : resetPosition // Reset to original position if outside grid
          : pos
      )
    );

    // Ensure the Konva node is reset to the correct position visually
    e.target.position(isWithinGrid ? { x, y } : { x: resetPosition.x, y: resetPosition.y });
  };

  const handleSave = () => {
    console.log('Saved positions:', positions);
  };

  const handleReset = () => {
    setPositions(
      items.map((item, index) => ({
        id: item.id,
        x: stageWidth / 2 - ((listLength - 1) * listDistance) / 2 + index * listDistance, // Reset to initial x position
        y: 40, // Reset to initial y position
      }))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {/* Render grid */}
          {[...Array(gridWidth)].map((_, col) =>
            [...Array(gridHeight)].map((_, row) => (
              <Rect
                key={`${col}-${row}`}
                x={col * gridSize}
                y={row * gridSize + 100} // Offset grid below staging area
                width={gridSize}
                height={gridSize}
                stroke="gray"
                strokeWidth={0.5}
              />
            ))
          )}

          {/* Add middle lines */}
          <Line
            points={[0, stageHeight / 2 + gridSize, stageWidth, stageHeight / 2 + gridSize]}
            stroke="black"
            strokeWidth={1}
          />
          <Line
            points={[stageWidth / 2, 100, stageWidth / 2, stageHeight]}
            stroke="black"
            strokeWidth={1}
          />

          {/* Render draggable items */}
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <Circle
                x={positions[index].x}
                y={positions[index].y}
                radius={20} // Radius of the dot
                fill={item.color}
                draggable
                onDragEnd={(e) => handleDragEnd(e, item.id)}
              />
              <Text
                x={positions[index].x - 20} // Center text horizontally (width of text is approx. 40)
                y={positions[index].y - 40} // Position text above the dot
                text={item.label}
                fontSize={12}
                fill="black"
                width={40} // Set width for centering
                align="center" // Align text to center
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>

      {/* Tracker display */}
      <div style={{ marginTop: 20, display: 'flex', justifyContent:  'center', alignItems: 'center', flexDirection: 'column' }}>
        {items.map((item, index) => (
          <div key={item.id} style={{ marginBottom: 5 }}>
            {item.label}: (
            {Math.round(positions[index].x - stageWidth / 2)},{" "}
            {Math.round(positions[index].y - (stageHeight / 2 + gridSize))})
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 20, display: 'flex', gap: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ContainedPage;
