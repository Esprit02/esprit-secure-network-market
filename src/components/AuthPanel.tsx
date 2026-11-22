import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Globe2, ShieldCheck, Zap, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function AuthPanel() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleGoogleSignIn() {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Password reset link sent — check your email.");
        setMode("signin");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast.success("Account created — check your Gmail to verify your account.");
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
          <Link to="/" aria-label="EspritAccess home">
            <BrandLogo size={34} />
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-10 px-4 py-12 md:flex-row md:py-20">
        <div className="flex-1 space-y-6 md:pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Your Gateway to <span className="text-primary">Digital Access</span>
          </h1>
          <p className="max-w-lg leading-relaxed text-foreground/70">
            One account for VPN services, virtual numbers, digital subscriptions,
            AI tools, privacy products and e-books.
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
          {mode !== "forgot" ? (
            <div className="mb-6 flex rounded-lg bg-secondary p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 rounded-md py-2 font-medium transition ${mode === "signin"
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]"
                    : "text-foreground/70"
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-md py-2 font-medium transition ${mode === "signup"
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]"
                    : "text-foreground/70"
                  }`}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="mb-6 space-y-1">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="inline-flex items-center gap-1 text-xs font-medium text-foreground/60 hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </button>
              <h2 className="text-xl font-bold">Reset your password</h2>
              <p className="text-xs text-foreground/70">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Miller"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            {mode !== "forgot" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={busy}
              className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {busy
                ? "Please wait…"
                : mode === "forgot"
                  ? "Send Reset Link"
                  : mode === "signup"
                    ? "Create Account"
                    : "Sign In"}
            </Button>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-foreground/50">
                <span className="h-px flex-1 bg-border" />
                <span>OR</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={handleGoogleSignIn}
                className="w-full gap-2 font-medium"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
                </svg>
                Continue with Google
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}