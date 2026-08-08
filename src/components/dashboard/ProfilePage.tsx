import { motion } from "framer-motion";
import { User, Eye, Bookmark, Heart, Scan, Compass } from "lucide-react";
import { useUserState } from "../../context/UserStateContext";

export function ProfilePage() {
  const { state } = useUserState();

  // Determine a simple "member since" date based on the oldest activity, or just say "Today"
  const memberSince = state.recentActivity.length > 0 
    ? new Date(state.recentActivity[state.recentActivity.length - 1].timestamp).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 pt-8 max-w-4xl mx-auto"
    >
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-gold/40 to-ink border border-gold/30 flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" />
          <User size={48} className="text-gold relative z-10" />
        </div>
        <h1 className="font-serif text-4xl text-parchment mb-2">Heritage Explorer</h1>
        <p className="font-sans text-sm text-parchment/50 uppercase tracking-widest">
          Member since {memberSince}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<Eye />} 
          label="Monuments Viewed" 
          value={state.stats.monumentsViewed} 
          delay={0.1} 
        />
        <StatCard 
          icon={<Bookmark />} 
          label="Saved Collections" 
          value={state.savedCollections.length} 
          delay={0.2} 
        />
        <StatCard 
          icon={<Heart />} 
          label="Favorites" 
          value={state.favorites.length} 
          delay={0.3} 
        />
        <StatCard 
          icon={<Scan />} 
          label="Monuments Scanned" 
          value={state.stats.scanCount} 
          delay={0.4} 
        />
        <StatCard 
          icon={<Compass />} 
          label="Explorations" 
          value={state.stats.explorationCount} 
          delay={0.5} 
        />
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, delay }: { icon: React.ReactNode, label: string, value: number, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="explore-card p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-gold/10 hover:border-gold/30 transition-all"
    >
      <div className="text-gold mb-4 opacity-80">
        {icon}
      </div>
      <h2 className="font-serif text-5xl text-parchment mb-2">{value}</h2>
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-parchment/60">{label}</p>
    </motion.div>
  );
}
