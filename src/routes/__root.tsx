import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * After first paint, warm the code-split chunks of the lightweight primary-nav
 * routes so the first click on any of them is instant. In dev this also
 * pre-compiles the modules through Vite, removing the long first-navigation
 * stall.
 *
 * Deliberately does NOT eagerly preload the heavy routes (Historical
 * Reconstruction with Three.js, Smart Trails, Scan Monument with a ~3MB AI
 * dependency): downloading them in the background on every page load competes
 * with the user's first interaction (e.g. the login click) for network + main
 * thread. Those heavy routes still load instantly on hover via the router's
 * `defaultPreload: "intent"`, and show the RoutePending state while loading.
 */
const LIGHT_ROUTES = [
  "/home",
  "/monuments",
  "/explore",
  "/profile",
  "/about",
  "/login",
  "/signup",
  "/favorites",
  "/recent-activity",
  "/saved-collections",
  "/timeline",
  "/settings",
  "/ai-historian",
] as const;

function preloadRoutes(
  router: ReturnType<typeof useRouter>,
  routes: readonly string[],
) {
  for (const to of routes) {
    router.preloadRoute({ to }).catch(() => {
      /* non-fatal: preloads are best-effort */
    });
  }
}

function useRouteWarmup() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lightTimer = window.setTimeout(() => {
      preloadRoutes(router, LIGHT_ROUTES);
    }, 350);

    return () => {
      window.clearTimeout(lightTimer);
    };
  }, [router]);
}

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { UserStateProvider } from "../context/UserStateContext";
import { PageNotFound } from "@/components/PageNotFound";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  // One automatic retry: transient errors (e.g. a navigation that raced a
  // route load) are retried silently ~300ms later so the user never sees the
  // error flash. A genuinely permanent error shows the screen after the retry.
  const autoRetried = useRef(false);
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
    if (autoRetried.current) return;
    autoRetried.current = true;
    const timer = window.setTimeout(() => {
      router.invalidate();
      reset();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [error, reset, router]);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: "oklch(0.13 0.008 60)",
        color: "oklch(0.96 0.012 85)",
      }}
    >
      <div className="max-w-md text-center">
        <p
          className="font-sans text-[0.6rem] uppercase tracking-[0.35em] text-gold/60"
          style={{ marginBottom: "1rem" }}
        >
          Heritage Gateway
        </p>
        <h1
          className="font-serif text-3xl font-light tracking-tight text-parchment"
          style={{ marginBottom: "0.75rem" }}
        >
          This page didn&apos;t load
        </h1>
        <p
          className="font-sans text-sm font-light text-parchment/55"
          style={{ lineHeight: 1.7 }}
        >
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        {error?.message ? (
          <p
            className="font-mono text-[0.6rem] text-parchment/25"
            style={{ marginTop: "1rem", wordBreak: "break-word" }}
          >
            {error.message}
          </p>
        ) : null}
        <div
          className="mt-8 flex flex-wrap justify-center gap-3"
          style={{ alignItems: "center" }}
        >
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 font-sans text-[0.7rem] uppercase tracking-[0.2em] text-ink"
            style={{
              background: "linear-gradient(135deg, oklch(0.79 0.11 82), oklch(0.68 0.08 78))",
              border: "none",
              cursor: "pointer",
              transition: "filter 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border px-6 py-2.5 font-sans text-[0.7rem] uppercase tracking-[0.2em] text-parchment/70 transition-colors hover:text-parchment"
            style={{ borderColor: "oklch(0.96 0.012 85 / 0.15)", textDecoration: "none" }}
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Heritage Gateway — Experience India's History Like Never Before" },
      {
        name: "description",
        content:
          "A cinematic journey through India's iconic monuments, brought together in Heritage Gateway.",
      },
      { name: "author", content: "Heritage Gateway" },
      {
        property: "og:title",
        content: "Heritage Gateway — Experience India's History Like Never Before",
      },
      {
        property: "og:description",
        content:
          "A cinematic journey through India's iconic monuments, brought together in Heritage Gateway.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@heritagegateway" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Jost:wght@300;400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: PageNotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useRouteWarmup();

  return (
    <QueryClientProvider client={queryClient}>
      <UserStateProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </UserStateProvider>
    </QueryClientProvider>
  );
}
