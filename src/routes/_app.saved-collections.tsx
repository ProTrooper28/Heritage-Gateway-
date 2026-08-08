import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SavedCollectionsPage } from "@/components/dashboard/SavedCollectionsPage";

export const Route = createFileRoute("/_app/saved-collections")({
  head: () => ({
    meta: [
      { title: "Saved Collections — Heritage Gateway" },
      {
        name: "description",
        content:
          "Revisit your curated collections of monuments and heritage discoveries.",
      },
    ],
  }),
  component: SavedCollectionsComponent,
});

function SavedCollectionsComponent() {
  const navigate = useNavigate();

  return (
    <SavedCollectionsPage
      onOpenMonument={(id) => navigate({ to: "/monuments/$id", params: { id } })}
      onOpenTrail={() => navigate({ to: "/smart-trails" })}
    />
  );
}
