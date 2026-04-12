import type { ReactNode } from "react";

interface HudFrameProps {
  children: ReactNode;
  className?: string;
  glowing?: boolean;
}

export default function HudFrame({
  children,
  className = "",
  glowing = false,
}: HudFrameProps) {
  const cornerStyle = { borderColor: "rgba(255, 195, 0, 0.35)" };

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 pointer-events-none"
        style={cornerStyle}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 pointer-events-none"
        style={cornerStyle}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 pointer-events-none"
        style={cornerStyle}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 pointer-events-none"
        style={cornerStyle}
      />
      {glowing && (
        <div className="absolute inset-0 hud-glow pointer-events-none" />
      )}
      {children}
    </div>
  );
}
