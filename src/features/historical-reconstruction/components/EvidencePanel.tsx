import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ShieldCheck, Landmark } from "lucide-react";

import type { EvidenceSource, Monument, MonumentPeriod } from "../types";
import { CONFIDENCE_EXPLANATIONS } from "../types";
import { useIsMobile } from "../../../hooks/use-mobile";

const GROUPS: { key: string; title: string; types: string[] }[] = [
  { key: "paintings", title: "Historical Images & Paintings", types: ["Painting"] },
  { key: "photographs", title: "Photographs", types: ["Photograph"] },
  { key: "records", title: "Architectural Records", types: ["Architectural Record"] },
  { key: "archaeology", title: "Archaeological Sources", types: ["Archaeology", "Inscription"] },
  { key: "archive", title: "Museum / Archive Sources", types: ["Archive", "Travelogue", "Historical Record"] },
];

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const color =
    confidence === "High" ? "oklch(0.72 0.14 150)" : confidence === "Medium" ? "oklch(0.79 0.11 82)" : "oklch(0.68 0.18 40)";
  return (
    <span
      className="px-3 py-1.5 rounded-full font-sans text-[0.62rem] uppercase tracking-[0.18em] font-semibold"
      style={{
        color,
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in oklab, ${color} 40%, transparent)`,
      }}
    >
      {confidence}
    </span>
  );
}

function EvidenceBody({ monument, period, onClose }: { monument: Monument; period: MonumentPeriod; onClose: () => void }) {
  const confidence = period.reconstruction?.confidence ?? "Medium";
  const grouped = useMemo(() => {
    return GROUPS.map((group) => ({
      ...group,
      items: monument.sources.filter((s) => group.types.includes(s.type)),
    })).filter((g) => g.items.length > 0);
  }, [monument.sources]);

  return (
    <div className="relative flex flex-col max-h-full overflow-hidden">
      {/* Header */}
      <div className="px-7 pt-7 pb-5 border-b border-parchment/8 flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-[0.58rem] uppercase tracking-[0.3em] text-gold/80 mb-1.5">
            Evidence · {monument.name}
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-parchment">Viewing the evidence</h3>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
          style={{ background: "oklch(0.96 0.012 85 / 0.06)", border: "1px solid oklch(0.96 0.012 85 / 0.12)", color: "oklch(0.96 0.012 85 / 0.6)" }}
          aria-label="Close evidence panel"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-7 py-6 space-y-8 scrollbar-hide">
        {/* Confidence summary */}
        <div className="rounded-2xl p-5" style={{ background: "oklch(0.96 0.012 85 / 0.04)", border: "1px solid oklch(0.96 0.012 85 / 0.08)" }}>
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={16} className="text-gold" />
            <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-parchment/60">
              Evidence confidence — reconstruction of {period.year}
            </span>
            <span className="ml-auto">
              <ConfidenceBadge confidence={confidence} />
            </span>
          </div>
          <p className="font-sans text-xs text-parchment/55 leading-relaxed">
            {period.reconstruction
              ? period.reconstruction.confidenceNote
              : CONFIDENCE_EXPLANATIONS[confidence]}
          </p>
        </div>

        {/* Source groups */}
        {grouped.map((group) => (
          <div key={group.key}>
            <p className="font-sans text-[0.6rem] uppercase tracking-[0.25em] text-parchment/45 mb-4">
              {group.title}
            </p>
            <div className="space-y-3">
              {group.items.map((source) => (
                <SourceRow key={source.id} source={source} />
              ))}
            </div>
          </div>
        ))}

        <p className="flex items-start gap-2 font-sans text-[0.7rem] text-parchment/35 leading-relaxed pt-2 border-t border-parchment/8">
          <Landmark size={13} className="text-gold/60 shrink-0 mt-0.5" />
          Reconstructions are never presented as confirmed historical fact — every visual links back to the sources above.
        </p>
      </div>
    </div>
  );
}

function SourceRow({ source }: { source: EvidenceSource }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl p-4 transition-colors duration-300 hover:border-gold/30"
      style={{ background: "oklch(0.96 0.012 85 / 0.03)", border: "1px solid oklch(0.96 0.012 85 / 0.08)" }}
    >
      {source.thumbnail ? (
        <img src={source.thumbnail} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
      ) : (
        <div className="flex items-center justify-center w-14 h-14 rounded-xl shrink-0"
          style={{ background: "oklch(0.79 0.11 82 / 0.08)", border: "1px solid oklch(0.79 0.11 82 / 0.2)", color: "oklch(0.79 0.11 82)" }}
        >
          <Landmark size={18} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <p className="font-serif text-base text-parchment leading-snug">{source.name}</p>
          <span className="font-sans text-[0.55rem] uppercase tracking-[0.15em] text-parchment/40 border border-parchment/10 rounded-full px-2 py-0.5">
            {source.date}
          </span>
        </div>
        <p className="font-sans text-[0.62rem] uppercase tracking-[0.18em] text-gold/60">{source.type}</p>
        {source.attribution && (
          <p className="font-sans text-xs text-parchment/45 mt-0.5 truncate">{source.attribution}</p>
        )}
      </div>
      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-sans text-[0.58rem] uppercase tracking-[0.18em] text-gold hover:text-gold/70 shrink-0 transition-colors"
        >
          Visit <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
}

export function EvidencePanel({
  monument,
  period,
  open,
  onClose,
}: {
  monument: Monument;
  period: MonumentPeriod;
  open: boolean;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60]"
            style={{ background: "oklch(0.04 0.003 60 / 0.7)", backdropFilter: "blur(6px)" }}
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[61]"
            style={
              isMobile
                ? { inset: "auto 0 0 0", height: "82vh", background: "oklch(0.12 0.008 60 / 0.98)", borderTop: "1px solid oklch(0.79 0.11 82 / 0.3)", borderTopLeftRadius: "2rem", borderTopRightRadius: "2rem" }
                : { top: 0, right: 0, bottom: 0, width: "min(30rem, 92vw)", background: "oklch(0.12 0.008 60 / 0.98)", borderLeft: "1px solid oklch(0.79 0.11 82 / 0.3)" }
            }
          >
            <EvidenceBody monument={monument} period={period} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
