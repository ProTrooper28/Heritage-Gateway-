import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock3,
  Camera,
  Compass,
  Sparkles,
  ArrowUpRight,
  Footprints,
  Banknote,
} from "lucide-react";

import type { TrailStop } from "../types";
import { EASE, GOLD, PARCHMENT, Pill } from "./TrailVisuals";

const TYPE_LABEL: Record<TrailStop["type"], string> = {
  monument: "Monument",
  food: "Local Food",
  park: "Park & Walk",
  museum: "Museum",
  experience: "Experience",
  viewpoint: "Viewpoint",
};

const DIFFICULTY_COLOR: Record<TrailStop["difficulty"], string> = {
  Easy: "oklch(0.72 0.14 150)",
  Moderate: "oklch(0.79 0.11 82)",
  Challenging: "oklch(0.65 0.2 25)",
};

export function TrailStopCard({
  stop,
  index,
  distanceFromPrevKm,
  onExplore,
}: {
  stop: TrailStop;
  index: number;
  distanceFromPrevKm: number;
  onExplore?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.05, ease: EASE }}
      className="relative rounded-3xl overflow-hidden group"
      style={{
        background:
          "linear-gradient(150deg, oklch(0.96 0.012 85 / 0.05), oklch(0.13 0.008 60 / 0.72))",
        backdropFilter: "blur(24px) saturate(130%)",
        border: "1px solid oklch(0.79 0.11 82 / 0.14)",
        boxShadow: "0 20px 60px -24px oklch(0 0 0 / 0.85), inset 0 1px 0 oklch(0.96 0.012 85 / 0.07)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "oklch(0.79 0.11 82 / 0.4)";
        e.currentTarget.style.boxShadow =
          "0 24px 70px -24px oklch(0 0 0 / 0.9), 0 0 30px oklch(0.79 0.11 82 / 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "oklch(0.79 0.11 82 / 0.14)";
        e.currentTarget.style.boxShadow =
          "0 20px 60px -24px oklch(0 0 0 / 0.85), inset 0 1px 0 oklch(0.96 0.012 85 / 0.07)";
      }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-72 h-52 md:h-auto overflow-hidden shrink-0">
          <img
            src={stop.image}
            alt={stop.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            style={{ filter: "saturate(0.85) brightness(0.8) contrast(1.05)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent md:bg-gradient-to-r" />
          {/* Time badge */}
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[0.62rem] uppercase tracking-[0.18em]"
            style={{
              background: "oklch(0.08 0.005 60 / 0.78)",
              backdropFilter: "blur(10px)",
              border: "1px solid oklch(0.79 0.11 82 / 0.35)",
              color: GOLD,
            }}
          >
            <Clock3 size={11} /> {stop.startTime}
          </div>
          {/* Stop number */}
          <div
            className="absolute bottom-4 left-4 font-serif text-5xl font-light italic"
            style={{ color: "oklch(0.96 0.012 85 / 0.85)", textShadow: "0 2px 12px oklch(0 0 0 / 0.6)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 md:p-7">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p
                className="font-sans text-[0.58rem] uppercase tracking-[0.28em] mb-2"
                style={{ color: "oklch(0.79 0.11 82 / 0.75)" }}
              >
                {TYPE_LABEL[stop.type]}
              </p>
              <h3 className="font-serif text-2xl text-parchment leading-tight">{stop.name}</h3>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Pill>
                <Footprints size={10} />
                {stop.difficulty}
              </Pill>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 mb-5 font-sans text-[0.68rem] text-parchment/50 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-gold" />
              {distanceFromPrevKm > 0 ? `${distanceFromPrevKm.toFixed(1)} km from previous` : "Starting point"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 size={12} className="text-gold" />
              {stop.visitMinutes} min visit
            </span>
            <span className="flex items-center gap-1.5">
              <Banknote size={12} className="text-gold" />
              {stop.ticketCost}
            </span>
          </div>

          {/* Why recommended */}
          <div className="flex gap-3 mb-4">
            <Sparkles size={15} className="text-gold shrink-0 mt-0.5" />
            <p className="font-sans text-sm text-parchment/75 leading-relaxed">
              <span className="text-gold/80 text-[0.62rem] uppercase tracking-[0.2em] mr-2">
                Why this stop
              </span>
              {stop.whyRecommended}
            </p>
          </div>

          {/* Collapsible details */}
          <div
            className="grid transition-all duration-500 overflow-hidden"
            style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
          >
            <div className="min-h-0 space-y-3.5">
              <p className="flex gap-3 font-sans text-sm text-parchment/70 leading-relaxed">
                <Compass size={15} className="text-gold shrink-0 mt-0.5" />
                <span>
                  <span className="text-gold/80 text-[0.62rem] uppercase tracking-[0.2em] mr-2 block mb-1">
                    Historical importance
                  </span>
                  {stop.historicalImportance}
                </span>
              </p>
              <p className="flex gap-3 font-sans text-sm text-parchment/70 leading-relaxed">
                <Camera size={15} className="text-gold shrink-0 mt-0.5" />
                <span>
                  <span className="text-gold/80 text-[0.62rem] uppercase tracking-[0.2em] mr-2 block mb-1">
                    Best photo spot
                  </span>
                  {stop.bestPhotoSpot}
                </span>
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-parchment/10">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-parchment/45 hover:text-gold transition-colors"
            >
              {expanded ? "Hide details" : "View details"}
            </button>
            <button
              onClick={onExplore}
              className="flex items-center gap-2 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-gold hover:text-gold/70 transition-colors"
            >
              Explore More <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
