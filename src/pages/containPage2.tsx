import { useRef, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";

const GRID_SIZE = 50;
const GRID_COUNT = 10; // 10x10 grid
const MAX_SIZE = GRID_SIZE * GRID_COUNT;

const GridCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: MAX_SIZE, height: MAX_SIZE });
  const [circle, setCircle] = useState<{ x: number; y: number } | null>(null);

  const updateSize = () => {
    const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 0;
    const size = Math.min(containerWidth, MAX_SIZE);
    setDimensions({ width: size, height: size });
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const renderGridRectangles = () => {
    const rectangles = [];
    for (let row = 0; row < GRID_COUNT; row++) {
      for (let col = 0; col < GRID_COUNT; col++) {
        rectangles.push(
          <Rect
            key={`rect-${row}-${col}`}
            x={col * GRID_SIZE}
            y={row * GRID_SIZE}
            width={GRID_SIZE}
            height={GRID_SIZE}
            fill="#f0f0f0"
            stroke="#ddd"
            strokeWidth={1}
          />
        );
      }
    }
    return rectangles;
  };

  const handleStageClick = (e: any) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (pointerPosition) {
      const snappedX = Math.floor(pointerPosition.x / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      const snappedY = Math.floor(pointerPosition.y / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      setCircle({ x: snappedX, y: snappedY });
    }
  };

  return (
    <div ref={containerRef} style={{ width: "100%", maxWidth: MAX_SIZE, margin: "auto" }}>
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleStageClick}
      >
        <Layer>{renderGridRectangles()}</Layer>
        <Layer>
          {circle && (
            <Circle
              x={circle.x}
              y={circle.y}
              radius={20}
              fill="blue"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default GridCanvas;
