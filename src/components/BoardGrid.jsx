import React from "react";
import './BoardGrid.css'; // BoardGrid.cssをインポート

const BoardGrid = ({ board, problemCells, errorCells, selectedCell, onCellClick }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // 3x3ブロックの境界線を判定
          const isBlockBorderRight = (colIndex + 1) % 3 === 0 && colIndex < 8;
          const isBlockBorderBottom = (rowIndex + 1) % 3 === 0 && rowIndex < 8;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell 
                ${problemCells.some(([r, c]) => r === rowIndex && c === colIndex) ? "problem" : ""} 
                ${errorCells.some(([r, c]) => r === rowIndex && c === colIndex) ? "error" : ""}
                ${isBlockBorderRight ? "block-border-right" : ""}
                ${isBlockBorderBottom ? "block-border-bottom" : ""}
              `}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell !== 0 ? cell : ""}
            </div>
          );
        })
      )}
    </div>
  );
};

export default BoardGrid;