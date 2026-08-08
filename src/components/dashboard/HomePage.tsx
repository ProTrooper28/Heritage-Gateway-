import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Camera,
  Bot,
  Layers,
  Clock,
  ImagePlay,
  ArrowDown,
  Landmark,
  BookMarked,
  Heart,
  History,
  Settings,
  User,
} from "lucide-react";
import { SpecularButton } from "@/components/ui/SpecularButton";
import brihadeeswara from "@/assets/brihadeeswara.jpg";
import hampi from "@/assets/hampi.jpg";
import konark from "@/assets/konark.jpg";
import tajmahal from "@/assets/tajmahal.jpg";
import qutubminar from "@/assets/qutubminar.jpg";
import heritageBlend from "@/assets/heritage-blend.jpg";

// ─── Shared tokens ────────────────────────────────────────────────────────────
const GLASS_BORDER = "1px solid oklch(0.79 0.11 82 / 0.14)";

// ─── Ease tuple (Framer Motion strict typing) ─────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_SHARP: [number, number, number, number] = [0.4, 0, 0.2, 1];

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
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
    transition: { duration: 0.8, ease: EASE },
  },
};

// ─── Feature card definitions ─────────────────────────────────────────────────
const FEATURE_CARDS = [
  {
    id: "scan-monument",
    label: "Scan Monument",
    icon: Camera,
    desc: "Point your camera at any structure to instantly decode its history.",
  },
  {
    id: "explore-heritage",
    label: "Explore Heritage",
    icon: Landmark,
    desc: "Journey through India's most iconic cultural landmarks.",
  },
  {
    id: "ai-historian",
    label: "AI Historian",
    icon: Bot,
    desc: "Converse with a personalized guide powered by centuries of archives.",
  },
  {
    id: "architecture-explorer",
    label: "Architecture Explorer",
    icon: Layers,
    desc: "Deconstruct monuments layer by layer across dynasties.",
  },
  {
    id: "timeline-explorer",
    label: "Timeline Explorer",
    icon: Clock,
    desc: "Navigate India's history along an immersive interactive timeline.",
  },
  {
    id: "historical-reconstruction",
    label: "Historical Reconstruction",
    icon: ImagePlay,
    desc: "See ancient ruins restored to their original glory with AI.",
  },
  {
    id: "saved-collections",
    label: "Saved Collections",
    icon: BookMarked,
    desc: "Revisit your curated collections of monuments and discoveries.",
  },
  {
    id: "favorites",
    label: "Favorites",
    icon: Heart,
    desc: "Your personally starred monuments, always one tap away.",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────
type HomePageProps = {
  activeItem: string;
  onNavigate: (label: string) => void;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function HomePage({ activeItem, onNavigate }: HomePageProps) {
  // ══════════════════════════════════════════════════════════════════════════
  //  isLanding = true  → show cinematic hero + "Begin Journey" button
  //  isLanding = false → show application menu (feature cards)
  // ══════════════════════════════════════════════════════════════════════════
  const [isLanding, setIsLanding] = useState(true);

  const { scrollY } = useScroll();

  // Scroll-based transforms — only relevant when isLanding = true
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.85]);
  const heroY = useTransform(scrollY, [0, 800], [0, -100]);
  const heroOpacity = useTransform(scrollY, [500, 900], [1, 0]);
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const titleY = useTransform(scrollY, [0, 300], [0, -50]);
  const indicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  // ── Handler: Begin Journey click ──────────────────────────────────────────
  function handleBeginJourney() {
    setIsLanding(false);
    onNavigate("Home");
  }

  return (
    <>
      {/*
        ════════════════════════════════════════════════════════════════════════
        LAYER 1 — Hero background image (FIXED, behind everything)
        pointer-events: none so it never intercepts clicks
        Blurs when isLanding = false
        ════════════════════════════════════════════════════════════════════════
      */}
      <motion.div
        initial={false}
        animate={
          isLanding
            ? { filter: "blur(0px)", opacity: 1, scale: 1 }
            : { filter: "blur(10px)", opacity: 0.32, scale: 0.97 }
        }
        transition={{ duration: 0.45, ease: EASE_SHARP }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,             // behind everything
          pointerEvents: "none", // CRITICAL — never block clicks
          transformOrigin: "top center",
          overflow: "hidden",
          backgroundColor: "oklch(0.1 0 0)",
        }}
      >
        {/* Monument background image */}
        <img
          src={heritageBlend}
          alt="Indian Heritage"
          className="w-full h-full object-cover opacity-80"
          style={{ transform: "scale(1.05)" }}
        />

        {/* Dust / fog gradients */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at bottom, transparent 20%, oklch(0.05 0.01 60 / 0.9) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />

        {/* Dark overlay that appears when menu is open */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLanding ? 0 : 1 }}
          transition={{ duration: 0.45, ease: EASE_SHARP }}
          style={{
            position: "absolute",
            inset: 0,
            background: "oklch(0.06 0.004 60 / 0.65)",
          }}
        />
      </motion.div>

      {/*
        ════════════════════════════════════════════════════════════════════════
        LAYER 2 — Hero overlay (FIXED, z-index 25)
        Contains the editorial title + "Begin Journey" button.
        z=25 ensures it sits ABOVE the main content (z=1) so the button
        receives pointer events correctly.
        Exits when isLanding becomes false.
        ════════════════════════════════════════════════════════════════════════
      */}
      <AnimatePresence>
        {isLanding && (
          <motion.div
            key="hero-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.35, ease: EASE_SHARP } }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 25,        // ABOVE main content (z=1), BELOW sidebar (z=50)
              pointerEvents: "none", // container itself doesn't intercept
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Inner wrapper — re-enable pointer events just for the content */}
            <motion.div
              style={{ opacity: titleOpacity, y: titleY, pointerEvents: "auto" }}
              className="relative max-w-5xl text-center px-6"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-10 -inset-y-6 bg-[radial-gradient(ellipse_at_center,rgba(18,16,12,0.62)_0%,rgba(18,16,12,0.34)_50%,transparent_78%)]"
              />

              {/* Editorial headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
                className="relative [font-family:'Cormorant_Garamond',Georgia,serif] text-[clamp(4rem,8vw,8rem)] font-normal leading-[0.9] tracking-[-0.03em] text-[#F5F1E8] [text-shadow:0_2px_8px_rgba(0,0,0,0.32)]"
              >
                <span>Every </span>
                <span className="text-[#D6B36A]">Monument</span>
                <br />
                <span className="italic text-[#E8DDD0]">Has A </span>
                <span className="italic text-[#D6B36A]">Story.</span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: EASE }}
                className="relative isolate mt-8 max-w-xl mx-auto font-sans text-[clamp(1rem,1.5vw,1.25rem)] font-light text-[#F5F1E8] [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] before:pointer-events-none before:absolute before:-inset-x-8 before:-inset-y-4 before:-z-10 before:bg-[radial-gradient(ellipse_at_center,rgba(18,16,12,0.56)_0%,transparent_75%)]"
              >
                Experience India's heritage through AI-powered exploration.
              </motion.p>

              {/*
                ─── BEGIN JOURNEY BUTTON ──────────────────────────────────────
                onClick calls handleBeginJourney → sets isLanding = false
                This button IS interactive (pointer-events: auto from parent)
              */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: EASE }}
                className="mt-12 flex w-full justify-center"
              >
                <SpecularButton
                  onClick={handleBeginJourney}
                  size="lg"
                  radius={999}
                  tint="#ffffff"
                  tintOpacity={0.03}
                  blur={12}
                  textColor="#F6F4F1"
                  lineColor="#E5D1A5"
                  baseColor="#2B2F34"
                  intensity={0.65}
                  shineSize={8}
                  shineFade={30}
                  thickness={1}
                  speed={0.18}
                  followMouse={true}
                  autoAnimate={false}
                  proximity={220}
                >
                  Begin Journey
                </SpecularButton>
              </motion.div>
            </motion.div>

            {/* Scroll indicator (fades on scroll, vanishes when menu opens) */}
            <motion.div
              style={{ opacity: indicatorOpacity, pointerEvents: "none" }}
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
        )}
      </AnimatePresence>

      {/*
        ════════════════════════════════════════════════════════════════════════
        LAYER 3 — Application Menu (normal flow, inside motion.main)
        Shown when isLanding = false.
        ════════════════════════════════════════════════════════════════════════
      */}
      <AnimatePresence>
        {!isLanding && (
          <motion.div
            key="app-menu"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{ position: "relative", zIndex: 10, minHeight: "100vh", paddingTop: "5rem" }}
          >
            {/* Compact top-right utility bar */}
            <UtilityBar onNavigate={onNavigate} />

            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              style={{ marginBottom: "2.5rem" }}
            >
              <p
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.4em",
                  color: "oklch(0.79 0.11 82 / 0.7)",
                  marginBottom: "0.6rem",
                }}
              >
                Heritage AI — Your Gateway
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                  fontWeight: 300,
                  color: "oklch(0.96 0.012 85)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                Where would you like to explore?
              </h2>
            </motion.div>

            {/* Feature cards grid */}
            <motion.div
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
              }}
              initial="hidden"
              animate="visible"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
                gap: "1.25rem",
                paddingBottom: "4rem",
              }}
            >
              {FEATURE_CARDS.map((card) => (
                <FeatureCard
                  key={card.id}
                  card={card}
                  isActive={activeItem === card.label}
                  onClick={() => onNavigate(card.label)}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        ════════════════════════════════════════════════════════════════════════
        Scroll sections — only rendered when isLanding = true
        ════════════════════════════════════════════════════════════════════════
      */}
      {isLanding && (
        <>
          {/* Spacer so the scroll sections appear below the hero */}
          <div style={{ height: "100vh" }} />

          <div className="relative z-10 pb-32 pt-20">
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
        </>
      )}
    </>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({
  card,
  isActive,
  onClick,
}: {
  card: (typeof FEATURE_CARDS)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = card.icon;

  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: EASE },
        },
      }}
      whileHover={{ y: -6, scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.35, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "1rem",
        padding: "1.6rem 1.5rem",
        borderRadius: "1.25rem",
        border: isActive
          ? "1px solid oklch(0.79 0.11 82 / 0.55)"
          : hovered
            ? "1px solid oklch(0.79 0.11 82 / 0.3)"
            : "1px solid oklch(0.96 0.012 85 / 0.08)",
        background: isActive
          ? "linear-gradient(145deg, oklch(0.79 0.11 82 / 0.14), oklch(0.13 0.008 60 / 0.82))"
          : hovered
            ? "linear-gradient(145deg, oklch(0.79 0.11 82 / 0.07), oklch(0.13 0.008 60 / 0.75))"
            : "linear-gradient(145deg, oklch(0.96 0.012 85 / 0.04), oklch(0.13 0.008 60 / 0.7))",
        backdropFilter: "blur(20px) saturate(130%)",
        boxShadow: isActive
          ? "0 0 28px oklch(0.79 0.11 82 / 0.18), 0 8px 32px oklch(0 0 0 / 0.45), inset 0 1px 0 oklch(0.96 0.012 85 / 0.1)"
          : hovered
            ? "0 0 20px oklch(0.79 0.11 82 / 0.1), 0 8px 32px oklch(0 0 0 / 0.4), inset 0 1px 0 oklch(0.96 0.012 85 / 0.08)"
            : "0 4px 20px oklch(0 0 0 / 0.35), inset 0 1px 0 oklch(0.96 0.012 85 / 0.06)",
        cursor: "pointer",
        textAlign: "left",
        transition: "border 0.25s ease, background 0.25s ease, box-shadow 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gold shimmer line — top */}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: "1px",
          background:
            isActive || hovered
              ? "linear-gradient(90deg, transparent, oklch(0.79 0.11 82 / 0.5), transparent)"
              : "linear-gradient(90deg, transparent, oklch(0.96 0.012 85 / 0.12), transparent)",
          transition: "background 0.25s ease",
        }}
      />

      {/* Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.75rem",
          height: "2.75rem",
          borderRadius: "0.85rem",
          border: isActive
            ? "1px solid oklch(0.79 0.11 82 / 0.45)"
            : hovered
              ? "1px solid oklch(0.79 0.11 82 / 0.25)"
              : "1px solid oklch(0.96 0.012 85 / 0.1)",
          background: isActive
            ? "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.25), oklch(0.79 0.11 82 / 0.08))"
            : hovered
              ? "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.12), oklch(0.79 0.11 82 / 0.04))"
              : "oklch(0.96 0.012 85 / 0.05)",
          color: isActive
            ? "oklch(0.79 0.11 82)"
            : hovered
              ? "oklch(0.79 0.11 82 / 0.85)"
              : "oklch(0.79 0.11 82 / 0.5)",
          transition: "all 0.25s ease",
          flexShrink: 0,
        }}
      >
        <Icon size={18} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div>
        <p
          style={{
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: "0.9rem",
            fontWeight: 500,
            letterSpacing: "0.01em",
            color: isActive
              ? "oklch(0.96 0.012 85)"
              : hovered
                ? "oklch(0.96 0.012 85 / 0.95)"
                : "oklch(0.96 0.012 85 / 0.8)",
            marginBottom: "0.35rem",
            transition: "color 0.2s ease",
          }}
        >
          {card.label}
        </p>
        <p
          style={{
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: "0.72rem",
            fontWeight: 300,
            lineHeight: 1.55,
            color: "oklch(0.96 0.012 85 / 0.45)",
          }}
        >
          {card.desc}
        </p>
      </div>
    </motion.button>
  );
}

// ─── Utility Bar ──────────────────────────────────────────────────────────────

const UTILITY_BUTTONS = [
  { icon: History, label: "Recent Activity", navLabel: "Recent Activity" },
  { icon: Settings, label: "Settings", navLabel: "Settings" },
  { icon: User, label: "Profile", navLabel: "Profile" },
];

function UtilityBar({ onNavigate }: { onNavigate: (label: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
      style={{
        position: "fixed",
        top: "1.15rem",
        right: "1.25rem",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.45rem 0.65rem",
        borderRadius: "2rem",
        background:
          "linear-gradient(135deg, oklch(0.96 0.012 85 / 0.08), oklch(0.13 0.008 60 / 0.9))",
        backdropFilter: "blur(28px) saturate(150%)",
        border: "1px solid oklch(0.79 0.11 82 / 0.2)",
        boxShadow:
          "0 16px 48px -12px oklch(0 0 0 / 0.6), inset 0 1px 0 oklch(0.96 0.012 85 / 0.1)",
      }}
    >
      {UTILITY_BUTTONS.map(({ icon: Icon, label, navLabel }, i) => (
        <UtilityButton
          key={label}
          icon={Icon}
          label={label}
          delay={0.35 + i * 0.06}
          onClick={() => onNavigate(navLabel)}
        />
      ))}
    </motion.div>
  );
}

function UtilityButton({
  icon: Icon,
  label,
  delay,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  delay: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <motion.button
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay, ease: EASE }}
        whileHover={{ scale: 1.14 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.2rem",
          height: "2.2rem",
          borderRadius: "50%",
          border: hovered
            ? "1px solid oklch(0.79 0.11 82 / 0.5)"
            : "1px solid oklch(0.96 0.012 85 / 0.12)",
          background: hovered
            ? "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.18), oklch(0.79 0.11 82 / 0.06))"
            : "oklch(0.96 0.012 85 / 0.05)",
          color: hovered
            ? "oklch(0.79 0.11 82)"
            : "oklch(0.96 0.012 85 / 0.5)",
          cursor: "pointer",
          boxShadow: hovered
            ? "0 0 18px oklch(0.79 0.11 82 / 0.35), 0 4px 12px oklch(0 0 0 / 0.3)"
            : "none",
          transition: "all 0.22s ease",
        }}
      >
        <Icon size={14} strokeWidth={1.75} />
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.88 }}
            transition={{ duration: 0.16, ease: EASE }}
            style={{
              position: "absolute",
              top: "calc(100% + 0.5rem)",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              padding: "0.3rem 0.65rem",
              borderRadius: "0.45rem",
              background:
                "linear-gradient(135deg, oklch(0.96 0.012 85 / 0.1), oklch(0.13 0.008 60 / 0.92))",
              backdropFilter: "blur(16px)",
              border: "1px solid oklch(0.79 0.11 82 / 0.2)",
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "oklch(0.96 0.012 85 / 0.75)",
              boxShadow: "0 4px 16px oklch(0 0 0 / 0.4)",
              pointerEvents: "none",
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
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
      <motion.p variants={fadeUp} className="font-serif italic text-2xl text-parchment/60 mb-4">
        Welcome Back.
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="font-serif text-[clamp(2.5rem,4vw,4rem)] font-light text-parchment tracking-[-0.02em] leading-tight"
      >
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
            transition={{ duration: 0.6, ease: EASE }}
            className="group relative h-[32rem] rounded-2xl overflow-hidden cursor-pointer"
            style={{ border: GLASS_BORDER }}
          >
            <img
              src={m.image}
              alt={m.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
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
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            className="relative shrink-0 w-[clamp(320px,40vw,480px)] h-[28rem] rounded-2xl overflow-hidden snap-center group cursor-pointer"
          >
            <img
              src={f.image}
              alt={f.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/30 transition-colors duration-500 group-hover:bg-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="font-serif text-3xl text-parchment mb-3">{f.title}</h3>
              <p className="font-sans text-sm text-parchment/70 leading-relaxed max-w-xs">
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Section 5: AI Features ───────────────────────────────────────────────────
const AI_FEATURES = [
  {
    icon: Camera,
    title: "AI Monument Scanner",
    desc: "Point your camera at any ancient structure. Our vision models instantly decode its history, architecture, and hidden stories in real-time.",
  },
  {
    icon: Bot,
    title: "The AI Historian",
    desc: "A personalized guide powered by centuries of archives. Ask questions, debate interpretations, and converse with history itself.",
  },
  {
    icon: Layers,
    title: "Architecture Explorer",
    desc: "Deconstruct monuments layer by layer. Understand the engineering marvels and stylistic evolutions of past dynasties.",
  },
  {
    icon: ImagePlay,
    title: "Historical Reconstruction",
    desc: "Peer through the veil of time. See ruins restored to their original glory with breathtaking AI-generated reconstructions.",
  },
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
            transition={{ duration: 1, ease: EASE }}
            className={`flex flex-col gap-12 items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
          >
            <div className="w-full md:w-1/2 aspect-square max-h-[500px] rounded-[2.5rem] bg-ink/50 border border-parchment/5 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.79_0.11_82/0.1),transparent)] opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
              <feat.icon
                size={80}
                className="text-gold/20 transition-transform duration-1000 group-hover:scale-110 group-hover:text-gold/40"
                strokeWidth={1}
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-16">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gold/20 text-gold mb-8">
                <feat.icon size={18} />
              </div>
              <h3 className="font-serif text-4xl text-parchment mb-6 tracking-tight leading-tight">
                {feat.title}
              </h3>
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
const COLLECTIONS = [
  "UNESCO World Heritage",
  "Chola Temples",
  "Mughal Architecture",
  "Rajput Forts",
  "Lost Cities",
  "Buddhist Caves",
];

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
