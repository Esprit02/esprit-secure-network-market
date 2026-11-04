import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/AuthPanel";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — EspritAccess" },
      { name: "description", content: "Sign in to your EspritAccess account or create a new one." },
      { property: "og:title", content: "Sign In — EspritAccess" },
      { property: "og:description", content: "Sign in to your EspritAccess account or create a new one." },
    ],
  }),
  component: () => <AuthPanel />,
});
