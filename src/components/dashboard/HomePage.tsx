import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { TopBar } from "./TopBar";
import {
  Camera,
  Bot,
  Layers,
  ImagePlay,
} from "lucide-react";
import brihadeeswara from "@/assets/brihadeeswara.jpg";
import hampi from "@/assets/hampi.jpg";
import konark from "@/assets/konark.jpg";
import tajmahal from "@/assets/tajmahal.jpg";
import qutubminar from "@/assets/qutubminar.jpg";
import hero1 from "@/assets/hero1.png";
import hero2 from "@/assets/hero2.png";
import hero3 from "@/assets/hero3.png";
import hero4 from "@/assets/hero4.png";
import hero5 from "@/assets/hero5.png";

const GLASS_BORDER = "1px solid oklch(0.79 0.11 82 / 0.14)";

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

const HEROES = [
  { id: 1, image: hero1 },
  { id: 2, image: hero2 },
  { id: 3, image: hero3 },
  { id: 4, image: hero4 },
  { id: 5, image: hero5 },
];

export function HomePage({ sidebarCollapsed }: { sidebarCollapsed?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll over the 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress for smoother crossfades
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative">
      {/* 
        ==================================================
        SECTION 1: 500vh Scroll Container
        ==================================================
      */}
      <div ref={containerRef} style={{ height: "500vh" }}>
        
        {/* Fixed Hero Sequence Wrapper */}
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1, 
            backgroundColor: "oklch(0.1 0 0)",
            overflow: "hidden"
          }}
        >
          {HEROES.map((hero, index) => {
            // Calculate ranges based on 5 images (0.2 progress each)
            const startFadeIn = index === 0 ? 0 : (index - 0.5) * 0.2;
            const fullVisible = index * 0.2;
            const startFadeOut = (index + 0.5) * 0.2;
            const endFadeOut = (index + 1) * 0.2;
            
            // For the last image, don't fade out until the very end, and let dashboard cover it
            const actualEndFadeOut = index === 4 ? 1 : endFadeOut;

            // Use hooks inside loop (this is safe because HEROES length is constant)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(
              smoothProgress,
              [startFadeIn, fullVisible, startFadeOut, actualEndFadeOut],
              [0, 1, 1, 0]
            );
            
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const scale = useTransform(
              smoothProgress,
              [startFadeIn, actualEndFadeOut],
              [1.1, 0.95]
            );

            return (
              <motion.div
                key={hero.id}
                className="absolute inset-0"
                style={{ opacity, scale, transformOrigin: "center 30%" }}
              >
                <img
                  src={hero.image}
                  alt={`Hero ${hero.id}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,oklch(0.05_0.01_60/0.4)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 
        ==================================================
        DASHBOARD CONTENT 
        Begins right after the 500vh spacer ends
        ==================================================
      */}
      <div className="relative z-10 min-h-screen" style={{ backgroundColor: "oklch(0.13 0.008 60)" }}>
        {/* Ambient background glow for dashboard */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          background: "radial-gradient(ellipse 60% 50% at 25% 0%, oklch(0.79 0.11 82 / 0.06), transparent)"
        }} />

        {/* Sticky TopBar inside dashboard flow */}
        <div className="sticky top-4 z-40 mb-12" style={{ pointerEvents: "auto" }}>
          <TopBar sidebarCollapsed={sidebarCollapsed || false} />
        </div>

        <div className="pb-32 pt-20 relative z-10 px-6 md:px-12">
          <Section2Welcome />
          <Section3Explore />
          <Section4Featured />
          <Section5AIFeatures />
          <Section6Collections />
          
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
      </div>
    </div>
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
            <div className="w-full md:w-1/2 aspect-square max-h-[500px] rounded-[2.5rem] bg-ink/50 border border-parchment/5 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.79_0.11_82/0.1),transparent)] opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
              <feat.icon size={80} className="text-gold/20 transition-transform duration-1000 group-hover:scale-110 group-hover:text-gold/40" strokeWidth={1} />
            </div>
            
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
        {COLLECTIONS.map((c) => (
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
