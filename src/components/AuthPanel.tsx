import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Zap, Globe2 } from "lucide-react";
import { toast } from "sonner";

export function AuthPanel() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: "https://espritaccess.com.ng/dashboard",
          },
        });
        if (error) throw error;
        toast.success("Account created — enter the code we emailed you.");
        navigate({ to: "/verify-email", search: { email } });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user?.email_confirmed_at) {
          navigate({ to: "/dashboard" });
        } else {
          navigate({ to: "/verify-email", search: { email } });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-4 py-16 md:flex-row">
      <div className="flex-1 space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
          Decentralized · Private · Fast
        </div>
        <h1 className="font-[Space_Grotesk] text-4xl font-bold leading-tight md:text-6xl">
          Esprit <span className="text-primary">VPN</span>
          <br />
          <span className="text-foreground/80">Own your traffic.</span>
        </h1>
        <p className="max-w-xl text-foreground/70">
          65,000+ localized decentralized nodes, malware-blocking, anti-detect
          fingerprint protection, and high-speed encrypted P2P bandwidth — all
          in one premium client portal.
        </p>
        <ul className="grid gap-3 text-sm text-foreground/80">
          {[
            [Globe2, "65,000+ nodes across the world"],
            [ShieldCheck, "Malware blocking & ad shielding"],
            [Zap, "High-speed P2P encrypted bandwidth"],
          ].map(([Icon, txt], i) => {
            const I = Icon as typeof Globe2;
            return (
              <li key={i} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <I className="h-4 w-4" />
                </span>
                {txt as string}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="w-full max-w-md rounded-2xl border border-border bg-panel p-6 shadow-[var(--shadow-panel)] md:p-8">
        <div className="mb-6 flex rounded-lg bg-secondary p-1 text-sm">
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-md py-2 font-medium transition ${
              mode === "signin" ? "bg-primary text-primary-foreground shadow-[var(--shadow-red)]" : "text-foreground/70"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-md py-2 font-medium transition ${
              mode === "signup" ? "bg-primary text-primary-foreground shadow-[var(--shadow-red)]" : "text-foreground/70"
            }`}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Miller" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          </div>
          <Button type="submit" disabled={busy} className="w-full font-semibold" style={{ background: "var(--gradient-red)" }}>
            {busy ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
