"use client";
import { formatDistanceToNow } from "date-fns";
import { useRef, useEffect, useState } from "react";

const Particle = ({ size, left, top, rotation, scale = 1 }) => {
  const scaledSize = size * scale;
  const scaledLeft = left * scale;
  const scaledTop = top * scale;
  const h = scaledSize * (Math.sqrt(3) / 2); // True height of the triangle
  const topPadding = (scaledSize - h) / 2; // Padding to center it vertically
  const bottomY = topPadding + h;
  return (
    <svg
      className="absolute"
      style={{
        width: `${scaledSize}px`,
        height: `${scaledSize}px`,
        left: `${scaledLeft}px`,
        top: `${scaledTop}px`,
        transform: `rotate(${rotation}deg)`,
        overflow: "visible",
      }}
      viewBox={`0 0 ${scaledSize} ${scaledSize}`}
    >
      <polygon
        points={`${scaledSize / 2},${topPadding} ${scaledSize},${bottomY} 0,${bottomY}`}
        fill="#5281C7"
      />
    </svg>
  );
};

export default function ArticleCard({
  title,
  description,
  updatedAt,
  onLongPressed,
  cancelLongPressed,
  isSelected = false,
  isSelectionState = false,
  mode,
  deletedAt,
  onClick,
  isDeleted = false,
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Design dimensions (from Figma)
  const DESIGN_WIDTH = 280;
  const DESIGN_HEIGHT = 200;

  const particles = [
    { size: 44.38, left: 187, top: 101, rotation: -43.43 },
    { size: 33.45, left: 225, top: 77, rotation: -18.67 },
    { size: 23.45, left: 205, top: 88, rotation: 7.9 },
    { size: 16.01, left: 231, top: 50, rotation: 51.52 },
    { size: 10.75, left: 211, top: 66, rotation: -34.15 },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const actualWidth = containerRef.current.offsetWidth;
        const scaleRatio = actualWidth / DESIGN_WIDTH;
        setScale(scaleRatio);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const LastSavedtimeAgo = formatDistanceToNow(new Date(updatedAt), {
    addSuffix: true,
  });
  const DeletedtimeAgo = formatDistanceToNow(new Date(deletedAt), {
    addSuffix: true,
  });

  return (
    <div
      onPointerDown={onLongPressed}
      onPointerUp={cancelLongPressed}
      onPointerLeave={cancelLongPressed}
      onPointerCancel={cancelLongPressed}
      onClick={onClick}
      ref={containerRef}
      className="w-full max-h-[196px] max-w-[290px] flex flex-col justify-center items-start gap-3 px-2 py-2 rounded-xl bg-tinted-white-blue shadow-md hover:cursor-pointer hover:opacity-80"
      style={{ aspectRatio: `${DESIGN_WIDTH}/${DESIGN_HEIGHT}` }}
    >
      {/* Content container with description and particles */}
      <div className="relative w-full flex-1 rounded-lg bg-white p-2 h-full overflow-hidden">
        {/* Title */}
        <div className="w-full flex flex-row gap-0.5">
          <div className="relative w-full h-7 overflow-hidden group">
            {/* The actual moving text positioned absolutely */}
            <h2 className="absolute left-0 top-0 font-geist font-bold text-sm leading-7 text-dark-brown z-10 whitespace-nowrap transition-transform duration-3000 ease-linear group-hover:translate-x-[calc(-100%+8.5rem)]">
              {title}
            </h2>
          </div>
          {isSelectionState && (
            <button className="material-symbols-rounded text-primary-blue cursor-pointer">
              {isSelected ? "check_circle" : "circle"}
            </button>
          )}
        </div>
        {/* Description text */}
        <p className="relative font-geist font-normal text-xs leading-5 text-dark-brown max-w-[187px] z-10 line-clamp-3 w-[80%]">
          {description}
        </p>
        {/* Decorative particles */}
        <div className="absolute overflow-hidden inset-0 z-0">
          {particles.map((particle, idx) => (
            <Particle key={idx} {...particle} scale={scale} />
          ))}
        </div>
      </div>

      {/* Saved footer */}
      <div className="flex items-center gap-2 z-10">
        <span className="material-symbols-outlined !text-sm text-accent-grey">
          history
        </span>
        <span className="font-geist font-normal text-xs leading-4 text-accent-grey">
          {mode == "my_article"
            ? "Saved: " + LastSavedtimeAgo
            : "Deleted: " + DeletedtimeAgo}
        </span>
      </div>
    </div>
  );
}
