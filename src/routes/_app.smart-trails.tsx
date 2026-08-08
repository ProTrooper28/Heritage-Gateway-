import { createFileRoute } from "@tanstack/react-router";
import { SmartTrailsFeaturePage } from "@/features/smart-trails";

export const Route = createFileRoute("/_app/smart-trails")({
  head: () => ({
    meta: [
      { title: "Smart Heritage Trails — Heritage Gateway" },
      {
        name: "description",
        content:
          "Discover intelligently curated heritage journeys based on your interests, available time, and destination.",
      },
    ],
  }),
  component: SmartTrailsFeaturePage,
});
