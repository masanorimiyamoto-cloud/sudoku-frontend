// src/components/Cell_com.jsx
import React from "react";

export default function Cell({
  value,
  isFixed,
  isError,
  isSelected,
  onClick,
}) {
  const baseClass = "sudoku-cell";
  const className = [
    baseClass,
    isFixed && "fixed",
    isError && "error",
    isSelected && "selected",
  ]
    .filter(Boolean)
    .join(" ");

    return (
      <div
        className={className}
        onClick={onClick}
        style={{
          width: "40px",
          height: "40px",
          border: "1px solid black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value || ""}
      </div>
    );
    
}
