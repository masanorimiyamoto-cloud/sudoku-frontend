import React, { useState } from "react";
import axios from "axios";

function SudokuBoard() {
  const initialBoard = Array(9).fill(null).map(() => Array(9).fill(0));

  const [board, setBoard] = useState(initialBoard);
  const [originalBoard, setOriginalBoard] = useState(initialBoard); // 問題の元データ
  const [selectedCell, setSelectedCell] = useState(null); // タップされたセル

  // セルが変更されたとき
  const handleChangeCell = (row, col, value) => {
    const val = parseInt(value) || 0;
    const newBoard = board.map((rArr) => rArr.slice());
    newBoard[row][col] = val;
    setBoard(newBoard);
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

  // 解答のみ消す
  const handleClearSolution = () => {
    const newBoard = board.map((row, r) =>
      row.map((cell, c) => (originalBoard[r][c] !== 0 ? originalBoard[r][c] : 0))
    );
    setBoard(newBoard);
  };

  // すべてリセット
  const handleResetBoard = () => {
    setBoard(initialBoard);
    setOriginalBoard(initialBoard);
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
