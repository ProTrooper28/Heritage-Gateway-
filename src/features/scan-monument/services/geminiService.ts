import { GoogleGenAI } from "@google/genai";
import { MonumentAnalysisResult, ConfidenceLevel } from "../types";

// ─── Key Resolution ──────────────────────────────────────────────────────────
// ONLY reads from the environment variable. No localStorage, no UI prompt.

function resolveApiKey(): string {
  const key = import.meta.env["VITE_GEMINI_API_KEY"];
  if (typeof key === "string" && key.trim().length > 10) return key.trim();
  return "";
}

// ─── Confidence Helper ───────────────────────────────────────────────────────

function toConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 90) return "Highly Confident (>90%)";
  if (score >= 70) return "Likely Match (70–90%)";
  return "Possible Match (<70%)";
}

// ─── Prompt ──────────────────────────────────────────────────────────────────

const PROMPT = `You are an expert archaeologist, architectural historian, and Indian heritage specialist.

Analyze the uploaded image. Identify the monument as accurately as possible.

Return ONLY valid JSON — no markdown fences, no extra text — matching this exact schema:

{
  "isMonument": true,
  "name": "Official name",
  "confidenceScore": "96%",
  "numericConfidence": 96,
  "location": "City or region",
  "state": "State or province",
  "dynasty": "Ruling dynasty or empire",
  "constructionPeriod": "Years or century",
  "architecturalStyle": "Primary style",
  "religion": "Associated tradition",
  "unescoStatus": "UNESCO designation or 'Not Listed'",
  "builder": "Ruler, patron, or architect",
  "summary": "2–3 sentence historical overview",
  "architecture": {
    "style": "Detailed classification",
    "materials": ["Material 1", "Material 2"],
    "engineeringHighlights": ["Highlight 1", "Highlight 2"]
  },
  "historicalBackground": {
    "builder": "Ruler and lineage",
    "significance": "Historical context",
    "importantEvents": ["Event with date 1", "Event with date 2"]
  },
  "culturalImportance": {
    "traditions": "Living customs",
    "festivals": "Festivals celebrated here",
    "religiousSignificance": "Spiritual role"
  },
  "interestingFacts": [
    "Fact 1", "Fact 2", "Fact 3", "Fact 4", "Fact 5"
  ],
  "alternativeMatches": [
    { "name": "Candidate 1", "confidenceScore": "15%", "location": "City, State" },
    { "name": "Candidate 2", "confidenceScore": "8%",  "location": "City, State" }
  ]
}

Rules:
1. If the image does NOT show a historic monument or landmark, set "isMonument": false only.
2. Never fabricate facts — base all values strictly on the image.
3. numericConfidence is a plain integer 0–100.
4. List up to 3 alternativeMatches when confidence < 90.`;

// ─── Main Export ─────────────────────────────────────────────────────────────

export async function analyzeMonumentWithGemini(
  base64Image: string
): Promise<MonumentAnalysisResult> {
  const apiKey = resolveApiKey();

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not configured.");
  }

  const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  const mimeType = (mimeMatch?.[1] ?? "image/jpeg") as
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "image/gif";
  const imageData = base64Image.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

  const ai = new GoogleGenAI({ apiKey });

  // Rolling "latest" aliases stay valid as Google rotates model versions
  // instead of pinning to a dated model name that can be retired.
  const MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest"];

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              { text: PROMPT },
              { inlineData: { mimeType, data: imageData } },
            ],
          },
        ],
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });

      const raw = response.text?.trim() ?? "";
      // Strip accidental markdown fences
      const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      const parsed = JSON.parse(cleaned);

      if (!parsed?.isMonument) {
        return { isMonument: false } as MonumentAnalysisResult;
      }

      const numeric = Number(parsed.numericConfidence) || 90;
      parsed.numericConfidence = numeric;
      parsed.confidenceLevel = toConfidenceLevel(numeric);

      return parsed as MonumentAnalysisResult;
    } catch (err) {
      // Log technical detail privately; try next model
      console.error(`[Gemini] model "${model}" failed:`, err);
    }
  }

  // All models failed — surface a user-friendly message only
  throw new Error("Unable to analyze this image. Please try again.");
}
