import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, Clock } from "lucide-react";
import { useUserState } from "../../context/UserStateContext";

// Simple relative time formatter
function getRelativeTime(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
}

export function RecentActivityPage() {
  const { state, removeActivity, clearActivity } = useUserState();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 pt-8 max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-serif text-5xl text-parchment mb-3 flex items-center gap-4">
            Recent Activity <History className="text-parchment/30" size={32} />
          </h1>
          <p className="font-sans text-sm text-parchment/50 uppercase tracking-widest">
            Your Journey Through Heritage
          </p>
        </div>
        
        {state.recentActivity.length > 0 && (
          <button 
            onClick={clearActivity}
            className="px-6 py-2.5 rounded-full border border-red-900/30 bg-red-900/10 text-red-400 font-sans text-xs uppercase tracking-widest hover:bg-red-900/30 hover:border-red-900/50 transition-all self-start md:self-auto"
          >
            Clear History
          </button>
        )}
      </div>

      {state.recentActivity.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-parchment/10 rounded-3xl">
          <Clock size={48} className="text-parchment/20 mb-6" />
          <h3 className="font-serif text-2xl text-parchment/60 mb-2">No activity yet</h3>
          <p className="font-sans text-sm text-parchment/40">Start exploring to build your history.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:inset-y-4 before:left-[1.95rem] before:w-px before:bg-gradient-to-b before:from-gold/30 before:to-transparent">
          <AnimatePresence>
            {state.recentActivity.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                layout
                className="relative flex items-center gap-6"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[0.35rem] w-3 h-3 rounded-full bg-ink border-2 border-gold z-10" />
                
                <div className="flex-1 explore-card p-5 rounded-2xl border border-parchment/5 hover:border-gold/20 transition-all flex items-center justify-between group">
                  <div>
                    <h4 className="font-serif text-xl text-parchment/90 mb-1">{activity.action}</h4>
                    <p className="font-sans text-xs uppercase tracking-widest text-gold/70">{activity.title}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-xs text-parchment/40">{getRelativeTime(activity.timestamp)}</span>
                    <button 
                      onClick={() => removeActivity(activity.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-parchment/40 hover:text-red-400 transition-all"
                      title="Remove"
                    >
                      <Trash2 size={16} />
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
