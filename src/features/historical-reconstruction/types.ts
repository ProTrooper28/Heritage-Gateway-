// ─── Historical Reconstruction — reusable data model ─────────────────────────
// One structure drives the entire experience for ANY monument: 3D viewer,
// annotations, timeline, reconstructions, evidence and information sections.
// Swapping in a new monument (or a real GLB) only requires editing data.

export type Confidence = "High" | "Medium" | "Low";

export interface ModelRef {
  /** Path to a GLB/GLTF, e.g. "/models/red-fort.glb". */
  url: string;
  /** Whether a real model file exists. Set false to use the procedural placeholder. */
  available: boolean;
}

export interface EvidenceSource {
  id: string;
  name: string;
  /** Approximate date of the source, e.g. "c. 1795" or "1860s". */
  date: string;
  /** One of: Painting · Photograph · Architectural Record · Archaeology · Archive · Travelogue · Inscription */
  type: string;
  attribution?: string;
  url?: string;
  thumbnail?: string;
}

export interface MonumentPeriod {
  year: number;
  label: string;
  era: string;
  summary: string;
  /** Major changes during this period. */
  changes: string[];
  /** Period-specific 3D model (optional — see ModelRef.available). */
  model?: ModelRef;
  /** Period-specific reconstruction visual. `illustrative` must be true unless evidence-backed. */
  reconstruction?: {
    image: string;
    alt: string;
    illustrative: boolean;
    confidence: Confidence;
    confidenceScore: number;
    confidenceNote: string;
  };
}

export interface MonumentAnnotation {
  id: number;
  /** Zero-padded label, e.g. "01". */
  index: string;
  title: string;
  subtitle: string;
  /** World-space position the marker attaches to on the model. */
  position: [number, number, number];
  /** Optional camera focus point (defaults to position). */
  focus?: [number, number, number];
  /** Period (year) this element is associated with. */
  period: number;
  description: string;
  historicalSignificance: string;
  architecturalDetails: string;
  periodLabel: string;
  confidence: Confidence;
  /** Short evidence references. */
  evidence: string[];
}

export interface Monument {
  id: string;
  name: string;
  location: string;
  description: string;
  model: ModelRef;
  /** Sorted ascending by year. */
  periods: MonumentPeriod[];
  annotations: MonumentAnnotation[];
  sources: EvidenceSource[];
  /** Photograph of the monument as it stands today. */
  presentImage: string;
  info: {
    overview: string[];
    history: string[];
    architecture: string[];
    majorChanges: string[];
    culturalSignificance: string[];
    preservation: string[];
  };
}

export const CONFIDENCE_EXPLANATIONS: Record<Confidence, string> = {
  High: "High confidence: supported by multiple independent historical sources.",
  Medium: "Medium confidence: visual reconstruction contains historically plausible elements that are not directly documented.",
  Low: "Low confidence: largely speculative; few or contested historical sources.",
};

export const CONFIDENCE_SCORE: Record<Confidence, number> = {
  High: 84,
  Medium: 68,
  Low: 52,
};
