export type ScanMode = "upload" | "camera";

export type ScanStatus = "idle" | "preview" | "analyzing" | "result" | "error";

export type ConfidenceLevel =
  | "Highly Confident (>90%)"
  | "Likely Match (70–90%)"
  | "Possible Match (<70%)";

export interface AlternativeMatch {
  name: string;
  confidenceScore: string;
  location: string;
}

export interface ArchitectureDetails {
  style: string;
  materials: string[];
  engineeringHighlights: string[];
}

export interface HistoricalBackground {
  builder: string;
  significance: string;
  importantEvents: string[];
}

export interface CulturalImportance {
  traditions: string;
  festivals: string;
  religiousSignificance: string;
}

export interface MonumentAnalysisResult {
  isMonument: boolean;
  name: string;
  confidenceScore: string;
  numericConfidence: number;
  confidenceLevel: ConfidenceLevel;
  location: string;
  state: string;
  dynasty: string;
  constructionPeriod: string;
  architecturalStyle: string;
  religion: string;
  unescoStatus: string;
  builder: string;
  summary: string;
  architecture: ArchitectureDetails;
  historicalBackground: HistoricalBackground;
  culturalImportance: CulturalImportance;
  interestingFacts: string[];
  alternativeMatches?: AlternativeMatch[];
}

export interface GeminiApiConfig {
  apiKey?: string;
  modelName?: string;
}
