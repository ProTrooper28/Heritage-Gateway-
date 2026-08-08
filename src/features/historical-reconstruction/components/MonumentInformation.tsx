import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Feather,
  ScrollText,
  Landmark,
  History,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

import type { Monument } from "../types";

const SECTIONS: {
  key: keyof Monument["info"];
  label: string;
  icon: typeof Feather;
}[] = [
  { key: "overview", label: "Overview", icon: Feather },
  { key: "history", label: "History", icon: ScrollText },
  { key: "architecture", label: "Architecture", icon: Landmark },
  { key: "majorChanges", label: "Major Changes", icon: History },
  { key: "culturalSignificance", label: "Cultural Significance", icon: Sparkles },
  { key: "preservation", label: "Preservation", icon: ShieldCheck },
];

function Section({
  label,
  icon: Icon,
  paragraphs,
  index,
  defaultOpen = false,
}: {
  label: string;
  icon: typeof Feather;
  paragraphs: string[];
  index: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="border-b"
      style={{ borderColor: "oklch(0.96 0.012 85 / 0.08)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 py-6 text-left group"
      >
        <span
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors duration-300"
          style={{
            background: open ? "linear-gradient(135deg, oklch(0.82 0.12 85), oklch(0.68 0.08 78))" : "oklch(0.79 0.11 82 / 0.08)",
            border: `1px solid ${open ? "transparent" : "oklch(0.79 0.11 82 / 0.25)"}`,
            color: open ? "oklch(0.13 0.008 60)" : "oklch(0.79 0.11 82)",
          }}
        >
          <Icon size={17} />
        </span>
        <span className="flex-1">
          <span className="block font-sans text-[0.55rem] uppercase tracking-[0.3em] text-parchment/35 mb-1">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="block font-serif text-xl md:text-2xl text-parchment group-hover:text-gold transition-colors duration-300">
            {label}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gold/70"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-14 pb-8 space-y-3 max-w-3xl">
              {paragraphs.map((text, i) => (
                <p key={i} className="font-sans text-sm text-parchment/65 leading-relaxed font-light">
                  {text}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function MonumentInformation({ monument }: { monument: Monument }) {
  return (
    <section className="mt-24">
      <div className="mb-10">
        <p className="font-sans text-[0.62rem] uppercase tracking-[0.35em] text-gold/80 mb-3">
          About this monument
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-parchment tracking-[-0.02em]">
          {monument.name} — in depth
        </h2>
      </div>

      <div>
        {SECTIONS.map((section, i) => (
          <Section
            key={section.key}
            label={section.label}
            icon={section.icon}
            index={i}
            defaultOpen={i === 0}
            paragraphs={monument.info[section.key]}
          />
        ))}
      </div>

      {/* Sources */}
      <div className="mt-10">
        <p className="font-sans text-[0.6rem] uppercase tracking-[0.25em] text-parchment/45 mb-5">
          Sources & further reading
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {monument.sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-colors duration-300 hover:border-gold/30"
              style={{ background: "oklch(0.96 0.012 85 / 0.03)", border: "1px solid oklch(0.96 0.012 85 / 0.08)" }}
            >
              <div className="min-w-0">
                <p className="font-sans text-sm text-parchment/80 truncate">{source.name}</p>
                <p className="font-sans text-[0.6rem] uppercase tracking-[0.18em] text-gold/60 mt-1">
                  {source.type} · {source.date}
                </p>
              </div>
              {source.url && (
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-gold hover:text-gold/70 transition-colors" aria-label={`Open source: ${source.name}`}>
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
