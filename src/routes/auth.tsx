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
        navigate({ to: "/dashboard" });
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (signUpError) throw signUpError;
        navigate({ to: "/verify-email", search: { email } as any });
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please try again.");
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
    if (oauthError) setError(oauthError.message);
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      {/* Top Navbar */}
      <header className="border-b border-blue-500/15 bg-[#030712]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.7)]">
              EA
            </span>
            <span className="text-white">
              Esprit<span className="text-blue-400">Access</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-14 lg:grid-cols-2 lg:py-20">
        {/* Left Info Column */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-blue-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Your Gateway to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Digital Access
            </span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            One account for VPN services, virtual numbers, digital
            subscriptions, AI tools, privacy products, and e-books.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              { icon: Globe, text: "Fast, encrypted connections" },
              { icon: ShieldCheck, text: "Privacy and security first" },
              { icon: Zap, text: "Instant activation after payment" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.text} className="flex items-center gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-slate-200">
                    {item.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Auth Card */}
        <div className="rounded-2xl border border-blue-500/25 bg-[#070f24] p-6 shadow-[0_0_40px_rgba(37,99,235,0.15)] sm:p-8">
          <div className="grid grid-cols-2 rounded-xl border border-blue-500/20 bg-[#030712] p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-lg py-2 text-xs font-bold transition ${mode === "signin"
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-lg py-2 text-xs font-bold transition ${mode === "signup"
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/50 px-3.5 py-2.5 text-xs text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-blue-500/20 bg-[#030712] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-blue-500/20 bg-[#030712] px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
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
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] transition hover:bg-blue-500 disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[11px] text-slate-500">
            <div className="h-px flex-1 bg-blue-500/15" />
            OR
            <div className="h-px flex-1 bg-blue-500/15" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/25 bg-[#030712] py-2.5 text-sm font-semibold text-white transition hover:border-blue-400"
          >
            Continue with Google
          </button>
        </div>
      </main>
    </div>
  );
}