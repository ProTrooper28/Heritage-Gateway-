import { motion } from "framer-motion";
import { Heart, Search } from "lucide-react";
import { useUserState } from "../../context/UserStateContext";
import { MonumentCard } from "../explore/MonumentCard";
import { monuments } from "../explore/data/monuments";
import { useState } from "react";

export function FavoritesPage({ onOpenMonument }: { onOpenMonument?: (id: string) => void }) {
  const { state } = useUserState();
  const [searchQuery, setSearchQuery] = useState("");

  const favoriteMonuments = monuments.filter(m => state.favorites.includes(m.id));
  const filteredFavorites = favoriteMonuments.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 pt-8 max-w-6xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-serif text-5xl text-parchment mb-3 flex items-center gap-4">
            Favorites <Heart className="text-red-500 fill-red-500" size={32} />
          </h1>
          <p className="font-sans text-sm text-parchment/50 uppercase tracking-widest">
            {favoriteMonuments.length} Places Loved
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/40" size={16} />
          <input 
            type="text"
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink/50 border border-parchment/10 rounded-full py-3 pl-12 pr-4 text-parchment font-sans text-sm outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      {favoriteMonuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-parchment/10 rounded-3xl">
          <Heart size={48} className="text-parchment/20 mb-6" />
          <h3 className="font-serif text-2xl text-parchment/60 mb-2">No favorites yet</h3>
          <p className="font-sans text-sm text-parchment/40">Tap the heart on any monument card to add it to your favorites.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-start">
          {filteredFavorites.map(m => (
            <MonumentCard 
              key={m.id} 
              monument={m} 
              onClick={() => onOpenMonument?.(m.id)} 
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
