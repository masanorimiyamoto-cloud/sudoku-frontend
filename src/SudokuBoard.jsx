// テスト用の簡易版 SudokuBoard.jsx
import React, { useState } from "react";
import BoardGrid from "./components/BoardGrid";

function SudokuBoard() {
  const initialBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  const [board, setBoard] = useState(initialBoard);

  const handleCellClick = (r, c) => {
    console.log(`Cell clicked: ${r}, ${c}`);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Sudoku Solver</h1>
      <BoardGrid
        board={board}
        problemCells={[]}
        errorCells={[]}
        selectedCell={null}
        onCellClick={handleCellClick}
      />
    </div>
  );
}

export default SudokuBoard;
