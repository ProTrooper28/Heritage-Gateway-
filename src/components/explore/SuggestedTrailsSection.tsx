import { motion } from "framer-motion";
import { Route, Clock, Navigation, MapPin } from "lucide-react";
import { SuggestedTrail } from "./data/extendedMonumentData";

export function SuggestedTrailsSection({ trails }: { trails: SuggestedTrail[] }) {
  if (!trails || trails.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-parchment/10 pb-4">
        <h2 className="font-serif text-3xl text-parchment">Suggested Heritage Trails</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {trails.map((trail, index) => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="explore-card p-8 rounded-3xl border border-gold/10 hover:border-gold/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="font-serif text-2xl text-parchment mb-2">{trail.name}</h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-parchment/60 bg-ink/50 px-3 py-1 rounded-full border border-parchment/10">
                    <MapPin size={12} className="text-gold" /> {trail.stops} Stops
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-parchment/60 bg-ink/50 px-3 py-1 rounded-full border border-parchment/10">
                    <Clock size={12} className="text-gold" /> {trail.duration}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-parchment/60 bg-ink/50 px-3 py-1 rounded-full border border-parchment/10">
                    <Navigation size={12} className="text-gold" /> {trail.distance}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30 shrink-0">
                <Route size={18} className="text-gold" />
              </div>
            </div>

            {/* Route Timeline Preview */}
            <div className="relative pl-4 mb-8 space-y-6 before:absolute before:inset-y-2 before:left-[19px] before:w-px before:bg-gradient-to-b before:from-gold/50 before:to-transparent">
              {trail.route.map((stop, stopIdx) => (
                <div key={stopIdx} className="relative flex items-center gap-4">
                  <div className="absolute -left-6 w-3 h-3 rounded-full bg-ink border-2 border-gold z-10" />
                  <span className={`font-sans text-sm ${stopIdx === 0 || stopIdx === trail.route.length - 1 ? 'text-parchment font-semibold' : 'text-parchment/60'}`}>
                    {stop}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full py-3 rounded-xl border border-gold/30 bg-gold/5 text-gold font-sans text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-ink transition-colors duration-300">
              View Full Route
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
