// src/components/NumberPad.jsx
import React from "react";

export default function NumberPad({ onNumberClick }) {
  return (
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
            onClick={() => onNumberClick(num)}
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
          onClick={() => onNumberClick(0)}
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
  );
}
