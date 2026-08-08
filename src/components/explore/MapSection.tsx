import { motion } from "framer-motion";
import { Map, ExternalLink, MapPin } from "lucide-react";
import { Monument } from "./data/monuments";

export function MapSection({ monument }: { monument: Monument }) {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-parchment/10 pb-4">
        <h2 className="font-serif text-3xl text-parchment">Location & Map</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="explore-card rounded-3xl overflow-hidden relative border border-gold/20 flex flex-col md:flex-row items-center"
      >
        {/* Placeholder Map Background */}
        <div className="w-full md:w-2/3 h-64 md:h-80 relative bg-ink/80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,179,106,0.1)_0%,transparent_70%)]" />
          {/* Decorative Map Pattern (abstract lines to simulate roads/terrain) */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-parchment)" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M 0 100 Q 150 50 300 200 T 600 150" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
          
          {/* Main Monument Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-ink/80 backdrop-blur-md border border-gold px-3 py-1 rounded-lg mb-2 font-sans text-xs text-parchment whitespace-nowrap shadow-lg">
              {monument.name}
            </div>
            <MapPin size={32} className="text-gold drop-shadow-md animate-bounce" />
            <div className="w-4 h-1 bg-black/50 rounded-full blur-sm mt-1" />
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="w-full md:w-1/3 p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-parchment/10 bg-ink/40">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30 mb-6">
            <Map size={24} className="text-gold" />
          </div>
          <h3 className="font-serif text-2xl text-parchment mb-2">Explore the Area</h3>
          <p className="font-sans text-sm text-parchment/60 mb-8 leading-relaxed">
            Discover {monument.location.city}'s rich history. Open the interactive map to see real-time walking routes and nearby facilities.
          </p>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(monument.name + ' ' + monument.location.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-gold/30 bg-gold text-ink font-sans text-xs uppercase tracking-[0.2em] hover:bg-gold/90 transition-colors duration-300 font-semibold"
          >
            Open in Google Maps
            <ExternalLink size={14} />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
