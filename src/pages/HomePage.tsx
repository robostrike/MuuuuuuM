import { useState, useRef, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Button } from '@mui/material';
import NameCard from '../components/NameCard';
import MarkerGrid from '../components/MarkerGrid';

const initialNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];

const HomePage = () => {
  const [items, setItems] = useState<{ id: number; name: string; x: number; y: number }[]>([]);
  const [hoveredItem, setHoveredItem] = useState<{ id: number; name: string; x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [, dropRef] = useDrop(() => ({
    accept: 'NAME_CARD',
    drop: (item: { id: number; name: string }, monitor) => {
      const offset = monitor.getClientOffset();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (offset && containerRect) {
        const x = Math.round(offset.x - containerRect.left - 250); // Adjusted to center relative to grid
        const y = Math.round(offset.y - containerRect.top - 250); // Adjusted to center relative to grid

        setItems((prev) => {
          const filteredItems = prev.filter((existingItem) => existingItem.id !== item.id);
          return [...filteredItems, { id: item.id, name: item.name, x, y }];
        });
      }
    },
  }));

  const [, dragRef] = useDrag<{ id: number; name: string }, unknown, unknown>({
    type: 'NAME_CARD',
    item: { id: 0, name: '' }, // Default item structure
  });

  const handleDragStart = (id: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      setHoveredItem(item);
    }
  };

  const handleDragEnd = () => {
    setHoveredItem(null);
  };

  const combinedRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    dropRef(node);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const closestItem = items.reduce<{ id: number; name: string; x: number; y: number } | null>((closest, item) => {
          const distance = Math.sqrt((item.x - x) ** 2 + (item.y - y) ** 2);
          if (!closest || distance < Math.sqrt((closest.x - x) ** 2 + (closest.y - y) ** 2)) {
            return { id: item.id, name: item.name, x: item.x, y: item.y };
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

  const onSave = () => {
    localStorage.setItem('savedItems', JSON.stringify(items));
    console.log('Items saved to local storage:', items);
  };

  const onReset = () => {
    setItems([]);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bridges: Build or Burn</h1>
      <div
        ref={combinedRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '50px',
          }}
        >
          {initialNames.map((name, index) => (
            <NameCard
              key={index}
              name={name}
              index={index}
              onClick={() => {}} // Add required onClick
            />
          ))}
        </div>
        <MarkerGrid
          data={items}
          onPlaceMarker={() => {}} // No-op for now
          markerPosition={null}
        />
        {items.map((item) => (
          <div
            key={item.id}
            ref={(node) => {
              dragRef(node); // Ensure proper ref assignment
            }}
            style={{
              position: 'absolute',
              left: `${item.x}px`,
              top: `${item.y}px`,
              cursor: 'grab',
            }}
            onMouseDown={() => handleDragStart(item.id)}
            onMouseUp={handleDragEnd}
          >
            <NameCard name={item.name} index={item.id} onClick={() => {}} /> {/* Add required onClick */}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <Button variant="contained" color="primary" onClick={onSave}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>
      {hoveredItem && (
        <div style={{ marginTop: '10px', fontSize: '16px', color: 'gray' }}>
          Hovering over: {hoveredItem.name} (ID: {hoveredItem.id}, X: {hoveredItem.x}, Y: {hoveredItem.y})
        </div>
      )}
    </div>
  );
};

export default HomePage;