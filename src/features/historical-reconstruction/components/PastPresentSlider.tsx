import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal, ChevronsLeftRight } from "lucide-react";

export function PastPresentSlider({
  pastImage,
  presentImage,
  pastLabel,
  presentLabel,
}: {
  pastImage: string;
  presentImage: string;
  pastLabel: string;
  presentLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(96, Math.max(4, pct)));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[2rem] overflow-hidden select-none"
      style={{
        border: "1px solid oklch(0.79 0.11 82 / 0.2)",
        boxShadow: "0 28px 80px -28px oklch(0 0 0 / 0.9)",
        touchAction: "none",
        cursor: "ew-resize",
      }}
      ref={containerRef}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Present (base layer) */}
        <img
          src={presentImage}
          alt={presentLabel}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "saturate(0.92) brightness(0.9)" }}
        />
        {/* Past (clipped layer) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={pastImage}
            alt={pastLabel}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "sepia(0.5) saturate(0.8) brightness(0.72) contrast(1.08)" }}
          />
        </div>

        {/* Gradient hint on past side */}
        <div
          className="absolute inset-y-0 left-0 w-24 pointer-events-none"
          style={{ background: "linear-gradient(90deg, oklch(0.1 0.006 60 / 0.35), transparent)" }}
        />

        {/* Labels */}
        <div className="absolute top-5 left-5 pointer-events-none">
          <span className="px-3 py-1.5 rounded-full font-sans text-[0.58rem] uppercase tracking-[0.22em]"
            style={{ background: "oklch(0.08 0.005 60 / 0.75)", backdropFilter: "blur(8px)", border: "1px solid oklch(0.79 0.11 82 / 0.35)", color: "oklch(0.86 0.1 85)" }}
          >
            {pastLabel}
          </span>
        </div>
        <div className="absolute top-5 right-5 pointer-events-none">
          <span className="px-3 py-1.5 rounded-full font-sans text-[0.58rem] uppercase tracking-[0.22em]"
            style={{ background: "oklch(0.08 0.005 60 / 0.75)", backdropFilter: "blur(8px)", border: "1px solid oklch(0.96 0.012 85 / 0.2)", color: "oklch(0.96 0.012 85 / 0.8)" }}
          >
            {presentLabel}
          </span>
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{ left: `${position}%`, width: 2, background: "oklch(0.85 0.14 85)", boxShadow: "0 0 18px oklch(0.79 0.11 82 / 0.7)" }}
        >
          {/* Handle */}
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
            style={{
              width: 46,
              height: 46,
              background: "linear-gradient(135deg, oklch(0.85 0.14 85), oklch(0.68 0.08 78))",
              boxShadow: "0 8px 26px oklch(0 0 0 / 0.5), 0 0 0 6px oklch(0.79 0.11 82 / 0.2)",
            }}
          >
            <ChevronsLeftRight size={19} className="text-ink" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 py-3.5"
        style={{ background: "linear-gradient(150deg, oklch(0.96 0.012 85 / 0.05), oklch(0.13 0.008 60 / 0.85))" }}
      >
        <MoveHorizontal size={13} className="text-gold/70" />
        <span className="font-sans text-[0.58rem] uppercase tracking-[0.24em] text-parchment/45">
          Drag to compare · past ⇄ present
        </span>
      </div>
    </motion.div>
  );
}
