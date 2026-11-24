
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  MailCheck,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === "string" ? search.email : "",
  }),
  head: () => ({
    meta: [
      { title: "Verify Your Email — EspritAccess" },
      {
        name: "description",
        content:
          "Verify your email address to activate your EspritAccess account and access your digital services.",
      },
    ],
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const navigate = useNavigate();
  const { email: emailParam } = Route.useSearch();

  const [email, setEmail] = useState(emailParam);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(true);

  // Check whether the current user has already verified their email
  useEffect(() => {
    let active = true;

    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (!error && data.user?.email_confirmed_at) {
        void navigate({ to: "/dashboard", replace: true });
        return;
      }

      if (!emailParam && data.user?.email) {
        setEmail(data.user.email);
      }

      setChecking(false);
    }

    void checkUser();

    return () => {
      active = false;
    };
  }, [emailParam, navigate]);

  // Resend cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function resend() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Email address not found. Please sign up again.");
      return;
    }

    if (cooldown > 0 || resending) return;

    setResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: trimmedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Verification email sent. Check your inbox.");
        setCooldown(30);
      }
    } catch {
      toast.error("Unable to send verification email. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#040711] px-4 py-16 text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.06),transparent_55%)]" />

      {/* Verification card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#090f1d]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-8">

        {/* Brand */}
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981] text-xs font-black text-[#040711]">
            EA
          </span>
          <span className="text-base font-bold text-white">
            Esprit<span className="text-emerald-400">Access</span>
          </span>
        </Link>

        {/* Icon */}
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
            <MailCheck className="h-8 w-8 text-emerald-400" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Verify your <span className="text-emerald-400">Email</span>
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              You're almost there. We sent a verification link to
              your email address. Verify your email to complete your
              EspritAccess registration.
            </p>
          </div>
        </div>

        {/* Email display */}
        <div className="mb-6 rounded-2xl border border-white/[0.08] bg-[#050811]/80 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <Mail className="h-5 w-5 text-emerald-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">
                Verification sent to
              </p>
              <p className="mt-1 break-all text-sm font-semibold text-white">
                {email || "Your email address"}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-400">
          <p>
            <span className="font-semibold text-slate-200">
              1.
            </span>{" "}
            Open your email inbox.
          </p>

          <p>
            <span className="font-semibold text-slate-200">
              2.
            </span>{" "}
            Find the verification email from EspritAccess.
          </p>

          <p>
            <span className="font-semibold text-slate-200">
              3.
            </span>{" "}
            Click the verification link to activate your account.
          </p>
        </div>

        {/* Resend */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={resend}
            disabled={resending || cooldown > 0 || checking}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#10B981] py-3 text-sm font-bold text-[#040711] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${resending ? "animate-spin" : ""
                }`}
            />

            {resending
              ? "Sending..."
              : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : "Resend Verification Email"}
          </button>

          <Link
            to="/auth"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-[#050811]/90 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>

        {/* Help */}
        <div className="mt-6 border-t border-white/[0.06] pt-5">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

            <p className="text-xs leading-relaxed text-slate-500">
              If you don't see the email, check your Spam or Promotions
              folder. If the problem persists, contact EspritAccess
              support.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-slate-600">
          EspritAccess — Your Gateway to Digital Access
        </p>
      </div>
    </div>
  );
}
