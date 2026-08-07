import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Camera,
  Landmark,
  Bot,
  Layers,
  Clock,
  ImagePlay,
  BookMarked,
  Heart,
  History,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type NavItem = {
  icon: React.ReactNode;
  label: string;
};

const NAV_MAIN: NavItem[] = [
  { icon: <Home size={18} />, label: "Home" },
  { icon: <Camera size={18} />, label: "Scan Monument" },
  { icon: <Landmark size={18} />, label: "Explore Heritage" },
  { icon: <Bot size={18} />, label: "AI Historian" },
  { icon: <Layers size={18} />, label: "Architecture Explorer" },
  { icon: <Clock size={18} />, label: "Timeline Explorer" },
  { icon: <ImagePlay size={18} />, label: "Historical Reconstruction" },
];

const NAV_LIBRARY: NavItem[] = [
  { icon: <BookMarked size={18} />, label: "Saved Collections" },
  { icon: <Heart size={18} />, label: "Favorites" },
  { icon: <History size={18} />, label: "Recent Activity" },
];

const NAV_ACCOUNT: NavItem[] = [
  { icon: <Settings size={18} />, label: "Settings" },
  { icon: <User size={18} />, label: "Profile" },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  activeItem: string;
  onNavigate: (label: string) => void;
};

function NavGroup({
  label,
  items,
  collapsed,
  activeItem,
  onNavigate,
}: {
  label: string;
  items: NavItem[];
  collapsed: boolean;
  activeItem: string;
  onNavigate: (label: string) => void;
}) {
  return (
    <div className="mb-2">
      <AnimatePresence>
        {!collapsed && (
          <motion.p
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.35em",
              color: "oklch(0.79 0.11 82 / 0.5)",
              padding: "0 1rem",
              marginBottom: "0.4rem",
              marginTop: "1rem",
            }}
          >
            {label}
          </motion.p>
        )}
      </AnimatePresence>
      {!collapsed && <div style={{ marginTop: collapsed ? "0.75rem" : "0" }} />}
      {items.map((item) => (
        <NavItemRow
          key={item.label}
          item={item}
          collapsed={collapsed}
          isActive={activeItem === item.label}
          onClick={() => onNavigate(item.label)}
        />
      ))}
    </div>
  );
}

function NavItemRow({
  item,
  collapsed,
  isActive,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={collapsed ? item.label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        width: "100%",
        padding: collapsed ? "0.65rem" : "0.65rem 1rem",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: "0.75rem",
        border: "none",
        background: isActive
          ? "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.18), oklch(0.79 0.11 82 / 0.06))"
          : hovered
            ? "oklch(0.96 0.012 85 / 0.05)"
            : "transparent",
        color: isActive
          ? "oklch(0.79 0.11 82)"
          : hovered
            ? "oklch(0.96 0.012 85 / 0.85)"
            : "oklch(0.96 0.012 85 / 0.5)",
        cursor: "pointer",
        transition: "all 0.25s ease",
        position: "relative",
        marginBottom: "0.1rem",
        boxShadow: isActive
          ? "inset 0 0 0 1px oklch(0.79 0.11 82 / 0.25)"
          : "none",
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "25%",
            height: "50%",
            width: "3px",
            borderRadius: "0 3px 3px 0",
            background: "oklch(0.79 0.11 82)",
          }}
        />
      )}
      <span
        style={{
          flexShrink: 0,
          opacity: isActive ? 1 : hovered ? 0.9 : 0.65,
        }}
      >
        {item.icon}
      </span>
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: "0.8rem",
              fontWeight: isActive ? 500 : 400,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function AppSidebar({ collapsed, onToggle, activeItem, onNavigate }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        left: "1rem",
        top: "1rem",
        bottom: "1rem",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        borderRadius: "1.25rem",
        overflow: "hidden",
        transition: "width 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        width: collapsed ? "4.25rem" : "15rem",
        // Glassmorphism
        background:
          "linear-gradient(150deg, oklch(0.96 0.012 85 / 0.07), oklch(0.13 0.008 60 / 0.85))",
        backdropFilter: "blur(28px) saturate(140%)",
        border: "1px solid oklch(0.79 0.11 82 / 0.16)",
        boxShadow:
          "0 32px 80px -24px oklch(0 0 0 / 0.7), inset 0 1px 0 oklch(0.96 0.012 85 / 0.1)",
      }}
    >
      {/* Logo area */}
      <div
        style={{
          padding: collapsed ? "1.25rem 0" : "1.25rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          borderBottom: "1px solid oklch(0.79 0.11 82 / 0.1)",
          minHeight: "4rem",
          flexShrink: 0,
        }}
      >
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.05rem",
                  fontStyle: "italic",
                  letterSpacing: "0.04em",
                  color: "oklch(0.96 0.012 85 / 0.9)",
                }}
              >
                Heritage{" "}
                <span style={{ color: "oklch(0.79 0.11 82)", fontStyle: "normal" }}>
                  AI
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1.75rem",
            height: "1.75rem",
            borderRadius: "0.5rem",
            border: "1px solid oklch(0.79 0.11 82 / 0.2)",
            background: "oklch(0.79 0.11 82 / 0.08)",
            color: "oklch(0.79 0.11 82)",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav scroll area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "0.75rem 0.5rem",
          scrollbarWidth: "none",
        }}
      >
        <NavGroup
          label="Navigation"
          items={NAV_MAIN}
          collapsed={collapsed}
          activeItem={activeItem}
          onNavigate={onNavigate}
        />
        <div
          style={{
            height: "1px",
            margin: "0.75rem 0.5rem",
            background: "oklch(0.79 0.11 82 / 0.1)",
          }}
        />
        <NavGroup
          label="Library"
          items={NAV_LIBRARY}
          collapsed={collapsed}
          activeItem={activeItem}
          onNavigate={onNavigate}
        />
        <div
          style={{
            height: "1px",
            margin: "0.75rem 0.5rem",
            background: "oklch(0.79 0.11 82 / 0.1)",
          }}
        />
        <NavGroup
          label="Account"
          items={NAV_ACCOUNT}
          collapsed={collapsed}
          activeItem={activeItem}
          onNavigate={onNavigate}
        />
      </div>
    </motion.aside>
  );
}
