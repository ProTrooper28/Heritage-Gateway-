import { createFileRoute } from "@tanstack/react-router";
import { ExploreHeritagePage } from "@/components/explore/ExploreHeritagePage";

export const Route = createFileRoute("/_app/explore")({
  head: () => ({
    meta: [
      { title: "Explore Heritage — Heritage Gateway" },
      {
        name: "description",
        content:
          "Journey through India's most iconic cultural landmarks — temples, forts, caves, and more.",
      },
    ],
  }),
  component: ExploreHeritagePage,
});
