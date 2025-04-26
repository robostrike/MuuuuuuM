import React, { useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

const ContainedPage = () => {
  const gridSize = 50; // Size of each grid cell
  const gridWidth = 10; // Number of columns
  const gridHeight = 10; // Number of rows

  // List of items to populate as draggable objects
  const items = [
    { id: 1, label: 'Item 1', color: 'red' },
    { id: 2, label: 'Item 2', color: 'blue' },
    { id: 3, label: 'Item 3', color: 'green' },
  ];

  const [positions, setPositions] = useState(
    items.map((item, index) => ({
      id: item.id,
      x: 20 + index * 60,
      y: 20,
    }))
  );

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: number) => {
    const { x, y } = e.target.position();
    setPositions((prev) =>
      prev.map((pos) => (pos.id === id ? { ...pos, x, y } : pos))
    );
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {/* Render grid */}
        {[...Array(gridWidth)].map((_, col) =>
          [...Array(gridHeight)].map((_, row) => (
            <Rect
              key={`${col}-${row}`}
              x={col * gridSize}
              y={row * gridSize}
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
  );
};

export default ContainedPage;
