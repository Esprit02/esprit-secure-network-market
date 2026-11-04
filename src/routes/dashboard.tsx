import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Dashboard } from "@/components/Dashboard";
import logoPulse from "@/assets/logo-mark.png";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — EspritAccess" },
      { name: "description", content: "Your EspritAccess client portal: browse services, purchase plans, and manage your profile." },
      { property: "og:title", content: "Dashboard — EspritAccess" },
      { property: "og:description", content: "Your EspritAccess client portal: browse services, purchase plans, and manage your profile." },
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <img src={logoPulse} alt="" className="h-16 w-16 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
