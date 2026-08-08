import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { DustParticles, LightRays } from "@/components/heritage/Atmosphere";
import { session } from "@/lib/session";

// Lazy-load the WebGL orb so the auth page's own chunk — and therefore its
// hydration — never waits on ogl. The form appears and becomes interactive
// first, then the orb streams in behind it. A failed chunk resolves to a no-op
// component so it can never throw the page into an error state.
const Orb = lazy(() =>
  import("@/components/ui/Orb").catch(() => ({ default: () => <></> })),
);

type AuthMode = "login" | "signup";

/**
 * AuthCard — standalone mock authentication experience.
 *
 * Auth is intentionally simulated (no backend yet): signing in marks the
 * session as authenticated and routes to /profile. Swap the finishAuth()
 * internals for a real provider later without touching the UI.
 */
export function AuthCard({ mode }: { mode: AuthMode }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orbReady, setOrbReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleOrbReady = useCallback(() => setOrbReady(true), []);

  // Warm the post-login destination (/home + its _app shell) as soon as the
  // auth page mounts — by the time the user finishes typing, the click lands
  // on an already-loaded page, so navigation feels instant.
  useEffect(() => {
    // Warm the post-login destination and the sibling auth route so both the
    // next click and the mode-switch link land instantly.
    router.preloadRoute({ to: "/home" }).catch(() => {
      /* best-effort warmup */
    });
    router.preloadRoute({ to: isLogin ? "/signup" : "/login" }).catch(() => {
      /* best-effort warmup */
    });
  }, [router, isLogin]);

  function finishAuth() {
    session.setAuthenticated();
    setSubmitting(true);
    navigate({ to: "/home" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    finishAuth();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">
      {/* CSS aurora — always animated, zero WebGL required (guarantees the page
          never sits on a black screen while the orb warms up or is unavailable) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="float-a absolute left-[6%] top-[-14%] h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle,oklch(0.79_0.11_82/0.06),transparent_65%)] blur-2xl" />
        <div className="float-b absolute bottom-[-16%] right-[-6%] h-[44vmax] w-[44vmax] rounded-full bg-[radial-gradient(circle,oklch(0.68_0.08_78/0.05),transparent_65%)] blur-2xl" />
        <LightRays />
        <DustParticles />
      </div>

      {/* WebGL Orb — fades in on top once its first frame has rendered */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: orbReady ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0"
      >
        <Suspense fallback={null}>
          <Orb
            hue={45}
            hoverIntensity={0.35}
            rotateOnHover
            backgroundColor="#000000"
            onReady={handleOrbReady}
          />
        </Suspense>
      </motion.div>

      {/* Soft veil — keeps the glass card readable while letting the orb glow through */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_42%,transparent_50%,rgba(0,0,0,0.5))]" />

      {/* Card — visible the instant the HTML renders: the `reveal` entrance is
          pure CSS, so the form never waits on JS download/hydration. */}
      <div
        className="login-card reveal relative w-[min(26.5rem,100%)] overflow-hidden px-6 py-10 sm:px-10 sm:py-12"
      >
        {/* Card top gold shimmer line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.79_0.11_82/0.5)] to-transparent" />

        {/* Branding */}
        <div className="mb-9 flex flex-col items-center gap-4 text-center">
          <HeritageMark />
          <div>
            <h1 className="font-serif text-[1.9rem] font-light leading-tight tracking-[-0.02em] text-parchment">
              Heritage Gateway
            </h1>
            <p className="mx-auto mt-3 max-w-[20rem] font-sans text-[0.72rem] leading-relaxed font-light text-parchment/55">
              {isLogin
                ? "Explore India's timeless monuments with AI-powered historical discovery."
                : "Create your account and begin your journey through India's heritage."}
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-2">
              <label className="ml-1 block font-sans text-[0.62rem] uppercase tracking-[0.18em] text-parchment/50">
                Name
              </label>
              <input
                type="text"
                placeholder="Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="heritage-input"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="ml-1 block font-sans text-[0.62rem] uppercase tracking-[0.18em] text-parchment/50">
              Email
            </label>
            <input
              type="email"
              placeholder="scholar@heritagegateway.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="heritage-input"
              required
            />
          </div>

          <div className="space-y-2 pb-1">
            <div className="flex items-center justify-between">
              <label className="ml-1 font-sans text-[0.62rem] uppercase tracking-[0.18em] text-parchment/50">
                Password
              </label>
              {isLogin && (
                <a
                  href="#"
                  className="font-sans text-[0.62rem] text-gold/65 transition-colors duration-200 hover:text-gold"
                >
                  Forgot Password?
                </a>
              )}
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="heritage-input"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="heritage-btn-primary w-full disabled:cursor-wait disabled:opacity-80"
          >
            <span className="heritage-btn-shine" />
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <span
                  className="inline-block h-3.5 w-3.5 animate-spin rounded-full"
                  style={{
                    border: "2px solid rgba(0,0,0,0.25)",
                    borderTopColor: "currentColor",
                  }}
                />
                {isLogin ? "Signing In…" : "Creating…"}
              </span>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-parchment/10" />
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.22em] text-parchment/35">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-parchment/10" />
        </div>

        {/* Social / guest buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={finishAuth}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-parchment/12 bg-[oklch(0.13_0.005_60/0.5)] px-5 py-3 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-parchment/75 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-[oklch(0.16_0.008_82/0.55)] hover:text-parchment hover:shadow-[0_0_18px_oklch(0.79_0.11_82/0.12)]"
          >
            <GoogleMark />
            Continue with Google
          </button>
          <button
            type="button"
            onClick={finishAuth}
            className="w-full rounded-xl border border-parchment/8 bg-transparent py-3 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-parchment/40 transition-all duration-300 hover:border-gold/20 hover:text-gold/80"
          >
            Continue as Guest
          </button>
        </div>

        {/* Honest demo note */}
        <p className="mt-6 text-center font-sans text-[0.58rem] uppercase tracking-[0.22em] text-parchment/25">
          Demo build — authentication is simulated for this session
        </p>

        {/* Mode switch */}
        <p className="mt-4 text-center font-sans text-[0.72rem] text-parchment/45">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-gold/80 transition-colors hover:text-gold">
                Create one
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-gold/80 transition-colors hover:text-gold">
                Sign in
              </Link>
            </>
          )}
        </p>

        {/* Card bottom gold shimmer line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.79_0.11_82/0.2)] to-transparent" />
      </div>

      {/* Footer */}
      <footer className="absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-5 py-6 sm:justify-between sm:px-8 sm:py-7 font-sans text-[0.58rem] uppercase tracking-[0.28em] text-parchment/25">
        <span>© 2026 Heritage Gateway</span>
        <span>Privacy · Terms</span>
      </footer>
    </main>
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
