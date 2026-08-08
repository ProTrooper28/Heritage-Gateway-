import { motion } from "framer-motion";

export type TabId = "near-me" | "search" | "hidden" | "unesco" | "dynasty" | "category";

export const TABS: { id: TabId; label: string }[] = [
  { id: "near-me", label: "Near Me" },
  { id: "search", label: "Search" },
  { id: "hidden", label: "Hidden Heritage" },
  { id: "unesco", label: "UNESCO Sites" },
  { id: "dynasty", label: "By Dynasty" },
  { id: "category", label: "By Category" },
];

type Props = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

export function ExploreTabBar({ activeTab, onTabChange }: Props) {
  return (
    <div className="sticky top-20 z-30 flex items-center gap-2 overflow-x-auto scrollbar-hide py-4 border-b border-parchment/10 bg-ink/40 backdrop-blur-xl mb-8 -mx-6 px-6">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-5 py-2.5 rounded-full font-sans text-[0.7rem] uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${
              isActive ? "text-gold" : "text-parchment/50 hover:text-parchment/80"
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="explore-tab-indicator"
                className="absolute inset-0 rounded-full border border-gold/30 bg-gold/10 -z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
