import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { DiscoverSection } from "../types";
import { EASE, GOLD, TrailSectionHeader } from "./TrailVisuals";

function DiscoverRail({ section }: { section: DiscoverSection }) {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">{section.emoji}</span>
        <h3 className="font-serif text-2xl text-parchment">{section.title}</h3>
      </div>

      <div className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6 pr-4 -mx-1 px-1">
        {section.items.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
            whileHover={{ y: -6 }}
            className="group relative shrink-0 w-64 h-80 rounded-3xl overflow-hidden snap-center cursor-pointer text-left"
            style={{
              border: "1px solid oklch(0.79 0.11 82 / 0.14)",
              boxShadow: "0 16px 44px -18px oklch(0 0 0 / 0.8)",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              style={{ filter: "saturate(0.82) brightness(0.78) contrast(1.06)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

            {/* Tag */}
            <span
              className="absolute top-4 left-4 px-2.5 py-1 rounded-full font-sans text-[0.54rem] uppercase tracking-[0.2em]"
              style={{
                background: "oklch(0.08 0.005 60 / 0.75)",
                backdropFilter: "blur(8px)",
                border: "1px solid oklch(0.79 0.11 82 / 0.3)",
                color: GOLD,
              }}
            >
              {item.tag}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-sans text-[0.58rem] uppercase tracking-[0.22em] text-gold/80 mb-1.5">
                {item.subtitle}
              </p>
              <h4 className="font-serif text-lg text-parchment leading-snug">{item.name}</h4>
            </div>

            <div className="absolute bottom-5 right-5 flex items-center justify-center w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))",
              }}
            >
              <ArrowUpRight size={14} className="text-ink" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function DiscoverMore({ sections }: { sections: DiscoverSection[] }) {
  return (
    <section className="mt-28">
      <TrailSectionHeader
        eyebrow="Continue Exploring"
        title="Discover More"
        subtitle="The region around your trail has so much more to offer."
      />
      <div className="mt-12">
        {sections.map((section) => (
          <DiscoverRail key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}
