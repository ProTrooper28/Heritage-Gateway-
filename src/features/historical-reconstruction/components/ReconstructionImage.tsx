import { motion } from "framer-motion";
import { ImageOff, ShieldCheck, FileSearch, BadgeInfo } from "lucide-react";

import type { MonumentPeriod } from "../types";

export function ReconstructionImage({
  period,
  onViewEvidence,
}: {
  period: MonumentPeriod;
  onViewEvidence: () => void;
}) {
  const reconstruction = period.reconstruction;

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[2rem] overflow-hidden"
        style={{
          border: "1px solid oklch(0.79 0.11 82 / 0.2)",
          boxShadow: "0 28px 80px -28px oklch(0 0 0 / 0.9)",
        }}
      >
        {reconstruction ? (
          <>
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={reconstruction.image}
                alt={reconstruction.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
                style={{
                  filter: reconstruction.illustrative
                    ? "sepia(0.45) saturate(0.85) brightness(0.78) contrast(1.06)"
                    : "saturate(0.9) brightness(0.85)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />

              {/* Top-left label */}
              <div className="absolute top-5 left-5">
                <p className="font-sans text-[0.58rem] uppercase tracking-[0.3em] text-gold/85 mb-1.5">
                  Historical Reconstruction
                </p>
                <h3 className="font-serif text-3xl md:text-4xl text-parchment font-light tracking-[-0.01em]">
                  The monument in {period.year}
                </h3>
              </div>

              {/* Illustrative badge */}
              {reconstruction.illustrative && (
                <span
                  className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[0.55rem] uppercase tracking-[0.18em]"
                  style={{
                    background: "oklch(0.08 0.005 60 / 0.75)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid oklch(0.79 0.11 82 / 0.35)",
                    color: "oklch(0.86 0.1 85)",
                  }}
                >
                  <BadgeInfo size={11} /> Illustrative visualization
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 md:p-7 flex flex-wrap items-end justify-between gap-5"
              style={{ background: "linear-gradient(150deg, oklch(0.96 0.012 85 / 0.05), oklch(0.13 0.008 60 / 0.8))" }}
            >
              <div className="max-w-lg">
                <div className="flex items-center gap-2.5 mb-2">
                  <ShieldCheck size={15} className="text-gold" />
                  <span className="font-sans text-[0.6rem] uppercase tracking-[0.22em] text-parchment/55">
                    Evidence-backed reconstruction
                  </span>
                </div>
                <p className="font-sans text-xs text-parchment/55 leading-relaxed">
                  {reconstruction.confidenceNote}
                </p>
              </div>

              <div className="flex items-center gap-5">
                {/* Confidence ring */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full font-sans font-semibold"
                    style={{
                      width: 56,
                      height: 56,
                      border: "2px solid",
                      borderColor: "oklch(0.79 0.11 82 / 0.6)",
                      color: "oklch(0.86 0.1 85)",
                      fontSize: "0.85rem",
                      background: "oklch(0.79 0.11 82 / 0.08)",
                    }}
                  >
                    {reconstruction.confidenceScore}%
                  </div>
                  <div>
                    <p className="font-sans text-[0.55rem] uppercase tracking-[0.2em] text-parchment/45">Confidence</p>
                    <p className="font-sans text-xs text-gold/90 font-medium">{reconstruction.confidence}</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onViewEvidence}
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-sans text-[0.62rem] uppercase tracking-[0.2em] font-semibold"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))",
                    color: "oklch(0.13 0.008 60)",
                    boxShadow: "0 10px 30px oklch(0.79 0.11 82 / 0.35)",
                  }}
                >
                  <FileSearch size={14} /> View Evidence
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center aspect-[16/10] gap-4 p-10 text-center"
            style={{ background: "oklch(0.96 0.012 85 / 0.03)" }}
          >
            <ImageOff size={36} className="text-parchment/20" />
            <h3 className="font-serif text-2xl text-parchment/60">
              Reconstruction unavailable for {period.year}
            </h3>
            <p className="font-sans text-sm text-parchment/40 max-w-sm">
              No period visual exists yet. Add one via{" "}
              <span className="font-mono text-[0.7rem]">periods[].reconstruction</span>.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
