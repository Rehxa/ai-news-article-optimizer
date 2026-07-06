"use client";

import { useRef, useState, useEffect } from "react";

const SIZE_CONFIGS = {
  big: {
    width: 280,
    height: 200,
    maxWidth: "290px",
    maxHeight: "190px",
    borderRadius: "16px",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) ",
    backgroundColor: "#F8F8FF",
    blueWidth: "80%",
    blueHeight: "82%",
    blueMaxWidth: "217px",
    blueMaxHeight: "155px",
    blueBorderRadius: "16px",
    blueBoxShadow: "none",
    iconSize: "!text-6xl",
    particles: [
      { size: 129.02, left: -62, top: -61, rotation: 4.74, color: "#5281C7" },
      { size: 129.02, left: 147, top: 53, rotation: 4.74, color: "#5281C7" },
      { size: 129.02, left: 106, top: 98, rotation: 4.74, color: "#FFFFFF" },
    ],
  },
  small: {
    width: 67,
    height: 50,
    maxWidth: "67px",
    maxHeight: "50px",
    borderRadius: "8px",
    boxShadow: "none",
    backgroundColor: "transparent",
    blueWidth: "80%",
    blueHeight: "82%",
    blueMaxWidth: "52px",
    blueMaxHeight: "38px",
    blueBorderRadius: "6px",
    iconSize: "!text-2xl",
    blueBoxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) ",
    particles: [
      { size: 30.5, left: -14.5, top: -14.5, rotation: 4.74, color: "#5281C7" },
      { size: 30.5, left: 34, top: 12.5, rotation: 4.74, color: "#5281C7" },
      { size: 30.5, left: 25, top: 23, rotation: 4.74, color: "#FFFFFF" },
    ],
  },
};

export default function AddNewCard({ onClick, variant = "big" }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const config = SIZE_CONFIGS[variant] || SIZE_CONFIGS.big;
  const { width: DESIGN_WIDTH, height: DESIGN_HEIGHT, particles } = config;

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const actualWidth = containerRef.current.offsetWidth;
      const scaleRatio = actualWidth / DESIGN_WIDTH;
      setScale(scaleRatio);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [DESIGN_WIDTH]);

  return (
    <div
      ref={containerRef}
      className="hover:cursor-pointer hover:opacity-80 flex justify-center items-center place-self-center"
      style={{
        maxWidth: config.maxWidth,
        maxHeight: config.maxHeight,
        aspectRatio: `${DESIGN_WIDTH}/${DESIGN_HEIGHT}`,
        width: "100%",
        borderRadius: config.borderRadius,
        boxShadow: config.boxShadow,
        backgroundColor: config.backgroundColor,
      }}
      onClick={onClick}
    >
      {/* Blue background area */}
      <div
        className="relative bg-natural-sky-blue overflow-hidden flex justify-center items-center"
        style={{
          width: config.blueWidth,
          height: config.blueHeight,
          maxWidth: config.blueMaxWidth,
          maxHeight: config.blueMaxHeight,
          borderRadius: config.blueBorderRadius,
          boxShadow: config.blueBoxShadow,
        }}
      >
        {/* Plus icon - Material Symbols */}
        <div className="relative z-10 drop-shadow-md">
          <span
            className={`material-symbols-rounded text-white ${config.iconSize} select-none icon-fill`}
          >
            add
          </span>
        </div>

        {/* Decorative particles */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            width: `${DESIGN_WIDTH}px`,
            height: `${DESIGN_HEIGHT}px`,
          }}
        >
          {particles.map((particle, idx) => (
            <circle
              key={idx}
              cx={particle.left + particle.size / 2}
              cy={particle.top + particle.size / 2}
              r={particle.size / 2}
              fill={particle.color}
              style={{
                transform: `rotate(${particle.rotation}deg)`,
                transformOrigin: `${particle.left + particle.size / 2}px ${particle.top + particle.size / 2}px`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
