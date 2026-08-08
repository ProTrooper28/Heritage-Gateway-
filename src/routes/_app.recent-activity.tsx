import { createFileRoute } from "@tanstack/react-router";
import { RecentActivityPage } from "@/components/dashboard/RecentActivityPage";

export const Route = createFileRoute("/_app/recent-activity")({
  head: () => ({
    meta: [
      { title: "Recent Activity — Heritage Gateway" },
      {
        name: "description",
        content: "Your latest explorations across Heritage Gateway.",
      },
    ],
  }),
  component: RecentActivityPage,
});
