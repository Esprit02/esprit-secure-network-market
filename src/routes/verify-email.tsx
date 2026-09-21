import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, MailCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === "string" ? search.email : "",
  }),
  head: () => ({
    meta: [
      { title: "Verify Your Email — Esprit VPN" },
      { name: "description", content: "Enter the 6-digit code sent to your email to activate your Esprit VPN account." },
      { property: "og:title", content: "Verify Your Email — Esprit VPN" },
      { property: "og:description", content: "Enter the 6-digit code sent to your email to activate your Esprit VPN account." },
    ],
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const navigate = useNavigate();
  const { email: emailParam } = Route.useSearch();
  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (emailParam) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        if (data.user.email_confirmed_at) {
          navigate({ to: "/dashboard", replace: true });
          return;
        }
        setEmail(data.user.email);
      }
    });
  }, [emailParam, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Enter the email you signed up with.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: "signup",
      });
      if (error) throw error;
      toast.success("Email verified — welcome to Esprit VPN!");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid or expired code");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    if (error) toast.error(error.message);
    else toast.success("A new verification code was sent to your email.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A1128] px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-panel p-6 shadow-[var(--shadow-panel)] md:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-red)]"
            style={{ background: "var(--gradient-red)" }}
          >
            <MailCheck className="h-6 w-6" />
          </span>
          <h1 className="font-[Space_Grotesk] text-2xl font-bold">
            Verify your <span className="text-primary">email</span>
          </h1>
          <p className="text-sm text-foreground/70">
            We sent a 6-digit verification code to your email. Enter it below to
            activate your account.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="token">6-digit code</Label>
            <Input
              id="token"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              required
              className="text-center font-mono text-2xl tracking-[0.5em]"
            />
          </div>
          <Button
            type="submit"
            disabled={busy || token.length !== 6}
            className="w-full font-semibold"
            style={{ background: "var(--gradient-red)" }}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            {busy ? "Verifying…" : "Verify Email"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-foreground/60">
          Didn't get the code?{" "}
          <button
            onClick={resend}
            disabled={resending}
            className="font-medium text-primary hover:underline disabled:opacity-50"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
