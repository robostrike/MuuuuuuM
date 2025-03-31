import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Tooltip } from '@mui/material';

interface NameCardProps {
  name: string;
  index: number;
}

const NameCard: React.FC<NameCardProps> = ({ name, index }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'NAME_CARD',
    item: () => {
      console.log(`Picked up: ${name} at index ${index}`);
      return { id: index, name }; // Ensure unique id for each item
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      dragRef(containerRef.current);
    }
  }, [dragRef]);

  return (
    <Tooltip title={name} arrow>
      <div
        ref={containerRef}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'blue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'grab',
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {name[0]}
      </div>
    </Tooltip>
  );
};

export default NameCard;