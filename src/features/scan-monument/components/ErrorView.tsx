import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight, RefreshCw, Upload, Camera, KeyRound } from "lucide-react";

type Props = {
  onReset: () => void;
  onSelectUpload: () => void;
  onSelectCamera: () => void;
  errorMessage?: string | null;
};

const isApiKeyError = (msg?: string | null) =>
  !!msg && (msg.toLowerCase().includes("api key") || msg.toLowerCase().includes("missing") || msg.toLowerCase().includes("key"));

export function ErrorView({ onReset, onSelectUpload, onSelectCamera, errorMessage }: Props) {
  const keyError = isApiKeyError(errorMessage);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-2xl border border-destructive/20 bg-ink/80 backdrop-blur-md p-10 max-w-2xl mx-auto text-center"
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${keyError ? "bg-amber-400/10 border border-amber-400/30 text-amber-400" : "bg-destructive/10 border border-destructive/30 text-destructive"}`}>
        {keyError ? (
          <KeyRound size={28} className="animate-pulse" />
        ) : (
          <AlertTriangle size={28} className="animate-pulse" />
        )}
      </div>

      <h3 className="font-serif text-2xl font-light text-parchment mb-3">
        {keyError
          ? "AI Service Not Configured"
          : "We couldn't confidently identify this monument."}
      </h3>

      {errorMessage && (
        <p className="font-sans text-xs text-parchment/50 font-light max-w-md mx-auto mb-4 leading-relaxed">
          {errorMessage}
        </p>
      )}

      {!keyError && (
        <p className="font-sans text-xs text-parchment/40 font-light max-w-md mx-auto mb-8 leading-relaxed">
          Our vision network could not match this photo with a high confidence rating in our architectural database.
        </p>
      )}

      {/* Suggested Action Options */}
      <div className="rounded-xl border border-parchment/8 bg-parchment/3 p-5 max-w-md mx-auto text-left mb-8 space-y-3 font-sans">
        <p className="text-[0.62rem] uppercase tracking-widest text-gold/80 mb-2 font-semibold">
          {keyError ? "How to Fix" : "Suggested Steps"}
        </p>

        {keyError ? (
          <>
            <div className="flex gap-3 items-start text-xs text-parchment/75">
              <ChevronRight size={14} className="text-gold shrink-0 mt-0.5" />
              <span><strong>Set the API key:</strong> Add the required key to your <code className="bg-parchment/10 px-1 rounded">.env.local</code> file and restart the dev server.</span>
            </div>
            <div className="flex gap-3 items-start text-xs text-parchment/75">
              <ChevronRight size={14} className="text-gold shrink-0 mt-0.5" />
              <span><strong>Need help?</strong> Contact the site administrator to configure the AI service.</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-3 items-start text-xs text-parchment/75">
              <ChevronRight size={14} className="text-gold shrink-0 mt-0.5" />
              <span><strong>Try another image:</strong> Avoid blurry photos, low resolution, or heavy filters.</span>
            </div>
            <div className="flex gap-3 items-start text-xs text-parchment/75">
              <ChevronRight size={14} className="text-gold shrink-0 mt-0.5" />
              <span><strong>Capture from another angle:</strong> Take a photo showing the central facade, gateway, or tower silhouette.</span>
            </div>
            <div className="flex gap-3 items-start text-xs text-parchment/75">
              <ChevronRight size={14} className="text-gold shrink-0 mt-0.5" />
              <span><strong>Upload another image:</strong> Select a well-lit photograph taken in daylight.</span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={onSelectUpload}
          className="rounded-xl border border-gold/30 bg-gold/10 px-6 py-3 font-sans text-xs uppercase tracking-wider text-gold hover:bg-gold/20 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Upload size={13} />
          Upload Another Image
        </button>

        <button
          onClick={onSelectCamera}
          className="rounded-xl border border-parchment/15 bg-parchment/5 px-6 py-3 font-sans text-xs uppercase tracking-wider text-parchment/75 hover:bg-parchment/10 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Camera size={13} />
          Capture From Another Angle
        </button>

        <button
          onClick={onReset}
          className="rounded-xl border border-parchment/10 bg-transparent px-4 py-3 font-sans text-xs uppercase tracking-wider text-parchment/50 hover:text-parchment transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RefreshCw size={12} />
          Reset
        </button>
      </div>
    </motion.div>
  );
}
