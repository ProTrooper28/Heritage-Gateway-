// ─── Smart Heritage Trails — trail generation service ────────────────────────
// Mock engine for the hackathon demo. Components only depend on the
// `TrailProvider` interface, so a live API (Google Routes / Places, a
// backend, etc.) can replace this file later without touching the UI.

import type {
  Destination,
  DiscoverSection,
  SmartTrail,
  TimeOption,
  TrailProvider,
  TrailQuery,
  TrailStop,
} from "../types";
import { TIME_OPTIONS } from "../types";
import { DESTINATIONS, getDiscoverSections } from "../data/destinations";
import { DEFAULT_CITY_ID, DESTINATION_BANNERS, STOPS_BY_CITY, cityById } from "../data/stops";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatClock(minutesSinceMidnight: number): string {
  const clamped = Math.max(0, minutesSinceMidnight) % 1440;
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseStartMinutes(stop: TrailStop): number {
  const [h, m] = stop.startTime.split(":").map((n) => Number(n));
  return (h ?? 9) * 60 + (m ?? 0);
}

const DIFFICULTY_ORDER: Record<string, number> = {
  Easy: 0,
  Moderate: 1,
  Challenging: 2,
};

// Rough ₹ estimate parsed from ticket strings like "₹35" / "₹300–500"
function estimateBudget(stops: TrailStop[]): string {
  let total = 0;
  for (const stop of stops) {
    const match = stop.ticketCost.match(/(\d+)/);
    if (match?.[1]) total += Number(match[1]);
  }
  if (total === 0) return "Free";
  const rounded = Math.round(total / 50) * 50;
  return `₹${rounded.toLocaleString("en-IN")} (est.)`;
}

// ─── Mock engine ─────────────────────────────────────────────────────────────

function scoreDestination(destination: Destination, query: string): number {
  const q = normalize(query);
  if (!q) return 0;
  const haystack = normalize(
    [destination.city, destination.state, ...destination.aliases].join(" "),
  );
  if (haystack === q) return 100;
  if (haystack.includes(q)) return 80 - (haystack.length - q.length) / 10;
  // Partial alias matches (e.g. "taj" → Taj Mahal)
  const aliasHits = destination.aliases.filter((a) => normalize(a).includes(q)).length;
  return aliasHits * 60;
}

/** Pick the destination whose coordinates are closest to the user's location. */
export function nearestDestination(lat: number, lng: number): Destination | undefined {
  let best: Destination | undefined;
  let bestDist = Infinity;
  for (const destination of DESTINATIONS) {
    const dLat = destination.lat - lat;
    const dLng = destination.lng - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < bestDist) {
      bestDist = dist;
      best = destination;
    }
  }
  return best;
}

function buildTrail(query: TrailQuery): SmartTrail {
  // 1. Resolve the destination (fuzzy).
  const ranked = [...DESTINATIONS]
    .map((d) => ({ d, score: scoreDestination(d, query.destination) }))
    .sort((a, b) => b.score - a.score);
  const destination = (ranked[0] && ranked[0].score > 0 ? ranked[0].d : undefined) ??
    DESTINATIONS.find((d) => d.id === cityById(normalize(query.destination))) ??
    DESTINATIONS.find((d) => d.id === DEFAULT_CITY_ID)!;

  // 2. Pull the stop catalogue for the destination.
  const allStops = STOPS_BY_CITY[destination.id] ?? STOPS_BY_CITY[DEFAULT_CITY_ID]!;

  // 3. Filter by interests (never empty — heritage always leads).
  const timeOption = TIME_OPTIONS.find((t) => t.id === query.time) ?? TIME_OPTIONS[1]!;
  const interestSet = new Set(query.interests);
  const matched = allStops.filter(
    (stop) => interestSet.size === 0 || stop.interests.some((i) => interestSet.has(i)),
  );
  const filler = allStops.filter((stop) => !matched.includes(stop));
  let stops = [...matched, ...filler];

  // 4. Keep the authored chronological order, cap by time budget.
  stops = stops.slice(0, timeOption.maxStops);

  // 5. Recompute timings from the first stop's authored start time.
  const firstStop = stops[0]!;
  let cursor = parseStartMinutes(firstStop);
  const scheduled = stops.map((stop, index) => {
    const start = cursor;
    cursor += stop.visitMinutes + (index < stops.length - 1 ? (stops[index + 1]!.travelMinutesFromPrev ?? 20) : 0);
    return { ...stop, startTime: formatClock(start) };
  });

  // 6. Summary statistics.
  const totalVisit = scheduled.reduce((acc, s) => acc + s.visitMinutes, 0);
  const totalTravel = scheduled.reduce(
    (acc, s, i) => (i === 0 ? acc : acc + s.travelMinutesFromPrev),
    0,
  );
  const totalDurationMinutes = Math.min(totalVisit + totalTravel, timeOption.minutes);
  const walkingKm = Math.round(scheduled.length * 1.1 * 10) / 10;
  const drivingKm = Math.round((totalTravel * 0.55 + scheduled.length * 1.5) * 10) / 10;

  const maxDifficulty = scheduled.reduce(
    (acc, s) => Math.max(acc, DIFFICULTY_ORDER[s.difficulty] ?? 0),
    0,
  );
  const difficulty = (Object.keys(DIFFICULTY_ORDER) as (keyof typeof DIFFICULTY_ORDER)[])
    .find((key) => DIFFICULTY_ORDER[key] === maxDifficulty) as SmartTrail["difficulty"];

  const firstStopForTitle = scheduled[0]!;
  const title = `${destination.city} Smart Heritage Trail`;
  const subtitle =
    interestSet.size > 0
      ? `Curated for ${query.interests.length} interest${query.interests.length > 1 ? "s" : ""} · ${timeOption.label} · from ${scheduled[0]!.startTime}`
      : `${timeOption.label} · ${scheduled.length} stops · from ${scheduled[0]!.startTime}`;

  return {
    id: `trail-${destination.id}-${Date.now()}`,
    title,
    subtitle,
    destinationId: destination.id,
    city: destination.city,
    state: destination.state,
    image: DESTINATION_BANNERS[destination.id] ?? firstStopForTitle.image,
    bestTime: destination.bestTime,
    stops: scheduled,
    totalStops: scheduled.length,
    totalDurationMinutes,
    walkingKm,
    drivingKm,
    difficulty,
    budgetEstimate: estimateBudget(scheduled),
  };
}

// ─── Public provider ─────────────────────────────────────────────────────────

export const mockTrailProvider: TrailProvider = {
  async searchDestinations(query: string): Promise<Destination[]> {
    await delay(250);
    const q = normalize(query);
    if (!q) return DESTINATIONS.slice(0, 6);
    return DESTINATIONS
      .map((d) => ({ d, score: scoreDestination(d, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((r) => r.d);
  },

  async generateTrail(query: TrailQuery): Promise<SmartTrail> {
    // Simulate "curating" latency so the generating state reads naturally.
    await delay(1400);
    return buildTrail(query);
  },

  async discover(destinationId: string): Promise<DiscoverSection[]> {
    await delay(200);
    return getDiscoverSections(destinationId);
  },
};

export function timeOptionById(id: TrailQuery["time"]): TimeOption {
  return TIME_OPTIONS.find((t) => t.id === id) ?? TIME_OPTIONS[1]!;
}
