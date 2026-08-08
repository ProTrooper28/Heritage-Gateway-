import { motion, AnimatePresence } from "framer-motion";
import { X, Landmark, ShieldCheck, BookOpen, Calendar } from "lucide-react";

import type { MonumentAnnotation } from "../types";
import { CONFIDENCE_EXPLANATIONS } from "../types";
import { useIsMobile } from "../../../hooks/use-mobile";

const CONFIDENCE_COLOR: Record<string, string> = {
  High: "oklch(0.72 0.14 150)",
  Medium: "oklch(0.79 0.11 82)",
  Low: "oklch(0.68 0.18 40)",
};

function PanelBody({
  annotation,
  onClose,
  mobile = false,
}: {
  annotation: MonumentAnnotation;
  onClose: () => void;
  mobile?: boolean;
}) {
  return (
    <div className="relative flex flex-col max-h-full overflow-hidden rounded-t-3xl md:rounded-3xl"
      style={{
        background: "linear-gradient(160deg, oklch(0.16 0.01 60 / 0.97), oklch(0.1 0.006 60 / 0.98))",
        backdropFilter: "blur(24px)",
        border: "1px solid oklch(0.79 0.11 82 / 0.25)",
        boxShadow: "0 32px 90px -20px oklch(0 0 0 / 0.85)",
      }}
    >
      {/* Drag handle (mobile) */}
      {mobile && (
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "oklch(0.96 0.012 85 / 0.2)" }} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-parchment/8">
        <div className="flex items-start gap-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
            style={{
              background: "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.3), oklch(0.79 0.11 82 / 0.08))",
              border: "1px solid oklch(0.79 0.11 82 / 0.4)",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.1rem",
              color: "oklch(0.86 0.1 85)",
            }}
          >
            {annotation.index}
          </div>
          <div>
            <p className="font-sans text-[0.58rem] uppercase tracking-[0.3em] text-gold/75 mb-1">
              {annotation.subtitle}
            </p>
            <h3 className="font-serif text-2xl text-parchment leading-tight">{annotation.title}</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-colors"
          style={{
            background: "oklch(0.96 0.012 85 / 0.06)",
            border: "1px solid oklch(0.96 0.012 85 / 0.1)",
            color: "oklch(0.96 0.012 85 / 0.6)",
          }}
          aria-label="Close annotation panel"
        >
          <X size={15} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-6 scrollbar-hide">
        <p className="font-sans text-sm text-parchment/75 leading-relaxed">
          {annotation.description}
        </p>

        <DetailBlock icon={<Landmark size={14} />} label="Historical significance">
          {annotation.historicalSignificance}
        </DetailBlock>

        <DetailBlock icon={<BookOpen size={14} />} label="Architectural details">
          {annotation.architecturalDetails}
        </DetailBlock>

        <div className="flex items-center gap-2 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-parchment/45">
          <Calendar size={12} className="text-gold" />
          Historical period: <span className="text-parchment/75">{annotation.periodLabel}</span>
        </div>

        {/* Confidence */}
        <div className="rounded-2xl p-4" style={{ background: "oklch(0.96 0.012 85 / 0.04)", border: "1px solid oklch(0.96 0.012 85 / 0.08)" }}>
          <div className="flex items-center gap-2.5 mb-2">
            <ShieldCheck size={14} style={{ color: CONFIDENCE_COLOR[annotation.confidence] }} />
            <span className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-parchment/60">
              Evidence confidence
            </span>
            <span
              className="ml-auto px-2.5 py-1 rounded-full font-sans text-[0.58rem] uppercase tracking-[0.15em] font-semibold"
              style={{
                color: CONFIDENCE_COLOR[annotation.confidence],
                background: `color-mix(in oklab, ${CONFIDENCE_COLOR[annotation.confidence]} 12%, transparent)`,
                border: `1px solid color-mix(in oklab, ${CONFIDENCE_COLOR[annotation.confidence]} 35%, transparent)`,
              }}
            >
              {annotation.confidence}
            </span>
          </div>
          <p className="font-sans text-xs text-parchment/50 leading-relaxed">
            {CONFIDENCE_EXPLANATIONS[annotation.confidence]}
          </p>
        </div>

        {/* Evidence */}
        <div>
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.25em] text-parchment/45 mb-3">
            Evidence sources
          </p>
          <ul className="space-y-2">
            {annotation.evidence.map((item) => (
              <li key={item} className="flex items-center gap-2.5 font-sans text-xs text-parchment/70">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "oklch(0.79 0.11 82 / 0.7)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function AnnotationPanel({
  annotation,
  onClose,
}: {
  annotation: MonumentAnnotation | null;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();

  return (
    <AnimatePresence>
      {annotation && !isMobile && (
        <motion.aside
          key="desktop-panel"
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-4 bottom-4 right-4 w-[22rem] max-w-[calc(100%-2rem)] z-20"
        >
          <PanelBody annotation={annotation} onClose={onClose} />
        </motion.aside>
      )}

      {annotation && isMobile && (
        <motion.div
          key="mobile-sheet"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[70] max-h-[68vh]"
        >
          <PanelBody annotation={annotation} onClose={onClose} mobile />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5"
        style={{ background: "oklch(0.79 0.11 82 / 0.1)", border: "1px solid oklch(0.79 0.11 82 / 0.2)", color: "oklch(0.79 0.11 82)" }}
      >
        {icon}
      </div>
      <div>
        <p className="font-sans text-[0.6rem] uppercase tracking-[0.25em] text-gold/70 mb-1.5">{label}</p>
        <p className="font-sans text-sm text-parchment/70 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
