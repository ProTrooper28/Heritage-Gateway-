import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/dashboard/SettingsPage";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Heritage Gateway" },
      {
        name: "description",
        content: "Manage your Heritage Gateway preferences.",
      },
    ],
  }),
  component: SettingsPage,
});
