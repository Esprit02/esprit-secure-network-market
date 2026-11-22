import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MailCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === "string" ? search.email : "",
  }),
  head: () => ({
    meta: [
      { title: "Check Your Email — EspritAccess" },
      {
        name: "description",
        content:
          "Check your inbox and click the verification link to activate your EspritAccess account.",
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email_confirmed_at) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }
      if (!emailParam && data.user?.email) {
        setEmail(data.user.email);
      }
    });
  }, [emailParam, navigate]);

  async function resend() {
    if (!email) {
      toast.error("No email found. Please sign up again.");
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setResending(false);
    if (error) toast.error(error.message);
    else toast.success("Verification link resent — check your Gmail.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-panel)] md:p-8">
        <div className="mb-6 flex flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary shadow-[var(--shadow-brand)]">
            <MailCheck className="h-6 w-6" />
          </span>
          <h1 className="font-display text-2xl font-bold">
            Check your <span className="text-primary">Gmail</span>
          </h1>
          <p className="text-sm leading-relaxed text-foreground/70">
            We sent a verification link to{" "}
            <span className="font-semibold text-foreground">
              {email || "your email"}
            </span>
            . Open your inbox and click the link to activate your account.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={resend}
            disabled={resending}
            className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${resending ? "animate-spin" : ""}`}
            />
            {resending ? "Sending…" : "Resend Verification Link"}
          </Button>

          <Link
            to="/auth"
            className="inline-flex w-full items-center justify-center gap-1.5 py-2 text-sm font-medium text-foreground/60 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </Link>
        </div>

        <p className="mt-4 text-xs text-foreground/50">
          Don&apos;t see it? Check your Spam or Promotions folder.
        </p>
      </div>
    </div>
  );
}