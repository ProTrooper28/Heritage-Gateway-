import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, MapPin, RotateCw, ChevronDown } from "lucide-react";

import type { Monument, MonumentAnnotation, MonumentPeriod } from "../types";
import { MONUMENTS, MONUMENT_THUMBNAILS } from "../data/monuments";
import { useUserState } from "../../../context/UserStateContext";

import { MonumentAnnotations } from "./MonumentAnnotations";
import { AnnotationPanel } from "./AnnotationPanel";
import { HistoricalTimeline } from "./HistoricalTimeline";
import { ReconstructionImage } from "./ReconstructionImage";
import { EvidencePanel } from "./EvidencePanel";
import { PastPresentSlider } from "./PastPresentSlider";
import { MonumentInformation } from "./MonumentInformation";
import { ViewerControls } from "./ViewerControls";

import type { CameraFocusRequest } from "./MonumentViewer";

// Lazy-load the R3F viewer so Three.js stays out of the initial bundle.
const MonumentViewer = lazy(() =>
  import("./MonumentViewer").then((m) => ({ default: m.MonumentViewer })),
);

const DEFAULT_FOCUS: CameraFocusRequest = { point: [0, 1.4, 0], key: 0 };

function ViewerSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center shimmer">
      <div className="text-center">
        <RotateCw size={26} className="text-gold animate-spin mx-auto mb-4" />
        <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-parchment/50">
          Loading 3D viewer…
        </p>
      </div>
    </div>
  );
}

export function HistoricalReconstruction() {
  const { addActivity } = useUserState();
  const [mounted, setMounted] = useState(false);

  const [monumentIndex, setMonumentIndex] = useState(0);
  const [periodIndex, setPeriodIndex] = useState(0);
  const [activeAnnotation, setActiveAnnotation] = useState<MonumentAnnotation | null>(null);
  const [focus, setFocus] = useState<CameraFocusRequest>(DEFAULT_FOCUS);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const focusKey = useRef(0);

  const monument = MONUMENTS[monumentIndex] ?? MONUMENTS[0]!;
  const period = monument.periods[periodIndex] ?? monument.periods[0]!;

  // Use a period-specific 3D model when one is available; otherwise fall back
  // to the monument's base model (or its procedural placeholder).
  const model = period.model && period.model.available ? period.model : monument.model;

  // Client-only mount (R3F canvas is not SSR-safe).
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    addActivity("Historical Reconstruction", `Opened ${monument.name} 3D viewer`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monument.id]);

  // Fullscreen state tracking.
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Annotations relevant to the selected period (existed by that year).
  const visibleAnnotations = monument.annotations.filter(
    (a) => a.period <= period.year,
  );

  function selectAnnotation(annotation: MonumentAnnotation) {
    setActiveAnnotation(annotation);
    focusKey.current += 1;
    setFocus({
      point: annotation.focus ?? annotation.position,
      key: focusKey.current,
    });
  }

  function resetView() {
    setActiveAnnotation(null);
    focusKey.current += 1;
    setFocus({ point: [0, 1.4, 0], key: focusKey.current });
  }

  function switchMonument(index: number) {
    setMonumentIndex(index);
    setPeriodIndex(0);
    setActiveAnnotation(null);
    resetView();
  }

  function switchPeriod(index: number) {
    setPeriodIndex(index);
    setActiveAnnotation(null);
    resetView();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-4 pb-40 relative"
    >
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.25), oklch(0.79 0.11 82 / 0.06))",
              border: "1px solid oklch(0.79 0.11 82 / 0.4)",
            }}
          >
            <Box size={17} className="text-gold" />
          </span>
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.4em] text-gold/80">
            Historical Reconstruction
          </p>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-parchment tracking-[-0.02em] mb-3">
          {monument.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-parchment/50">
            <MapPin size={13} className="text-gold" />
            {monument.location}
          </span>
          <span className="w-1 h-1 rounded-full bg-gold/40" />
          <span className="font-serif italic text-base text-parchment/60">
            {monument.description}
          </span>
        </div>

        {/* Monument switcher */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 mt-6">
          {MONUMENTS.map((m, i) => {
            const isActive = i === monumentIndex;
            return (
              <button
                key={m.id}
                onClick={() => switchMonument(i)}
                className="flex items-center gap-3 pl-2.5 pr-5 py-2 rounded-full transition-all duration-300 shrink-0"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.2), oklch(0.79 0.11 82 / 0.06))"
                    : "oklch(0.96 0.012 85 / 0.04)",
                  border: `1px solid ${isActive ? "oklch(0.79 0.11 82 / 0.45)" : "oklch(0.96 0.012 85 / 0.1)"}`,
                  cursor: "pointer",
                }}
              >
                <img
                  src={MONUMENT_THUMBNAILS[m.id]}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                  style={{ border: "1px solid oklch(0.79 0.11 82 / 0.3)" }}
                />
                <span className="font-sans text-xs uppercase tracking-widest" style={{ color: isActive ? "oklch(0.96 0.012 85)" : "oklch(0.96 0.012 85 / 0.5)" }}>
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ─── 3D Viewer hero ─────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        className="relative rounded-[2rem] overflow-hidden"
        style={{
          height: isFullscreen ? "100vh" : "clamp(30rem, 68vh, 46rem)",
          border: "1px solid oklch(0.79 0.11 82 / 0.22)",
          boxShadow: "0 32px 90px -30px oklch(0 0 0 / 0.95)",
          background: "radial-gradient(ellipse at 50% 35%, oklch(0.24 0.02 60 / 0.9), oklch(0.1 0.006 60 / 1))",
        }}
      >
        {mounted ? (
          <Suspense fallback={<ViewerSkeleton />}>
            <MonumentViewer
              monument={monument}
              model={model}
              annotations={visibleAnnotations}
              autoRotate={autoRotate}
              focus={focus}
            />
          </Suspense>
        ) : (
          <ViewerSkeleton />
        )}

        {/* Annotation markers overlay */}
        <MonumentAnnotations
          annotations={visibleAnnotations}
          activeId={activeAnnotation?.id ?? null}
          onSelect={selectAnnotation}
        />

        {/* Annotation info panel (desktop) */}
        <AnnotationPanel annotation={activeAnnotation} onClose={() => setActiveAnnotation(null)} />

        {/* Top-left chips */}
        <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2">
          <span className="px-3.5 py-2 rounded-full font-sans text-[0.6rem] uppercase tracking-[0.22em]"
            style={{
              background: "oklch(0.08 0.005 60 / 0.75)",
              backdropFilter: "blur(10px)",
              border: "1px solid oklch(0.79 0.11 82 / 0.4)",
              color: "oklch(0.86 0.1 85)",
            }}
          >
            {period.year} · {period.label}
          </span>
          {!monument.model.available && (
            <span className="px-3.5 py-2 rounded-full font-sans text-[0.58rem] uppercase tracking-[0.2em]"
              style={{
                background: "oklch(0.08 0.005 60 / 0.75)",
                backdropFilter: "blur(10px)",
                border: "1px dashed oklch(0.79 0.11 82 / 0.45)",
                color: "oklch(0.79 0.11 82 / 0.9)",
              }}
            >
              Placeholder model — attach a .glb to replace
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 z-20">
          <ViewerControls
            autoRotate={autoRotate}
            onToggleAutoRotate={() => setAutoRotate((v) => !v)}
            onReset={resetView}
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
          />
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full"
          style={{
            background: "oklch(0.08 0.005 60 / 0.65)",
            backdropFilter: "blur(10px)",
            border: "1px solid oklch(0.96 0.012 85 / 0.1)",
          }}
        >
          <span className="font-sans text-[0.55rem] uppercase tracking-[0.24em] text-parchment/45">
            Drag to rotate · Scroll to zoom · Tap a marker
          </span>
        </div>
      </div>

      {/* ─── Historical timeline ────────────────────────────────────────── */}
      <HistoricalTimeline monument={monument} activeIndex={periodIndex} onSelect={switchPeriod} />

      {/* ─── Reconstruction + Past vs Present ───────────────────────────── */}
      <div className="mt-20 grid lg:grid-cols-2 gap-8 items-start">
        <ReconstructionImage period={period} onViewEvidence={() => setEvidenceOpen(true)} />
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <ChevronDown size={14} className="text-gold rotate-180" />
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.35em] text-gold/80">
              Past vs Present
            </p>
          </div>
          <PastPresentSlider
            pastImage={period.reconstruction?.image ?? monument.presentImage}
            presentImage={monument.presentImage}
            pastLabel={period.year < 1900 ? `${period.year} reconstruction` : `${period.year}`}
            presentLabel="Present day"
          />
          <p className="font-sans text-[0.68rem] text-parchment/40 leading-relaxed mt-4">
            The past side is an illustrative treatment of the period's reconstruction; the present
            side is a current photograph. Neither is presented as a precise historical record.
          </p>
        </div>
      </div>

      {/* ─── Monument information ───────────────────────────────────────── */}
      <MonumentInformation monument={monument} />

      {/* ─── Evidence drawer ────────────────────────────────────────────── */}
      <EvidencePanel
        monument={monument}
        period={period}
        open={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
      />
    </motion.div>
  );
}

export type { MonumentPeriod };
