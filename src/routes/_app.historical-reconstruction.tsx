import { createFileRoute } from "@tanstack/react-router";
import { HistoricalReconstructionFeaturePage } from "@/features/historical-reconstruction";

export const Route = createFileRoute("/_app/historical-reconstruction")({
  head: () => ({
    meta: [
      { title: "Historical Reconstruction — Heritage Gateway" },
      {
        name: "description",
        content:
          "Step inside interactive 3D reconstructions — rotate the monument, explore its parts, and compare past with present.",
      },
    ],
  }),
  component: HistoricalReconstructionFeaturePage,
});
