import { motion } from "framer-motion";
import heroFigure from "@/assets/hero-figure.png";
import tajmahal from "@/assets/tajmahal.jpg";
import brihadeeswara from "@/assets/brihadeeswara.jpg";

type Props = {
  onExplore: () => void;
};

export function HeroLanding({ onExplore }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #1a1a1e 0%, #0d0d10 100%)",
        color: "#f5f5f0",
      }}
    >
      {/* Top Navigation */}
      <nav className="absolute top-0 w-full z-40 px-[4vw] py-8 flex justify-between items-center text-[0.65rem] tracking-[0.05em] uppercase font-sans text-white/80">
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Philosophy & Power</a>
          <a href="#" className="hover:text-white transition-colors">Rituals & Religion</a>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 font-serif text-[1.1rem] capitalize tracking-normal text-white">
          Indian Heritage AI
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Warfare & Honor</a>
          <a href="#" className="hover:text-white transition-colors">Legacy & Ruins</a>
        </div>
      </nav>

      {/* Massive Background Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5vh]">
        <div className="relative w-full max-w-[1400px] px-[4vw]">
          <h1
            className="font-serif leading-none tracking-tight text-center"
            style={{
              fontSize: "clamp(8rem, 20vw, 24rem)",
              color: "#e8e8e3",
              textShadow: "0 20px 60px rgba(0,0,0,0.5)",
              transform: "scaleY(1.1)",
            }}
          >
            HERITAGE
          </h1>
          <h2
            className="absolute right-[8vw] bottom-[10%] font-serif leading-none tracking-widest uppercase text-white/90"
            style={{
              fontSize: "clamp(2rem, 5vw, 6rem)",
            }}
          >
            EXPLORER
          </h2>
        </div>
      </div>

      {/* Central Figure */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-[-10vh] left-1/2 -translate-x-1/2 w-[min(90vw,600px)] h-[85vh] z-20 pointer-events-none"
      >
        <img
          src={heroFigure}
          alt="Hero figure"
          className="w-full h-full object-contain object-bottom"
          style={{
            filter: "drop-shadow(0 0 40px rgba(0,0,0,0.8))",
            maskImage: "linear-gradient(to top, transparent 5%, black 25%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 5%, black 25%)",
          }}
        />
      </motion.div>

      {/* Left Content Block */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute left-[6vw] top-[45vh] -translate-y-1/2 w-[min(26vw,320px)] z-30"
      >
        <div className="aspect-[4/3] w-full overflow-hidden mb-5 rounded-[4px]">
          <img src={tajmahal} alt="Voices of Reason" className="w-full h-full object-cover grayscale-[20%] sepia-[10%] opacity-90" />
        </div>
        <h3 className="font-serif text-[1.4rem] font-bold text-white mb-2">Voices of Reason</h3>
        <p className="font-sans text-[0.8rem] text-white/70 leading-relaxed font-light">
          Scholars and philosophers debate truth before the royal court — a moment that defined ancient wisdom.
        </p>
      </motion.div>

      {/* Right Content Block */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute right-[6vw] bottom-[20vh] w-[min(24vw,300px)] z-30"
      >
        <h3 className="font-serif text-[1.3rem] font-bold text-white mb-2">Sacrifice and Sovereignty</h3>
        <p className="font-sans text-[0.8rem] text-white/70 leading-relaxed font-light mb-5">
          A king presents offerings to the gods, embodying the empire's deep ties to ritual and divine order.
        </p>
        <div className="aspect-[16/10] w-full overflow-hidden rounded-[4px]">
          <img src={brihadeeswara} alt="Sacrifice and Sovereignty" className="w-full h-full object-cover grayscale-[20%] sepia-[10%] opacity-90" />
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        onClick={onExplore}
        className="absolute bottom-10 left-[6vw] z-40 font-serif text-[1.1rem] italic text-white/80 hover:text-white transition-colors flex items-center gap-2"
      >
        Explore Further &darr;
      </motion.button>
    </motion.section>
  );
}
