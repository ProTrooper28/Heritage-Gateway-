import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onComplete: () => void;
};

/**
 * IntroVideo — fullscreen cinematic intro player.
 *
 * Plays `intro.mp4` from /public once after login.
 * Fades out and calls onComplete when the video ends (or on skip).
 *
 * The video is expected at: /public/intro.mp4
 * Place your cinematic video there for this to work.
 */
export function IntroVideo({ onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  // Show skip button after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleEnd = () => {
    if (exiting) return;
    setExiting(true);
    // Give time for exit animation before unmounting
    setTimeout(onComplete, 1200);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="intro-video"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            src="/intro.mp4"
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handleEnd}
            onTimeUpdate={handleTimeUpdate}
          />

          {/* Cinematic letterbox bars */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[8vh] bg-black" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] bg-black" />

          {/* Gradient vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

          {/* Brand watermark */}
          <motion.div
            className="absolute left-[4vw] top-8 z-10"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "oklch(0.79 0.11 82)",
                fontSize: "1.05rem",
                fontStyle: "italic",
                letterSpacing: "0.08em",
                opacity: 0.9,
              }}
            >
              Indian Heritage{" "}
              <span style={{ fontStyle: "normal", opacity: 0.7 }}>AI</span>
            </span>
          </motion.div>

          {/* Progress bar */}
          <div className="absolute inset-x-0 bottom-[8vh] z-10 px-[4vw]">
            <div
              className="h-px w-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <motion.div
                className="h-full origin-left"
                style={{
                  background: "oklch(0.79 0.11 82)",
                  scaleX: progress,
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>

          {/* Skip button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                className="absolute bottom-[calc(8vh+28px)] right-[4vw] z-10"
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.34em",
                  color: "oklch(0.96 0.012 85 / 0.55)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem 0",
                  transition: "color 0.3s",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "oklch(0.79 0.11 82)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "oklch(0.96 0.012 85 / 0.55)")
                }
                onClick={handleEnd}
              >
                Skip
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
