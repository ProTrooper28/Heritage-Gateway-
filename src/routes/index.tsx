import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { DustParticles, LightRays } from "@/components/heritage/Atmosphere";
import { slides } from "@/components/heritage/slides";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { session } from "@/lib/session";
import blend from "@/assets/heritage-blend.jpg";

export const Route = createFileRoute("/")(
  {
  head: () => ({
    meta: [
      { title: "Indian Heritage AI — Experience History Like Never Before" },
      {
        name: "description",
        content:
          "A cinematic journey through India's iconic monuments — Brihadeeswara, Taj Mahal, Hampi, Qutub Minar and Konark — reimagined with Indian Heritage AI.",
      },
      { property: "og:title", content: "Indian Heritage AI — Experience History Like Never Before" },
      {
        property: "og:description",
        content:
          "A cinematic journey through India's iconic monuments, reimagined with Indian Heritage AI.",
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
  const [step, setStep] = useState(0);
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

  // Auto-advance slides
  useEffect(() => {
    if (!isSlides) return;
    const t = setTimeout(() => {
      if (step < slides.length - 1) {
        setStep((s) => s + 1);
      } else {
        setAppState("login");
      }
    }, 10000);
    return () => clearTimeout(t);
  }, [step, isSlides]);

  // Keyboard navigation (slides only)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isSlides) return;
      if (e.key === "ArrowRight") {
        if (step < slides.length - 1) setStep((s) => s + 1);
        else setAppState("login");
      }
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, isSlides]);

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
          <LoginScene
            key="login"
            parallax={parallax}
            onLogin={handleLogin}
          />
        ) : (
          <SlideScene key={`slide-${step}`} step={step} parallax={parallax} />
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
      transition={{ duration: 0.8 }}
      className="absolute inset-0"
    >
      <img
        src={blend}
        alt="A blend of India's iconic monuments in golden light"
        width={1920}
        height={1280}
        loading="lazy"
        className="h-full w-full scale-105 object-cover opacity-70"
        style={{ transform: `scale(1.08) translate3d(${parallax.x * -18}px, ${parallax.y * -12}px, 0)` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_45%,oklch(0.13_0.008_60/0.55),oklch(0.07_0.005_60/0.96))]" />
      <LightRays />
      <DustParticles />

      <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
        <div className="reveal glass-card w-[min(26rem,90vw)] px-10 py-12 text-center relative overflow-hidden">
          
          <h1 className="font-serif text-[2.2rem] font-light leading-[1.05] tracking-[-0.02em] text-parchment">
            Welcome Back
          </h1>
          <p className="mt-2 font-sans text-xs text-parchment/60 font-light mb-8">
            Enter your details to access the archives.
          </p>

          <form className="space-y-4 text-left" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-1.5">
              <label className="text-[0.65rem] uppercase tracking-wider text-parchment/60 font-sans ml-1">Email</label>
              <input 
                type="email" 
                placeholder="scholar@heritage.ai" 
                className="w-full bg-ink/50 border border-parchment/10 rounded-lg px-4 py-3 text-sm text-parchment placeholder:text-parchment/30 outline-none focus:border-gold/50 transition-colors"
                required
              />
            </div>
            
            <div className="space-y-1.5 pb-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[0.65rem] uppercase tracking-wider text-parchment/60 font-sans">Password</label>
                <a href="#" className="text-[0.65rem] text-gold/70 hover:text-gold transition-colors font-sans">Forgot Password?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-ink/50 border border-parchment/10 rounded-lg px-4 py-3 text-sm text-parchment placeholder:text-parchment/30 outline-none focus:border-gold/50 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gold text-ink py-3 font-sans text-[0.75rem] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-gold/90 hover:shadow-[0_0_20px_rgba(230,200,120,0.3)]"
            >
              Sign In
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-parchment/10 flex-1"></div>
            <span className="text-[0.65rem] uppercase tracking-wider text-parchment/40 font-sans">Or continue with</span>
            <div className="h-px bg-parchment/10 flex-1"></div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onLogin}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-parchment/15 bg-ink/30 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-parchment/80 transition-all duration-300 hover:border-parchment/40 hover:bg-ink/50"
            >
              <GoogleMark />
              Google
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="w-full rounded-lg border border-transparent py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-parchment/50 transition-all duration-300 hover:text-gold"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>

      <footer className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-[4vw] py-8 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-parchment/35">
        <span>© 2026 Indian Heritage AI</span>
        <span>Privacy · Terms</span>
      </footer>
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
