import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Button } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

const ContainedPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen size is small

  const gridWidth = 10; // Number of columns
  const gridHeight = 10; // Number of rows
  const listDistance = 60; // Distance between items in the list
  const itemHeight = 100; // Height of the row of items on the list
  const originGridSize = 50; // Original grid size for larger screens

  const calculateGridDimensions = () => {
    const maxStageWidth = window.innerWidth; // Get the screen width
    
    if (!isSmallScreen) {
      // Static grid size and layout for larger screens
      const gridSize = 50; // Apply offset
      const stageWidth = gridSize * gridWidth;
      const stageHeight = stageWidth + itemHeight;
      const offsetX = 0;
      return { gridSize, stageWidth, stageHeight, offsetX };
    }

    // Dynamic grid size and layout for smaller screens
    const gridSize = Math.floor((maxStageWidth) / gridWidth); // Reduce gridSize slightly to fit within the viewport
    const stageWidth = gridSize * gridWidth;
    const stageHeight = stageWidth + itemHeight;
    const offsetX = (maxStageWidth - stageWidth) / 2 ; // Center the grid horizontally
    return { gridSize, stageWidth, stageHeight, offsetX };
  };

  const { gridSize, stageWidth, stageHeight, offsetX } = calculateGridDimensions();

  useEffect(() => {

    const handleResize = () => {
      const { gridSize, stageWidth, stageHeight, offsetX } = calculateGridDimensions();
      console.log('New Grid Size:', gridSize);
      console.log('Stage Dimensions:', { width: stageWidth, height: stageHeight });
      console.log('Offset X:', offsetX);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSmallScreen]);

  // List of items to populate as draggable objects
  const items = [
    { id: 1, label: 'Item 1', color: 'red' },
    { id: 2, label: 'Item 2', color: 'blue' },
    { id: 3, label: 'Item 3', color: 'green' },
    { id: 4, label: 'Item 4', color: 'brown' },
    { id: 5, label: 'Item 5', color: 'yellow' },
  ];

  const listLength = items.length; // Get the size of the list

  // Define initial positions based on the items and grid dimensions
  const getInitialPositions = () => {
    return items.map((item, index) => ({
      id: item.id,
      x: stageWidth / 2 - ((listLength - 1) * listDistance) / 2 + index * listDistance,
      y: 40,
    }));
  };

  const mapPositionsToDisplay = (positions: { id: number; x: number; y: number }[]) => {
    return positions.map((pos) => {
      const originX = (pos.x - offsetX) * (originGridSize / gridSize);
      const originY = (pos.y - itemHeight) * (originGridSize / gridSize);
      console.log(`Mapped Position: Item ${pos.id}, x=${originX.toFixed(2)}, y=${originY.toFixed(2)}`);
      return { x: originX, y: originY };
    });
  };

  const initialPositions = getInitialPositions();
  const [positions, setPositions] = useState(initialPositions);
  const [itemDisplay, setItemDisplay] = useState(mapPositionsToDisplay(initialPositions));

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: number) => {
    const { x, y } = e.target.position();

    // Check if the item is within the grid boundaries
    const isWithinGrid =
      x >= offsetX &&
      x <= stageWidth + offsetX - gridSize &&
      y >= itemHeight &&
      y <= stageHeight - gridSize;

    const resetPosition = positions.find((pos) => pos.id === id) || { id, x: 0, y: 0 };

    // Create a new array reference using the spread operator
    const updatedPositions = positions.map((pos) =>
      pos.id === id
        ? isWithinGrid
          ? { ...pos, x, y }
          : resetPosition
        : pos
    );

    setPositions([...updatedPositions]); // Update state with the new array reference
    setItemDisplay(mapPositionsToDisplay(updatedPositions)); // Map positions to display immediately
    console.log('Updated Positions After Drag:', updatedPositions); // Log updated positions
    e.target.position(isWithinGrid ? { x, y } : { x: resetPosition.x, y: resetPosition.y });
  };

  const handleSave = () => {
    console.log('Saved positions:', positions);
  };

  const handleReset = () => {
    const resetPositions = [...initialPositions]; // Copy initial positions using spread operator
    setPositions(resetPositions); // Update state with the copied list
    setItemDisplay(mapPositionsToDisplay(resetPositions)); // Map positions to display immediately
    console.log('Reset Positions:');
    resetPositions.forEach((pos) => {
      console.log(`Item ${pos.id}: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}`);
    });
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
      <Stage
        width={stageWidth}
        height={stageHeight}
        style={{
          display: 'block',
          
        }}
      >
        <Layer>
          {/* Render grid */}
          {[...Array(gridWidth)].map((_, col) =>
            [...Array(gridHeight)].map((_, row) => (
              <Rect
                key={`${col}-${row}`}
                x={col * gridSize + offsetX} // Apply horizontal offset
                y={row * gridSize + itemHeight}
                width={gridSize}
                height={gridSize}
                fill= "white"
                stroke={
                  col === 0 || row === 0 || col === gridWidth - 1 || row === gridHeight - 1
                    ? 'white' // Make the first/last row and column transparent
                    : 'grey' // Default grid color
                }
                strokeWidth={0.5}
              />
            ))
          )}

          {/* Add horizontal line */}
          <Line
            points={[offsetX + gridSize, itemHeight + gridSize*5, stageWidth + offsetX - + gridSize, itemHeight + gridSize*5]}
            stroke="black"
            strokeWidth={2}
          />
          {/* Add vertical line */}
          <Line
            points={[stageWidth / 2 + offsetX, itemHeight + gridSize, stageWidth / 2 + offsetX, stageHeight - + gridSize]}
            stroke="black"
            strokeWidth={2}
          />

          {/* Add labels */}
          <Text
            x={offsetX + 20} // Position to the left of the horizontal line
            y={100 + gridSize * 5} // Center vertically on the horizontal line
            align="center"
            text="no"
            fontSize={16}
            fill="black"
            rotation={-90} // Rotate 90 degrees counterclockwise
            
          />
          <Text
            x={stageWidth + offsetX - 20} // Position to the right of the horizontal line
            y={100 + gridSize * 5} // Center vertically on the horizontal line
            align="center"
            text="yes"
            fontSize={16}
            fill="black"
            rotation={90} // Rotate 90 degrees clockwise
            
          />
          <Text
            x={stageWidth / 2 + offsetX - 40}
            y={stageHeight - 30}
            text="puzzling"
            fontSize={16}
            fill="black"
            align="center"
          />
          <Text
            x={stageWidth / 2 + offsetX - 50}
            y={110}
            text="confident"
            fontSize={16}
            fill="black"
            align="center"
          />

          {/* Render draggable items */}
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <Circle
                x={positions[index].x} // Apply horizontal offset
                y={positions[index].y}
                radius={20}
                fill={item.color}
                draggable
                onDragEnd={(e) => handleDragEnd(e, item.id)}
              />
              <Text
                id={`text-${item.id}`}
                x={positions[index].x + offsetX - 30}
                y={positions[index].y + 30}
                text={item.label}
                fontSize={12}
                fill="black"
                width={60}
                align="center"
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>

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
        {items.map((item, index) => (
          <div key={item.id} style={{ textAlign: 'center' }}>
            <div>Item {item.id}</div>
            <div>
              ({Math.round(itemDisplay[index].x)}, {Math.round(itemDisplay[index].y)})
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'row', // Change to row
          gap: '10px', // Add spacing between buttons
          alignItems: 'center',
          justifyContent: 'center', // Center the buttons
        }}
      >
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
