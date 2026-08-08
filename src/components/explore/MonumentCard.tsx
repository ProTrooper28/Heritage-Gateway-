import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Monument } from "./data/monuments";

type Props = {
  monument: Monument;
  onClick: (monument: Monument) => void;
};

export function MonumentCard({ monument, onClick }: Props) {
  return (
    <motion.div
      whileHover="hover"
      onClick={() => onClick(monument)}
      className="relative flex-shrink-0 w-72 h-96 rounded-2xl overflow-hidden cursor-pointer explore-card group"
    >
      <motion.img
        src={monument.images[0]}
        alt={monument.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
        variants={{
          hover: { scale: 1.05 }
        }}
      />
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-80" />
      
      {/* Content */}
      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end">
        <h3 className="font-serif text-2xl text-parchment mb-1 leading-tight">{monument.name}</h3>
        <div className="flex items-center gap-1.5 text-gold/80 font-sans text-xs uppercase tracking-widest mb-3">
          <MapPin size={12} />
          {monument.location.city}, {monument.location.state}
        </div>
        <p className="font-sans text-sm text-parchment/70 line-clamp-2 leading-relaxed">
          {monument.shortDesc}
        </p>
      </div>

      {/* Gold hover border glow */}
      <motion.div 
        className="absolute inset-0 rounded-2xl border border-gold/0"
        variants={{
          hover: { borderColor: "oklch(0.79 0.11 82 / 0.5)", boxShadow: "inset 0 0 20px oklch(0.79 0.11 82 / 0.2)" }
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
