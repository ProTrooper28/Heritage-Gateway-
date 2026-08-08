import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera as CameraIcon } from "lucide-react";
import { useScanMonument } from "../hooks/useScanMonument";
import { ImageUploader } from "./ImageUploader";
import { CameraScanner } from "./CameraScanner";
import { ImagePreview } from "./ImagePreview";
import { AnalysisLoading } from "./AnalysisLoading";
import { ResultView } from "./ResultView";
import { ErrorView } from "./ErrorView";

export function ScanMonumentContainer() {
  const {
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
  } = useScanMonument();

  return (
    <div className="relative min-h-[calc(100vh-6rem)] pt-20 pb-16 text-left max-w-5xl mx-auto z-10 font-sans">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-4xl font-light text-parchment tracking-tight mb-2">
            Scan Monument
          </h2>
          <p className="font-sans text-xs text-parchment/50 font-light max-w-xl">
            Identify historic landmarks, explore dynasties, and uncover the stories behind India's architectural heritage.
          </p>
        </div>
      </div>

      {/* ── Main Content Views ── */}
      <AnimatePresence mode="wait">
        
        {/* 1. ANALYZING STATE */}
        {status === "analyzing" && (
          <AnalysisLoading key="loading-view" loadingStep={loadingStep} />
        )}

        {/* 2. RESULT STATE */}
        {status === "result" && result && (
          <ResultView key="result-view" result={result} image={image} onReset={resetScanner} />
        )}

        {/* 3. ERROR STATE */}
        {status === "error" && (
          <ErrorView
            key="error-view"
            onReset={resetScanner}
            errorMessage={errorMessage}
            onSelectUpload={() => {
              resetScanner();
              setMode("upload");
            }}
            onSelectCamera={() => {
              resetScanner();
              setMode("camera");
            }}
          />
        )}

        {/* 4. IDLE OR PREVIEW STATE */}
        {(status === "idle" || status === "preview") && (
          <motion.div
            key="input-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {status === "preview" && image ? (
              <ImagePreview
                image={image}
                onRemove={removeImage}
                onChooseAnother={removeImage}
                onAnalyze={triggerAnalysis}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                
                {/* Method Switcher Tabs (Left) */}
                <div className="md:col-span-4 flex flex-col gap-3">
                  <button
                    onClick={() => setMode("upload")}
                    className={`rounded-2xl border p-5 text-left transition flex flex-col gap-3 h-full justify-between cursor-pointer ${
                      mode === "upload"
                        ? "border-gold/30 bg-gold/5"
                        : "border-parchment/8 bg-ink/30 hover:bg-parchment/3"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition ${
                      mode === "upload"
                        ? "border-gold/35 bg-gold/15 text-gold"
                        : "border-parchment/12 bg-parchment/5 text-parchment/50"
                    }`}>
                      <Upload size={16} />
                    </div>
                    <div>
                      <p className={`font-sans text-sm font-medium ${mode === "upload" ? "text-gold" : "text-parchment/75"}`}>
                        Upload Image
                      </p>
                      <p className="font-sans text-[0.68rem] text-parchment/40 mt-1 leading-normal">
                        Select a JPG, JPEG, PNG, or WEBP file (max 10MB) from your local archives.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setMode("camera")}
                    className={`rounded-2xl border p-5 text-left transition flex flex-col gap-3 h-full justify-between cursor-pointer ${
                      mode === "camera"
                        ? "border-gold/30 bg-gold/5"
                        : "border-parchment/8 bg-ink/30 hover:bg-parchment/3"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition ${
                      mode === "camera"
                        ? "border-gold/35 bg-gold/15 text-gold"
                        : "border-parchment/12 bg-parchment/5 text-parchment/50"
                    }`}>
                      <CameraIcon size={16} />
                    </div>
                    <div>
                      <p className={`font-sans text-sm font-medium ${mode === "camera" ? "text-gold" : "text-parchment/75"}`}>
                        Open Camera
                      </p>
                      <p className="font-sans text-[0.68rem] text-parchment/40 mt-1 leading-normal">
                        Use your device's camera stream to capture a photograph live.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Input Active View (Right) */}
                <div className="md:col-span-8">
                  {mode === "upload" ? (
                    <ImageUploader onImageSelected={selectImage} />
                  ) : (
                    <CameraScanner
                      onImageCaptured={selectImage}
                      onClose={() => setMode("upload")}
                    />
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
