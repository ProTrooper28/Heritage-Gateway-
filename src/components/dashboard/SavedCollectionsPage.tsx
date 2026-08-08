import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Search,
  Calendar,
  MapPin,
  ExternalLink,
  Bookmark,
  Route,
  Timer,
  Layers,
} from "lucide-react";
import { useUserState } from "../../context/UserStateContext";
import { monuments } from "../explore/data/monuments";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h} hr${h > 1 ? "s" : ""}`;
}

export function SavedCollectionsPage({
  onOpenMonument,
  onOpenTrail,
}: {
  onOpenMonument?: (id: string) => void;
  onOpenTrail?: () => void;
}) {
  const { state, removeSave, removeTrail } = useUserState();
  const [searchQuery, setSearchQuery] = useState("");

  const q = searchQuery.trim().toLowerCase();
  const filteredSaves = state.savedCollections
    .filter(save =>
      save.name.toLowerCase().includes(q) ||
      save.location.city.toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime());

  const filteredTrails = state.savedTrails
    .filter(trail =>
      trail.name.toLowerCase().includes(q) ||
      trail.city.toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime());

  const total = state.savedCollections.length + state.savedTrails.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 pt-8 max-w-6xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-serif text-5xl text-parchment mb-3">Saved Collections</h1>
          <p className="font-sans text-sm text-parchment/50 uppercase tracking-widest">
            {total} Items Saved
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/40" size={16} />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink/50 border border-parchment/10 rounded-full py-3 pl-12 pr-4 text-parchment font-sans text-sm outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-parchment/10 rounded-3xl">
          <Bookmark size={48} className="text-parchment/20 mb-6" />
          <h3 className="font-serif text-2xl text-parchment/60 mb-2">No collections yet</h3>
          <p className="font-sans text-sm text-parchment/40">
            Monuments and heritage trails you save will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-20">
          {/* ─── Saved Trails ─── */}
          {filteredTrails.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 text-gold">
                  <Route size={16} />
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-parchment">Smart Heritage Trails</h2>
                  <p className="font-sans text-xs uppercase tracking-widest text-parchment/40">
                    {filteredTrails.length} Trails
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredTrails.map((trail) => (
                    <motion.div
                      key={trail.trailId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="rounded-3xl overflow-hidden group flex flex-col border border-gold/10 hover:border-gold/30 transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(150deg, oklch(0.96 0.012 85 / 0.05), oklch(0.13 0.008 60 / 0.75))",
                        backdropFilter: "blur(20px) saturate(130%)",
                        boxShadow: "0 16px 44px -20px oklch(0 0 0 / 0.8)",
                      }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={trail.image}
                          alt={trail.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent opacity-90" />
                        <span className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[0.58rem] uppercase tracking-[0.18em] text-gold bg-ink/70 backdrop-blur-md border border-gold/30">
                          <Route size={10} /> Trail
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTrail(trail.trailId);
                          }}
                          className="absolute top-4 right-4 p-2 rounded-full bg-ink/60 backdrop-blur-md text-red-400/80 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/30 transition-all"
                          title="Remove from saved"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-serif text-2xl text-parchment mb-1">{trail.name}</h3>
                        <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-parchment/50 mb-5">
                          <MapPin size={12} className="text-gold" />
                          {trail.city}, {trail.state}
                        </div>

                        <div className="flex items-center gap-4 font-sans text-[0.65rem] uppercase tracking-widest text-parchment/45 mb-5">
                          <span className="flex items-center gap-1.5">
                            <Layers size={12} className="text-gold" /> {trail.stops} stops
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Timer size={12} className="text-gold" />
                            {formatDuration(trail.durationMinutes)}
                          </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-parchment/10">
                          <div className="flex items-center gap-2 font-sans text-[0.65rem] uppercase tracking-widest text-parchment/40">
                            <Calendar size={12} />
                            Saved {new Date(trail.dateSaved).toLocaleDateString()}
                          </div>
                          <button
                            onClick={() => onOpenTrail?.()}
                            className="flex items-center gap-2 text-gold font-sans text-xs uppercase tracking-widest hover:text-gold/70 transition-colors"
                          >
                            Open <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* ─── Saved Monuments ─── */}
          {state.savedCollections.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 text-gold">
                  <Bookmark size={16} />
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-parchment">Monuments</h2>
                  <p className="font-sans text-xs uppercase tracking-widest text-parchment/40">
                    {state.savedCollections.length} Monuments
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredSaves.map((save) => (
                    <motion.div
                      key={save.monumentId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="explore-card rounded-3xl overflow-hidden group flex flex-col border border-gold/10 hover:border-gold/30 transition-all duration-300"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={save.image}
                          alt={save.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent opacity-90" />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSave(save.monumentId);
                          }}
                          className="absolute top-4 right-4 p-2 rounded-full bg-ink/60 backdrop-blur-md text-red-400/80 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/30 transition-all"
                          title="Remove from saved"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-serif text-2xl text-parchment mb-1">{save.name}</h3>
                        <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-parchment/50 mb-6">
                          <MapPin size={12} className="text-gold" />
                          {save.location.city}, {save.location.state}
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-parchment/10">
                          <div className="flex items-center gap-2 font-sans text-[0.65rem] uppercase tracking-widest text-parchment/40">
                            <Calendar size={12} />
                            Saved {new Date(save.dateSaved).toLocaleDateString()}
                          </div>
                          <button
                            onClick={() => onOpenMonument?.(save.monumentId)}
                            className="flex items-center gap-2 text-gold font-sans text-xs uppercase tracking-widest hover:text-gold/70 transition-colors"
                          >
                            Open <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </div>
      )}
    </motion.div>
  );
}
