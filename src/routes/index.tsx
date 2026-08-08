import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { DustParticles, LightRays } from "@/components/heritage/Atmosphere";
import { DriftWall } from "@/components/heritage/DriftWall";
import { slides } from "@/components/heritage/slides";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { session } from "@/lib/session";
import konark from "@/assets/konark.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heritage Gateway — Experience India's History Like Never Before" },
      {
        name: "description",
        content:
          "A cinematic journey through India's iconic monuments, brought together in Heritage Gateway.",
      },
      {
        property: "og:title",
        content: "Heritage Gateway — Experience India's History Like Never Before",
      },
      {
        property: "og:description",
        content:
          "A cinematic journey through India's iconic monuments, brought together in Heritage Gateway.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experience,
});

// ─── App state machine ────────────────────────────────────────────────────────
//
//  "slides"    → pre-login cinematic slideshow
//  "login"     → login card is shown
//  "dashboard" → main Heritage AI dashboard
//
type AppState = "slides" | "login" | "dashboard";

// ─── Parallax hook ────────────────────────────────────────────────────────────

function useParallax() {
  const [p, setP] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setP({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return p;
}

// ─── Root experience ──────────────────────────────────────────────────────────

function Experience() {
  // Always start with "slides" on SSR/initial render (safe for Node.js).
  const [appState, setAppState] = useState<AppState>("slides");
  const parallax = useParallax();

  // Client-only session check
  useEffect(() => {
    if (session.isAuthenticated()) {
      setAppState("dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSlides = appState === "slides";
  const isLogin = appState === "login";
  const isDashboard = appState === "dashboard";

  // The wall is intentionally continuous rather than time-limited: visitors can
  // choose when to open the preserved login card.

  // Called when user successfully authenticates
  function handleLogin() {
    session.setAuthenticated();
    setAppState("dashboard");
  }

  // Full-screen dashboard — render outside the pre-login shell
  if (isDashboard) {
    return <DashboardShell />;
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-ink">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <LoginScene key="login" parallax={parallax} onLogin={handleLogin} />
        ) : (
          <DriftWall key="heritage-wall" onOpenLogin={() => setAppState("login")} />
        )}
      </AnimatePresence>

      {/* Header - ONLY SHOW "Login ->" per instructions */}
      {isSlides && (
        <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-end px-[4vw] py-8">
          <button
            onClick={() => setAppState("login")}
            className="pointer-events-auto font-sans text-[0.8rem] uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white flex items-center gap-2"
          >
            Login <span className="text-gold">&rarr;</span>
          </button>
        </header>
      )}
    </main>
  );
}

// ─── SlideScene ───────────────────────────────────────────────────────────────

function SlideScene({ step, parallax }: { step: number; parallax: { x: number; y: number } }) {
  const slide = slides[step] ?? slides[0]!;

  return (
    <motion.section
      key={slide.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: "easeInOut" }}
      className="absolute inset-0"
    >
      {/* Fullscreen uploaded monument image with gentle parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          key={`${slide.id}-img`}
          src={slide.image}
          alt={slide.title.join(" ")}
          width={1920}
          height={1080}
          className="ken-burns h-full w-full object-cover object-center"
          style={{
            transform: `translate3d(${parallax.x * -18}px, ${parallax.y * -12}px, 0)`,
          }}
        />
      </div>

      {/* Very subtle vignette — keeps edges cinematic without washing out the image */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.06_0.003_240/0.55)_100%)]" />

      {/* Floating dust particles */}
      <DustParticles />
      {/* Soft atmospheric light rays */}
      <LightRays />
    </motion.section>
  );
}

// ─── LoginScene ───────────────────────────────────────────────────────────────

function LoginScene({
  parallax,
  onLogin,
}: {
  parallax: { x: number; y: number };
  onLogin: () => void;
}) {
  return (
    <motion.section
      key="login-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="absolute inset-0 flex"
    >
      {/* ════════════════════════════════════════════════════════════════════════
          LEFT PANEL — Login form on dark surface
          ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative flex h-full w-[52%] items-center justify-center overflow-hidden bg-ink px-6">
        {/* Soft ambient glow from the seam */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_100%_50%,oklch(0.79_0.11_82/0.04),transparent_70%)]" />

        {/* Subtle drifting dust on the form side */}
        <DustParticles />

        {/* ── Login card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="login-card w-[min(30rem,90%)] px-12 py-14 text-left relative overflow-hidden"
        >
          {/* Card inner gold shimmer line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.79_0.11_82/0.5)] to-transparent" />

          {/* ── Branding ── */}
          <div className="mb-10 flex flex-col items-start gap-4">
            <HeritageMark />
            <div>
              <h1 className="font-serif text-[2.1rem] font-light leading-[1.05] tracking-[-0.02em] text-parchment">
                Heritage Gateway
              </h1>
              <p className="mt-3 font-sans text-[0.74rem] leading-relaxed text-parchment/55 font-light max-w-[22rem]">
                Explore India's timeless monuments with AI-powered historical discovery.
              </p>
            </div>
          </div>

          {/* ── Email / password form ── */}
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
          >
            <div className="space-y-2">
              <label className="text-[0.62rem] uppercase tracking-[0.18em] text-parchment/50 font-sans ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="scholar@heritage.ai"
                className="heritage-input"
                required
              />
            </div>

            <div className="space-y-2 pb-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[0.62rem] uppercase tracking-[0.18em] text-parchment/50 font-sans">
                  Password
                </label>
                <a
                  href="#"
                  className="text-[0.62rem] text-gold/65 hover:text-gold transition-colors duration-200 font-sans"
                >
                  Forgot Password?
                </a>
              </div>
              <input type="password" placeholder="••••••••" className="heritage-input" required />
            </div>

            <button type="submit" className="heritage-btn-primary w-full">
              <span className="heritage-btn-shine" />
              Sign In
            </button>
          </form>

          {/* ── Divider ── */}
          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-parchment/10 flex-1" />
            <span className="text-[0.6rem] uppercase tracking-[0.22em] text-parchment/35 font-sans">
              Or continue with
            </span>
            <div className="h-px bg-parchment/10 flex-1" />
          </div>

          {/* ── Social / guest buttons ── */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={onLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-parchment/12 bg-[oklch(0.13_0.005_60/0.5)] px-5 py-3 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-parchment/75 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-[oklch(0.16_0.008_82/0.55)] hover:text-parchment hover:shadow-[0_0_18px_oklch(0.79_0.11_82/0.12)]"
            >
              <GoogleMark />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="w-full rounded-xl border border-parchment/8 bg-transparent py-3 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-parchment/40 transition-all duration-300 hover:border-gold/20 hover:text-gold/80"
            >
              Continue as Guest
            </button>
          </div>

          {/* Card bottom gold shimmer line */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.79_0.11_82/0.2)] to-transparent" />
        </motion.div>

        {/* ── Footer (left panel) ── */}
        <footer className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-12 py-8 font-sans text-[0.58rem] uppercase tracking-[0.28em] text-parchment/25">
          <span>© 2026 Heritage Gateway</span>
          <span>Privacy · Terms</span>
        </footer>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          RIGHT PANEL — Heritage image with cinematic treatment
          ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative h-full w-[48%] overflow-hidden">
        {/* Konark Sun Temple with Ken Burns + parallax */}
        <img
          src={konark}
          alt="Konark Sun Temple — a chariot for the sun"
          width={1920}
          height={1280}
          loading="lazy"
          className="ken-burns h-full w-full object-cover object-center"
          style={{
            transform: `translate3d(${parallax.x * -14}px, ${parallax.y * -10}px, 0)`,
            filter: "saturate(0.8) brightness(0.7) contrast(1.05)",
          }}
        />

        {/* Dark overlay so the form stays the focus */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-[oklch(0.05_0.002_60/0.25)] to-[oklch(0.05_0.002_60/0.65)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,transparent_30%,oklch(0.04_0.002_60/0.55)_100%)]" />

        {/* Soft fog gradient at the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[oklch(0.04_0.002_60/0.7)] to-transparent" />

        {/* Warm volumetric light rays */}
        <LightRays />

        {/* Drifting dust particles */}
        <DustParticles />

        {/* Editorial caption — bottom right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-12 right-12 z-20 text-right"
        >
          <p className="font-sans text-[0.58rem] uppercase tracking-[0.32em] text-gold/70 mb-2">
            Konark · Odisha
          </p>
          <p className="font-serif text-[1.15rem] italic font-light text-parchment/60 leading-snug max-w-[16rem] ml-auto">
            A chariot for the sun, with wheels that keep time itself.
          </p>
        </motion.div>

        {/* Vertical "EST." accent — top right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute top-12 right-12 z-20 flex flex-col items-center gap-3"
        >
          <span className="font-sans text-[0.55rem] uppercase tracking-[0.4em] text-parchment/30 [writing-mode:vertical-rl] rotate-180">
            Est. 1250
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─── Google mark icon ─────────────────────────────────────────────────────────

function GoogleMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.66 4.1-5.35 4.1a5.9 5.9 0 1 1 0-11.8c1.7 0 2.84.72 3.5 1.34l2.38-2.3A9.1 9.1 0 1 0 12 21.2c5.26 0 8.73-3.7 8.73-8.9 0-.6-.06-1.05-.15-1.5Z"
      />
    </svg>
  );
}

// ─── Heritage mark icon ───────────────────────────────────────────────────────

function HeritageMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L2 7V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V7L12 2Z"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V7M12 7L2 12M12 7L22 12"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
