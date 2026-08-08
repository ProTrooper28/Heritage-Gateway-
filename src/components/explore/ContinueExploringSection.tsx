import { motion } from "framer-motion";
import { Landmark, Sparkles, Flame, Coffee, Library, TreePine } from "lucide-react";

const EXPLORE_CATEGORIES = [
  { id: "c-1", label: "UNESCO Heritage Sites", icon: Landmark, color: "text-blue-400" },
  { id: "c-2", label: "Hidden Gems Nearby", icon: Sparkles, color: "text-purple-400" },
  { id: "c-3", label: "Local Culture & Traditions", icon: Flame, color: "text-orange-400" },
  { id: "c-4", label: "Local Food & Cuisine", icon: Coffee, color: "text-yellow-500" },
  { id: "c-5", label: "Museums Nearby", icon: Library, color: "text-teal-400" },
  { id: "c-6", label: "Nature & Scenic Spots", icon: TreePine, color: "text-green-400" }
];

export function ContinueExploringSection() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-parchment/10 pb-4">
        <h2 className="font-serif text-3xl text-parchment">Continue Exploring</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {EXPLORE_CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="explore-card p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-gold/10 hover:border-gold/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-ink/50 border border-parchment/10 flex items-center justify-center mb-4 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                <Icon size={20} className={category.color} />
              </div>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-parchment/80 group-hover:text-gold transition-colors">
                {category.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
