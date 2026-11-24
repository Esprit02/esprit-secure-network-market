import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Globe, ShieldCheck, Zap, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        await navigate({ to: "/dashboard" });
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (signUpError) throw signUpError;
        await navigate({
          to: "/verify-email",
          search: { email },
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#040711] text-slate-100">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.06),transparent_55%)]" />

      {/* Floating Glass Navbar */}
      <header className="sticky top-3 z-40 mx-auto w-full max-w-6xl px-3 sm:px-6">
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#090f1d]/80 px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#10B981] text-xs font-black text-[#040711]">
              EA
            </span>
            <span className="text-white">
              Esprit<span className="text-emerald-400">Access</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#050811]/90 px-4 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 px-3 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
        {/* Left Info Column */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#090f1d]/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-emerald-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your Gateway to{" "}
            <span className="text-emerald-400">Digital Access</span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            One account for VPN services, virtual numbers, digital
            subscriptions, AI tools, privacy products, and e-books.
          </p>

          <ul className="mt-7 space-y-3.5">
            {[
              { icon: Globe, text: "Encrypted connections across supported devices" },
              { icon: ShieldCheck, text: "Account and billing clarity first" },
              { icon: Zap, text: "Fast activation after payment" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.text}
                  className="flex items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-[#050811]/80 p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-slate-200 sm:text-sm">
                    {item.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Floating Auth Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#090f1d]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-8">
          <div className="grid grid-cols-2 rounded-full border border-white/[0.08] bg-[#050811] p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-full py-2 text-xs font-bold transition ${mode === "signin"
                  ? "bg-[#10B981] text-[#040711]"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full py-2 text-xs font-bold transition ${mode === "signup"
                  ? "bg-[#10B981] text-[#040711]"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2.5 text-xs text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="auth-email"
                className="block text-xs font-semibold text-slate-300"
              >
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#050811] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400/50 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="block text-xs font-semibold text-slate-300"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#050811] px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:border-emerald-400/50 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#10B981] py-3 text-sm font-bold text-[#040711] transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[11px] text-slate-500">
            <div className="h-px flex-1 bg-white/[0.08]" />
            OR
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-[#050811] py-2.5 text-sm font-semibold text-white transition hover:border-emerald-400/40"
          >
            Continue with Google
          </button>
        </div>
      </main>
    </div>
  );
}