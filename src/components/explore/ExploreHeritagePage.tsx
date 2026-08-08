import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ExploreHomeView } from "./ExploreHomeView";
import { MonumentDetailPage } from "./MonumentDetailPage";
import { Monument } from "./data/monuments";

export function ExploreHeritagePage() {
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {selectedMonument ? (
          <MonumentDetailPage 
            key="detail"
            monument={selectedMonument} 
            onBack={() => setSelectedMonument(null)} 
            onSelectMonument={setSelectedMonument}
          />
        ) : (
          <ExploreHomeView 
            key="home"
            onSelectMonument={setSelectedMonument} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
