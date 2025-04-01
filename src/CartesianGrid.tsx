import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import NameCard from './NameCard';

const initialNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];

const gridSize = 20; // Grid spacing in pixels
const gridWidth = 500; // Total width of the grid
const gridHeight = 500; // Total height of the grid

interface CartesianGridProps {
  items: { id: number; name: string; x: number; y: number }[];
  setItems: React.Dispatch<React.SetStateAction<{ id: number; name: string; x: number; y: number }[]>>;
  setHoveredItem: React.Dispatch<React.SetStateAction<{ id: number; name: string; x: number; y: number } | null>>; // Include x and y in hovered item
}

const CartesianGrid: React.FC<CartesianGridProps> = ({ items = [], setItems, setHoveredItem }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'NAME_CARD',
    drop: (item: { id: number; name: string }, monitor) => {
      const offset = monitor.getClientOffset();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (offset && containerRect) {
        // Calculate position relative to the grid container
        const x = Math.round((offset.x - containerRect.left) / gridSize) * gridSize - gridWidth / 2 + gridSize / 2;
        const y = Math.round((offset.y - containerRect.top) / gridSize) * gridSize - gridHeight / 2 + gridSize / 2;

        console.log(`Dropped: ${item.name} at (${x}, ${y})`);

        setItems((prev) => {
          // Remove any existing instance of the item by id
          const filteredItems = prev.filter((existingItem) => existingItem.id !== item.id);
          const updatedItems = [...filteredItems, { id: item.id, name: item.name, x, y }];
          console.log('Updated items array:', updatedItems); // Log the entire array
          return updatedItems;
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const combinedRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    dropRef(node);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left - gridWidth / 2;
        const y = event.clientY - rect.top - gridHeight / 2;

        // Find the closest item to the mouse position
        const closestItem = items.reduce<{ id: number; name: string; x: number; y: number } | null>((closest, item) => {
          const distance = Math.sqrt((item.x - x) ** 2 + (item.y - y) ** 2);
          if (!closest || distance < Math.sqrt((closest.x - x) ** 2 + (closest.y - y) ** 2)) {
            return { id: item.id, name: item.name, x: item.x, y: item.y }; // Include x and y
          }
          return closest;
        }, null);

        setHoveredItem(closestItem);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [items, setHoveredItem]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Name cards for dragging */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {initialNames.map((name, index) => (
          <NameCard key={index} name={name} index={index} />
        ))}
      </div>

      {/* Grid container */}
      <div style={{ position: 'relative', width: `${gridWidth}px`, height: `${gridHeight}px` }}>
        {/* Axis Labels */}
        <div
          style={{
            position: 'absolute',
            top: gridHeight / 2 + 20,
            left: gridWidth / 2 - 50,
            textAlign: 'center',
          }}
        >
          X Axis: Like / Dislike
        </div>
        <div
          style={{
            position: 'absolute',
            top: gridHeight / 2 - 50,
            left: gridWidth / 2 + 10,
            transform: 'rotate(-90deg)',
            textAlign: 'center',
          }}
        >
          Y Axis: Engaging / Disengaging
        </div>

        {/* Grid */}
        <div
          ref={combinedRef}
          style={{
            position: 'relative',
            width: `${gridWidth}px`,
            height: `${gridHeight}px`,
            border: '1px solid black',
            backgroundColor: isOver ? '#f0f0f0' : 'white',
          }}
        >
          {/* Render grid dots */}
          {Array.from({ length: gridWidth / gridSize }).map((_, xIndex) =>
            Array.from({ length: gridHeight / gridSize }).map((_, yIndex) => {
              const x = xIndex * gridSize - gridWidth / 2 + gridSize / 2;
              const y = yIndex * gridSize - gridHeight / 2 + gridSize / 2;
              return (
                <div
                  key={`${xIndex}-${yIndex}`}
                  style={{
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
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '1px',
              backgroundColor: 'black',
              top: gridHeight / 2,
              left: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '1px',
              height: '100%',
              backgroundColor: 'black',
              top: 0,
              left: gridWidth / 2,
            }}
          />

          {/* Render dropped items */}
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: item.y + gridHeight / 2 - 20,
                left: item.x + gridWidth / 2 - 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <NameCard name={item.name} index={item.id} />
              <div style={{ fontSize: '12px', marginTop: '5px', color: 'black' }}>
                ({item.x}, {item.y})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartesianGrid;
