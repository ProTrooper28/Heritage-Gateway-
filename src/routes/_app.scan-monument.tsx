import { createFileRoute } from "@tanstack/react-router";
import { ScanMonumentFeaturePage } from "@/features/scan-monument";

export const Route = createFileRoute("/_app/scan-monument")({
  head: () => ({
    meta: [
      { title: "Scan Monument — Heritage Gateway" },
      {
        name: "description",
        content: "Identify Indian monuments with AI-powered vision.",
      },
    ],
  }),
  component: ScanMonumentFeaturePage,
});
