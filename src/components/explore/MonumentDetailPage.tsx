import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Building, Landmark, Compass, Navigation } from "lucide-react";
import { Monument } from "./data/monuments";
import { getExtendedData } from "./data/extendedMonumentData";
import { NearbyHeritageSection } from "./NearbyHeritageSection";
import { ContinueExploringSection } from "./ContinueExploringSection";
import { SuggestedTrailsSection } from "./SuggestedTrailsSection";
import { MapSection } from "./MapSection";
import { ExploreMoreSection } from "./ExploreMoreSection";

type Props = {
  monument: Monument;
  onBack: () => void;
  onSelectMonument?: (monument: Monument) => void;
};

export function MonumentDetailPage({ monument, onBack, onSelectMonument }: Props) {
  const extendedData = getExtendedData(monument.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pb-32"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-24 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-ink/40 backdrop-blur-xl border border-parchment/10 text-parchment/70 hover:text-gold hover:border-gold/30 transition-all"
      >
        <ArrowLeft size={16} />
        <span className="font-sans text-xs uppercase tracking-widest">Back</span>
      </button>

      {/* Hero Section */}
      <div className="relative h-[60vh] -mt-10 -mx-6 mb-12 rounded-b-[3rem] overflow-hidden">
        <img 
          src={monument.images[0]} 
          alt={monument.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        
        <div className="absolute bottom-16 left-12 right-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold font-sans text-xs uppercase tracking-widest">
                {monument.category}
              </span>
              {monument.unesco && (
                <span className="px-3 py-1 rounded-full border border-parchment/20 bg-parchment/5 text-parchment font-sans text-xs uppercase tracking-widest">
                  UNESCO Site
                </span>
              )}
            </div>
            <h1 className="font-serif text-6xl text-parchment mb-4 leading-tight">{monument.name}</h1>
            <div className="flex items-center gap-6 font-sans text-sm text-parchment/70 uppercase tracking-widest">
              <span className="flex items-center gap-2"><MapPin size={16} className="text-gold" /> {monument.location.city}, {monument.location.state}</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-gold" /> {monument.period}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-8">
          <Section icon={<Landmark />} title="History" content={monument.history} />
          <Section icon={<Building />} title="Architecture" content={monument.architecture} />
          <Section icon={<Compass />} title="Cultural Significance" content={monument.culturalSignificance} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <InfoCard title="Dynasty & Period">
            <p className="font-serif text-xl text-parchment">{monument.dynasty}</p>
            <p className="font-sans text-sm text-parchment/50 uppercase tracking-widest mt-1">{monument.timePeriod}</p>
          </InfoCard>

          <InfoCard title="Visiting Tips">
            <ul className="space-y-3">
              {monument.visitingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 font-sans text-sm text-parchment/80 leading-relaxed">
                  <span className="text-gold mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Nearby Attractions">
            <ul className="space-y-3">
              {monument.nearbyAttractions.map((attraction, idx) => (
                <li key={idx} className="flex items-center gap-3 font-sans text-sm text-parchment/80">
                  <Navigation size={14} className="text-gold/50" />
                  {attraction}
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </div>

      {/* --- New Extended Content --- */}
      <div className="max-w-6xl mx-auto mt-24 space-y-32">
        <NearbyHeritageSection sites={extendedData.nearbySites} />
        <ContinueExploringSection />
        <SuggestedTrailsSection trails={extendedData.suggestedTrails} />
        <MapSection monument={monument} />
        {onSelectMonument && (
          <ExploreMoreSection 
            currentMonument={monument} 
            onSelectMonument={onSelectMonument} 
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function Section({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="explore-card p-8 rounded-3xl"
    >
      <div className="flex items-center gap-3 mb-6 text-gold">
        {icon}
        <h2 className="font-sans text-sm uppercase tracking-[0.2em]">{title}</h2>
      </div>
      <p className="font-serif text-xl text-parchment/90 leading-relaxed">
        {content}
      </p>
    </motion.section>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="explore-card p-6 rounded-3xl border-t border-gold/20"
    >
      <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-parchment/50 mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}
