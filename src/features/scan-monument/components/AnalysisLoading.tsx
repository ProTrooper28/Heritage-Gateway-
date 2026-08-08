import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { LOADING_MESSAGES } from "../hooks/useScanMonument";

type Props = {
  loadingStep: number;
};

export function AnalysisLoading({ loadingStep }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-gold/15 bg-gradient-to-br from-parchment/3 to-ink/90 backdrop-blur-xl p-12 text-center"
    >
      {/* Animated Mandala Reticle */}
      <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
        {/* Radar ping */}
        <div className="absolute inset-0 rounded-full border border-gold/15 animate-ping opacity-25" />

        {/* Outer clockwise ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t border-b border-gold/40 border-l border-r border-transparent"
        />

        {/* Inner counter-clockwise ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          className="absolute inset-4 rounded-full border-l border-r border-gold/30 border-t border-b border-transparent"
        />

        {/* Blinking core */}
        <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/60 flex items-center justify-center gold-pulse">
          <Sparkles size={16} className="text-gold animate-spin" style={{ animationDuration: "3s" }} />
        </div>
      </div>

      {/* Rotating Loading Text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={loadingStep}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.45 }}
          className="font-serif text-2xl italic font-light text-parchment/90 mb-2"
        >
          {LOADING_MESSAGES[loadingStep]}
        </motion.p>
      </AnimatePresence>

      <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-gold/50">
        Heritage Intelligence Matrix
      </p>
    </motion.div>
  );
}
