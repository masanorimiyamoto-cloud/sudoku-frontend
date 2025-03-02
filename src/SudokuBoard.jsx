import React, { useState } from "react";
import axios from "axios";

function SudokuBoard() {
  const initialBoard = Array(9).fill(null).map(() => Array(9).fill(0));

  const [board, setBoard] = useState(initialBoard);
  const [originalBoard, setOriginalBoard] = useState(initialBoard.map(row => [...row])); // 元の問題のデータ
  const [selectedCell, setSelectedCell] = useState(null); // タップされたセル

  // セルが変更されたとき
  const handleChangeCell = (row, col, value) => {
    const val = parseInt(value) || 0;
    const newBoard = board.map((rArr) => rArr.slice());
    newBoard[row][col] = val;
    setBoard(newBoard);

    // 初回入力時に originalBoard を更新（ユーザー入力を保存）
    if (originalBoard[row][col] === 0) {
      const newOriginalBoard = originalBoard.map(row => [...row]);
      newOriginalBoard[row][col] = val;
      setOriginalBoard(newOriginalBoard);
    }
  };

  // セルをタップ
  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  // 数字を入力
  const handleNumberClick = (num) => {
    if (selectedCell) {
      handleChangeCell(selectedCell.row, selectedCell.col, num);
      setSelectedCell(null);
    }
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
      } else {
        alert("解けませんでした: " + response.data.message);
      }
    } catch (error) {
      alert("サーバーへのリクエストでエラーが発生しました。");
    }
  };

  // 解答のみ消す（ユーザーが入力したマスを残す）
  const handleClearSolution = () => {
    const newBoard = board.map((row, r) =>
      row.map((cell, c) => (originalBoard[r][c] !== 0 ? originalBoard[r][c] : 0))
    );
    setBoard(newBoard);
  };

  // すべてリセット（完全にクリア）
  const handleResetBoard = () => {
    setBoard(initialBoard.map(row => [...row]));
    setOriginalBoard(initialBoard.map(row => [...row]));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Sudoku Solver</h1>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(9, 50px)",
            gap: "2px",
            margin: "20px auto",
            maxWidth: "500px",
          }}
        >
          {board.map((rowArr, r) =>
            rowArr.map((cellVal, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "20px",
                  backgroundColor:
                    selectedCell?.row === r && selectedCell?.col === c
                      ? "lightblue"
                      : "white",
                  fontWeight: "bold",
                  border: `1px solid black`,
                  borderTop: r % 3 === 0 ? "3px solid black" : "1px solid gray",
                  borderLeft: c % 3 === 0 ? "3px solid black" : "1px solid gray",
                  cursor: "pointer",
                }}
              >
                {cellVal !== 0 ? cellVal : ""}
              </div>
            ))
          )}
        </div>

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
      
