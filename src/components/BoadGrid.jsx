// src/components/BoardGrid.jsx
import React from "react";
import Cell from "./Cell_com";
import "../styles/BoardGrid.css"; // 必要なら CSS を別途用意

export default function BoardGrid({
  board,
  problemCells,
  errorCells,
  selectedCell,
  onCellClick,
}) {
  return (
    <div className="board-grid">
      {board.map((rowArr, r) =>
        rowArr.map((val, c) => {
          const isFixed = problemCells.some(
            ([pr, pc]) => pr === r && pc === c
          );
          const isError = errorCells.some(
            ([er, ec]) => er === r && ec === c
          );
          const isSelected =
            selectedCell?.row === r && selectedCell?.col === c;
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
