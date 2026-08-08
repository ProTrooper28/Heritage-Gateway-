import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EASE, GOLD, PARCHMENT } from "./TrailVisuals";

const MESSAGES = [
  "Consulting the heritage archives…",
  "Plotting the perfect route…",
  "Balancing your interests…",
  "Tuning the timings to the golden hour…",
  "Adding hidden gems along the way…",
];

export function GeneratingState({ destination }: { destination: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-28 text-center relative">
      {/* Radial gold aura */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.79 0.11 82 / 0.12), transparent 65%)",
        }}
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="relative flex items-center justify-center w-24 h-24 rounded-full mb-10"
        style={{
          background: "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.2), oklch(0.13 0.008 60 / 0.8))",
          border: "1px dashed oklch(0.79 0.11 82 / 0.5)",
        }}
      >
        <div
          className="absolute inset-1 rounded-full"
          style={{ border: "1px solid oklch(0.79 0.11 82 / 0.2)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-gold"
        >
          <Sparkles size={30} />
        </motion.div>
      </motion.div>

      <h3 className="font-serif text-3xl text-parchment mb-3">
        Curating your {destination} trail
      </h3>

      <div className="h-8 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="font-sans text-sm font-light tracking-wide"
            style={{ color: "oklch(0.96 0.012 85 / 0.55)" }}
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mt-4">
        {MESSAGES.map((_, i) => (
          <motion.span
            key={i}
            animate={{
              scale: i === index ? 1.25 : 1,
              opacity: i <= index ? 0.9 : 0.25,
            }}
            transition={{ duration: 0.3 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: i <= index ? GOLD : "oklch(0.96 0.012 85 / 0.3)" }}
          />
        ))}
      </div>
    </div>
  );
}
