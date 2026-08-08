import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ChevronDown, Landmark } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NAV_MAIN,
  NAV_LIBRARY,
  NAV_ACCOUNT,
  isRouteActive,
  type NavItem,
} from "./AppSidebar";

/**
 * MobileNav — the mobile-only header + navigation drawer.
 *
 * Rendered inside DashboardShell only below the md breakpoint (CSS-controlled
 * via `md:hidden`, so there is no hydration flash). The hamburger opens a
 * premium dark slide-over with every navigation group, clear active states,
 * and ≥44px tap targets. Navigating closes the drawer.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      {/* ─── Fixed mobile header ─────────────────────────────────────── */}
      <div
        className="fixed inset-x-3 top-3 z-40 flex h-12 items-center gap-2 rounded-2xl px-2"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.96 0.012 85 / 0.07), oklch(0.13 0.008 60 / 0.88))",
          backdropFilter: "blur(24px) saturate(140%)",
          border: "1px solid oklch(0.96 0.012 85 / 0.1)",
          boxShadow: "0 16px 48px -16px oklch(0 0 0 / 0.65)",
        }}
      >
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-parchment/80 transition-colors hover:text-gold"
              style={{ border: "1px solid oklch(0.96 0.012 85 / 0.1)" }}
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[86vw] max-w-[21rem] overflow-y-auto border-r p-0"
            style={{
              background:
                "linear-gradient(165deg, oklch(0.15 0.008 60 / 0.98), oklch(0.1 0.006 60 / 0.99))",
              backdropFilter: "blur(28px) saturate(140%)",
              borderRight: "1px solid oklch(0.79 0.11 82 / 0.18)",
            }}
          >
            {/* Drawer brand */}
            <div
              className="flex items-center gap-3 px-5 pb-4 pt-6"
              style={{ borderBottom: "1px solid oklch(0.79 0.11 82 / 0.12)" }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.25), oklch(0.79 0.11 82 / 0.06))",
                  border: "1px solid oklch(0.79 0.11 82 / 0.4)",
                  color: "oklch(0.86 0.1 85)",
                }}
              >
                <Landmark size={18} strokeWidth={1.6} />
              </span>
              <Link to="/home" className="min-w-0" title="Heritage Gateway — Home">
                <span
                  className="block truncate font-serif text-lg italic leading-tight text-parchment/90"
                >
                  Heritage{" "}
                  <span className="font-normal text-gold">Gateway</span>
                </span>
                <span className="block font-sans text-[0.55rem] uppercase tracking-[0.28em] text-parchment/35">
                  Explore India's past
                </span>
              </Link>
            </div>

            {/* Nav groups */}
            <div className="px-3 py-3">
              <NavGroup label="Navigation" items={NAV_MAIN} pathname={pathname} />
              <Divider />
              <NavGroup label="Library" items={NAV_LIBRARY} pathname={pathname} />
              <Divider />
              <NavGroup label="Account" items={NAV_ACCOUNT} pathname={pathname} />
            </div>

            {/* Profile CTA */}
            <div className="px-4 pb-6">
              <Link
                to="/profile"
                className="flex min-h-12 items-center gap-3 rounded-2xl px-4 transition-colors"
                style={{
                  background: "oklch(0.96 0.012 85 / 0.05)",
                  border: "1px solid oklch(0.79 0.11 82 / 0.2)",
                }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-sans text-xs font-semibold text-ink"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.6), oklch(0.68 0.08 78 / 0.8))",
                  }}
                >
                  U
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-sm text-parchment/85">Profile</span>
                  <span className="block font-sans text-[0.6rem] uppercase tracking-[0.2em] text-parchment/40">
                    Heritage Explorer
                  </span>
                </span>
                <ChevronDown size={15} className="rotate-[-90deg] text-parchment/40" />
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        {/* Centered brand (mobile header) */}
        <Link
          to="/home"
          className="min-w-0 flex-1 px-1"
          title="Heritage Gateway — Home"
        >
          <span className="block truncate text-center font-serif text-[1.05rem] italic tracking-[0.02em] text-parchment/90">
            Heritage{" "}
            <span className="font-normal text-gold">Gateway</span>
          </span>
        </Link>

        {/* Profile avatar */}
        <Link
          to="/profile"
          aria-label="Open profile"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ border: "1px solid oklch(0.96 0.012 85 / 0.1)" }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg font-sans text-xs font-semibold text-ink"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.6), oklch(0.68 0.08 78 / 0.8))",
            }}
          >
            U
          </span>
        </Link>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="mx-2 my-2 h-px"
      style={{ background: "oklch(0.79 0.11 82 / 0.1)" }}
    />
  );
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div className="mb-1">
      <p className="mb-1.5 px-3 pt-3 font-sans text-[0.58rem] uppercase tracking-[0.3em] text-gold/55">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = isRouteActive(pathname, item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              className="relative flex min-h-12 items-center gap-3 rounded-xl px-3 transition-colors"
              style={{
                background: active
                  ? "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.18), oklch(0.79 0.11 82 / 0.06))"
                  : "transparent",
                color: active
                  ? "oklch(0.79 0.11 82)"
                  : "oklch(0.96 0.012 85 / 0.6)",
                boxShadow: active
                  ? "inset 0 0 0 1px oklch(0.79 0.11 82 / 0.25)"
                  : "none",
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/4 h-1/2 w-[3px] rounded-r-full"
                  style={{ background: "oklch(0.79 0.11 82)" }}
                />
              )}
              <span className="shrink-0 opacity-90">{item.icon}</span>
              <span className="font-sans text-[0.82rem] font-medium tracking-[0.02em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
