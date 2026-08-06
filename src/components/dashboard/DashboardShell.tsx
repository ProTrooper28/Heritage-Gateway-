import { useState } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { HomePage } from "./HomePage";

/**
 * DashboardShell — the main app layout after the cinematic intro.
 * Composes sidebar + topbar + scrollable content area.
 */
export function DashboardShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? "4.25rem" : "15rem";

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
      />

      {/* Top bar */}
      <TopBar sidebarCollapsed={sidebarCollapsed} />

      {/* Main content */}
      <motion.main
        style={{
          position: "relative",
          zIndex: 1,
          marginLeft: `calc(${sidebarWidth} + 2rem)`,
          marginRight: "1rem",
          paddingTop: "calc(3.5rem + 2rem)",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          minHeight: "100vh",
          transition: "margin-left 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <HomePage />
      </motion.main>
    </motion.div>
  );
}
