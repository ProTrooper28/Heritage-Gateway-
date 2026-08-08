import { motion } from "framer-motion";
import { Map, ExternalLink, Navigation } from "lucide-react";

import type { TrailStop } from "../types";
import { EASE, GOLD, PARCHMENT, TrailSectionHeader } from "./TrailVisuals";

interface Point {
  x: number;
  y: number;
}

/** Project lat/lng onto a padded canvas box (simple equirectangular fit). */
function project(stops: TrailStop[], width: number, height: number, padding: number): Point[] {
  const lats = stops.map((s) => s.lat);
  const lngs = stops.map((s) => s.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latSpan = Math.max(maxLat - minLat, 0.01);
  const lngSpan = Math.max(maxLng - minLng, 0.01);
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  return stops.map((s) => ({
    x: padding + ((s.lng - minLng) / lngSpan) * innerW,
    y: padding + ((maxLat - s.lat) / latSpan) * innerH,
  }));
}

function googleMapsDirectionsUrl(stops: TrailStop[]): string {
  const [origin, ...rest] = stops;
  if (!origin) return "https://www.google.com/maps";
  const last = rest[rest.length - 1] ?? origin;
  const waypoints = rest.slice(0, -1).map((s) => `${s.lat},${s.lng}`).join("|");
  const params = new URLSearchParams({
    api: "1",
    origin: `${origin.lat},${origin.lng}`,
    destination: `${last.lat},${last.lng}`,
  });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function TrailRouteMap({ stops }: { stops: TrailStop[] }) {
  const width = 900;
  const height = 420;
  const padding = 56;
  const points = project(stops, width, height, padding);
  const polyline = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <section className="mt-24">
      <TrailSectionHeader
        eyebrow="Your route"
        title="Trail Map"
        subtitle="Every stop connected — follow the line from the first bell to the final view."
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-10 rounded-3xl overflow-hidden relative"
        style={{
          background: "linear-gradient(160deg, oklch(0.16 0.01 60 / 0.9), oklch(0.1 0.006 60 / 0.95))",
          border: "1px solid oklch(0.79 0.11 82 / 0.18)",
          boxShadow: "0 24px 70px -30px oklch(0 0 0 / 0.9)",
        }}
      >
        {/* Decorative map grid */}
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <pattern id="trail-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="oklch(0.96 0.012 85 / 0.05)" strokeWidth="1" />
            </pattern>
            <radialGradient id="trail-glow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="oklch(0.79 0.11 82 / 0.14)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#trail-grid)" />
          <rect width="100%" height="100%" fill="url(#trail-glow)" />

          {/* Route connectors */}
          <motion.path
            d={polyline}
            fill="none"
            stroke={GOLD}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="1 10"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 6px oklch(0.79 0.11 82 / 0.6))" }}
          />
          <path d={polyline} fill="none" stroke="oklch(0.79 0.11 82 / 0.15)" strokeWidth="7" strokeLinecap="round" />

          {/* Pins */}
          {points.map((p, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: EASE }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <circle cx={p.x} cy={p.y} r="15" fill="oklch(0.13 0.008 60 / 0.85)" stroke="oklch(0.79 0.11 82 / 0.7)" strokeWidth="1.5" />
              <circle cx={p.x} cy={p.y} r="4" fill={GOLD} />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fill={PARCHMENT}
                fontSize="10"
                fontFamily="Jost, sans-serif"
                letterSpacing="0.08em"
              >
                {i + 1}
              </text>
              <text
                x={p.x}
                y={p.y - 22}
                textAnchor="middle"
                fill="oklch(0.96 0.012 85 / 0.75)"
                fontSize="10.5"
                fontFamily="Cormorant Garamond, serif"
                fontStyle="italic"
              >
                {stops[i]?.name.split(" ").slice(0, 3).join(" ")}
              </text>
            </motion.g>
          ))}
        </svg>

        {/* Google Maps action */}
        <div className="absolute bottom-4 right-4 z-10">
          <a
            href={googleMapsDirectionsUrl(stops)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-sans text-[0.62rem] uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))",
              color: "oklch(0.13 0.008 60)",
              boxShadow: "0 10px 30px oklch(0.79 0.11 82 / 0.35)",
            }}
          >
            <Navigation size={13} /> Open in Google Maps
          </a>
        </div>

        {/* Map legend */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 rounded-full"
          style={{
            background: "oklch(0.08 0.005 60 / 0.7)",
            backdropFilter: "blur(10px)",
            border: "1px solid oklch(0.79 0.11 82 / 0.25)",
          }}
        >
          <Map size={12} className="text-gold" />
          <span className="font-sans text-[0.58rem] uppercase tracking-[0.2em] text-parchment/70">
            Route · {stops.length} stops
          </span>
          <ExternalLink size={10} className="text-parchment/40" />
        </div>
      </motion.div>
    </section>
  );
}
