import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

/**
 * Pathless layout for the signed-in experience.
 * Every route under the app shell (profile, explore, monuments, features…)
 * renders inside DashboardShell — sidebar + topbar + animated Outlet.
 */
export const Route = createFileRoute("/_app")({
  component: DashboardShell,
});
