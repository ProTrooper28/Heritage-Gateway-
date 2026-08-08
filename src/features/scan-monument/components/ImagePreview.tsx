import { Trash2, RefreshCw, Sparkles } from "lucide-react";

type Props = {
  image: string;
  onRemove: () => void;
  onChooseAnother: () => void;
  onAnalyze: () => void;
};

export function ImagePreview({ image, onRemove, onChooseAnother, onAnalyze }: Props) {
  return (
    <div className="w-full rounded-2xl border border-gold/15 bg-ink/40 backdrop-blur-md p-6 max-w-xl mx-auto flex flex-col items-center">
      {/* Large Image Frame */}
      <div className="relative w-full rounded-xl overflow-hidden border border-parchment/10 bg-black aspect-4/3 shadow-2xl">
        <img src={image} alt="Monument preview" className="w-full h-full object-cover" />
        
        {/* Holographic scanner grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(214,179,106,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(214,179,106,0.06)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        {/* Holographic laser sweep */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gold/50 shadow-[0_0_15px_oklch(0.79_0.11_82)] animate-[scan-line_3.5s_ease-in-out_infinite]" />
      </div>

      {/* Button Controls */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
        <button
          onClick={onRemove}
          className="rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 text-destructive/80 hover:text-destructive py-3.5 px-4 font-sans text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trash2 size={13} />
          Remove Image
        </button>

        <button
          onClick={onChooseAnother}
          className="rounded-xl border border-parchment/15 bg-parchment/4 hover:bg-parchment/8 text-parchment/70 hover:text-parchment py-3.5 px-4 font-sans text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={13} />
          Choose Another
        </button>

        <button
          onClick={onAnalyze}
          className="rounded-xl border border-gold/30 bg-gold/25 hover:bg-gold/35 text-gold flex-1 py-3.5 px-4 font-sans text-xs uppercase tracking-widest font-semibold transition gold-pulse flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles size={14} className="animate-spin" style={{ animationDuration: "4s" }} />
          Analyze Monument
        </button>
      </div>

      <style>{`
        @keyframes scan-line {
          0%, 100% { top: 0%; opacity: 0.2; }
          50% { top: 100%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
