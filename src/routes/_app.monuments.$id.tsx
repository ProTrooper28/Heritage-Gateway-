import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { MonumentDetailPage } from "@/components/explore/MonumentDetailPage";
import {
  findMonumentByParam,
  slugify,
  type Monument,
} from "@/components/explore/data/monuments";

export const Route = createFileRoute("/_app/monuments/$id")({
  head: () => ({
    meta: [
      { title: "Monument — Heritage Gateway" },
      {
        name: "description",
        content: "Explore the history, architecture, and cultural significance of this monument.",
      },
    ],
  }),
  component: MonumentRouteComponent,
});

function MonumentRouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const monument = findMonumentByParam(id);

  if (!monument) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="mb-4 font-sans text-[0.65rem] uppercase tracking-[0.4em] text-gold/70">
          Monument not found
        </p>
        <h1 className="font-serif text-4xl font-light text-parchment">
          We couldn&apos;t find &ldquo;{id}&rdquo;
        </h1>
        <p className="mt-3 max-w-md font-sans text-sm font-light text-parchment/50">
          It may have been moved or isn&apos;t part of our collection yet.
        </p>
        <Link
          to="/monuments"
          className="mt-8 rounded-xl border border-gold/30 px-7 py-3 font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
        >
          Browse all monuments
        </Link>
      </div>
    );
  }

  const openMonument = (m: Monument) =>
    navigate({ to: "/monuments/$id", params: { id: slugify(m.name) } });

  return (
    <MonumentDetailPage
      monument={monument}
      onBack={() => navigate({ to: "/monuments" })}
      onSelectMonument={openMonument}
    />
  );
}
