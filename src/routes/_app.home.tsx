import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/dashboard/HomePage";

export const Route = createFileRoute("/_app/home")({
  head: () => ({
    meta: [
      { title: "Home — Heritage Gateway" },
      {
        name: "description",
        content:
          "Your gateway to India's heritage — explore monuments, trails, and interactive reconstructions.",
      },
    ],
  }),
  component: HomePage,
});
