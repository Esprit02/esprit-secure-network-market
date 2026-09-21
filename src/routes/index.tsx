import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthPanel } from "@/components/AuthPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Esprit VPN — Own Your Traffic" },
      { name: "description", content: "Premium decentralized VPN with 65,000+ localized nodes, malware blocking, and high-speed encrypted P2P bandwidth." },
      { property: "og:title", content: "Esprit VPN — Own Your Traffic" },
      { property: "og:description", content: "Premium decentralized VPN with 65,000+ localized nodes, malware blocking, and high-speed encrypted P2P bandwidth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const u = data.user;
      if (u?.email_confirmed_at) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }
      if (u && !u.email_confirmed_at) {
        navigate({
          to: "/verify-email",
          search: { email: u.email ?? "" },
          replace: true,
        });
        return;
      }
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!active) return;
      const u = session?.user;
      if (u?.email_confirmed_at) navigate({ to: "/dashboard", replace: true });
      else if (u)
        navigate({
          to: "/verify-email",
          search: { email: u.email ?? "" },
          replace: true,
        });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A1128] text-foreground/70">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1128]">
      <AuthPanel />
    </div>
  );
}
