"use client";

import { useState } from "react";

export default function ProgressCircle({ score, onOptimizedScore }) {
  const [spinning, setSpinning] = useState(false);

  const radius = 28;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const fillPercentage = score / 100;
  const strokeDashoffset = circumference * (1 - fillPercentage);

  const simulateRecalculate = (e) => {
    e.stopPropagation();
    if (spinning) return;

    setSpinning(true);

    setTimeout(() => {
      onOptimizedScore();
      setSpinning(false);
    }, 900);
  };

  return (
    <div className="relative w-18 h-18 flex items-center justify-center">
      {/* Circle SVG */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="36"
          cy="36"
          r={radius}
          className="stroke-slate-200"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          className="stroke-primary-blue transition-all duration-500 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Inside Text Overlay */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-[16px] font-extrabold text-dark-brown leading-none">
          {score}
        </span>
        <span className="text-[8px] font-bold text-slate-500 leading-none mt-0.5">
          / 100
        </span>
      </div>

      {/* Refresh Icon overlay at bottom right */}
      <button
        onClick={simulateRecalculate}
        className="absolute bottom-0 right-0 w-5.5 h-5.5 bg-white border border-slate-200/80 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-slate-100 transition-colors duration-150"
      >
        <span
          className={`material-symbols-outlined text-[11px] text-primary-blue ${
            spinning ? "animate-spin text-primary-blue" : ""
          }`}
        >
          autorenew
        </span>
      </button>
    </div>
  );
}
