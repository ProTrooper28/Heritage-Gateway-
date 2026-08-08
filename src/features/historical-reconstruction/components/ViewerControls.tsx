import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Orbit, Maximize, Minimize, Move3d } from "lucide-react";

function ControlButton({
  label,
  active = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      aria-label={label}
      title={label}
      className="relative flex items-center justify-center rounded-xl"
      style={{
        width: 42,
        height: 42,
        background: active
          ? "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))"
          : "oklch(0.08 0.005 60 / 0.7)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${
          active ? "transparent" : hovered ? "oklch(0.79 0.11 82 / 0.5)" : "oklch(0.96 0.012 85 / 0.12)"
        }`,
        color: active ? "oklch(0.13 0.008 60)" : hovered ? "oklch(0.86 0.1 85)" : "oklch(0.96 0.012 85 / 0.6)",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </motion.button>
  );
}

export function ViewerControls({
  autoRotate,
  onToggleAutoRotate,
  onReset,
  onToggleFullscreen,
  isFullscreen,
}: {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <ControlButton label="Reset view" onClick={onReset}>
        <RotateCcw size={16} />
      </ControlButton>
      <ControlButton label={autoRotate ? "Stop auto-rotation" : "Auto-rotate"} active={autoRotate} onClick={onToggleAutoRotate}>
        <Orbit size={16} />
      </ControlButton>
      <ControlButton label="Fullscreen" onClick={onToggleFullscreen}>
        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
      </ControlButton>
      <div className="hidden md:flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 mt-1"
        style={{ background: "oklch(0.08 0.005 60 / 0.7)", border: "1px solid oklch(0.96 0.012 85 / 0.1)" }}
      >
        <Move3d size={13} style={{ color: "oklch(0.79 0.11 82 / 0.7)" }} />
        <span className="font-sans text-[0.5rem] uppercase tracking-[0.18em] text-parchment/45">
          Drag · Scroll
        </span>
      </div>
    </div>
  );
}
