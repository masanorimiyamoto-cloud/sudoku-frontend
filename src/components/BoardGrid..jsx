// src/components/BoardGrid.jsx
import React from "react";
import Cell from "./Cell_com";  // ここで正しいパスを指定する

export default function BoardGrid({ board, problemCells, errorCells, selectedCell, onCellClick }) {
  return (
    <div className="board-grid">
      {board.map((rowArr, r) =>
        rowArr.map((val, c) => {
          const isFixed = problemCells.some(([pr, pc]) => pr === r && pc === c);
          const isError = errorCells.some(([er, ec]) => er === r && ec === c);
          const isSelected = selectedCell?.row === r && selectedCell?.col === c;
          return (
            <Cell
              key={`${r}-${c}`}
              value={val}
              isFixed={isFixed}
              isError={isError}
              isSelected={isSelected}
              onClick={() => onCellClick(r, c)}
            />
          );
        })
      )}
    </div>
  );
}
