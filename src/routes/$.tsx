import { createFileRoute } from "@tanstack/react-router";
import { PageNotFound } from "@/components/PageNotFound";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [{ title: "Page Not Found — Heritage Gateway" }],
  }),
  component: PageNotFound,
});
