// ─── Smart Heritage Trails — domain types ────────────────────────────────────
// All types are deliberately UI-agnostic so a live trail API (e.g. Google
// Routes, TripAdvisor, custom backend) can replace the mock service later
// without touching the components.

export type InterestId =
  | "ancient"
  | "history"
  | "photography"
  | "religious"
  | "nature"
  | "culture"
  | "food"
  | "hidden"
  | "family";

export interface InterestOption {
  id: InterestId;
  label: string;
  emoji: string;
}

export const INTERESTS: InterestOption[] = [
  { id: "ancient", label: "Ancient Monuments", emoji: "🏛" },
  { id: "history", label: "History", emoji: "📖" },
  { id: "photography", label: "Photography", emoji: "📷" },
  { id: "religious", label: "Religious Heritage", emoji: "🕌" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "culture", label: "Culture", emoji: "🎭" },
  { id: "food", label: "Local Food", emoji: "🍛" },
  { id: "hidden", label: "Hidden Gems", emoji: "⭐" },
  { id: "family", label: "Family Friendly", emoji: "👨‍👩‍👧" },
];

export type TimeOptionId = "2h" | "half" | "full" | "weekend";

export interface TimeOption {
  id: TimeOptionId;
  label: string;
  minutes: number;
  maxStops: number;
  description: string;
}

export const TIME_OPTIONS: TimeOption[] = [
  { id: "2h", label: "2 Hours", minutes: 120, maxStops: 3, description: "A sharp, focused highlight reel" },
  { id: "half", label: "Half Day", minutes: 300, maxStops: 4, description: "The essentials, well paced" },
  { id: "full", label: "Full Day", minutes: 540, maxStops: 6, description: "A deep, unhurried immersion" },
  { id: "weekend", label: "Weekend", minutes: 1440, maxStops: 7, description: "Two days across the region" },
];

export type StopType = "monument" | "food" | "park" | "museum" | "experience" | "viewpoint";

export interface TrailStop {
  id: string;
  name: string;
  city: string;
  state: string;
  image: string;
  lat: number;
  lng: number;
  /** Minutes the traveller should spend here */
  visitMinutes: number;
  /** Minutes of travel from the previous stop (0 for the first) */
  travelMinutesFromPrev: number;
  /** Displayed start time, e.g. "09:00" */
  startTime: string;
  historicalImportance: string;
  whyRecommended: string;
  bestPhotoSpot: string;
  interests: InterestId[];
  type: StopType;
  difficulty: "Easy" | "Moderate" | "Challenging";
  ticketCost: string;
  /** Optional link into the existing Explore Heritage monument catalogue */
  monumentId?: string;
}

export interface Destination {
  id: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  tagline: string;
  bestTime: string;
  /** Aliases used by search (state names, monument names, nicknames) */
  aliases: string[];
  image: string;
}

export interface TrailQuery {
  destination: string;
  time: TimeOptionId;
  interests: InterestId[];
}

export interface SmartTrail {
  id: string;
  title: string;
  subtitle: string;
  destinationId: string;
  city: string;
  state: string;
  image: string;
  bestTime: string;
  stops: TrailStop[];
  totalStops: number;
  totalDurationMinutes: number;
  walkingKm: number;
  drivingKm: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  budgetEstimate: string;
}

export interface DiscoverItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  tag: string;
}

export interface DiscoverSection {
  id: string;
  title: string;
  emoji: string;
  items: DiscoverItem[];
}

export interface TrailProvider {
  /** Resolve a free-text destination (city / state / monument) to a Destination. */
  searchDestinations(query: string): Promise<Destination[]>;
  /** Generate a trail for the given query. */
  generateTrail(query: TrailQuery): Promise<SmartTrail>;
  /** Extra curated sections shown after the itinerary. */
  discover(destinationId: string): Promise<DiscoverSection[]>;
}
