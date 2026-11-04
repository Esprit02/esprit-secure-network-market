import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Globe2, ShieldCheck, Zap, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" aria-label="EspritAccess home"><BrandLogo size={34} /></Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-10 px-4 py-12 md:flex-row md:py-20">
        <div className="flex-1 space-y-6 md:pt-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Your Gateway to <span className="text-primary">Digital Access</span>
          </h1>
          <p className="max-w-lg leading-relaxed text-foreground/70">
            One account for VPN services, virtual numbers, digital
            subscriptions, AI tools, privacy products and e-books.
          </p>
          <ul className="grid gap-3 text-sm text-foreground/80">
            {[
              [Globe2, "Fast, encrypted connections"],
              [ShieldCheck, "Privacy and security first"],
              [Zap, "Instant activation after payment"],
            ].map(([Icon, txt]) => {
              const I = Icon as typeof Globe2;
              return (
                <li key={txt as string} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
                    <I className="h-4 w-4" />
                  </span>
                  {txt as string}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-panel)] md:p-8">
          <div className="mb-6 flex rounded-lg bg-secondary p-1 text-sm">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-md py-2 font-medium transition ${
                mode === "signin" ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]" : "text-foreground/70"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-md py-2 font-medium transition ${
                mode === "signup" ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]" : "text-foreground/70"
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
            <Button type="submit" disabled={busy} className="w-full font-semibold" style={{ background: "var(--gradient-brand)" }}>
              {busy ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
