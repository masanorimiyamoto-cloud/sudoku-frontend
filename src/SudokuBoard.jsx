import React, { useState } from "react";
import axios from "axios";
import BoardGrid from "./components/BoardGrid";
import NumberPad from "./components/NumberPad";
import ControlButtons from "./components/ControlButtons";

function SudokuBoard() {
  // ... state 定義、イベントハンドラなど（省略）

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Sudoku Solver0320 22:33</h1>
      <form onSubmit={handleSubmit}>
        <BoardGrid
          board={board}
          problemCells={problemCells}
          errorCells={errorCells}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
        />

        {selectedCell && <NumberPad onNumberClick={handleNumberClick} />}

        <ControlButtons
          onSetProblem={handleSetProblem}
          onSubmit={handleSubmit}
          onCheckPartial={handleCheckPartialSolution}
          onClearSolution={handleClearSolution}
          onReset={handleResetBoard}
        />
      </form>
    </div>
  );
}

export default SudokuBoard;
