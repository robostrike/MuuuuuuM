import React, { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle, Image, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useTheme, useMediaQuery } from '@mui/material';
import { useImage } from 'react-konva-utils';
import hearingIcon from '../assets/hearing.svg';
import speakingIcon from '../assets/speaking.svg';

interface ContainedPageProps {
  items: { id: number; label: string; color: string; icon: string }[];
  onPositionsUpdate: (positions: { id: number; x: number; y: number }[]) => void;
  onDisplayPositionsUpdate: (displayPositions: { id: number; x: number; y: number }[]) => void;
  axes?: { left?: string; right?: string; up?: string; down?: string };
}

const ContainedPage: React.FC<ContainedPageProps> = ({ items, onPositionsUpdate, onDisplayPositionsUpdate, axes }) => {

  if (!items || items.length === 0) {
    console.log('No items were passed to ContainedPage or items is empty:', items); // Log when items is undefined or empty
    return <div>No items to display, refresh page and try again</div>;
  }

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const gridWidth = 10;
  const gridHeight = 10;
  const listDistance = 60;
  const itemHeight = 100;
  const originGridSize = 50;

  const calculateGridDimensions = () => {
    const maxStageWidth = window.innerWidth;

    if (!isSmallScreen) {
      const gridSize = 50;
      const stageWidth = gridSize * gridWidth;
      const stageHeight = stageWidth + itemHeight;
      const offsetX = 0;
      return { gridSize, stageWidth, stageHeight, offsetX };
    }

    const gridSize = Math.floor(maxStageWidth / gridWidth);
    const stageWidth = gridSize * gridWidth;
    const stageHeight = stageWidth + itemHeight;
    const offsetX = (maxStageWidth - stageWidth) / 2;
    return { gridSize, stageWidth, stageHeight, offsetX };
  };

  const { gridSize, stageWidth, stageHeight, offsetX } = calculateGridDimensions();

  const getInitialPositions = () => {
    return items.map((item, index) => ({
      id: item.id,
      x: stageWidth / 2 - ((items.length - 1) * listDistance) / 2 + index * listDistance,
      y: 40,
    }));
  };

  const [positions, setPositions] = useState(getInitialPositions());
  const [displayPositions, setDisplayPositions] = useState<{ id: number; x: number; y: number }[]>([]);

  // Update positions whenever items change
  useEffect(() => {
    setPositions(getInitialPositions());
  }, [items]);

  // Notify parent component of position updates
  useEffect(() => {
    if (onPositionsUpdate) {
      onPositionsUpdate(positions);
      onDisplayPositionsUpdate(displayPositions);
    }
  }, [positions, onPositionsUpdate]);

  // Update display positions whenever positions change
  useEffect(() => {
    const updateDisplayPositions = () => {
      const updatedDisplayPositions = positions.map(({ id, x, y }) => {
        const centerX = (x - (offsetX + stageWidth / 2)) * (originGridSize / gridSize);
        const centerY = ((stageWidth / 2 + itemHeight) - y) * (originGridSize / gridSize);
        return { id, x: centerX, y: centerY };
      });

      setDisplayPositions(updatedDisplayPositions);
      console.log('Display Positions:', updatedDisplayPositions);
    };

    updateDisplayPositions();
  }, [positions, offsetX, stageWidth, stageHeight, gridSize, originGridSize, itemHeight]);

  // Notify parent component of display position updates
  useEffect(() => {
    if (onPositionsUpdate) {
      onPositionsUpdate(displayPositions);
    }
  }, [displayPositions, onPositionsUpdate]);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: number) => {
    const { x, y } = e.target.position();

    const isWithinGrid =
      x >= offsetX &&
      x <= stageWidth + offsetX &&
      y >= itemHeight &&
      y <= stageHeight;

    const resetPosition = positions.find((pos) => pos.id === id) || { id, x: 0, y: 0 };

    const updatedPositions = positions.map((pos) =>
      pos.id === id
        ? isWithinGrid
          ? { ...pos, x, y }
          : resetPosition
        : pos
    );

    setPositions([...updatedPositions]);
    e.target.position(isWithinGrid ? { x, y } : { x: resetPosition.x, y: resetPosition.y });
  };

  const iconMap: { [key: string]: string } = {
    '../assets/hearing.svg': hearingIcon,
    '../assets/speaking.svg': speakingIcon,
  };

  const useIconImage = (iconPath: string) => {
    const [image] = useImage(iconPath);
    return image;
  };

  return (
      <div
        style={{
          maxWidth: '500px',
          maxHeight: '600px',
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
            {[...Array(gridWidth)].map((_, col) =>
              [...Array(gridHeight)].map((_, row) => (
                <Rect
                  key={`${col}-${row}`}
                  x={col * gridSize + offsetX}
                  y={row * gridSize + itemHeight}
                  width={gridSize}
                  height={gridSize}
                  fill="white"
                  stroke={
                    '#fafafa'
                  }
                  strokeWidth={0.5}
                />
              ))
            )}

            <Line
              points={[offsetX , itemHeight + gridSize * 5, stageWidth + offsetX , itemHeight + gridSize * 5]}
              stroke="lightgrey"
              strokeWidth={2}
            />
            <Line
              points={[stageWidth / 2 + offsetX, itemHeight , stageWidth / 2 + offsetX, stageHeight ]}
              stroke="lightgrey"
              strokeWidth={2}
            />

            

            {items.map((item, index) => {
              const iconSrc = iconMap[item.icon] || null;
              const iconImage = iconSrc ? useIconImage(iconSrc) : null;

              return (
                <Group
                  key={item.id}
                  draggable
                  x={positions[index]?.x || 0}
                  y={positions[index]?.y || 0}
                  onDragEnd={(e) => handleDragEnd(e, item.id)}
                >
                  <Circle
                    radius={20 * gridSize / originGridSize}
                    fill={item.color}
                  />
                  {iconImage ? (
                    <Image
                      image={iconImage}
                      x={-12 * Math.sqrt(gridSize / originGridSize)}
                      y={-12 * Math.sqrt(gridSize / originGridSize)}
                      width={24 * Math.sqrt(gridSize / originGridSize)}
                      height={24 * Math.sqrt(gridSize / originGridSize)}
                      listening={false} // Prevents the image from intercepting pointer events
                    />
                  ) : (
                    <Text
                      text={item.label}
                      x={-30}
                      y={25}
                      fontSize={12}
                      fill="black"
                      width={60}
                      align="center"
                    />
                  )}
                </Group>
              );
            })}

            <Text
              x={offsetX + gridSize/3}
              y={100 + gridSize * 5 + 100}
              align="center"
              text= {axes?.left || 'N/A'}
              fontSize={16}
              fill="black"
              rotation={-90}
              fontFamily="Courier New"
              width={200}
              listening={false}
            />
            <Text
              x={stageWidth + offsetX-gridSize/3}
              y={100 + gridSize * 5 - 100}
              align="center"
              text= {axes?.right || 'N/A'}
              fontSize={16}
              fill="black"
              rotation={90}
              fontFamily="Courier New"
              width={200}
              listening={false}
            />
            <Text
              x={stageWidth / 2 + offsetX - 100}
              y={stageHeight - gridSize/1.5}
              text= {axes?.down || 'N/A'}
              fontSize={16}
              fill="black"
              align="center"
              fontFamily="Courier New"
              width={200}
              listening={false}
            />
            <Text
              x={stageWidth / 2 + offsetX - 100}
              y={100 + gridSize/3}
              text= {axes?.up || 'N/A'}
              fontSize={16}
              fill="black"
              align="center"
              fontFamily="Courier New"
              width={200}
              listening={false}
            />
          </Layer>
        </Stage>
      </div>
  );
};

export default ContainedPage;
