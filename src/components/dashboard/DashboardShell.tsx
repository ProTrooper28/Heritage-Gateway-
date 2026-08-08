import { useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "@tanstack/react-router";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * DashboardShell — the app-wide layout for the signed-in experience.
 *
 * Responsive by design:
 *  - Desktop (md+): fixed sidebar + top bar, content offset by the sidebar width.
 *  - Mobile (<md): sidebar and desktop top bar are hidden; a compact mobile
 *    header with a hamburger navigation drawer (MobileNav) takes over, and the
 *    content runs full-width. No `md:`-hidden wrapper means no hydration flash.
 */
export function DashboardShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { pathname } = useLocation();

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
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 25% 0%, oklch(0.79 0.11 82 / 0.06), transparent), " +
            "radial-gradient(ellipse 40% 35% at 80% 90%, oklch(0.65 0.15 240 / 0.06), transparent)",
        }}
      />

      {/* Sidebar — desktop only (hidden below md via CSS) */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Desktop top bar */}
      <div className="fixed left-0 right-0 top-0 z-40 hidden md:block">
        <TopBar sidebarCollapsed={sidebarCollapsed} />
      </div>

      {/* Mobile header + navigation drawer */}
      <MobileNav />

      {/* Main content */}
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className={
          sidebarCollapsed
            ? "md:ml-[6.25rem] md:mr-4 px-4 pt-[5.5rem] md:px-6 md:pt-[4.75rem]"
            : "md:ml-[17rem] md:mr-4 px-4 pt-[5.5rem] md:px-6 md:pt-[4.75rem]"
        }
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          transition: "margin-left 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
