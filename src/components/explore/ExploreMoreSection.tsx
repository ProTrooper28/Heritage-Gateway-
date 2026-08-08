import { useMemo } from "react";
import { Monument, monuments } from "./data/monuments";
import { MonumentCard } from "./MonumentCard";

type Props = {
  currentMonument: Monument;
  onSelectMonument: (monument: Monument) => void;
};

export function ExploreMoreSection({ currentMonument, onSelectMonument }: Props) {
  // Logic to find related monuments based on shared attributes
  const relatedMonuments = useMemo(() => {
    return monuments
      .filter(m => m.id !== currentMonument.id)
      .map(m => {
        let score = 0;
        if (m.dynasty === currentMonument.dynasty) score += 3;
        if (m.category === currentMonument.category) score += 2;
        if (m.location.state === currentMonument.location.state) score += 2;
        if (m.unesco && currentMonument.unesco) score += 1;
        if (m.timePeriod === currentMonument.timePeriod) score += 1;
        return { monument: m, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // Top 5
      .map(item => item.monument);
  }, [currentMonument]);

  if (relatedMonuments.length === 0) return null;

  return (
    <section className="space-y-8 pt-8">
      <div className="flex items-center justify-between border-b border-parchment/10 pb-4">
        <h2 className="font-serif text-3xl text-parchment">You may also like</h2>
      </div>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 px-2 -mx-2">
        {relatedMonuments.map(m => (
          <MonumentCard 
            key={m.id} 
            monument={m} 
            onClick={onSelectMonument} 
          />
        ))}
      </div>
    </section>
  );
}
