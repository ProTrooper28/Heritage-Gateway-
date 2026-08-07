import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Camera,
  Bot,
  Layers,
  Clock,
  ImagePlay,
  ChevronRight,
  Sparkles,
  MapPin,
  ArrowDown
} from "lucide-react";
import brihadeeswara from "@/assets/brihadeeswara.jpg";
import hampi from "@/assets/hampi.jpg";
import konark from "@/assets/konark.jpg";
import tajmahal from "@/assets/tajmahal.jpg";
import qutubminar from "@/assets/qutubminar.jpg";
import heritageBlend from "@/assets/heritage-blend.jpg";

// ─── Shared tokens ────────────────────────────────────────────────────────────
const GOLD = "oklch(0.79 0.11 82)";
const PARCHMENT = "oklch(0.96 0.012 85)";
const PARCHMENT_DIM = "oklch(0.78 0.015 85 / 0.72)";
const GLASS_BG = "linear-gradient(150deg, oklch(0.96 0.012 85 / 0.05), oklch(0.13 0.008 60 / 0.7))";
const GLASS_BORDER = "1px solid oklch(0.79 0.11 82 / 0.14)";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function HomePage() {
  const { scrollY } = useScroll();

  // Scroll transforms for the Apple-style hero
  // Hero slowly shrinks and moves up
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.85]);
  const heroY = useTransform(scrollY, [0, 800], [0, -100]);
  const heroOpacity = useTransform(scrollY, [500, 900], [1, 0]);
  const heroBlur = useTransform(scrollY, [200, 600], ["blur(0px)", "blur(12px)"]);
  
  // Title fades out quickly
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const titleY = useTransform(scrollY, [0, 300], [0, -50]);
  
  // Indicator fades out immediately
  const indicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <>
      {/* 
        ==================================================
        SECTION 1: FULLSCREEN HERO (Fixed in background)
        ==================================================
      */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1, // Behind the sidebar and main content
          scale: heroScale,
          y: heroY,
          opacity: heroOpacity,
          filter: heroBlur,
          transformOrigin: "top center",
          overflow: "hidden",
          backgroundColor: "oklch(0.1 0 0)",
        }}
      >
        <img
          src={heritageBlend}
          alt="Indian Heritage"
          className="w-full h-full object-cover opacity-80"
          style={{ transform: "scale(1.05)" }} // Slight zoom to allow parallax
        />
        
        {/* Dust and Fog effect gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_20%,oklch(0.05_0.01_60/0.9)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
        
        {/* Editorial Title */}
        <motion.div 
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-light text-[clamp(3.5rem,8vw,6.5rem)] text-parchment leading-[1.05] tracking-[-0.03em] max-w-5xl"
          >
            Every Monument <br />
            <span className="italic text-parchment-dim">Has A Story.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-sans text-[clamp(1rem,1.5vw,1.25rem)] text-parchment/60 font-light max-w-xl"
          >
            Experience India's heritage through AI-powered exploration.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 group relative overflow-hidden rounded-full border border-gold/30 bg-ink/40 backdrop-blur-md px-8 py-4 transition-all hover:border-gold hover:bg-gold/10"
          >
            <span className="relative z-10 font-sans text-xs uppercase tracking-[0.3em] text-gold group-hover:text-gold/90 transition-colors flex items-center gap-3">
              Begin Journey
              <ChevronRight size={14} />
            </span>
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-parchment/40"
        >
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={14} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Spacer to push content below the hero */}
      <div style={{ height: "100vh" }} />

      {/* 
        ==================================================
        DASHBOARD CONTENT (Reveals on scroll)
        ==================================================
      */}
      <div className="relative z-10 pb-32 pt-20">
        <Section2Welcome />
        <Section3Explore />
        <Section4Featured />
        <Section5AIFeatures />
        <Section6Collections />
        
        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 border-t border-parchment/10 pt-16 pb-8 text-center"
        >
          <h2 className="font-serif text-3xl text-parchment/40 mb-6 italic">History Awaits.</h2>
          <div className="flex justify-center gap-8 font-sans text-[0.65rem] uppercase tracking-[0.2em] text-parchment/30">
            <span className="hover:text-gold transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Credits</span>
          </div>
        </motion.footer>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[0.65rem] uppercase tracking-[0.4em] text-gold/80 mb-6">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-[clamp(2rem,3.5vw,3.5rem)] font-light text-parchment tracking-[-0.02em] leading-tight mb-16">
      {children}
    </h2>
  );
}

// ─── Section 2: Welcome Back ──────────────────────────────────────────────────
function Section2Welcome() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="mt-12 mb-32 max-w-4xl"
    >
      <motion.p variants={fadeUp} className="font-serif italic text-2xl text-parchment-dim mb-4">
        Welcome Back.
      </motion.p>
      <motion.h2 variants={fadeUp} className="font-serif text-[clamp(2.5rem,4vw,4rem)] font-light text-parchment tracking-[-0.02em] leading-tight">
        Continue your journey through India's heritage.
      </motion.h2>
    </motion.section>
  );
}

// ─── Section 3: Continue Exploring ────────────────────────────────────────────
const RECENT = [
  { id: "1", title: "Brihadeeswara Temple", subtitle: "Tamil Nadu", image: brihadeeswara },
  { id: "2", title: "Hampi Ruins", subtitle: "Karnataka", image: hampi },
];

function Section3Explore() {
  return (
    <motion.section className="mb-40">
      <SectionLabel>Recent Journeys</SectionLabel>
      <SectionTitle>Continue Exploring</SectionTitle>
      
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {RECENT.map((m) => (
          <motion.div
            key={m.id}
            variants={cardReveal}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative h-[32rem] rounded-2xl overflow-hidden cursor-pointer"
            style={{ border: GLASS_BORDER }}
          >
            <img src={m.image} alt={m.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-70" />
            
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-3 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                Resume Exploration
              </p>
              <h3 className="font-serif text-4xl text-parchment mb-2">{m.title}</h3>
              <p className="font-sans text-sm text-parchment/60">{m.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ─── Section 4: Featured Monuments ────────────────────────────────────────────
const FEATURED = [
  { id: "f1", title: "Taj Mahal", desc: "The eternal elegy of Shah Jahan.", image: tajmahal },
  { id: "f2", title: "Qutub Minar", desc: "History written vertically.", image: qutubminar },
  { id: "f3", title: "Konark Sun", desc: "Chariot of the Sun God.", image: konark },
];

function Section4Featured() {
  return (
    <motion.section className="mb-48">
      <SectionLabel>Curated Selections</SectionLabel>
      <SectionTitle>Featured Monuments</SectionTitle>
      
      <div className="flex gap-6 overflow-x-auto pb-12 pt-4 hide-scrollbar snap-x snap-mandatory">
        {FEATURED.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative shrink-0 w-[clamp(320px,40vw,480px)] h-[28rem] rounded-2xl overflow-hidden snap-center group cursor-pointer"
          >
            <img src={f.image} alt={f.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-ink/30 transition-colors duration-500 group-hover:bg-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="font-serif text-3xl text-parchment mb-3">{f.title}</h3>
              <p className="font-sans text-sm text-parchment/70 leading-relaxed max-w-xs">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Section 5: AI Features ───────────────────────────────────────────────────
const AI_FEATURES = [
  { icon: Camera, title: "AI Monument Scanner", desc: "Point your camera at any ancient structure. Our vision models instantly decode its history, architecture, and hidden stories in real-time." },
  { icon: Bot, title: "The AI Historian", desc: "A personalized guide powered by centuries of archives. Ask questions, debate interpretations, and converse with history itself." },
  { icon: Layers, title: "Architecture Explorer", desc: "Deconstruct monuments layer by layer. Understand the engineering marvels and stylistic evolutions of past dynasties." },
  { icon: ImagePlay, title: "Historical Reconstruction", desc: "Peer through the veil of time. See ruins restored to their original glory with breathtaking AI-generated reconstructions." },
];

function Section5AIFeatures() {
  return (
    <section className="mb-40">
      <div className="text-center mb-32">
        <SectionLabel>Capabilities</SectionLabel>
        <SectionTitle>Empowered by AI</SectionTitle>
      </div>

      <div className="space-y-48">
        {AI_FEATURES.map((feat, i) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className={`flex flex-col gap-12 items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
          >
            {/* Massive Abstract Visual block */}
            <div className="w-full md:w-1/2 aspect-square max-h-[500px] rounded-[2.5rem] bg-ink/50 border border-parchment/5 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.79_0.11_82/0.1),transparent)] opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
              <feat.icon size={80} className="text-gold/20 transition-transform duration-1000 group-hover:scale-110 group-hover:text-gold/40" strokeWidth={1} />
            </div>
            
            {/* Text block with lots of whitespace */}
            <div className="w-full md:w-1/2 p-8 md:p-16">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gold/20 text-gold mb-8">
                <feat.icon size={18} />
              </div>
              <h3 className="font-serif text-4xl text-parchment mb-6 tracking-tight leading-tight">{feat.title}</h3>
              <p className="font-sans text-lg text-parchment/60 leading-relaxed max-w-md font-light">
                {feat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Section 6: Collections ───────────────────────────────────────────────────
const COLLECTIONS = ["UNESCO World Heritage", "Chola Temples", "Mughal Architecture", "Rajput Forts", "Lost Cities", "Buddhist Caves"];

function Section6Collections() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1 }}
      className="mb-20"
    >
      <SectionLabel>Curations</SectionLabel>
      <SectionTitle>Thematic Collections</SectionTitle>
      
      <div className="flex gap-4 overflow-x-auto pb-8 hide-scrollbar">
        {COLLECTIONS.map((c, i) => (
          <motion.div
            key={c}
            whileHover={{ scale: 1.03 }}
            className="shrink-0 w-64 h-80 rounded-2xl border border-parchment/10 bg-ink flex items-end p-6 cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <h3 className="font-serif text-2xl text-parchment relative z-10">{c}</h3>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
