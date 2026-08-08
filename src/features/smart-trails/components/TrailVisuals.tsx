import { motion } from "framer-motion";
import type { ReactNode } from "react";

// ─── Shared visual primitives for Smart Heritage Trails ──────────────────────
// Reuses the app's design language: Cormorant Garamond serif, Jost sans,
// gold accents, dark cinematic glass.

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const GOLD = "oklch(0.79 0.11 82)";
export const PARCHMENT = "oklch(0.96 0.012 85)";

/** Section eyebrow + serif title, matching the app's editorial style. */
export function TrailSectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className={center ? "text-center" : ""}
    >
      <p
        className="font-sans text-[0.62rem] uppercase tracking-[0.4em] mb-3"
        style={{ color: "oklch(0.79 0.11 82 / 0.8)" }}
      >
        {eyebrow}
      </p>
      <h2
        className="font-serif text-3xl md:text-4xl font-light tracking-[-0.02em] text-parchment leading-tight"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-sm font-light text-parchment/50 mt-3 max-w-xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/** Floating glass panel with the app's signature gold-tinted blur. */
export function GlassPanel({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(150deg, oklch(0.96 0.012 85 / 0.06), oklch(0.13 0.008 60 / 0.72))",
        backdropFilter: "blur(24px) saturate(130%)",
        border: "1px solid oklch(0.79 0.11 82 / 0.16)",
        boxShadow:
          "0 24px 70px -30px oklch(0 0 0 / 0.9), inset 0 1px 0 oklch(0.96 0.012 85 / 0.08)",
        ...style,
      }}
    >
      {/* Top gold shimmer line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.79 0.11 82 / 0.5), transparent)",
        }}
      />
      {children}
    </div>
  );
}

/** Circular numbered badge used along the itinerary timeline. */
export function StopDot({
  index,
  isLast = false,
}: {
  index: number;
  isLast?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.28), oklch(0.79 0.11 82 / 0.08))",
          border: "1px solid oklch(0.79 0.11 82 / 0.45)",
          boxShadow: "0 0 20px oklch(0.79 0.11 82 / 0.25)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1rem",
          color: GOLD,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.div>
      {!isLast && (
        <div
          className="w-px flex-1 min-h-16 my-1"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.79 0.11 82 / 0.4), oklch(0.79 0.11 82 / 0.06))",
          }}
        />
      )}
    </div>
  );
}

/** Small gold-tinted pill tag. */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-sans text-[0.6rem] uppercase tracking-[0.18em]"
      style={{
        background: "oklch(0.79 0.11 82 / 0.1)",
        border: "1px solid oklch(0.79 0.11 82 / 0.25)",
        color: "oklch(0.86 0.1 85)",
      }}
    >
      {children}
    </span>
  );
}
