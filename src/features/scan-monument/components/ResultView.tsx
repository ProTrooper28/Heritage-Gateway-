import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Compass,
  Award,
  Layers,
  RefreshCw,
  Landmark,
  Crown,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Search
} from "lucide-react";
import { MonumentAnalysisResult, ConfidenceLevel } from "../types";

type Props = {
  result: MonumentAnalysisResult;
  image: string | null;
  onReset: () => void;
};

function ConfidenceBadge({ level, score }: { level: ConfidenceLevel; score: string }) {
  const config = {
    "Highly Confident (>90%)": {
      icon: <CheckCircle2 size={13} />,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10 border-emerald-400/30",
      dot: "bg-emerald-400",
    },
    "Likely Match (70–90%)": {
      icon: <TrendingUp size={13} />,
      color: "text-amber-400",
      bg: "bg-amber-400/10 border-amber-400/30",
      dot: "bg-amber-400",
    },
    "Possible Match (<70%)": {
      icon: <Search size={13} />,
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/30",
      dot: "bg-blue-400",
    },
  } satisfies Record<ConfidenceLevel, { icon: React.ReactNode; color: string; bg: string; dot: string }>;

  const c = config[level];
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[0.62rem] font-sans uppercase tracking-wide font-semibold ${c.color} ${c.bg}`}>
      {c.icon}
      {level}
    </div>
  );
}

export function ResultView({ result, image, onReset }: Props) {
  const numericConf = result.numericConfidence ?? 90;
  const confidenceLevel: ConfidenceLevel =
    result.confidenceLevel ??
    (numericConf >= 90
      ? "Highly Confident (>90%)"
      : numericConf >= 70
      ? "Likely Match (70–90%)"
      : "Possible Match (<70%)");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="w-full space-y-10"
    >
      {/* ── 1. TOP PRIMARY SECTION ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* Scanned Image Preview */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-gold/25 aspect-4/3 md:aspect-square bg-black shadow-2xl">
            {image && (
              <img src={image} alt={result.name} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute top-4 left-4 rounded-lg bg-gold/15 backdrop-blur border border-gold/35 px-3 py-1.5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-sans text-[0.62rem] uppercase tracking-widest text-gold font-semibold">
                {result.confidenceScore} Confidence
              </span>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full rounded-xl border border-gold/30 bg-gold/10 py-3.5 font-sans text-xs uppercase tracking-widest text-gold hover:bg-gold/20 transition flex items-center justify-center gap-2 cursor-pointer font-semibold"
          >
            <RefreshCw size={13} />
            Scan Another Monument
          </button>
        </div>

        {/* Primary Specification Details */}
        <div className="md:col-span-7 space-y-6">
          <div className="rounded-2xl border border-gold/15 bg-ink/40 backdrop-blur-md p-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            <div className="flex flex-col gap-3 mb-4">
              {/* Confidence level badge */}
              <ConfidenceBadge level={confidenceLevel} score={result.confidenceScore} />

              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-serif text-3xl font-light text-parchment leading-none mb-2">
                    {result.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gold/80 font-sans text-[0.75rem] tracking-wide">
                    <MapPin size={13} />
                    <span>{result.location}{result.state ? `, ${result.state}` : ""}</span>
                  </div>
                </div>

                <div className="rounded-lg border border-gold/25 bg-gold/5 px-3 py-1.5 text-center shrink-0">
                  <p className="font-sans text-[0.5rem] uppercase tracking-[0.1em] text-gold/60 leading-none mb-0.5">Score</p>
                  <p className="font-sans text-sm font-semibold text-gold leading-none">{result.confidenceScore}</p>
                </div>
              </div>
            </div>

            <p className="font-sans text-[0.82rem] leading-relaxed text-parchment-dim font-light pt-4 border-t border-parchment/10">
              {result.summary}
            </p>
          </div>

          {/* Primary Cards Specs Grid */}
          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl border border-parchment/8 bg-parchment/3 p-4 flex gap-3 items-center">
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Crown size={16} />
              </div>
              <div>
                <p className="font-sans text-[0.55rem] uppercase tracking-widest text-parchment/40">Dynasty</p>
                <p className="font-sans text-[0.78rem] text-parchment/80 font-medium">{result.dynasty || "—"}</p>
              </div>
            </div>

            <div className="rounded-xl border border-parchment/8 bg-parchment/3 p-4 flex gap-3 items-center">
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <p className="font-sans text-[0.55rem] uppercase tracking-widest text-parchment/40">Period</p>
                <p className="font-sans text-[0.78rem] text-parchment/80 font-medium">{result.constructionPeriod || "—"}</p>
              </div>
            </div>

            <div className="rounded-xl border border-parchment/8 bg-parchment/3 p-4 flex gap-3 items-center">
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Compass size={16} />
              </div>
              <div>
                <p className="font-sans text-[0.55rem] uppercase tracking-widest text-parchment/40">Architectural Style</p>
                <p className="font-sans text-[0.78rem] text-parchment/80 font-medium">{result.architecturalStyle || "—"}</p>
              </div>
            </div>

            <div className="rounded-xl border border-parchment/8 bg-parchment/3 p-4 flex gap-3 items-center">
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Landmark size={16} />
              </div>
              <div>
                <p className="font-sans text-[0.55rem] uppercase tracking-widest text-parchment/40">Builder</p>
                <p className="font-sans text-[0.78rem] text-parchment/80 font-medium">{result.builder || "—"}</p>
              </div>
            </div>

            <div className="rounded-xl border border-parchment/8 bg-parchment/3 p-4 flex gap-3 items-center">
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="font-sans text-[0.55rem] uppercase tracking-widest text-parchment/40">Religion</p>
                <p className="font-sans text-[0.78rem] text-parchment/80 font-medium">{result.religion || "—"}</p>
              </div>
            </div>

            <div className="rounded-xl border border-parchment/8 bg-parchment/3 p-4 flex gap-3 items-center">
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Award size={16} />
              </div>
              <div>
                <p className="font-sans text-[0.55rem] uppercase tracking-widest text-parchment/40">UNESCO Status</p>
                <p className="font-sans text-[0.75rem] text-parchment/80 font-medium leading-tight">{result.unescoStatus || "Not Listed"}</p>
              </div>
            </div>

          </div>

          {/* Alternative matches (shown for lower confidence results) */}
          {result.alternativeMatches && result.alternativeMatches.length > 0 && numericConf < 90 && (
            <div className="rounded-2xl border border-parchment/10 bg-ink/30 p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={14} className="text-amber-400" />
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-amber-400 font-semibold">
                  Other Possible Matches
                </p>
              </div>
              <div className="space-y-3">
                {result.alternativeMatches.map((alt, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-2 border-b border-parchment/8 last:border-0">
                    <div>
                      <p className="font-sans text-xs font-medium text-parchment/80">{alt.name}</p>
                      <p className="font-sans text-[0.65rem] text-parchment/45">{alt.location}</p>
                    </div>
                    <span className="font-sans text-xs text-amber-400 font-semibold shrink-0">{alt.confidenceScore}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── 2. EXPANDED DETAILS SECTION ── */}
      <div className="pt-8 border-t border-parchment/10 space-y-8">

        <p className="font-sans text-[0.65rem] uppercase tracking-[0.4em] text-gold/80 font-semibold">
          Expanded Architectural & Cultural Details
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Section A: Architecture */}
          <div className="rounded-2xl border border-parchment/10 bg-ink/40 p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center gap-3 border-b border-parchment/10 pb-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center border border-gold/20">
                <Layers size={16} />
              </div>
              <h4 className="font-serif text-xl font-light text-parchment">Architecture</h4>
            </div>

            {result.architecture?.style && (
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-gold/70 mb-1 font-semibold">Style</p>
                <p className="font-sans text-xs text-parchment/80 font-light">{result.architecture.style}</p>
              </div>
            )}

            {result.architecture?.materials?.length > 0 && (
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-gold/70 mb-1.5 font-semibold">Materials</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.architecture.materials.map((mat, i) => (
                    <span key={i} className="rounded-md border border-parchment/12 bg-parchment/5 px-2 py-0.5 font-sans text-[0.68rem] text-parchment/70">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.architecture?.engineeringHighlights?.length > 0 && (
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-gold/70 mb-2 font-semibold">Engineering Highlights</p>
                <ul className="space-y-2">
                  {result.architecture.engineeringHighlights.map((hl, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-xs text-parchment/75 font-light leading-relaxed">
                      <CheckCircle2 size={12} className="text-gold shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section B: Historical Background */}
          <div className="rounded-2xl border border-parchment/10 bg-ink/40 p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center gap-3 border-b border-parchment/10 pb-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center border border-gold/20">
                <Crown size={16} />
              </div>
              <h4 className="font-serif text-xl font-light text-parchment">Historical Background</h4>
            </div>

            {result.historicalBackground?.builder && (
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-gold/70 mb-1 font-semibold">Patron / Builder</p>
                <p className="font-sans text-xs text-parchment/80 font-light">{result.historicalBackground.builder}</p>
              </div>
            )}

            {result.historicalBackground?.significance && (
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-gold/70 mb-1 font-semibold">Historical Significance</p>
                <p className="font-sans text-xs text-parchment/75 font-light leading-relaxed">
                  {result.historicalBackground.significance}
                </p>
              </div>
            )}

            {result.historicalBackground?.importantEvents?.length > 0 && (
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-gold/70 mb-2 font-semibold">Key Timeline Events</p>
                <ul className="space-y-2">
                  {result.historicalBackground.importantEvents.map((evt, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-xs text-parchment/75 font-light leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                      <span>{evt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section C: Cultural Importance */}
          <div className="rounded-2xl border border-parchment/10 bg-ink/40 p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center gap-3 border-b border-parchment/10 pb-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center border border-gold/20">
                <Sparkles size={16} />
              </div>
              <h4 className="font-serif text-xl font-light text-parchment">Cultural Importance</h4>
            </div>

            {result.culturalImportance?.traditions && (
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-gold/70 mb-1 font-semibold">Traditions & Customs</p>
                <p className="font-sans text-xs text-parchment/75 font-light leading-relaxed">
                  {result.culturalImportance.traditions}
                </p>
              </div>
            )}

            {result.culturalImportance?.festivals && (
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-gold/70 mb-1 font-semibold">Major Festivals</p>
                <p className="font-sans text-xs text-parchment/75 font-light leading-relaxed">
                  {result.culturalImportance.festivals}
                </p>
              </div>
            )}

            {result.culturalImportance?.religiousSignificance && (
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-gold/70 mb-1 font-semibold">Spiritual Significance</p>
                <p className="font-sans text-xs text-parchment/75 font-light leading-relaxed">
                  {result.culturalImportance.religiousSignificance}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Section D: 5–8 Interesting Facts */}
        {result.interestingFacts?.length > 0 && (
          <div className="rounded-2xl border border-gold/15 bg-ink/50 backdrop-blur-md p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 border-b border-parchment/10 pb-4 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center border border-gold/20">
                <Lightbulb size={16} />
              </div>
              <h4 className="font-serif text-2xl font-light text-parchment">Fascinating Historical Facts</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.interestingFacts.map((fact, idx) => (
                <div key={idx} className="rounded-xl border border-parchment/8 bg-parchment/3 p-4 flex gap-3 items-start">
                  <span className="font-serif text-lg font-normal text-gold shrink-0">#{idx + 1}</span>
                  <p className="font-sans text-xs text-parchment/80 font-light leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
