import { motion } from "framer-motion";
import {
  Route,
  Timer,
  Footprints,
  Car,
  Sun,
  Gauge,
  Banknote,
} from "lucide-react";

import type { SmartTrail } from "../types";
import { EASE, GOLD, PARCHMENT, TrailSectionHeader } from "./TrailVisuals";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h} hr${h > 1 ? "s" : ""}`;
}

const DIFFICULTY_DESC: Record<SmartTrail["difficulty"], string> = {
  Easy: "Relaxed pace · mostly flat",
  Moderate: "Some walking & stairs",
  Challenging: "Hills or long walks",
};

export function TrailSummary({ trail }: { trail: SmartTrail }) {
  const stats: {
    icon: typeof Route;
    label: string;
    value: string;
    sub?: string;
  }[] = [
    { icon: Route, label: "Total Stops", value: String(trail.totalStops), sub: "curated places" },
    {
      icon: Timer,
      label: "Total Duration",
      value: formatDuration(trail.totalDurationMinutes),
      sub: "visit + travel",
    },
    { icon: Footprints, label: "Walking Distance", value: `${trail.walkingKm} km`, sub: "on foot" },
    { icon: Car, label: "Driving Distance", value: `${trail.drivingKm} km`, sub: "between stops" },
    { icon: Sun, label: "Best Time to Visit", value: trail.bestTime.split("·")[0] ?? trail.bestTime, sub: "recommended season" },
    {
      icon: Gauge,
      label: "Difficulty Level",
      value: trail.difficulty,
      sub: DIFFICULTY_DESC[trail.difficulty],
    },
    { icon: Banknote, label: "Estimated Budget", value: trail.budgetEstimate, sub: "entry fees only" },
  ];

  return (
    <section className="mt-24">
      <TrailSectionHeader
        eyebrow="At a glance"
        title="Trail Summary"
        subtitle="Everything you need to know before you set out."
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
            className="rounded-2xl p-4"
            style={{
              background: "oklch(0.96 0.012 85 / 0.04)",
              border: "1px solid oklch(0.96 0.012 85 / 0.08)",
            }}
          >
            <stat.icon size={16} className="text-gold mb-3" />
            <p className="font-sans text-[0.56rem] uppercase tracking-[0.2em] text-parchment/40 mb-1.5">
              {stat.label}
            </p>
            <p className="font-serif text-xl text-parchment leading-tight">{stat.value}</p>
            {stat.sub && (
              <p className="font-sans text-[0.6rem] text-parchment/35 mt-1">{stat.sub}</p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
