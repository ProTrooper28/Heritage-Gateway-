import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, MapPin, Sun } from "lucide-react";

import type { DiscoverSection, SmartTrail, TrailQuery } from "../types";
import { mockTrailProvider } from "../services/trailService";
import { useUserState } from "../../../context/UserStateContext";

import { PlannerWizard, type PlannerSelection } from "./PlannerSteps";
import { GeneratingState } from "./GeneratingState";
import { TrailStopCard } from "./TrailStopCard";
import { TrailSummary } from "./TrailSummary";
import { TrailRouteMap } from "./TrailRouteMap";
import { DiscoverMore } from "./DiscoverMore";
import { SaveShareBar } from "./SaveShareBar";
import { EASE, GOLD, Pill, StopDot } from "./TrailVisuals";

type Phase = "idle" | "generating" | "result";

// Haversine — distance between consecutive stops
function kmBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const EMPTY_SELECTION: PlannerSelection = {
  destination: null,
  time: null,
  interests: [],
};

export function SmartTrailsPage({ onNavigate }: { onNavigate?: (label: string) => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [selection, setSelection] = useState<PlannerSelection>(EMPTY_SELECTION);
  const [trail, setTrail] = useState<SmartTrail | null>(null);
  const [discover, setDiscover] = useState<DiscoverSection[]>([]);
  const { addActivity } = useUserState();

  function patchSelection(patch: Partial<PlannerSelection>) {
    setSelection((prev) => ({ ...prev, ...patch }));
  }

  async function generate() {
    if (!selection.destination || !selection.time) return;
    setPhase("generating");
    const query: TrailQuery = {
      destination: selection.destination.city,
      time: selection.time,
      interests: selection.interests,
    };
    const [nextTrail, sections] = await Promise.all([
      mockTrailProvider.generateTrail(query),
      mockTrailProvider.discover(selection.destination.id),
    ]);
    setTrail(nextTrail);
    setDiscover(sections);
    setPhase("result");
    addActivity("Smart Heritage Trails", `Generated ${nextTrail.title}`);
  }

  function reset() {
    setPhase("idle");
    setSelection(EMPTY_SELECTION);
    setTrail(null);
    setDiscover([]);
  }

  useEffect(() => {
    addActivity("Smart Heritage Trails", "Opened Smart Heritage Trails");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-4 pb-40 relative"
    >
      {/* Page header */}
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="flex items-center justify-center w-10 h-10 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.25), oklch(0.79 0.11 82 / 0.06))",
              border: "1px solid oklch(0.79 0.11 82 / 0.4)",
            }}
          >
            <Sparkles size={18} className="text-gold" />
          </span>
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.4em] text-gold/80">
            ✨ Smart Heritage Trails
          </p>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-parchment tracking-[-0.02em] mb-4">
          Smart Heritage Trails
        </h1>
        <p className="font-sans text-sm md:text-base font-light text-parchment/55 max-w-2xl leading-relaxed">
          Discover intelligently curated heritage journeys based on your interests,
          available time, and destination.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <PlannerWizard
              selection={selection}
              onChange={patchSelection}
              onGenerate={generate}
            />
          </motion.div>
        )}

        {phase === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GeneratingState destination={selection.destination?.city ?? "heritage"} />
          </motion.div>
        )}

        {phase === "result" && trail && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <TrailResult
              trail={trail}
              discover={discover}
              onExplore={() => onNavigate?.("Explore Heritage")}
              onPlanAnother={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Result view ─────────────────────────────────────────────────────────────

function TrailResult({
  trail,
  discover,
  onExplore,
  onPlanAnother,
}: {
  trail: SmartTrail;
  discover: DiscoverSection[];
  onExplore: () => void;
  onPlanAnother: () => void;
}) {
  return (
    <div>
      {/* Trail hero */}
      <motion.section
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative rounded-[2rem] overflow-hidden min-h-[22rem] flex flex-col justify-end p-8 md:p-12"
        style={{
          border: "1px solid oklch(0.79 0.11 82 / 0.22)",
          boxShadow: "0 32px 90px -30px oklch(0 0 0 / 0.95)",
        }}
      >
        <img
          src={trail.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "saturate(0.8) brightness(0.65) contrast(1.08)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <Pill>
              <MapPin size={10} /> {trail.city}, {trail.state}
            </Pill>
            <Pill>
              <Sun size={10} /> {trail.bestTime.split("·")[0]}
            </Pill>
            <Pill>{trail.totalStops} stops</Pill>
          </div>

          <h2 className="font-serif text-4xl md:text-6xl font-light text-parchment tracking-[-0.02em] leading-[1.05] mb-4">
            {trail.title}
          </h2>
          <p className="font-sans text-sm md:text-base text-parchment/70 max-w-2xl font-light mb-8">
            {trail.subtitle}
          </p>

          <SaveShareBar trail={trail} />
        </div>
      </motion.section>

      {/* Itinerary */}
      <section className="mt-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.4em] text-gold/80 mb-3">
              Your Itinerary
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-parchment tracking-[-0.02em]">
              Day at a glance
            </h2>
          </div>
          <button
            onClick={onPlanAnother}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-sans text-[0.62rem] uppercase tracking-[0.2em] text-parchment/60 hover:text-parchment transition-colors border border-parchment/10 hover:border-gold/30"
          >
            <RefreshCw size={13} /> Plan another trail
          </button>
        </div>

        <div className="flex flex-col gap-0 max-w-4xl">
          {trail.stops.map((stop, i) => {
            const prev = trail.stops[i - 1];
            const distance = prev ? kmBetween(prev, stop) : 0;
            const isLast = i === trail.stops.length - 1;
            return (
              <div key={stop.id} className="flex gap-6">
                <div className="flex flex-col items-center shrink-0 pt-6">
                  <StopDot index={i} isLast={isLast} />
                </div>
                <div className="flex-1 pb-8">
                  <TrailStopCard
                    stop={stop}
                    index={i}
                    distanceFromPrevKm={distance}
                    onExplore={onExplore}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Summary */}
      <TrailSummary trail={trail} />

      {/* Map */}
      <TrailRouteMap stops={trail.stops} />

      {/* Discover more */}
      {discover.length > 0 && <DiscoverMore sections={discover} />}
    </div>
  );
}
