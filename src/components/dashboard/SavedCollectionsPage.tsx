import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search, Calendar, MapPin, ExternalLink, Bookmark } from "lucide-react";
import { useUserState } from "../../context/UserStateContext";
import { monuments } from "../explore/data/monuments";

export function SavedCollectionsPage({ onOpenMonument }: { onOpenMonument?: (id: string) => void }) {
  const { state, removeSave } = useUserState();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSaves = state.savedCollections
    .filter(save => 
      save.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      save.location.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime());

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
            {state.savedCollections.length} Items Saved
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

      {state.savedCollections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-parchment/10 rounded-3xl">
          <Bookmark size={48} className="text-parchment/20 mb-6" />
          <h3 className="font-serif text-2xl text-parchment/60 mb-2">No collections yet</h3>
          <p className="font-sans text-sm text-parchment/40">Monuments you save will appear here.</p>
        </div>
      ) : (
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
                  <img src={save.image} alt={save.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
      )}
    </motion.div>
  );
}
