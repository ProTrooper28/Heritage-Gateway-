import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarRange, Box, AlertTriangle } from "lucide-react";

import type { Monument, MonumentPeriod } from "../types";

export function HistoricalTimeline({
  monument,
  activeIndex,
  onSelect,
}: {
  monument: Monument;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex]);

  const activePeriod = monument.periods[activeIndex];

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2.5 mb-8">
        <CalendarRange size={16} className="text-gold" />
        <p className="font-sans text-[0.62rem] uppercase tracking-[0.35em] text-gold/80">
          Historical Timeline
        </p>
      </div>

      {/* Period rail */}
      <div ref={railRef} className="overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
        <div className="relative flex items-center gap-0 min-w-max">
          {/* Connecting line */}
          <div className="absolute top-[1.35rem] left-6 right-6 h-px"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.79 0.11 82 / 0.35), transparent)" }}
          />

          {monument.periods.map((period, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={period.year}
                ref={isActive ? activeRef : undefined}
                onClick={() => onSelect(i)}
                className="relative flex flex-col items-center gap-3 px-6 group"
                style={{ cursor: "pointer" }}
              >
                {/* Node */}
                <motion.span
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: isActive ? 44 : 32,
                    height: isActive ? 44 : 32,
                    background: isActive
                      ? "linear-gradient(135deg, oklch(0.85 0.14 85), oklch(0.68 0.08 78))"
                      : "oklch(0.96 0.012 85 / 0.05)",
                    border: isActive ? "none" : "1px solid oklch(0.79 0.11 82 / 0.35)",
                    boxShadow: isActive ? "0 0 0 6px oklch(0.79 0.11 82 / 0.15), 0 10px 26px oklch(0 0 0 / 0.5)" : "none",
                    transition: "width 0.3s ease, height 0.3s ease",
                  }}
                >
                  <span
                    className="font-sans font-semibold"
                    style={{
                      fontSize: isActive ? "0.82rem" : "0.62rem",
                      color: isActive ? "oklch(0.13 0.008 60)" : "oklch(0.79 0.11 82)",
                      transition: "font-size 0.3s ease",
                    }}
                  >
                    {period.year}
                  </span>
                </motion.span>

                <span className="text-center">
                  <span
                    className="block font-serif text-sm whitespace-nowrap transition-colors duration-300"
                    style={{ color: isActive ? "oklch(0.96 0.012 85)" : "oklch(0.96 0.012 85 / 0.45)" }}
                  >
                    {period.label}
                  </span>
                  <span className="block font-sans text-[0.55rem] uppercase tracking-[0.18em] text-parchment/30 whitespace-nowrap mt-0.5">
                    {period.era.length > 26 ? `${period.era.slice(0, 26)}…` : period.era}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active period detail */}
      <AnimatePresence mode="wait">
        {activePeriod && (
          <motion.div
            key={activePeriod.year}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 rounded-3xl p-7 md:p-8"
            style={{
              background: "linear-gradient(150deg, oklch(0.96 0.012 85 / 0.05), oklch(0.13 0.008 60 / 0.7))",
              backdropFilter: "blur(20px)",
              border: "1px solid oklch(0.79 0.11 82 / 0.16)",
              boxShadow: "0 20px 60px -24px oklch(0 0 0 / 0.8)",
            }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-serif text-3xl text-gold">{activePeriod.year}</span>
              <span className="font-serif text-xl italic text-parchment/70">{activePeriod.label}</span>
              <span className="font-sans text-[0.58rem] uppercase tracking-[0.22em] text-parchment/40 border border-parchment/10 rounded-full px-3 py-1">
                {activePeriod.era}
              </span>
            </div>

            <p className="font-sans text-sm text-parchment/70 leading-relaxed max-w-3xl mb-6">
              {activePeriod.summary}
            </p>

            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2.5">
              {activePeriod.changes.map((change) => (
                <li key={change} className="flex items-start gap-2.5 font-sans text-xs text-parchment/60 leading-relaxed">
                  <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: "oklch(0.79 0.11 82 / 0.7)" }} />
                  {change}
                </li>
              ))}
            </ul>

            {activePeriod.model && !activePeriod.model.available && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl p-4"
                style={{ background: "oklch(0.79 0.11 82 / 0.06)", border: "1px solid oklch(0.79 0.11 82 / 0.2)" }}
              >
                <AlertTriangle size={15} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-xs text-gold/90 font-medium mb-0.5">
                    3D reconstruction unavailable for this period
                  </p>
                  <p className="font-sans text-[0.7rem] text-parchment/45 leading-relaxed">
                    Showing the closest available model. A period-specific reconstruction can be added later
                    via <span className="font-mono text-[0.65rem]">periods[].model</span>.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-2 font-sans text-[0.58rem] uppercase tracking-[0.2em] text-parchment/35">
              <Box size={11} className="text-gold/60" />
              Reconstruction imagery for this period is illustrative unless its evidence note says otherwise.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export type { MonumentPeriod };
