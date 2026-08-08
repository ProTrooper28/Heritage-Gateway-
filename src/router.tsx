import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { RoutePending } from "@/components/RoutePending";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Preloading is handled by the lightweight route warmup in __root (eager,
    // once, 350ms after first paint) — NOT by per-link hover preloading.
    //
    // `defaultPreload: "intent"` + zero delay + zero stale time caused a race
    // in production: hovering a nav link started a route preload, then clicking
    // the link while that preload was still downloading started a second,
    // competing load of the same route. The superseded load threw, the match
    // errored, and the "This page didn't load" boundary flashed for ~1s before
    // the page recovered. Keep preloads off per-link to make navigation
    // deterministic; the pending component below shows instantly instead.
    defaultPreload: false,
    // Swap to the pending component immediately while a lazily-loaded chunk
    // is being fetched — with the default 1000ms, the old page sits frozen
    // on screen.
    defaultPendingMs: 0,
    defaultPendingComponent: RoutePending,
  });

  return router;
};
