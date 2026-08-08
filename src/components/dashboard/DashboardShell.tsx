import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { HomePage } from "./HomePage";
import { AIHistorian } from "./AIHistorian";

/**
 * DashboardShell — the main app layout after the cinematic intro.
 * Composes sidebar + topbar + scrollable content area.
 * activeItem is lifted here so sidebar and HomePage stay in sync.
 *
 * selectedMonument — optional monument context forwarded to AI Historian.
 * When the user browses a specific monument in other feature panels, that
 * panel can call setSelectedMonument() to give AI Historian automatic context.
 */
export function DashboardShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [selectedMonument, setSelectedMonument] = useState<string | undefined>(undefined);
  const { scrollY } = useScroll();

  const sidebarWidth = sidebarCollapsed ? "4.25rem" : "15rem";

  // Top bar appears only after the hero scrolls away.
  // For AI Historian view we always show it (scroll-independent).
  const isAIHistorian = activeItem === "AI Historian";
  const topBarOpacity = useTransform(scrollY, [400, 700], [isAIHistorian ? 1 : 0, 1]);
  const topBarY = useTransform(scrollY, [400, 700], [isAIHistorian ? 0 : -20, 0]);
  const topBarPointer = useTransform(scrollY, (y) =>
    isAIHistorian || y > 500 ? "auto" : "none",
  );

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        minHeight: "100vh",
        background: "oklch(0.13 0.008 60)",
        position: "relative",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at 25% 0%, oklch(0.79 0.11 82 / 0.06), transparent), " +
            "radial-gradient(ellipse 40% 35% at 80% 90%, oklch(0.65 0.15 240 / 0.06), transparent)",
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        activeItem={activeItem}
        onNavigate={setActiveItem}
      />

      {/* Top bar (Sticky after hero; always visible in AI Historian view) */}
      <motion.div
        style={{
          opacity: topBarOpacity,
          y: topBarY,
          pointerEvents: topBarPointer as any,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
        }}
      >
        <TopBar sidebarCollapsed={sidebarCollapsed} />
      </motion.div>

      {/* Main content */}
      <motion.main
        style={{
          position: "relative",
          zIndex: 1,
          marginLeft: `calc(${sidebarWidth} + 2rem)`,
          marginRight: "1rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          minHeight: "100vh",
          transition: "margin-left 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {isAIHistorian ? (
          <AIHistorian
            monumentContext={selectedMonument}
            onClearMonumentContext={() => setSelectedMonument(undefined)}
          />
        ) : (
          <HomePage activeItem={activeItem} onNavigate={setActiveItem} />
        )}
      </motion.main>
    </motion.div>
  );
}
