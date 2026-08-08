import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ExploreHomeView } from "./ExploreHomeView";
import { MonumentDetailPage } from "./MonumentDetailPage";
import { Monument } from "./data/monuments";
import { useUserState } from "../../context/UserStateContext";

export function ExploreHeritagePage() {
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const { addActivity, incrementStat } = useUserState();

  useEffect(() => {
    addActivity("Explore Heritage", "Opened Explore Heritage");
    incrementStat("explorationCount");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
