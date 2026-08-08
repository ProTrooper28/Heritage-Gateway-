import { motion } from "framer-motion";
import { Clock, MapPin, Navigation } from "lucide-react";
import { NearbySite } from "./data/extendedMonumentData";

export function NearbyHeritageSection({ sites }: { sites: NearbySite[] }) {
  if (!sites || sites.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-parchment/10 pb-4">
        <h2 className="font-serif text-3xl text-parchment">Nearby Heritage Sites</h2>
        <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold">{sites.length} Locations</span>
      </div>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 px-2 -mx-2">
        {sites.map((site) => (
          <motion.div
            key={site.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="explore-card flex-shrink-0 w-80 rounded-3xl overflow-hidden group border border-gold/10 hover:border-gold/30 transition-all duration-500 flex flex-col"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={site.image} 
                alt={site.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-ink/60 backdrop-blur-md border border-parchment/20 text-parchment font-sans text-[0.65rem] uppercase tracking-widest">
                {site.category}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-serif text-2xl text-parchment mb-2">{site.name}</h3>
              <p className="font-sans text-sm text-parchment/60 line-clamp-2 mb-6 flex-1">
                {site.description}
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-parchment/50">
                  <Navigation size={12} className="text-gold" />
                  {site.distance}
                </div>
                <div className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-parchment/50">
                  <Clock size={12} className="text-gold" />
                  {site.travelTime}
                </div>
              </div>

              <button className="w-full py-3 rounded-xl border border-gold/30 bg-gold/5 text-gold font-sans text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-ink transition-colors duration-300">
                Explore
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
