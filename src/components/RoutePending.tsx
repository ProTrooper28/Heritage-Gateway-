/**
 * RoutePending — shown instantly while a lazily-loaded route chunk is
 * fetched/compiled (TanStack Start code-splits every page). It replaces the
 * old page immediately instead of letting it sit frozen for seconds, keeping
 * the app's premium dark/gold identity.
 *
 * It is rendered *inside* the layout, so the sidebar/topbar stay visible and
 * only the content area shows the pending state.
 */
export function RoutePending() {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at center, oklch(0.79 0.11 82 / 0.05), transparent 60%), oklch(0.13 0.008 60 / 0.35)",
      }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Thin gold spinner ring */}
        <div
          className="relative h-12 w-12"
          style={{
            border: "1px solid oklch(0.96 0.012 85 / 0.12)",
            borderRadius: "9999px",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              border: "2px solid transparent",
              borderTopColor: "oklch(0.79 0.11 82 / 0.9)",
              borderRightColor: "oklch(0.79 0.11 82 / 0.35)",
              borderRadius: "9999px",
              animation: "route-pending-spin 0.8s linear infinite",
            }}
          />
          <div
            className="absolute inset-1.5"
            style={{
              border: "1px solid transparent",
              borderBottomColor: "oklch(0.96 0.012 85 / 0.25)",
              borderRadius: "9999px",
              animation: "route-pending-spin 1.2s linear infinite reverse",
            }}
          />
        </div>

        <p
          className="text-sm tracking-[0.35em] uppercase"
          style={{
            fontFamily: "'Jost', system-ui, sans-serif",
            color: "oklch(0.96 0.012 85 / 0.55)",
            letterSpacing: "0.35em",
          }}
        >
          Preparing your journey
        </p>
      </div>

      <style>{`
        @keyframes route-pending-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
