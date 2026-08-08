import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Search, Scan, ChevronDown } from "lucide-react";

type Props = {
  sidebarCollapsed: boolean;
};

const NAV_LINKS = [
  { label: "Home", to: "/home" },
  { label: "Monuments", to: "/monuments" },
  { label: "Explore", to: "/explore" },
  { label: "Reconstruction", to: "/historical-reconstruction" },
  { label: "About", to: "/about" },
];

export function TopBar({ sidebarCollapsed }: Props) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifHovered, setNotifHovered] = useState(false);
  const { pathname } = useLocation();

  const sidebarWidth = sidebarCollapsed ? "4.25rem" : "15rem";
  const left = `calc(${sidebarWidth} + 2rem)`;

  const isActive = (to: string) =>
    pathname === to || (to === "/monuments" && pathname.startsWith("/monuments/"));

  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        left,
        zIndex: 40,
        height: "3.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0 0.75rem 0 1.25rem",
        borderRadius: "1rem",
        // dark glass
        background:
          "linear-gradient(135deg, oklch(0.96 0.012 85 / 0.06), oklch(0.13 0.008 60 / 0.88))",
        backdropFilter: "blur(24px) saturate(140%)",
        border: "1px solid oklch(0.96 0.012 85 / 0.1)",
        boxShadow:
          "0 16px 48px -16px oklch(0 0 0 / 0.65), inset 0 1px 0 oklch(0.96 0.012 85 / 0.08)",
        transition: "left 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0 0.75rem",
          height: "2.2rem",
          borderRadius: "0.65rem",
          background: searchFocused
            ? "oklch(0.96 0.012 85 / 0.07)"
            : "oklch(0.96 0.012 85 / 0.04)",
          border: `1px solid ${searchFocused ? "oklch(0.79 0.11 82 / 0.3)" : "oklch(0.96 0.012 85 / 0.08)"}`,
          transition: "all 0.25s",
          maxWidth: "18rem",
          width: "100%",
          flexShrink: 1,
        }}
      >
        <Search
          size={14}
          style={{
            color: "oklch(0.79 0.11 82 / 0.6)",
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          placeholder="Search monuments…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            width: "100%",
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: "0.82rem",
            letterSpacing: "0.01em",
            color: "oklch(0.96 0.012 85 / 0.85)",
          }}
        />
        {/* Keyboard shortcut hint */}
        <span
          style={{
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.06em",
            color: "oklch(0.96 0.012 85 / 0.25)",
            flexShrink: 0,
            border: "1px solid oklch(0.96 0.012 85 / 0.15)",
            borderRadius: "0.25rem",
            padding: "0.1rem 0.35rem",
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Primary nav — real routes with active state */}
      <nav className="hidden lg:flex items-center gap-0.5">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`relative rounded-lg px-3 py-1.5 font-sans text-[0.72rem] uppercase tracking-[0.16em] transition-colors ${
              isActive(link.to) ? "text-gold" : "text-parchment/60 hover:text-gold"
            }`}
          >
            {link.label}
            {isActive(link.to) && (
              <span
                className="absolute inset-x-3 -bottom-px h-px rounded-full bg-gold/70"
                style={{ boxShadow: "0 0 8px oklch(0.79 0.11 82 / 0.5)" }}
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Quick Scan CTA */}
      <motion.span
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ display: "inline-flex", flexShrink: 0 }}
      >
        <Link
          to="/scan-monument"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.45rem 1rem",
            borderRadius: "0.65rem",
            border: "1px solid oklch(0.79 0.11 82 / 0.4)",
            background:
              "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.18), oklch(0.79 0.11 82 / 0.06))",
            color: "oklch(0.79 0.11 82)",
            textDecoration: "none",
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontWeight: 500,
            boxShadow: "0 0 20px oklch(0.79 0.11 82 / 0.08)",
          }}
        >
          <Scan size={13} />
          Quick Scan
        </Link>
      </motion.span>

      {/* Notification bell */}
      <button
        onMouseEnter={() => setNotifHovered(true)}
        onMouseLeave={() => setNotifHovered(false)}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: "0.65rem",
          border: "1px solid oklch(0.96 0.012 85 / 0.1)",
          background: notifHovered
            ? "oklch(0.96 0.012 85 / 0.07)"
            : "transparent",
          color: "oklch(0.96 0.012 85 / 0.6)",
          cursor: "pointer",
          transition: "all 0.2s",
          flexShrink: 0,
        }}
      >
        <Bell size={16} />
        {/* Notification dot */}
        <span
          style={{
            position: "absolute",
            top: "0.35rem",
            right: "0.35rem",
            width: "6px",
            height: "6px",
            borderRadius: "9999px",
            background: "oklch(0.79 0.11 82)",
            border: "1.5px solid oklch(0.13 0.008 60)",
          }}
        />
      </button>

      {/* Profile avatar */}
      <Link
        to="/profile"
        title="Profile"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.25rem 0.5rem 0.25rem 0.25rem",
          borderRadius: "0.75rem",
          border: "1px solid oklch(0.96 0.012 85 / 0.1)",
          background: "oklch(0.96 0.012 85 / 0.04)",
          textDecoration: "none",
          transition: "all 0.2s",
          flexShrink: 0,
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: "1.9rem",
            height: "1.9rem",
            borderRadius: "0.5rem",
            background:
              "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.6), oklch(0.68 0.08 78 / 0.8))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "oklch(0.13 0.008 60)",
            flexShrink: 0,
          }}
        >
          U
        </div>
        <ChevronDown size={12} style={{ color: "oklch(0.96 0.012 85 / 0.4)" }} />
      </Link>
    </motion.header>
  );
}
