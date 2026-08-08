import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Omit the DOM props that framer-motion redefines with incompatible signatures
// (style → MotionStyle, onDrag/onDragStart/onDragEnd → PanInfo handlers,
// onAnimationStart → AnimationDefinition) so the `...props` spread stays valid.
interface SpecularButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "style" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
> {
  size?: "sm" | "md" | "lg";
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  autoAnimate?: boolean;
  proximity?: number;
  children: React.ReactNode;
}

export const SpecularButton = React.forwardRef<HTMLButtonElement, SpecularButtonProps>(
  (
    {
      className,
      size = "lg",
      radius = 9999,
      tint = "#ffffff",
      tintOpacity = 0.03,
      blur = 12,
      textColor = "#F6F4F1",
      lineColor = "#E5D1A5",
      baseColor = "#121317", // Using the requested background color
      intensity = 0.65,
      shineSize = 8,
      shineFade = 30,
      thickness = 1,
      speed = 0.18,
      followMouse = true,
      autoAnimate = false,
      proximity = 220,
      children,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    // Mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for the shine movement
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const shineX = useSpring(mouseX, springConfig);
    const shineY = useSpring(mouseY, springConfig);

    // Shine opacity based on proximity and hover
    const shineOpacity = useSpring(isHovered ? intensity : 0, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!followMouse || !buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    useEffect(() => {
      if (!followMouse) return;

      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!buttonRef.current) return;
        
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );
        
        // Calculate relative position for the shine
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        mouseX.set(x);
        mouseY.set(y);
        
        // Proximity logic
        if (distance < proximity) {
          const proximityIntensity = (1 - distance / proximity) * intensity;
          shineOpacity.set(isHovered ? intensity : proximityIntensity);
        } else {
          shineOpacity.set(isHovered ? intensity : 0);
        }
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
    }, [followMouse, proximity, intensity, isHovered]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Height based on size prop
    const heightMap = {
      sm: "h-10",
      md: "h-12",
      lg: "h-[58px] md:h-[64px]",
    };

    return (
      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative group overflow-hidden flex items-center justify-center px-10 transition-shadow duration-300",
          heightMap[size],
          className
        )}
        style={{
          backgroundColor: baseColor,
          borderRadius: `${radius}px`,
          border: `${thickness}px solid rgba(255, 255, 255, 0.18)`,
          boxShadow: isHovered 
            ? "0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)" 
            : "0 4px 20px -5px rgba(0, 0, 0, 0.4), inset 0 1px 0.5px rgba(255, 255, 255, 0.05)",
          cursor: "pointer",
          outline: "none",
        }}
        {...props}
      >
        {/* Glass Effect Layers */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${blur}px)`,
            backgroundColor: `rgba(255, 255, 255, ${tintOpacity})`,
            borderRadius: `${radius}px`,
          }}
        />

        {/* Inner Highlight (Top Edge) */}
        <div 
          className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        />

        {/* Specular Shine Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ borderRadius: `${radius}px` }}
        >
          <motion.div
            style={{
              x: shineX,
              y: shineY,
              opacity: shineOpacity,
              width: `${shineSize * 20}%`,
              height: `${shineSize * 20}%`,
              left: "-50%",
              top: "-50%",
              background: `radial-gradient(circle at center, ${lineColor} 0%, transparent 70%)`,
              filter: `blur(${shineFade}px)`,
            }}
            className="absolute"
          />
        </motion.div>

        {/* Content */}
        <span 
          className="relative z-10 font-sans text-[0.7rem] uppercase tracking-[0.18em] font-medium transition-colors duration-300"
          style={{ 
            color: textColor,
            fontWeight: 500, // Medium weight
            letterSpacing: "0.18em",
          }}
        >
          {children}
        </span>

        {/* Focus Ring */}
        <div className="absolute inset-[-4px] rounded-full border border-white/0 group-focus-visible:border-white/20 transition-all pointer-events-none" />
      </motion.button>
    );
  }
);

SpecularButton.displayName = "SpecularButton";
