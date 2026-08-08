import { createFileRoute } from "@tanstack/react-router";
import { TimelineExplorer } from "@/components/dashboard/TimelineExplorer";

export const Route = createFileRoute("/_app/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline Explorer — Heritage Gateway" },
      {
        name: "description",
        content:
          "Navigate India's history along an immersive interactive timeline — Heritage Gateway.",
      },
    ],
  }),
  component: TimelineExplorer,
});
