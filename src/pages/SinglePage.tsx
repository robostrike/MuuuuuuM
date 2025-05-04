import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Button } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

const SinglePage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen size is small

  const gridWidth = 10; // Number of columns
  const gridHeight = 10; // Number of rows
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

  const [itemVisible, setItemVisible] = useState(false); // Track item visibility
  const [itemPosition, setItemPosition] = useState({ x: 0, y: 0 }); // Track item position
  const [itemDisplay, setItemDisplay] = useState({x: 0,y: 0});

  useEffect(() => {
    const { x, y } = itemPosition;

    // Calculate Cartesian coordinates relative to the center of the grid
    const centerX = (x - (offsetX + stageWidth / 2)) * (originGridSize / gridSize);
    const centerY = ((stageWidth / 2 + itemHeight) - y) * (originGridSize / gridSize);

    setItemDisplay({ x: centerX, y: centerY });
    console.log('Display Position:', { gridSize, x: centerX, y: centerY });
  }, [itemPosition, offsetX, stageWidth, stageHeight, gridSize, originGridSize, itemHeight]);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const { x, y } = e.target.position();

    // Check if the item is within the grid boundaries
    const isWithinGrid =
      x >= offsetX &&
      x <= stageWidth + offsetX - gridSize &&
      y >= itemHeight &&
      y <= stageHeight - gridSize;

    if (!isWithinGrid) {
      // Reset to the previous position and make the item invisible
      e.target.position({ x: itemPosition.x, y: itemPosition.y });
      setItemVisible(false);
    } else {
      // Update the position if within bounds
      setItemPosition({ x, y });
    }
  };
    
  const handleGridClick = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (stage) {
      const pointerPosition = stage.getPointerPosition();
      if (pointerPosition) {
        const { x, y } = pointerPosition;

        // Check if the click is within the grid boundaries
        const isWithinGrid =
          x >= offsetX &&
          x <= stageWidth + offsetX &&
          y >= itemHeight &&
          y <= stageHeight;

        if (isWithinGrid) {
          setItemPosition({ x, y });
          setItemVisible(true); // Make the item visible
        } else if (itemVisible) {
          // Retain the previous position if clicked outside the grid
          setItemPosition((prevPosition) => ({ ...prevPosition }));
        } else {
          setItemVisible(false); // Hide the item if clicked outside the grid
        }
      }
    }
  };

  const handleSave = () => {
    console.log('Saved positions:', itemDisplay);
  };

  const handleReset = () => {
    setItemPosition({
      x: offsetX - (gridWidth * gridSize) / 2 ,
      y: itemHeight - (gridHeight * gridSize) / 2,
    });
    setItemVisible(false); // Optionally hide the item
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
        style={{ display: 'block' }}
        onClick={handleGridClick} // Handle grid click to place the item
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

          {/* Render the item conditionally */}
          {itemVisible && (
            <React.Fragment>
              <Circle
                x={itemPosition.x}
                y={itemPosition.y}
                radius={20}
                fill="red"
                draggable
                onDragMove={(e) => {
                  setItemPosition({
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
                onDragEnd={handleDragEnd} // Handle drag end to check boundaries
              />
              <Text
                x={itemPosition.x - 30}
                y={itemPosition.y + 30}
                text="Item"
                fontSize={12}
                fill="black"
                width={60}
                align="center"
              />
            </React.Fragment>
          )}
        </Layer>
      </Stage>

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

export default SinglePage;
