import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExploreHomeView } from "@/components/explore/ExploreHomeView";
import { slugify, type Monument } from "@/components/explore/data/monuments";

export const Route = createFileRoute("/_app/monuments")({
  head: () => ({
    meta: [
      { title: "Monuments — Heritage Gateway" },
      {
        name: "description",
        content:
          "Discover India's timeless monuments — search by name, city, or state and explore UNESCO sites.",
      },
    ],
  }),
  component: MonumentsComponent,
});

function MonumentsComponent() {
  const navigate = useNavigate();

  const handleSelect = (monument: Monument) => {
    navigate({ to: "/monuments/$id", params: { id: slugify(monument.name) } });
  };

  return <ExploreHomeView onSelectMonument={handleSelect} />;
}
