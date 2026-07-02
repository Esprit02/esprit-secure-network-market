import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { AuthPanel } from "@/components/AuthPanel";
import { Dashboard } from "@/components/Dashboard";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const emailVerified = !!user?.email_confirmed_at;

  const resendVerification = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
    if (error) toast.error(error.message);
    else toast.success("Verification email sent");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A1128] text-foreground/70">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A1128]">
        <AuthPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1128]">
      <AppHeader email={user.email ?? null} emailVerified={emailVerified} onVerify={resendVerification} />
      <Dashboard user={user} />
    </div>
  );
}
