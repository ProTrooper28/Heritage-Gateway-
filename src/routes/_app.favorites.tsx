import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FavoritesPage } from "@/components/dashboard/FavoritesPage";

export const Route = createFileRoute("/_app/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — Heritage Gateway" },
      {
        name: "description",
        content: "Your personally starred monuments, always one tap away.",
      },
    ],
  }),
  component: FavoritesComponent,
});

function FavoritesComponent() {
  const navigate = useNavigate();

  return (
    <FavoritesPage
      onOpenMonument={(id) => navigate({ to: "/monuments/$id", params: { id } })}
    />
  );
}
