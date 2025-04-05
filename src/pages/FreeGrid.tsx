import { useState } from 'react';
import '../CSS/FreeGrid.css'; // Ensure to create a CSS file for styling the grid

const FreeGrid = () => {
  const [gridSize] = useState({ rows: 20, cols: 20 }); // Define grid size
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col }); // Update the selected cell
  };

  return (
    <div>
      <div className="grid-container">
        {Array.from({ length: gridSize.rows }).map((_, row) => (
          <div key={row} className="grid-row">
            {Array.from({ length: gridSize.cols }).map((_, col) => {
              const isSelected = selectedCell?.row === row && selectedCell?.col === col;
              return (
                <div
                  key={col}
                  className={`grid-cell ${isSelected ? 'clicked' : ''}`}
                  onClick={() => handleCellClick(row, col)}
                >
                  {/* Optionally display something in the cell */}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="clicked-locations">
        <h3>Selected Location:</h3>
        {selectedCell ? (
          <p>
            Row: {selectedCell.row}, Col: {selectedCell.col}
          </p>
        ) : (
          <p>No cell selected</p>
        )}
      </div>
    </div>
  );
};

export default FreeGrid;
