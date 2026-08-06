import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Bot,
  Layers,
  Clock,
  ImagePlay,
  ChevronRight,
  Sparkles,
  Star,
  TrendingUp,
  MapPin,
} from "lucide-react";
import brihadeeswara from "@/assets/brihadeeswara.jpg";
import hampi from "@/assets/hampi.jpg";
import konark from "@/assets/konark.jpg";
import tajmahal from "@/assets/tajmahal.jpg";
import qutubminar from "@/assets/qutubminar.jpg";
import heritageBland from "@/assets/heritage-blend.jpg";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Shared tokens ────────────────────────────────────────────────────────────

const GOLD = "oklch(0.79 0.11 82)";
const PARCHMENT = "oklch(0.96 0.012 85)";
const PARCHMENT_DIM = "oklch(0.78 0.015 85 / 0.72)";
const INK = "oklch(0.13 0.008 60)";
const GLASS_BG =
  "linear-gradient(150deg, oklch(0.96 0.012 85 / 0.07), oklch(0.13 0.008 60 / 0.82))";
const GLASS_BORDER = "1px solid oklch(0.79 0.11 82 / 0.14)";

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Jost', system-ui, sans-serif",
        fontSize: "0.62rem",
        textTransform: "uppercase",
        letterSpacing: "0.45em",
        color: GOLD,
        marginBottom: "1.25rem",
        opacity: 0.8,
      }}
    >
      {children}
    </p>
  );
}

function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: "1.25rem",
      }}
    >
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
          fontWeight: 300,
          color: PARCHMENT,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {children}
      </h2>
      {action && (
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: `${GOLD}`,
            opacity: 0.65,
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.opacity = "0.65")
          }
        >
          {action} <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

// ─── Section 1: Continue Exploring ───────────────────────────────────────────

const RECENT = [
  {
    id: "1",
    title: "Brihadeeswara Temple",
    subtitle: "Thanjavur, Tamil Nadu",
    period: "1010 CE · Chola Dynasty",
    progress: 68,
    image: brihadeeswara,
  },
  {
    id: "2",
    title: "Hampi Ruins",
    subtitle: "Vijayanagara, Karnataka",
    period: "14th Century · Vijayanagara Empire",
    progress: 42,
    image: hampi,
  },
  {
    id: "3",
    title: "Konark Sun Temple",
    subtitle: "Konark, Odisha",
    period: "13th Century · Eastern Ganga Dynasty",
    progress: 15,
    image: konark,
  },
];

function ContinueExploring() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section
      variants={fadeUp}
      custom={0.2}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      style={{ marginBottom: "3.5rem" }}
    >
      <SectionLabel>Continue Exploring</SectionLabel>
      <SectionTitle action="View All">Pick up where you left off</SectionTitle>

      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          paddingBottom: "1rem",
          scrollbarWidth: "none",
        }}
      >
        {RECENT.map((m, i) => (
          <motion.div
            key={m.id}
            variants={cardReveal}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            style={{
              flexShrink: 0,
              width: "clamp(260px, 28vw, 340px)",
              borderRadius: "1rem",
              overflow: "hidden",
              background: GLASS_BG,
              backdropFilter: "blur(18px) saturate(130%)",
              border: GLASS_BORDER,
              boxShadow: "0 16px 40px -16px oklch(0 0 0 / 0.5)",
              cursor: "pointer",
            }}
          >
            {/* Image */}
            <div
              style={{
                height: "10rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={m.image}
                alt={m.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.transform = "scale(1)")
                }
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, oklch(0.13 0.008 60 / 0.7), transparent 50%)",
                }}
              />
              {/* Progress badge */}
              <span
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  color: GOLD,
                  background: "oklch(0.13 0.008 60 / 0.75)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid oklch(0.79 0.11 82 / 0.3)",
                  borderRadius: "0.4rem",
                  padding: "0.2rem 0.5rem",
                }}
              >
                {m.progress}%
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.15rem",
                  fontWeight: 400,
                  color: PARCHMENT,
                  marginBottom: "0.2rem",
                }}
              >
                {m.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.72rem",
                  color: `${GOLD}`,
                  opacity: 0.7,
                  marginBottom: "0.1rem",
                }}
              >
                {m.subtitle}
              </p>
              <p
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.68rem",
                  color: PARCHMENT_DIM,
                  marginBottom: "0.85rem",
                }}
              >
                {m.period}
              </p>
              {/* Progress bar */}
              <div
                style={{
                  height: "2px",
                  borderRadius: "9999px",
                  background: "oklch(0.96 0.012 85 / 0.1)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: m.progress / 100 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: `linear-gradient(to right, ${GOLD}, oklch(0.68 0.08 78))`,
                    transformOrigin: "left",
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Section 2: Featured Heritage Carousel ────────────────────────────────────

const FEATURED = [
  {
    id: "f1",
    title: "Taj Mahal",
    tag: "UNESCO World Heritage",
    desc: "The eternal elegy of Shah Jahan — 20,000 artisans, 22 years, one unfinished sentence of mourning.",
    image: tajmahal,
  },
  {
    id: "f2",
    title: "Qutub Minar",
    tag: "Islamic Architecture",
    desc: "Five storeys of sandstone, each raised by a different century — history written vertically.",
    image: qutubminar,
  },
  {
    id: "f3",
    title: "Brihadeeswara Temple",
    tag: "Chola Architecture",
    desc: "A thousand years of granite ambition, still standing against the dark.",
    image: brihadeeswara,
  },
];

function FeaturedHeritage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section
      variants={fadeUp}
      custom={0.3}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      style={{ marginBottom: "3.5rem" }}
    >
      <SectionLabel>Featured Heritage</SectionLabel>
      <SectionTitle action="View All">Monuments of the Week</SectionTitle>

      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "1.25rem",
          overflowX: "auto",
          paddingBottom: "1rem",
          scrollbarWidth: "none",
        }}
      >
        {FEATURED.map((f) => (
          <motion.div
            key={f.id}
            variants={cardReveal}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            style={{
              flexShrink: 0,
              width: "clamp(300px, 35vw, 420px)",
              height: "22rem",
              borderRadius: "1.25rem",
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              boxShadow: "0 24px 60px -20px oklch(0 0 0 / 0.65)",
            }}
          >
            <img
              src={f.image}
              alt={f.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.7s ease",
              }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, oklch(0.09 0.006 60 / 0.95) 0%, oklch(0.09 0.006 60 / 0.3) 55%, transparent 100%)",
              }}
            />
            {/* Border */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "1.25rem",
                border: GLASS_BORDER,
                pointerEvents: "none",
              }}
            />

            {/* Tag */}
            <span
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                fontFamily: "'Jost', system-ui, sans-serif",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: GOLD,
                background: "oklch(0.13 0.008 60 / 0.7)",
                backdropFilter: "blur(8px)",
                border: "1px solid oklch(0.79 0.11 82 / 0.3)",
                borderRadius: "0.4rem",
                padding: "0.2rem 0.6rem",
              }}
            >
              {f.tag}
            </span>

            {/* Content */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.7rem",
                  fontWeight: 300,
                  color: PARCHMENT,
                  lineHeight: 1.1,
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.78rem",
                  color: PARCHMENT_DIM,
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Section 3: Quick Actions ─────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    icon: <Camera size={22} />,
    label: "Scan Monument",
    desc: "Identify with your camera",
    color: "oklch(0.79 0.11 82)",
  },
  {
    icon: <Bot size={22} />,
    label: "Ask AI",
    desc: "Chat with AI Historian",
    color: "oklch(0.65 0.15 240)",
  },
  {
    icon: <Clock size={22} />,
    label: "Timeline",
    desc: "Explore through time",
    color: "oklch(0.7 0.12 180)",
  },
  {
    icon: <Layers size={22} />,
    label: "Architecture",
    desc: "Structural explorer",
    color: "oklch(0.75 0.12 280)",
  },
  {
    icon: <ImagePlay size={22} />,
    label: "Reconstruct",
    desc: "Historical visualizer",
    color: "oklch(0.72 0.14 30)",
  },
];

function QuickActions() {
  return (
    <motion.section
      variants={fadeUp}
      custom={0.4}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      style={{ marginBottom: "3.5rem" }}
    >
      <SectionLabel>Quick Actions</SectionLabel>
      <SectionTitle>Jump back in</SectionTitle>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "0.85rem",
        }}
      >
        {QUICK_ACTIONS.map((action) => (
          <motion.button
            key={action.label}
            variants={cardReveal}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "1.25rem",
              borderRadius: "1rem",
              background: GLASS_BG,
              backdropFilter: "blur(16px)",
              border: GLASS_BORDER,
              boxShadow: "0 8px 24px -8px oklch(0 0 0 / 0.4)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ color: action.color, marginBottom: "0.75rem" }}>
              {action.icon}
            </span>
            <span
              style={{
                fontFamily: "'Jost', system-ui, sans-serif",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: PARCHMENT,
                display: "block",
                marginBottom: "0.2rem",
              }}
            >
              {action.label}
            </span>
            <span
              style={{
                fontFamily: "'Jost', system-ui, sans-serif",
                fontSize: "0.68rem",
                color: PARCHMENT_DIM,
                display: "block",
              }}
            >
              {action.desc}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ─── Section 4: Trending Monuments ───────────────────────────────────────────

const TRENDING = [
  {
    id: "t1",
    title: "Ellora Caves",
    location: "Maharashtra",
    era: "600–1000 CE",
    image: brihadeeswara,
    views: "12.4K",
  },
  {
    id: "t2",
    title: "Khajuraho",
    location: "Madhya Pradesh",
    era: "950–1050 CE",
    image: konark,
    views: "9.8K",
  },
  {
    id: "t3",
    title: "Golconda Fort",
    location: "Hyderabad",
    era: "16th Century",
    image: qutubminar,
    views: "8.1K",
  },
  {
    id: "t4",
    title: "Hampi Ruins",
    location: "Karnataka",
    era: "14th Century",
    image: hampi,
    views: "7.6K",
  },
  {
    id: "t5",
    title: "Mehrangarh Fort",
    location: "Jodhpur",
    era: "1459 CE",
    image: tajmahal,
    views: "6.2K",
  },
  {
    id: "t6",
    title: "Rani ki Vav",
    location: "Patan, Gujarat",
    era: "11th Century",
    image: heritageBland,
    views: "5.9K",
  },
];

function TrendingMonuments() {
  return (
    <motion.section
      variants={fadeUp}
      custom={0.3}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      style={{ marginBottom: "3.5rem" }}
    >
      <SectionLabel>Trending Now</SectionLabel>
      <SectionTitle action="Explore All">Trending Monuments</SectionTitle>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {TRENDING.map((m, i) => (
          <motion.div
            key={m.id}
            variants={cardReveal}
            whileHover={{ y: -5 }}
            style={{
              borderRadius: "1rem",
              overflow: "hidden",
              background: GLASS_BG,
              backdropFilter: "blur(16px)",
              border: GLASS_BORDER,
              boxShadow: "0 8px 24px -8px oklch(0 0 0 / 0.45)",
              cursor: "pointer",
            }}
          >
            {/* Image */}
            <div
              style={{
                height: "8rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={m.image}
                alt={m.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, oklch(0.13 0.008 60 / 0.8), transparent)",
                }}
              />
              {/* Rank */}
              <span
                style={{
                  position: "absolute",
                  top: "0.6rem",
                  left: "0.6rem",
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  color: GOLD,
                  background: "oklch(0.13 0.008 60 / 0.8)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid oklch(0.79 0.11 82 / 0.25)",
                  borderRadius: "0.35rem",
                  padding: "0.15rem 0.4rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <TrendingUp size={9} /> #{i + 1}
              </span>
            </div>

            {/* Info */}
            <div style={{ padding: "0.85rem 1rem" }}>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: PARCHMENT,
                  marginBottom: "0.2rem",
                }}
              >
                {m.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.68rem",
                  color: PARCHMENT_DIM,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  marginBottom: "0.2rem",
                }}
              >
                <MapPin size={9} style={{ color: GOLD, opacity: 0.7 }} />
                {m.location} · {m.era}
              </p>
              <p
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.64rem",
                  color: "oklch(0.96 0.012 85 / 0.35)",
                }}
              >
                {m.views} views this week
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ─── Section 5: AI Suggestions ────────────────────────────────────────────────

const AI_SUGGESTIONS = [
  {
    id: "a1",
    prompt: "Continue exploring the Mauryan Empire",
    sub: "Based on your interest in ancient history",
    icon: "🏛",
  },
  {
    id: "a2",
    prompt: "Compare Hampi with Vijayanagara architecture",
    sub: "You've visited Hampi recently",
    icon: "⚖️",
  },
  {
    id: "a3",
    prompt: "Explore Mughal Architecture timeline",
    sub: "From Babur to Aurangzeb — 300 years",
    icon: "🕌",
  },
  {
    id: "a4",
    prompt: "Decode the Konark Sun Temple's wheel symbolism",
    sub: "A fascinating astronomical connection",
    icon: "☀️",
  },
];

function AISuggestions() {
  return (
    <motion.section
      variants={fadeUp}
      custom={0.2}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      style={{ marginBottom: "3.5rem" }}
    >
      <SectionLabel>AI Historian</SectionLabel>
      <SectionTitle>Suggested for you</SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {AI_SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ x: 6 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.25rem",
              borderRadius: "0.85rem",
              background: GLASS_BG,
              backdropFilter: "blur(16px)",
              border: GLASS_BORDER,
              boxShadow: "0 4px 16px -4px oklch(0 0 0 / 0.35)",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  color: PARCHMENT,
                  marginBottom: "0.15rem",
                }}
              >
                {s.prompt}
              </p>
              <p
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.7rem",
                  color: PARCHMENT_DIM,
                }}
              >
                {s.sub}
              </p>
            </div>
            <Sparkles
              size={15}
              style={{ color: "oklch(0.65 0.15 240)", flexShrink: 0 }}
            />
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Section 6: Daily Historical Insight ─────────────────────────────────────

function DailyInsight() {
  return (
    <motion.section
      variants={fadeUp}
      custom={0.2}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      style={{ marginBottom: "3.5rem" }}
    >
      <SectionLabel>Daily Insight</SectionLabel>
      <SectionTitle>Today's Historical Gem</SectionTitle>

      <div
        style={{
          position: "relative",
          borderRadius: "1.25rem",
          overflow: "hidden",
          padding: "2.5rem",
          background: GLASS_BG,
          backdropFilter: "blur(28px) saturate(140%)",
          border: "1px solid oklch(0.79 0.11 82 / 0.22)",
          boxShadow:
            "0 24px 60px -20px oklch(0 0 0 / 0.65), inset 0 1px 0 oklch(0.96 0.012 85 / 0.1)",
        }}
      >
        {/* Gold accent glow */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: "-10%",
            width: "35%",
            height: "180%",
            background:
              "radial-gradient(ellipse, oklch(0.79 0.11 82 / 0.12), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: GOLD,
              marginBottom: "1.25rem",
              background: "oklch(0.79 0.11 82 / 0.1)",
              border: "1px solid oklch(0.79 0.11 82 / 0.25)",
              borderRadius: "0.4rem",
              padding: "0.25rem 0.6rem",
            }}
          >
            <Star size={10} fill="currentColor" />
            August 7, 2026
          </span>

          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: PARCHMENT,
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              marginBottom: "1.5rem",
              maxWidth: "56rem",
            }}
          >
            "The Konark Sun Temple's 24 wheels are not merely decorative — each
            spoke acts as a sundial, precise enough to tell the time of day to
            within a few minutes."
          </blockquote>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "0.6rem",
                background:
                  "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.5), oklch(0.68 0.08 78 / 0.4))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
              }}
            >
              🤖
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: PARCHMENT,
                }}
              >
                AI Historian
              </p>
              <p
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.68rem",
                  color: PARCHMENT_DIM,
                }}
              >
                Konark Sun Temple · Astronomical Engineering
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Section 7: Collections ───────────────────────────────────────────────────

const COLLECTIONS = [
  { id: "c1", name: "UNESCO Sites", count: 42, emoji: "🌍", color: "oklch(0.65 0.12 200)" },
  { id: "c2", name: "Temples", count: 128, emoji: "🛕", color: GOLD },
  { id: "c3", name: "Forts", count: 86, emoji: "🏯", color: "oklch(0.7 0.14 40)" },
  { id: "c4", name: "Palaces", count: 54, emoji: "🏛", color: "oklch(0.72 0.12 280)" },
  { id: "c5", name: "Caves", count: 38, emoji: "🪨", color: "oklch(0.65 0.09 180)" },
  { id: "c6", name: "Stepwells", count: 22, emoji: "🌊", color: "oklch(0.68 0.15 220)" },
];

function Collections() {
  return (
    <motion.section
      variants={fadeUp}
      custom={0.2}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      style={{ marginBottom: "2rem" }}
    >
      <SectionLabel>Collections</SectionLabel>
      <SectionTitle action="View All">Curated Heritage Collections</SectionTitle>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "0.85rem",
        }}
      >
        {COLLECTIONS.map((c) => (
          <motion.button
            key={c.id}
            variants={cardReveal}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "1.25rem",
              borderRadius: "1rem",
              background: GLASS_BG,
              backdropFilter: "blur(16px)",
              border: `1px solid ${c.color}28`,
              boxShadow: "0 8px 24px -8px oklch(0 0 0 / 0.35)",
              cursor: "pointer",
              textAlign: "left",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Color accent glow */}
            <div
              style={{
                position: "absolute",
                top: "-20%",
                right: "-20%",
                width: "60%",
                height: "60%",
                borderRadius: "50%",
                background: `radial-gradient(ellipse, ${c.color}20, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
            <span style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
              {c.emoji}
            </span>
            <span
              style={{
                fontFamily: "'Jost', system-ui, sans-serif",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: PARCHMENT,
                display: "block",
                marginBottom: "0.2rem",
              }}
            >
              {c.name}
            </span>
            <span
              style={{
                fontFamily: "'Jost', system-ui, sans-serif",
                fontSize: "0.68rem",
                color: c.color,
                opacity: 0.8,
              }}
            >
              {c.count} monuments
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export function HomePage() {
  return (
    <div
      style={{
        padding: "0 0 4rem 0",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Hero welcome */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: "3.5rem", paddingTop: "1.5rem" }}
      >
        <p
          style={{
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.45em",
            color: GOLD,
            marginBottom: "0.75rem",
            opacity: 0.75,
          }}
        >
          Good morning · August 7, 2026
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: PARCHMENT,
            marginBottom: "0.75rem",
          }}
        >
          Welcome back.
          <br />
          <span
            style={{
              color: PARCHMENT_DIM,
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            Continue your journey through India's heritage.
          </span>
        </h1>

        {/* Subtle divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, oklch(0.79 0.11 82 / 0.35), transparent)",
            marginTop: "2rem",
          }}
        />
      </motion.div>

      <ContinueExploring />
      <FeaturedHeritage />
      <QuickActions />
      <TrendingMonuments />
      <AISuggestions />
      <DailyInsight />
      <Collections />
    </div>
  );
}
