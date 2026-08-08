import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";

/**
 * DashboardShell — the app-wide layout for the signed-in experience.
 *
 * Responsive by design:
 *  - Desktop (md+): fixed sidebar + top bar, content offset by the sidebar width.
 *  - Mobile (<md): sidebar and desktop top bar are hidden; a compact mobile
 *    header with a hamburger navigation drawer (MobileNav) takes over, and the
 *    content runs full-width. No `md:`-hidden wrapper means no hydration flash.
 *
 * The content area is intentionally a plain <main>: it is NOT a motion
 * component keyed by pathname. Remounting a framer-motion element on every
 * navigation hit a known framer-motion 13 / React 19 mount bug that threw
 * "Cannot read properties of undefined (reading 'mount')" on the deployed
 * site; it also forced a full remount of the content tree per route change.
 * Route transitions are now instant and crash-free.
 */
export function DashboardShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

      {/* Main content — plain element: never remounted per navigation */}
      <main
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
      </main>
    </div>
  );
}
