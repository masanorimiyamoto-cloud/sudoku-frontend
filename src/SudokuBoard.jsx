// src/SudokuBoard.jsx
import React, { useState } from "react";
import axios from "axios";
import BoardGrid from "./components/BoardGrid";

function SudokuBoard() {
  const initialBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  const [board, setBoard] = useState(initialBoard);
  const [originalBoard, setOriginalBoard] = useState(null); // 問題を保存する
  const [selectedCell, setSelectedCell] = useState(null); // タップされたセル
  const [problemCells, setProblemCells] = useState([]); // 問題としてセットされたセルの座標
  const [errorCells, setErrorCells] = useState([]); // ユーザー入力が誤っているセルの座標

  // セルが変更されたとき（問題セルは変更不可）
  const handleChangeCell = (row, col, value) => {
    // 問題セルは変更不可
    if (problemCells.some(([r, c]) => r === row && c === col)) return;
    const val = parseInt(value) || 0;
    const newBoard = board.map((rArr) => rArr.slice());
    newBoard[row][col] = val;
    setBoard(newBoard);
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

  // 問題をセット（originalBoard に保存し、固定セルを記録）
  const handleSetProblem = () => {
    setOriginalBoard(board.map((row) => [...row])); // 現在の board をコピーして保存
    const fixedCells = board
      .flatMap((row, r) =>
        row.map((cell, c) => (cell !== 0 ? [r, c] : null))
      )
      .filter(Boolean);
    setProblemCells(fixedCells);
    setErrorCells([]); // 問題セット時はエラーセルはリセット
    alert("問題がセットされました！");
  };

  // 解答リクエスト
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://numplay.onrender.com/solve", {
        board: board,
      });
      if (response.data.status === "ok") {
        setBoard(response.data.solution);
        setErrorCells([]); // 解答後はエラーセルもリセット
      } else {
        alert("解けませんでした: " + response.data.message);
      }
    } catch (error) {
      alert("サーバーへのリクエストでエラーが発生しました。");
    }
  };

  // 解答のみ消す（originalBoard を基にリセット）
  const handleClearSolution = () => {
    if (!originalBoard) {
      alert("問題をセットしてください！");
      return;
    }
    const newBoard = originalBoard.map((row) => [...row]); // originalBoard を元に戻す
    setBoard(newBoard);
    setErrorCells([]); // エラーセルもクリア
  };

  // すべてリセット（完全にクリア）
  const handleResetBoard = () => {
    setBoard(initialBoard.map((row) => [...row]));
    setOriginalBoard(null);
    setProblemCells([]);
    setErrorCells([]);
  };

  // 部分チェック機能
  const handleCheckPartialSolution = async () => {
    if (!originalBoard) {
      alert("問題をセットしてください！");
      return;
    }
    try {
      // 正解は問題セット時の originalBoard から取得
      const response = await axios.post("https://numplay.onrender.com/solve", {
        board: originalBoard,
      });
      if (response.data.status === "ok") {
        const solution = response.data.solution;
        let errors = [];
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            // ユーザーが入力済みで、かつ正解と異なる場合はエラーとする
            if (board[i][j] !== 0 && board[i][j] !== solution[i][j]) {
              errors.push([i, j]);
            }
          }
        }
        setErrorCells(errors);
        if (errors.length === 0) {
          alert("入力された値はすべて正しいです！");
        } else {
          alert("いくつかのセルに誤りがあります！");
        }
      } else {
        alert("正解が取得できませんでした: " + response.data.message);
      }
    } catch (error) {
      alert("サーバーへのリクエストでエラーが発生しました。");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Sudoku Solver</h1>
      <form onSubmit={handleSubmit}>
        <BoardGrid
          board={board}
          problemCells={problemCells}
          errorCells={errorCells}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
        />

        {/* 数字キーパッド */}
        {selectedCell && (
          <div style={{ marginTop: "10px" }}>
            <p>数字を選択:</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 60px)",
                gap: "5px",
                justifyContent: "center",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "20px",
                    borderRadius: "10px",
                    border: "1px solid gray",
                    cursor: "pointer",
                  }}
                >
                  {num}
                </button>
              ))}
              {/* 空白ボタン（削除） */}
              <button
                onClick={() => handleNumberClick(0)}
                style={{
                  width: "180px",
                  height: "60px",
                  fontSize: "20px",
                  backgroundColor: "#ff6666",
                  color: "white",
                  borderRadius: "10px",
                  border: "1px solid gray",
                  cursor: "pointer",
                  gridColumn: "span 3",
                }}
              >
                削除
              </button>
            </div>
          </div>
        )}

        {/* ボタンエリア */}
        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            onClick={handleSetProblem}
            style={{
              margin: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            問題をセット
          </button>

          <button
            type="submit"
            style={{
              margin: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            解答をリクエスト
          </button>

          <button
            type="button"
            onClick={handleCheckPartialSolution}
            style={{
              margin: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#6A5ACD",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            部分チェック
          </button>

          <button
            type="button"
            onClick={handleClearSolution}
            style={{
              margin: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#FFA500",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            解答を消す
          </button>

          <button
            type="button"
            onClick={handleResetBoard}
            style={{
              margin: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#DC143C",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            すべてリセット
          </button>
        </div>
      </form>
    </div>
  );
}

export default SudokuBoard;
