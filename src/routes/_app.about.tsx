import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Camera,
  Bot,
  Sparkles,
  ImagePlay,
  Landmark,
  BookOpen,
} from "lucide-react";
import { DustParticles } from "@/components/heritage/Atmosphere";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const Route = createFileRoute("/_app/about")({
  head: () => ({
    meta: [
      { title: "About — Heritage Gateway" },
      {
        name: "description",
        content:
          "Heritage Gateway brings India's timeless monuments to life with AI-powered discovery, smart trails, and 3D reconstruction.",
      },
    ],
  }),
  component: AboutComponent,
});

const PILLARS = [
  {
    icon: Landmark,
    title: "Explore Heritage",
    desc: "Discover temples, forts, caves and stepwells with rich historical context.",
    to: "/explore",
  },
  {
    icon: Camera,
    title: "AI Monument Scanner",
    desc: "Point your camera at any structure to instantly decode its history.",
    to: "/scan-monument",
  },
  {
    icon: Bot,
    title: "AI Historian",
    desc: "Converse with a personalized guide powered by centuries of archives.",
    to: "/ai-historian",
  },
  {
    icon: Sparkles,
    title: "Smart Heritage Trails",
    desc: "Personal heritage journeys curated to your time and interests.",
    to: "/smart-trails",
  },
  {
    icon: ImagePlay,
    title: "Historical Reconstruction",
    desc: "Step inside interactive 3D reconstructions of iconic monuments.",
    to: "/historical-reconstruction",
  },
  {
    icon: BookOpen,
    title: "Timeline Explorer",
    desc: "Navigate India's history along an immersive interactive timeline.",
    to: "/timeline",
  },
];

function AboutComponent() {
  return (
    <div className="relative min-h-screen pb-24">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,oklch(0.79_0.11_82/0.05),transparent_70%)]" />
      <DustParticles />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative mx-auto max-w-3xl pt-16 text-center"
      >
        <p className="mb-4 font-sans text-[0.65rem] uppercase tracking-[0.4em] text-gold/70">
          About
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-light leading-tight tracking-[-0.02em] text-parchment">
          A Gateway to India&apos;s
          <span className="italic text-gold"> Living Heritage</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-sans text-[0.95rem] font-light leading-relaxed text-parchment/60">
          Heritage Gateway brings India&apos;s timeless monuments to life — from
          AI-powered monument identification and interactive 3D reconstructions
          to smart heritage trails curated around your time and interests.
        </p>
      </motion.div>

      {/* Pillars */}
      <div className="relative mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
            className="explore-card group rounded-3xl p-7"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold transition-transform duration-300 group-hover:scale-110">
              <pillar.icon size={18} strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 font-serif text-xl text-parchment">{pillar.title}</h3>
            <p className="font-sans text-sm font-light leading-relaxed text-parchment/55">
              {pillar.desc}
            </p>
            <Link
              to={pillar.to}
              className="mt-5 inline-block font-sans text-[0.62rem] uppercase tracking-[0.22em] text-gold/70 transition-colors hover:text-gold"
            >
              Explore →
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mission + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative mx-auto mt-24 max-w-3xl text-center"
      >
        <h2 className="font-serif text-3xl font-light text-parchment">
          History is not behind us — it surrounds us.
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-parchment/50">
          Heritage Gateway is a demo experience. Monument content is illustrative
          and draws on public historical records; authentication and AI features
          are simulated in-session until a production backend is connected.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/monuments" className="heritage-btn-primary px-9">
            Start Exploring
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-parchment/10 px-9 py-3.5 font-sans text-[0.72rem] font-medium uppercase tracking-[0.2em] text-parchment/60 transition-colors hover:border-gold/30 hover:text-gold"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
