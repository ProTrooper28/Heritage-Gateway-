import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth/AuthCard";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Heritage Gateway" },
      {
        name: "description",
        content:
          "Create your Heritage Gateway account and begin exploring India's timeless monuments.",
      },
    ],
  }),
  component: SignupComponent,
});

function SignupComponent() {
  return <AuthCard mode="signup" />;
}
