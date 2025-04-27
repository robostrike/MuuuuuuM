import React, { useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

const ContainedPage = () => {
  const gridSize = 50; // Size of each grid cell
  const gridWidth = 10; // Number of columns
  const gridHeight = 10; // Number of rows
  const stageWidth = gridWidth * gridSize;
  const stageHeight = gridHeight * gridSize + 100; // Extra space for staging

  // List of items to populate as draggable objects
  const items = [
    { id: 1, label: 'Item 1', color: 'red' },
    { id: 2, label: 'Item 2', color: 'blue' },
    { id: 3, label: 'Item 3', color: 'green' },
    { id: 4, label: 'Item 4', color: 'brown' },
  ];

  const [positions, setPositions] = useState(
    items.map((item, index) => ({
      id: item.id,
      x: 20 + index * 60,
      y: 20, // Initial position in the staging area
    }))
  );

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: number) => {
    const { x, y } = e.target.position();
    const isWithinGrid =
      x >= 0 &&
      x <= stageWidth - 40 &&
      y >= 100 && // Grid starts at y = 100
      y <= stageHeight - 40;

    setPositions((prev) =>
      prev.map((pos) =>
        pos.id === id
          ? isWithinGrid
            ? { ...pos, x, y } // Update position if within grid
            : { ...pos, x: 20 + (id - 1) * 60, y: 20 } // Reset to original position if outside grid
          : pos
      )
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

          {/* Render draggable items */}
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <Rect
                x={positions[index].x}
                y={positions[index].y}
                width={40}
                height={40}
                fill={item.color}
                draggable
                onDragEnd={(e) => handleDragEnd(e, item.id)}
              />
              <Text
                x={positions[index].x}
                y={positions[index].y - 20}
                text={item.label}
                fontSize={12}
                fill="black"
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>

      {/* Tracker display */}
      <div style={{ marginTop: 20 }}>
        {items.map((item, index) => (
          <div key={item.id} style={{ marginBottom: 5 }}>
            {item.label}: ({Math.round(positions[index].x)}, {Math.round(positions[index].y)})
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContainedPage;
