import { useState } from 'react';
import type { GridCell as GridCellType } from '../types';
import './Grid.css';

interface GridProps {
  grid: GridCellType[][];
  onCellClick: (row: number, col: number, value: string) => void;
  canUpdate: boolean;
}

const Grid = ({ grid, onCellClick, canUpdate }: GridProps) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleCellClick = (row: number, col: number) => {
    if (!canUpdate) return;
    setSelectedCell({ row, col });
    setInputValue('');
  };

  const handleSubmit = () => {
    if (selectedCell && inputValue.length === 1) {
      onCellClick(selectedCell.row, selectedCell.col, inputValue);
      setSelectedCell(null);
      setInputValue('');
    }
  };

  const handleCancel = () => {
    setSelectedCell(null);
    setInputValue('');
  };

  return (
    <div className="grid-container">
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${!canUpdate ? 'disabled' : ''} ${
                  cell.value ? 'filled' : ''
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell.value || ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedCell && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Enter a Character</h3>
            <input
              type="text"
              maxLength={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter any character"
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={handleSubmit} disabled={inputValue.length !== 1}>
                Submit
              </button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grid;
