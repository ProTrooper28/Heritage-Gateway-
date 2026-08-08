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
    // Preload a route's chunk + data as soon as the user hovers/focuses its
    // link (or touches it on mobile), so clicks feel instant instead of
    // waiting for a first-time chunk download.
    defaultPreload: "intent",
    defaultPreloadDelay: 0,
    defaultPreloadStaleTime: 0,
    // Swap to the pending component immediately while a lazily-loaded chunk
    // is being fetched — with the default 1000ms, the old page sits frozen
    // on screen, which is the "4–5 second dead navigation" symptom.
    defaultPendingMs: 0,
    defaultPendingComponent: RoutePending,
  });

  return router;
};
