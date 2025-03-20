// src/components/ControlButtons.jsx
import React from "react";

export default function ControlButtons({
  onSetProblem,
  onSubmit,
  onCheckPartial,
  onClearSolution,
  onReset,
}) {
  return (
    <div style={{ marginTop: "20px" }}>
      <button
        type="button"
        onClick={onSetProblem}
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
        type="button"
        onClick={onSubmit}
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
        onClick={onCheckPartial}
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
        onClick={onClearSolution}
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
        onClick={onReset}
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
  );
}
