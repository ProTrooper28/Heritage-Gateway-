import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { DustParticles } from "@/components/heritage/Atmosphere";

/**
 * PageNotFound — shared premium 404 experience.
 * Used by the root notFoundComponent, the /404 route, and the catch-all route.
 */
export function PageNotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.79_0.11_82/0.05),transparent_70%)]" />
      <DustParticles />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative text-center"
      >
        <p className="mb-5 font-sans text-[0.65rem] uppercase tracking-[0.4em] text-gold/70">
          Error 404
        </p>
        <h1 className="font-serif text-[clamp(5rem,14vw,9rem)] font-light leading-none text-parchment">
          404
        </h1>
        <h2 className="mt-6 font-serif text-2xl font-light text-parchment/80">
          Page not found
        </h2>
        <p className="mx-auto mt-3 max-w-sm font-sans text-sm font-light leading-relaxed text-parchment/50">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/" className="heritage-btn-primary px-9">
            Return Home
          </Link>
          <Link
            to="/monuments"
            className="rounded-xl border border-parchment/10 px-9 py-3.5 font-sans text-[0.72rem] font-medium uppercase tracking-[0.2em] text-parchment/60 transition-colors hover:border-gold/30 hover:text-gold"
          >
            Explore Monuments
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
