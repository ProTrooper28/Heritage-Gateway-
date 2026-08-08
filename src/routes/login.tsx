import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth/AuthCard";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Heritage Gateway" },
      {
        name: "description",
        content:
          "Sign in to Heritage Gateway and continue your journey through India's heritage.",
      },
    ],
  }),
  component: LoginComponent,
});

function LoginComponent() {
  return <AuthCard mode="login" />;
}
