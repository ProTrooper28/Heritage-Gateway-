import { useState, useEffect } from "react";
import { ScanMode, ScanStatus, MonumentAnalysisResult } from "../types";
import { analyzeMonumentWithGemini } from "../services/geminiService";

export const LOADING_MESSAGES = [
  "Analyzing Heritage...",
  "Studying Architectural Details...",
  "Searching Historical Records...",
  "Exploring India's Heritage...",
  "Preparing Historical Insights..."
];

export function useScanMonument() {
  const [mode, setMode] = useState<ScanMode>("upload");
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [image, setImage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<MonumentAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rotate loading messages during active analysis
  useEffect(() => {
    if (status !== "analyzing") return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [status]);

  const selectImage = (dataUrl: string) => {
    setImage(dataUrl);
    setStatus("preview");
    setResult(null);
    setErrorMessage(null);
  };

  const removeImage = () => {
    setImage(null);
    setStatus("idle");
    setResult(null);
    setErrorMessage(null);
  };

  const triggerAnalysis = async () => {
    if (!image) return;

    setStatus("analyzing");
    setLoadingStep(0);
    setErrorMessage(null);

    try {
      const data = await analyzeMonumentWithGemini(image);

      if (data && data.isMonument) {
        setResult(data);
        setStatus("result");
      } else {
        setResult(null);
        setErrorMessage("We couldn't identify a historical monument in this image.");
        setStatus("error");
      }
    } catch (err: any) {
      console.error("Analysis failure:", err);
      setResult(null);
      const raw = err?.message || "";
      const isKeyIssue = /api key|not configured/i.test(raw);
      setErrorMessage(
        isKeyIssue
          ? "The AI service API key is not configured."
          : "Unable to analyze this monument at the moment. Please try again."
      );
      setStatus("error");
    }
  };

  const resetScanner = () => {
    setImage(null);
    setStatus("idle");
    setResult(null);
    setErrorMessage(null);
    setLoadingStep(0);
  };

  return {
    mode,
    setMode,
    status,
    image,
    selectImage,
    removeImage,
    loadingStep,
    result,
    errorMessage,
    triggerAnalysis,
    resetScanner,
  };
}
