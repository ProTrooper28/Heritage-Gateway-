import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bookmark, Share2, Check } from "lucide-react";

import type { SmartTrail } from "../types";
import { useUserState } from "../../../context/UserStateContext";
import type { SavedTrail } from "../../../context/UserStateContext";
import { EASE, GOLD } from "./TrailVisuals";

type ToastState = { id: number; message: string } | null;

function toSavedTrail(trail: SmartTrail): SavedTrail {
  return {
    trailId: trail.id,
    name: trail.title,
    city: trail.city,
    state: trail.state,
    image: trail.image,
    stops: trail.totalStops,
    durationMinutes: trail.totalDurationMinutes,
    dateSaved: new Date().toISOString(),
  };
}

export function SaveShareBar({ trail }: { trail: SmartTrail }) {
  const { state, toggleFavoriteTrail, toggleSaveTrail } = useUserState();
  const [toast, setToast] = useState<ToastState>(null);

  const isFavorited = state.favoriteTrails.includes(trail.id);
  const isSaved = state.savedTrails.some((t) => t.trailId === trail.id);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  function notify(message: string) {
    setToast({ id: Date.now(), message });
  }

  async function share() {
    const text = `${trail.title}\n${trail.stops.length} stops · ${trail.city}, ${trail.state}\nPlan it yourself on Heritage Gateway:`;
    try {
      if (navigator.share) {
        await navigator.share({ title: trail.title, text });
        notify("Trail shared");
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
        notify("Trail details copied to clipboard");
      }
    } catch {
      /* user cancelled */
    }
  }

  const actionStyle = (active: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.8rem 1.25rem",
    borderRadius: "999px",
    fontFamily: "'Jost', system-ui, sans-serif",
    fontSize: "0.62rem",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: `1px solid ${
      active ? "oklch(0.79 0.11 82 / 0.6)" : "oklch(0.96 0.012 85 / 0.12)"
    }`,
    background: active
      ? "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.22), oklch(0.79 0.11 82 / 0.08))"
      : "oklch(0.96 0.012 85 / 0.05)",
    color: active ? "oklch(0.88 0.1 85)" : "oklch(0.96 0.012 85 / 0.65)",
  } as const);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        className="flex flex-wrap items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          style={actionStyle(isFavorited)}
          onClick={() => {
            toggleFavoriteTrail(trail.id);
            notify(isFavorited ? "Removed from favorites" : "Added to favorites");
          }}
        >
          <Heart size={14} fill={isFavorited ? "currentColor" : "none"} />
          {isFavorited ? "Favorited" : "Favorite Trail"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          style={actionStyle(isSaved)}
          onClick={() => {
            toggleSaveTrail(toSavedTrail(trail));
            notify(isSaved ? "Trail removed from Saved Collections" : "Trail saved to collections");
          }}
        >
          <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Saved" : "Save Trail"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          style={actionStyle(false)}
          onClick={share}
        >
          <Share2 size={14} />
          Share Trail
        </motion.button>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2.5 px-5 py-3 rounded-full"
            style={{
              background: "linear-gradient(135deg, oklch(0.16 0.012 60 / 0.95), oklch(0.1 0.006 60 / 0.95))",
              backdropFilter: "blur(16px)",
              border: "1px solid oklch(0.79 0.11 82 / 0.4)",
              boxShadow: "0 16px 48px -12px oklch(0 0 0 / 0.8), 0 0 24px oklch(0.79 0.11 82 / 0.15)",
            }}
          >
            <span
              className="flex items-center justify-center w-5 h-5 rounded-full"
              style={{ background: "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))" }}
            >
              <Check size={11} className="text-ink" />
            </span>
            <span className="font-sans text-xs tracking-wide" style={{ color: GOLD }}>
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
