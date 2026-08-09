import { QueryClient } from "@tanstack/react-query";

/**
 * Stable, module-scoped QueryClient shared by the whole application.
 *
 * IMPORTANT — do not read this from `Route.useRouteContext()`.
 *
 * TanStack Router's `useRouteContext()` is implemented as
 * `useMatch({ select: (m) => m.context })`, and `useMatch` returns an empty
 * object `{}` whenever the route's match store is momentarily empty — which
 * happens on every client-side route transition as the router swaps match
 * trees. Reading `queryClient` from that context therefore produced
 * `<QueryClientProvider client={undefined}>` during transitions, and
 * QueryClientProvider's effect calls `client.mount()` unconditionally, throwing
 *
 *   Cannot read properties of undefined (reading 'mount')
 *
 * on every navigation (React logs it 6× per transition and routes it to the
 * error boundary, flashing "This page didn't load" for a second or two).
 *
 * A module-scope instance can never be undefined and its identity never
 * changes, so the provider effect never re-runs and navigation can no longer
 * crash.
 */
export const queryClient = new QueryClient();
