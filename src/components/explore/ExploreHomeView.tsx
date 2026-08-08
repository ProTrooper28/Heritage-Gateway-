import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPinOff } from "lucide-react";
import { ExploreTabBar, TabId } from "./ExploreTabBar";
import { MonumentCard } from "./MonumentCard";
import { monuments, Monument } from "./data/monuments";

type Props = {
  onSelectMonument: (monument: Monument) => void;
};

// Helper for Haversine distance
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
}

export function ExploreHomeView({ onSelectMonument }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("near-me");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);
  const [locError, setLocError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Request location when "near-me" is active
  useEffect(() => {
    if (activeTab === "near-me") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLoc({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setLocError(false);
          },
          (error) => {
            console.error("Location error:", error);
            setLocError(true);
          }
        );
      } else {
        setLocError(true);
      }
    }
  }, [activeTab]);

  const displayedMonuments = useMemo(() => {
    switch (activeTab) {
      case "near-me":
        if (!userLoc) return monuments.slice(0, 5); // Fallback while loading
        return [...monuments].sort((a, b) => {
          const distA = getDistance(userLoc.lat, userLoc.lng, a.location.lat, a.location.lng);
          const distB = getDistance(userLoc.lat, userLoc.lng, b.location.lat, b.location.lng);
          return distA - distB;
        });
      
      case "search":
        if (!searchQuery) return [];
        const q = searchQuery.toLowerCase();
        return monuments.filter(m => 
          m.name.toLowerCase().includes(q) || 
          m.location.city.toLowerCase().includes(q) ||
          m.location.state.toLowerCase().includes(q)
        );
      
      case "hidden":
        return monuments.filter(m => m.hidden);
        
      case "unesco":
        return monuments.filter(m => m.unesco);
        
      case "dynasty":
        // Handled specially in render
        return monuments;
        
      case "category":
        if (selectedCategory === "All") return monuments;
        return monuments.filter(m => m.category === selectedCategory);
        
      default:
        return monuments;
    }
  }, [activeTab, searchQuery, userLoc, selectedCategory]);

  const renderContent = () => {
    if (activeTab === "search") {
      return (
        <div className="space-y-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/40" size={20} />
            <input 
              type="text"
              placeholder="Search by name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ink/50 border border-parchment/10 rounded-2xl py-4 pl-12 pr-4 text-parchment font-sans outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center">
            {searchQuery && displayedMonuments.length === 0 && (
              <p className="text-parchment/50 font-sans mt-8">No monuments found matching "{searchQuery}"</p>
            )}
            {displayedMonuments.map(m => (
              <MonumentCard key={m.id} monument={m} onClick={onSelectMonument} />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "dynasty") {
      const byDynasty = monuments.reduce((acc, m) => {
        if (!acc[m.dynasty]) acc[m.dynasty] = [];
        acc[m.dynasty].push(m);
        return acc;
      }, {} as Record<string, Monument[]>);

      return (
        <div className="space-y-16 pb-16">
          {Object.entries(byDynasty).map(([dynasty, items]) => (
            <div key={dynasty} className="space-y-6">
              <h3 className="section-label pl-2">{dynasty}</h3>
              <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2">
                {items.map(m => (
                  <MonumentCard key={m.id} monument={m} onClick={onSelectMonument} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "category") {
      const categories = ["All", "Temples", "Forts", "Caves", "Museums", "Stepwells", "Other"];
      
      return (
        <div className="space-y-8">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-sans text-xs uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? "bg-gold text-ink font-semibold" 
                    : "bg-ink/50 text-parchment/60 border border-parchment/10 hover:border-gold/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center">
            {displayedMonuments.map(m => (
              <MonumentCard key={m.id} monument={m} onClick={onSelectMonument} />
            ))}
          </div>
        </div>
      );
    }

    // Default row layout (Near me, Hidden, UNESCO)
    return (
      <div className="space-y-6">
        {activeTab === "near-me" && locError && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-red-900/30 bg-red-900/10 text-red-200/80 font-sans text-sm max-w-xl mx-auto mb-8">
            <MapPinOff size={18} />
            Location access denied or unavailable. Showing default monuments.
          </div>
        )}
        
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 px-2">
          {displayedMonuments.map(m => (
            <MonumentCard key={m.id} monument={m} onClick={onSelectMonument} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-4"
    >
      <h1 className="font-serif text-4xl text-parchment mb-2">Explore Heritage</h1>
      <p className="font-sans text-sm text-parchment/50 uppercase tracking-widest mb-8">
        Discover India's timeless monuments
      </p>

      <ExploreTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
