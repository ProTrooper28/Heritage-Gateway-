import { createFileRoute } from "@tanstack/react-router";
import { AIHistorian } from "@/components/dashboard/AIHistorian";

export const Route = createFileRoute("/_app/ai-historian")({
  head: () => ({
    meta: [
      { title: "AI Historian — Heritage Gateway" },
      {
        name: "description",
        content:
          "Converse with a personalized heritage guide powered by centuries of archives.",
      },
    ],
  }),
  component: AIHistorian,
});
