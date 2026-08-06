const PARTICLES = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 1 + ((i * 7) % 3),
  delay: (i % 12) * 1.4,
  duration: 16 + ((i * 5) % 14),
  opacity: 0.12 + ((i % 5) * 0.07),
}));

export function LightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="ray ray-1" />
      <div className="ray ray-2" />
      <div className="ray ray-3" />
    </div>
  );
}

export function DustParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="dust"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
