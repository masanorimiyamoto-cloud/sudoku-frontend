import React, { useState } from "react";
import axios from "axios";

function SudokuBoard() {
  // 初期状態のボード（9x9のゼロ埋め）
  const initialBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  // React の state
  const [board, setBoard] = useState(initialBoard);
  const [isUserInput, setIsUserInput] = useState(
    Array(9).fill(null).map(() => Array(9).fill(false))
  );

  // セルの値が変更されたとき
  const handleChangeCell = (row, col, value) => {
    const val = parseInt(value) || 0;

    const newBoard = board.map((rArr) => rArr.slice());
    newBoard[row][col] = val;
    setBoard(newBoard);

    const newUserInput = isUserInput.map((rArr) => rArr.slice());
    newUserInput[row][col] = true; // ユーザー入力を記録
    setIsUserInput(newUserInput);
  };

  // 数独ソルバーAPIを呼ぶ
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://numplay.onrender.com/solve", {
        board: board
      });

      console.log("🟢 解答リクエスト送信: ", response.data);

      if (response.data.status === "ok") {
        setBoard(response.data.solution);
      } else {
        alert("解けませんでした: " + response.data.message);
      }
    } catch (error) {
      console.error("❌ 解答リクエストエラー: ", error);
      alert("サーバーへのリクエストでエラーが発生しました。");
    }
  };

  // 新しい問題を取得
  const fetchNewPuzzle = async () => {
    try {
      console.log("🟢 新しい問題をリクエスト中...");
      const response = await axios.get("https://numplay.onrender.com/generate", {
        headers: { "Content-Type": "application/json" },
        mode: "cors"
      });

      console.log("🟢 APIレスポンス: ", response.data);

      // まず board の中身を確かめる
      if (typeof response.data.board === "string") {
        // 1) カンマで split() すると、配列要素が 81 個になるはず
        const arr81 = response.data.board.split(",");

        // 2) 各要素を数値化 ("" は 0 とみなす)
        const arr81numbers = arr81.map(str => {
          if (str === "") return 0; // 空文字→0
          const num = parseInt(str, 10);
          return Number.isNaN(num) ? 0 : num; // 変換失敗→0
        });

        // 3) 9x9 に切り出す
        const newBoard = [];
        for (let i = 0; i < 9; i++) {
          newBoard.push(arr81numbers.slice(i * 9, i * 9 + 9));
        }

        setBoard(newBoard);
        setIsUserInput(Array(9).fill(null).map(() => Array(9).fill(false)));
      } else if (Array.isArray(response.data.board) && response.data.board.length === 81) {
        // 万が一、すでに Array(81) で来る場合の処理
        const arr81numbers = response.data.board.map(item =>
          typeof item === "string" ? parseInt(item, 10) : item
        );

        const newBoard = [];
        for (let i = 0; i < 9; i++) {
          newBoard.push(arr81numbers.slice(i * 9, i * 9 + 9));
        }
        setBoard(newBoard);
        setIsUserInput(Array(9).fill(null).map(() => Array(9).fill(false)));
      } else {
        console.error("❌ APIから不正なデータが返されました:", response.data.board);
        alert("問題の取得に失敗しました。");
      }

    } catch (error) {
      console.error("❌ 問題取得エラー: ", error);
      alert("問題の取得に失敗しました。");
    }
  };

  // JSXをreturn
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Sudoku Solver</h1>
      <form onSubmit={handleSubmit}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 40px)",
          gap: "2px",
          margin: "20px auto",
          maxWidth: "400px"
        }}>
          {board &&
            board.map((rowArr, r) =>
              rowArr.map((cellVal, c) => (
                <input
                  key={`${r}-${c}`}
                  type="number"
                  min="0"
                  max="9"
                  value={cellVal === 0 ? "" : cellVal}
                  onChange={(e) => handleChangeCell(r, c, e.target.value)}
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    fontSize: "16px",
                    backgroundColor: isUserInput[r][c] ? "white" : "#ddd",
                    fontWeight: isUserInput[r][c] ? "bold" : "normal",
                    border: `1px solid black`,
                    borderTop: r % 3 === 0 ? "3px solid black" : "1px solid gray",
                    borderLeft: c % 3 === 0 ? "3px solid black" : "1px solid gray"
                  }}
                />
              ))
            )}
        </div>
        <button type="submit" style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}>
          解答をリクエスト
        </button>
        <button type="button" onClick={fetchNewPuzzle} style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}>
          新しい問題
        </button>
      </form>
    </div>
  );
}

export default SudokuBoard;
