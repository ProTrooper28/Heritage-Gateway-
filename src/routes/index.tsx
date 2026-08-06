import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DustParticles, LightRays } from "@/components/heritage/Atmosphere";
import { InfoCard } from "@/components/heritage/InfoCard";
import { slides } from "@/components/heritage/slides";
import blend from "@/assets/heritage-blend.jpg";

export const Route = createFileRoute("/")({
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

function Experience() {
  const [step, setStep] = useState(0);
  const isLogin = step >= slides.length;
  const parallax = useParallax();

  useEffect(() => {
    if (isLogin) return;
    const t = setTimeout(() => setStep((s) => s + 1), 9000);
    return () => clearTimeout(t);
  }, [step, isLogin]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, slides.length));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-ink">
      {isLogin ? <LoginScene parallax={parallax} /> : <SlideScene step={step} parallax={parallax} />}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-[4vw] py-8">
        <span className="font-serif text-[1.05rem] italic tracking-wide text-parchment/85">
          Indian Heritage <span className="text-gold not-italic">AI</span>
        </span>
        {!isLogin && (
          <button
            onClick={() => setStep(slides.length)}
            className="pointer-events-auto font-sans text-[0.68rem] uppercase tracking-[0.34em] text-parchment/55 transition-colors hover:text-gold"
          >
            Skip
          </button>
        )}
      </header>

      {!isLogin && (
        <div className="absolute inset-x-0 bottom-10 z-40 flex justify-center gap-3">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              aria-label={s.title.join(" ")}
              className={`h-px w-14 transition-all duration-700 ${
                i === step ? "bg-gold" : "bg-parchment/20 hover:bg-parchment/40"
              }`}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function SlideScene({ step, parallax }: { step: number; parallax: { x: number; y: number } }) {
  const slide = slides[step] ?? slides[0]!;

  const alignClass =
    slide.align === "center"
      ? "items-center text-center"
      : slide.align === "right"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <section key={slide.id} className="absolute inset-0">
      <div className="absolute inset-0 overflow-hidden">
        <img
          key={`${slide.id}-img`}
          src={slide.image}
          alt={slide.title.join(" ")}
          width={1920}
          height={1280}
          className="ken-burns h-full w-full object-cover"
          style={{
            transform: `translate3d(${parallax.x * -26}px, ${parallax.y * -18}px, 0)`,
          }}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_15%,transparent_10%,oklch(0.13_0.008_60/0.55)_55%,oklch(0.09_0.006_60/0.94)_100%)]" />
      <LightRays />
      <DustParticles />

      <div
        className={`absolute inset-0 z-20 flex flex-col justify-center px-[7vw] [text-shadow:0_2px_30px_oklch(0.09_0.005_60/0.85)] ${alignClass}`}
        style={{ transform: `translate3d(${parallax.x * 14}px, ${parallax.y * 10}px, 0)` }}
      >
        <p
          className="reveal font-sans text-[0.65rem] uppercase tracking-[0.5em] text-gold"
          style={{ animationDelay: "150ms" }}
        >
          {slide.index} — {slide.theme}
        </p>

        <h1 className="mt-8 font-serif font-light leading-[1] tracking-[-0.02em] text-parchment">
          {slide.title.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span
                className="reveal block pb-[0.06em] text-[clamp(3.5rem,8vw,8.5rem)]"
                style={{ animationDelay: `${350 + i * 180}ms` }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="reveal mt-8 max-w-xl font-serif text-[1.35rem] font-light italic leading-relaxed text-parchment-dim"
          style={{ animationDelay: "780ms" }}
        >
          {slide.subtitle}
        </p>
      </div>

      <div
        className="absolute inset-0 z-30"
        style={{ transform: `translate3d(${parallax.x * 42}px, ${parallax.y * 30}px, 0)` }}
      >
        {slide.cards.map((c) => (
          <InfoCard key={c.title} {...c} />
        ))}
      </div>
    </section>
  );
}

function LoginScene({ parallax }: { parallax: { x: number; y: number } }) {
  return (
    <section className="absolute inset-0">
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
        <div className="reveal glass-card w-[min(30rem,90vw)] px-12 py-14 text-center">
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.5em] text-gold">Est. Heritage</p>
          <h1 className="mt-6 font-serif text-[2.9rem] font-light leading-[1.05] tracking-[-0.02em] text-parchment">
            Indian Heritage AI
          </h1>
          <p className="mt-4 font-serif text-lg font-light italic text-parchment-dim">
            Experience history like never before.
          </p>

          <div className="mt-11 space-y-3">
            <button className="w-full rounded-full border border-gold/45 bg-gold/12 py-3.5 font-sans text-[0.72rem] uppercase tracking-[0.28em] text-gold transition-all duration-500 hover:bg-gold/20">
              Continue as Guest
            </button>
            <button className="flex w-full items-center justify-center gap-3 rounded-full border border-parchment/18 py-3.5 font-sans text-[0.72rem] uppercase tracking-[0.28em] text-parchment/80 transition-all duration-500 hover:border-parchment/40 hover:text-parchment">
              <GoogleMark />
              Sign in with Google
            </button>
            <button className="w-full py-3 font-sans text-[0.72rem] uppercase tracking-[0.28em] text-parchment/45 transition-colors duration-500 hover:text-gold">
              Explore Heritage
            </button>
          </div>
        </div>
      </div>

      <footer className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-[4vw] py-8 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-parchment/35">
        <span>© 2026 Indian Heritage AI</span>
        <span>Privacy · Terms</span>
      </footer>
    </section>
  );
}

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
