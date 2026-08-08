import { useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "@tanstack/react-router";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * DashboardShell — the app-wide layout for the signed-in experience.
 * Composes sidebar + topbar + a scrollable content area, with a subtle
 * route-change transition rendered around <Outlet />.
 *
 * With real routing, each page is a route; the shell only provides chrome.
 */
export function DashboardShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { pathname } = useLocation();
  const sidebarWidth = sidebarCollapsed ? "4.25rem" : "15rem";

  return (
    <div
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
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40 }}>
        <TopBar sidebarCollapsed={sidebarCollapsed} />
      </div>

      {/* Main content */}
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{
          position: "relative",
          zIndex: 1,
          marginLeft: `calc(${sidebarWidth} + 2rem)`,
          marginRight: "1rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingTop: "4.75rem",
          minHeight: "100vh",
          transition: "margin-left 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
