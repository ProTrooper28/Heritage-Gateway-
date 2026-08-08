import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { MonumentAnnotation } from "../types";
import { projectionStore } from "../lib/projectionStore";

export function MonumentAnnotations({
  annotations,
  activeId,
  onSelect,
}: {
  annotations: MonumentAnnotation[];
  activeId: number | null;
  onSelect: (annotation: MonumentAnnotation) => void;
}) {
  // Re-render whenever the canvas updates any projection (version bump).
  useSyncExternalStore(projectionStore.subscribe, projectionStore.getVersion);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {annotations.map((annotation) => {
        const point = projectionStore.getPoint(annotation.id);
        if (!point || !point.visible) return null;
        const isActive = activeId === annotation.id;
        return (
          <div
            key={annotation.id}
            className="absolute"
            style={{
              left: point.x,
              top: point.y,
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
            }}
          >
            <Marker annotation={annotation} isActive={isActive} onSelect={onSelect} />
          </div>
        );
      })}
    </div>
  );
}

function Marker({
  annotation,
  isActive,
  onSelect,
}: {
  annotation: MonumentAnnotation;
  isActive: boolean;
  onSelect: (annotation: MonumentAnnotation) => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.22 }}
      whileTap={{ scale: 0.92 }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(annotation);
      }}
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={`Annotation ${annotation.index}: ${annotation.title}`}
      className="relative flex items-center justify-center rounded-full cursor-pointer select-none"
      style={{
        width: isActive ? 46 : 38,
        height: isActive ? 46 : 38,
        background: isActive
          ? "linear-gradient(135deg, oklch(0.85 0.14 85), oklch(0.68 0.08 78))"
          : "oklch(0.08 0.005 60 / 0.72)",
        backdropFilter: "blur(8px)",
        border: isActive ? "none" : "1px solid oklch(0.79 0.11 82 / 0.65)",
        boxShadow: isActive
          ? "0 0 0 6px oklch(0.79 0.11 82 / 0.18), 0 10px 30px oklch(0 0 0 / 0.5)"
          : "0 6px 20px oklch(0 0 0 / 0.45)",
        transition: "width 0.25s ease, height 0.25s ease",
      }}
    >
      {/* Pulsing halo */}
      {!isActive && (
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          style={{ border: "1px solid oklch(0.79 0.11 82 / 0.5)" }}
        />
      )}
      <span
        className="font-sans font-semibold"
        style={{
          fontSize: isActive ? "0.8rem" : "0.68rem",
          letterSpacing: "0.08em",
          color: isActive ? "oklch(0.13 0.008 60)" : "oklch(0.86 0.1 85)",
          transition: "font-size 0.25s ease",
        }}
      >
        {annotation.index}
      </span>

      {/* Tooltip on hover */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-3.5 py-2 rounded-xl whitespace-nowrap pointer-events-none"
            style={{
              background: "oklch(0.1 0.006 60 / 0.92)",
              backdropFilter: "blur(12px)",
              border: "1px solid oklch(0.79 0.11 82 / 0.3)",
              boxShadow: "0 10px 30px oklch(0 0 0 / 0.5)",
            }}
          >
            <p className="font-serif text-sm text-parchment whitespace-nowrap">
              {annotation.title}
            </p>
            <p className="font-sans text-[0.55rem] uppercase tracking-[0.2em] text-gold/70 mt-0.5">
              {annotation.subtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
