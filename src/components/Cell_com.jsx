// src/components/Cell.jsx
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
        style={{ width: "50px", height: "50px", border: "1px solid black" }}
      >
        {value || ""}
      </div>
    );
    
}
