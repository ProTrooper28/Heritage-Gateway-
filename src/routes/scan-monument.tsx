import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { ScanMonumentFeaturePage } from "@/features/scan-monument";

export const Route = createFileRoute("/scan-monument")({
  head: () => ({
    meta: [
      { title: "Scan Monument — Heritage Gateway" },
      { name: "description", content: "Identify Indian monuments with AI-powered vision." },
    ],
  }),
  component: ScanMonumentRouteComponent,
});

function ScanMonumentRouteComponent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? "4.25rem" : "15rem";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
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

      {/* Sidebar with 'Scan Monument' highlighted */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        activeItem="Scan Monument"
        onNavigate={() => {}}
      />

      {/* TopBar */}
      <TopBar sidebarCollapsed={sidebarCollapsed} />

      {/* Main content displaying isolated ScanMonumentFeaturePage */}
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
        <ScanMonumentFeaturePage />
      </motion.main>
    </motion.div>
  );
}
