import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LocateFixed,
  Search,
  MapPin,
  Building2,
  Landmark,
  Clock3,
  SunMedium,
  MoonStar,
  CalendarDays,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Destination, InterestId, TimeOptionId } from "../types";
import { INTERESTS, TIME_OPTIONS } from "../types";
import { mockTrailProvider, nearestDestination } from "../services/trailService";
import { DESTINATIONS } from "../data/destinations";
import { EASE, GOLD, PARCHMENT, TrailSectionHeader } from "./TrailVisuals";

// ─── Types ───────────────────────────────────────────────────────────────────

export type LocationMode = "current" | "city" | "state" | "monument";

export interface PlannerSelection {
  destination: Destination | null;
  time: TimeOptionId | null;
  interests: InterestId[];
}

const LOCATION_MODES: { id: LocationMode; label: string; icon: typeof LocateFixed }[] = [
  { id: "current", label: "Use Current Location", icon: LocateFixed },
  { id: "city", label: "Search by City", icon: Building2 },
  { id: "state", label: "Search by State", icon: MapPin },
  { id: "monument", label: "Search by Monument", icon: Landmark },
];

const STEP_META = [
  { label: "Destination", icon: MapPin },
  { label: "Time", icon: Clock3 },
  { label: "Interests", icon: Sparkles },
];

// ─── Step 1 — Where would you like to explore? ───────────────────────────────

function StepLocation({
  selection,
  onChange,
  onNext,
}: {
  selection: PlannerSelection;
  onChange: (patch: Partial<PlannerSelection>) => void;
  onNext: () => void;
}) {
  const [mode, setMode] = useState<LocationMode>("city");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Destination[]>([]);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(false);

  // Live suggestions as the user types.
  useEffect(() => {
    if (mode === "current") return;
    let active = true;
    const t = setTimeout(async () => {
      const matches = await mockTrailProvider.searchDestinations(query);
      if (active) setResults(matches);
    }, 180);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [query, mode]);

  const popular: Destination[] = useMemo(
    () => (selection.destination ? [selection.destination] : []),
    [selection.destination],
  );

  function useCurrentLocation() {
    setLocating(true);
    setLocError(false);
    if (!("geolocation" in navigator)) {
      setLocError(true);
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = nearestDestination(pos.coords.latitude, pos.coords.longitude);
        if (nearest) {
          onChange({ destination: nearest });
        } else {
          setLocError(true);
        }
        setLocating(false);
      },
      () => {
        setLocError(true);
        setLocating(false);
      },
    );
  }

  const suggestions = mode === "current" ? [] : results;

  return (
    <div className="space-y-10">
      {/* Mode selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {LOCATION_MODES.map(({ id, label, icon: Icon }) => {
          const isActive = mode === id;
          return (
            <button
              key={id}
              onClick={() => {
                setMode(id);
                if (id === "current") useCurrentLocation();
              }}
              className={`flex items-center gap-2.5 px-4 py-3.5 rounded-2xl font-sans text-[0.7rem] uppercase tracking-widest transition-all duration-300 text-left ${
                isActive ? "text-ink" : "text-parchment/60 hover:text-parchment"
              }`}
              style={{
                background: isActive
                  ? "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))"
                  : "oklch(0.96 0.012 85 / 0.04)",
                border: `1px solid ${isActive ? "transparent" : "oklch(0.96 0.012 85 / 0.1)"}`,
                boxShadow: isActive ? "0 8px 28px oklch(0.79 0.11 82 / 0.35)" : "none",
              }}
            >
              <Icon size={15} className={isActive ? "text-ink" : "text-gold"} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Current location feedback */}
      {mode === "current" && (
        <div className="flex items-center gap-3 font-sans text-sm text-parchment/70">
          <LocateFixed size={16} className={locating ? "animate-spin text-gold" : "text-gold"} />
          {locating
            ? "Locating the nearest heritage city…"
            : locError
              ? "Location unavailable — pick a destination below instead."
              : selection.destination
                ? `Nearest curated city: ${selection.destination.city}, ${selection.destination.state}`
                : "Tap to find the nearest curated city."}
        </div>
      )}

      {/* Search input */}
      {mode !== "current" && (
        <div className="relative max-w-2xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/70"
            size={18}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === "city"
                ? "Search by city — Delhi, Agra, Jaipur…"
                : mode === "state"
                  ? "Search by state — Rajasthan, Karnataka…"
                  : "Search by monument — Taj Mahal, Qutub Minar…"
            }
            className="w-full bg-ink/50 border border-parchment/10 rounded-2xl py-4 pl-12 pr-4 text-parchment font-sans outline-none focus:border-gold/50 transition-colors placeholder:text-parchment/25"
          />
        </div>
      )}

      {/* Suggestions / results */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
          <AnimatePresence>
            {suggestions.map((destination) => (
              <motion.button
                key={destination.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                onClick={() => onChange({ destination })}
                className="flex items-center gap-4 p-4 rounded-2xl text-left group transition-all duration-300"
                style={{
                  background:
                    selection.destination?.id === destination.id
                      ? "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.16), oklch(0.79 0.11 82 / 0.05))"
                      : "oklch(0.96 0.012 85 / 0.04)",
                  border: `1px solid ${
                    selection.destination?.id === destination.id
                      ? "oklch(0.79 0.11 82 / 0.4)"
                      : "oklch(0.96 0.012 85 / 0.1)"
                  }`,
                  cursor: "pointer",
                }}
              >
                <img
                  src={destination.image}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover"
                  style={{ border: "1px solid oklch(0.79 0.11 82 / 0.2)" }}
                />
                <div className="flex-1">
                  <p className="font-serif text-lg text-parchment">{destination.city}</p>
                  <p className="font-sans text-xs uppercase tracking-widest text-parchment/40">
                    {destination.state}
                  </p>
                </div>
                <p className="font-serif italic text-sm text-gold/70 max-w-[10rem] hidden md:block">
                  {destination.tagline.split("—")[0]}
                </p>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Popular destinations */}
      <div>
        <p className="font-sans text-[0.6rem] uppercase tracking-[0.3em] text-parchment/40 mb-4">
          {popular.length > 0 ? "Your selection" : "Popular destinations"}
        </p>
        <div className="flex flex-wrap gap-3">
          {(popular.length > 0 ? popular : SAMPLE_DESTINATIONS).map((destination) => {
            const isSelected = selection.destination?.id === destination.id;
            return (
              <button
                key={destination.id}
                onClick={() => onChange({ destination })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-xs uppercase tracking-widest transition-all duration-300"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))"
                    : "oklch(0.96 0.012 85 / 0.05)",
                  border: `1px solid ${
                    isSelected ? "transparent" : "oklch(0.96 0.012 85 / 0.12)"
                  }`,
                  color: isSelected ? "oklch(0.13 0.008 60)" : PARCHMENT,
                }}
              >
                <MapPin size={12} className={isSelected ? "text-ink" : "text-gold"} />
                {destination.city}
              </button>
            );
          })}
        </div>
      </div>

      <StepFooter
        nextLabel="Choose Time"
        disabled={!selection.destination}
        onBack={null}
        onNext={onNext}
      />
    </div>
  );
}

const SAMPLE_DESTINATIONS = DESTINATIONS;

// ─── Step 2 — How much time do you have? ─────────────────────────────────────

const TIME_ICONS: Record<TimeOptionId, typeof Clock3> = {
  "2h": Clock3,
  half: SunMedium,
  full: MoonStar,
  weekend: CalendarDays,
};

function StepTime({
  selection,
  onChange,
  onNext,
  onBack,
}: {
  selection: PlannerSelection;
  onChange: (patch: Partial<PlannerSelection>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TIME_OPTIONS.map((option) => {
          const Icon = TIME_ICONS[option.id];
          const isActive = selection.time === option.id;
          return (
            <motion.button
              key={option.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={() => onChange({ time: option.id })}
              className="p-6 rounded-3xl text-left relative overflow-hidden group"
              style={{
                background: isActive
                  ? "linear-gradient(145deg, oklch(0.79 0.11 82 / 0.18), oklch(0.13 0.008 60 / 0.78))"
                  : "linear-gradient(145deg, oklch(0.96 0.012 85 / 0.05), oklch(0.13 0.008 60 / 0.7))",
                border: `1px solid ${
                  isActive ? "oklch(0.79 0.11 82 / 0.5)" : "oklch(0.96 0.012 85 / 0.1)"
                }`,
                cursor: "pointer",
                boxShadow: isActive
                  ? "0 0 32px oklch(0.79 0.11 82 / 0.2), 0 8px 32px oklch(0 0 0 / 0.4)"
                  : "0 4px 20px oklch(0 0 0 / 0.35)",
              }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-2xl"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))"
                      : "oklch(0.79 0.11 82 / 0.1)",
                    border: `1px solid ${isActive ? "transparent" : "oklch(0.79 0.11 82 / 0.25)"}`,
                    color: isActive ? "oklch(0.13 0.008 60)" : GOLD,
                  }}
                >
                  <Icon size={19} />
                </div>
                <div>
                  <p className="font-serif text-2xl text-parchment">{option.label}</p>
                  <p className="font-sans text-xs text-parchment/45">{option.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-parchment/35">
                  Up to {option.maxStops} stops
                </span>
                <span className="w-1 h-1 rounded-full bg-gold/40" />
                <span className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-parchment/35">
                  {option.minutes} min budget
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <StepFooter
        nextLabel="Select Interests"
        disabled={!selection.time}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
}

// ─── Step 3 — Select your interests ──────────────────────────────────────────

function StepInterests({
  selection,
  onChange,
  onNext,
  onBack,
}: {
  selection: PlannerSelection;
  onChange: (patch: Partial<PlannerSelection>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  function toggle(interest: InterestId) {
    const current = selection.interests;
    const next = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    onChange({ interests: next });
  }

  return (
    <div className="space-y-8">
      <p className="font-sans text-sm text-parchment/50">
        Select as many as you like — the trail is curated around them.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {INTERESTS.map((interest) => {
          const isActive = selection.interests.includes(interest.id);
          return (
            <motion.button
              key={interest.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={() => toggle(interest.id)}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl font-sans text-sm transition-all duration-300"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.18), oklch(0.79 0.11 82 / 0.06))"
                  : "oklch(0.96 0.012 85 / 0.04)",
                border: `1px solid ${
                  isActive ? "oklch(0.79 0.11 82 / 0.45)" : "oklch(0.96 0.012 85 / 0.1)"
                }`,
                color: isActive ? PARCHMENT : "oklch(0.96 0.012 85 / 0.6)",
                cursor: "pointer",
                boxShadow: isActive ? "0 0 18px oklch(0.79 0.11 82 / 0.15)" : "none",
              }}
            >
              <span className="text-lg">{interest.emoji}</span>
              <span className="font-sans text-[0.82rem] tracking-wide">{interest.label}</span>
            </motion.button>
          );
        })}
      </div>

      <StepFooter
        nextLabel={
          selection.interests.length > 0
            ? `Generate Trail (${selection.interests.length} selected)`
            : "Generate Trail"
        }
        disabled={false}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
}

// ─── Footer nav + progress ───────────────────────────────────────────────────

function StepFooter({
  nextLabel,
  disabled,
  onBack,
  onNext,
}: {
  nextLabel: string;
  disabled: boolean;
  onBack: (() => void) | null;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <button
        onClick={onBack ?? undefined}
        disabled={!onBack}
        className={`flex items-center gap-2 px-5 py-3 rounded-full font-sans text-xs uppercase tracking-widest transition-all duration-300 ${
          onBack
            ? "text-parchment/60 hover:text-parchment border border-parchment/10 hover:border-gold/30"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronLeft size={14} /> Back
      </button>
      <motion.button
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.97 }}
        onClick={onNext}
        disabled={disabled}
        className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300"
        style={{
          background: disabled
            ? "oklch(0.96 0.012 85 / 0.08)"
            : "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))",
          color: disabled ? "oklch(0.96 0.012 85 / 0.3)" : "oklch(0.13 0.008 60)",
          boxShadow: disabled ? "none" : "0 10px 32px oklch(0.79 0.11 82 / 0.35)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {nextLabel} <ChevronRight size={14} />
      </motion.button>
    </div>
  );
}

// ─── Wizard container with progress ──────────────────────────────────────────

export function PlannerWizard({
  selection,
  onChange,
  onGenerate,
}: {
  selection: PlannerSelection;
  onChange: (patch: Partial<PlannerSelection>) => void;
  onGenerate: () => void;
}) {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  return (
    <div ref={containerRef} className="scroll-mt-28">
      <TrailSectionHeader
        eyebrow="Plan your journey"
        title="Craft your heritage trail"
        subtitle="Three quick steps — we'll curate a beautifully paced itinerary for you."
      />

      {/* Progress */}
      <div className="flex items-center gap-3 mt-10 mb-10">
        {STEP_META.map((meta, i) => {
          const isDone = i < step;
          const isActive = i === step;
          return (
            <div key={meta.label} className="flex items-center gap-3 flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-sans text-[0.62rem] uppercase tracking-[0.2em] transition-all duration-300 ${
                  isDone
                    ? "text-ink"
                    : isActive
                      ? "text-gold"
                      : "text-parchment/35"
                }`}
                style={{
                  background: isDone
                    ? "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))"
                    : isActive
                      ? "oklch(0.79 0.11 82 / 0.12)"
                      : "oklch(0.96 0.012 85 / 0.04)",
                  border: `1px solid ${
                    isActive ? "oklch(0.79 0.11 82 / 0.4)" : "transparent"
                  }`,
                  cursor: isDone ? "pointer" : "default",
                }}
              >
                <meta.icon size={12} className={isDone ? "text-ink" : ""} />
                <span className="hidden sm:inline">{meta.label}</span>
              </button>
              {i < STEP_META.length - 1 && (
                <div
                  className="h-px flex-1"
                  style={{
                    background: isDone
                      ? "linear-gradient(90deg, oklch(0.79 0.11 82 / 0.6), oklch(0.79 0.11 82 / 0.15))"
                      : "oklch(0.96 0.012 85 / 0.1)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {step === 0 && (
            <StepLocation
              selection={selection}
              onChange={onChange}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepTime
              selection={selection}
              onChange={onChange}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <StepInterests
              selection={selection}
              onChange={onChange}
              onNext={onGenerate}
              onBack={() => setStep(1)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
