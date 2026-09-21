import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Dashboard } from "@/components/Dashboard";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — Esprit VPN" },
      { name: "description", content: "Your Esprit VPN client portal: browse nodes, purchase plans, and manage your profile." },
      { property: "og:title", content: "Dashboard — Esprit VPN" },
      { property: "og:description", content: "Your Esprit VPN client portal: browse nodes, purchase plans, and manage your profile." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const u = data.user;
      if (!u) {
        navigate({ to: "/", replace: true });
        return;
      }
      if (!u.email_confirmed_at) {
        navigate({
          to: "/verify-email",
          search: { email: u.email ?? "" },
          replace: true,
        });
        return;
      }
      setUser(u);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!active) return;
      if (!session?.user) navigate({ to: "/", replace: true });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A1128] text-foreground/70">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1128]">
      <AppHeader
        email={user.email ?? null}
        emailVerified={!!user.email_confirmed_at}
        onVerify={() =>
          navigate({ to: "/verify-email", search: { email: user.email ?? "" } })
        }
      />
      <Dashboard user={user} />
    </div>
  );
}
