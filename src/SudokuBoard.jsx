import React, { useState } from "react"; // useStateをインポート
import axios from "axios"; // axiosをインポート
import BoardGrid from "./components/BoardGrid"; // BoardGridをインポート
import ControlButtons from "./components/ControlButtons"; // ControlButtonsをインポート
import NumberPad from "./components/NumberPad"; // NumberPadをインポート

function SudokuBoard() {
  const initialBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  const [board, setBoard] = useState(initialBoard);
  const [originalBoard, setOriginalBoard] = useState(null); // 問題を保存する
  const [selectedCell, setSelectedCell] = useState(null); // タップされたセル
  const [problemCells, setProblemCells] = useState([]); // 問題としてセットされたセルの座標
  const [errorCells, setErrorCells] = useState([]); // ユーザー入力が誤っているセルの座標
  const [isChecking, setIsChecking] = useState(false); // チェック中の状態
  const [isProblemSet, setIsProblemSet] = useState(false); // 問題がセットされているかどうか

  // セルが変更されたとき（問題セルは変更不可）
  const handleChangeCell = (row, col, value) => {
    if (problemCells.some(([r, c]) => r === row && c === col)) return; // 問題セルは変更不可
    const val = parseInt(value) || 0;
    const newBoard = board.map((rArr) => rArr.slice());
    newBoard[row][col] = val;
    setBoard(newBoard);
  
    // 誤りが修正された場合、errorCellsからそのセルを削除
    setErrorCells((prevErrorCells) =>
      prevErrorCells.filter(([r, c]) => !(r === row && c === col))
    );
  };

  // セルをタップ（問題セルの場合は選択しない）
  const handleCellClick = (row, col) => {
    if (problemCells.some(([r, c]) => r === row && c === col)) return;
    setSelectedCell({ row, col });
  };

  // 数字を入力
  const handleNumberClick = (num) => {
    if (selectedCell) {
      handleChangeCell(selectedCell.row, selectedCell.col, num);
      setSelectedCell(null);
    }
  };

  // 問題をセットまたは解除
  // 問題をセットまたは解除
const handleSetOrUnsetProblem = () => {
  console.log("isProblemSet before:", isProblemSet); // デバッグ用ログ
  if (isProblemSet) {
    // 問題のセットを解除
    setOriginalBoard(null);
    setProblemCells([]);
    setIsProblemSet(false);
    console.log("Problem unset. isProblemSet after:", false); // デバッグ用ログ
    alert("問題のセットを解除しました！");
  } else {
    // 問題をセット
    setOriginalBoard(board.map((row) => [...row]));
    const fixedCells = board
      .flatMap((row, r) =>
        row.map((cell, c) => (cell !== 0 ? [r, c] : null))
      )
      .filter(Boolean);
    setProblemCells(fixedCells);
    setErrorCells([]);
    setIsProblemSet(true);
    console.log("Problem set. isProblemSet after:", true); // デバッグ用ログ
    alert("問題がセットされました！");
  }
};


  // 解答リクエスト
  const handleSubmit = async () => {
    try {
      const response = await axios.post("https://numplay.onrender.com/solve", {
        board: board,
      });
      if (response.data.status === "ok") {
        setBoard(response.data.solution);
        setErrorCells([]);
      } else {
        alert("解けませんでした: " + response.data.message);
      }
    } catch (error) {
      alert("サーバーへのリクエストでエラーが発生しました。");
    }
  };

  // 解答のみ消す
  const handleClearSolution = () => {
    if (!originalBoard) {
      alert("問題をセットしてください！");
      return;
    }
    const newBoard = originalBoard.map((row) => [...row]);
    setBoard(newBoard);
    setErrorCells([]);
  };

  // すべてリセット
  const handleResetBoard = () => {
    setBoard(initialBoard.map((row) => [...row]));
    setOriginalBoard(null);
    setProblemCells([]);
    setErrorCells([]);
    setIsProblemSet(false); // 問題のセットも解除
  };

  // 部分チェック機能
  const handleCheckPartialSolution = async () => {
    if (!originalBoard) {
      alert("問題をセットしてください！");
      return;
    }

    setIsChecking(true);
    try {
      const response = await axios.post("https://numplay.onrender.com/solve", {
        board: originalBoard,
      });

      if (response.data.status === "ok") {
        const solution = response.data.solution;
        const errors = [];

        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0 && board[i][j] !== solution[i][j]) {
              errors.push([i, j]);
            }
          }
        }

        setErrorCells(errors);
        alert(errors.length === 0
          ? "✅ 入力された値はすべて正しいです！"
          : `❌ ${errors.length}箇所の誤りがあります！`
        );
      } else {
        alert("正解が取得できませんでした: " + response.data.message);
      }
    } catch (error) {
      alert("サーバーへのリクエストでエラーが発生しました。");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Sudoku Solver</h1>
      <BoardGrid
        board={board}
        problemCells={problemCells}
        errorCells={errorCells}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
      />
      {selectedCell && <NumberPad onNumberClick={handleNumberClick} />}
      <ControlButtons
        onSetOrUnsetProblem={handleSetOrUnsetProblem}
        onSubmit={handleSubmit}
        onCheckPartial={handleCheckPartialSolution}
        onClearSolution={handleClearSolution}
        onReset={handleResetBoard}
        disableCheck={isChecking}
        isProblemSet={isProblemSet} // 問題がセットされているかどうかを渡す
      />
    </div>
  );
}

export default SudokuBoard;