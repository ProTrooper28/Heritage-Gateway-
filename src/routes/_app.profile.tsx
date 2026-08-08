import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/dashboard/ProfilePage";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Heritage Gateway" },
      {
        name: "description",
        content:
          "Your Heritage Gateway profile — saved monuments, recent explorations, and bookmarks.",
      },
    ],
  }),
  component: ProfilePage,
});
