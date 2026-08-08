import { useEffect } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { DriftWall } from "@/components/heritage/DriftWall";
import { session } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heritage Gateway — Experience India's History Like Never Before" },
      {
        name: "description",
        content:
          "A cinematic journey through India's iconic monuments, brought together in Heritage Gateway.",
      },
      {
        property: "og:title",
        content: "Heritage Gateway — Experience India's History Like Never Before",
      },
      {
        property: "og:description",
        content:
          "A cinematic journey through India's iconic monuments, brought together in Heritage Gateway.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experience,
});

/**
 * Landing experience — the heritage drift wall.
 *
 * With real routing, this page is purely the cinematic entry point:
 *  - the "Login" entry navigates to the /login route,
 *  - visitors who are already authenticated are sent to /home.
 * The dashboard is no longer simulated on this page.
 */
function Experience() {
  const navigate = useNavigate();

  // Client-only session check
  useEffect(() => {
    if (session.isAuthenticated()) {
      navigate({ to: "/home" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-ink">
      <DriftWall onOpenLogin={() => navigate({ to: "/login" })} />

      {/* Header — Login entry */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-end px-[4vw] py-8">
        <Link
          to="/login"
          className="pointer-events-auto flex items-center gap-2 font-sans text-[0.8rem] uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
        >
          Login <span className="text-gold">&rarr;</span>
        </Link>
      </header>
    </main>
  );
}
