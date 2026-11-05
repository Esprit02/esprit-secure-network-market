import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { ShieldCheck, ShieldAlert, Check, X } from "lucide-react";

export const Route = createFileRoute("/.lovable/oauth/consent")({
  // SSR has no localStorage session and would redirect signed-in users.
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s["authorization_id"] === "string" ? s["authorization_id"] : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/auth", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-panel)]">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <h1 className="font-display text-xl font-bold text-foreground">Connection request unavailable</h1>
        <p className="text-sm text-foreground/70">
          Could not load this authorization request: {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    </main>
  ),
});

type ConsentDetails = Awaited<ReturnType<ReturnType<typeof Route.useLoaderData> extends never ? never : never>>;

function Consent() {
  const details = Route.useLoaderData() as ConsentDetails | null;
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, []);

  const clientName = details?.client?.name ?? "this app";
  const redirectUri = details?.client?.redirect_uris?.[0] ?? null;
  const scopes = (details?.scopes ?? []) as string[];

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await supabase.auth.oauth.approveAuthorization(authorization_id)
      : await supabase.auth.oauth.denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect was returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-panel)] md:p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <BrandLogo size={40} />
          <h1 className="font-display text-2xl font-bold leading-tight">
            Connect <span className="text-primary">{clientName}</span> to your account
          </h1>
          <p className="text-sm text-foreground/70">
            {clientName} will be able to call this app's enabled tools while you are signed in.
          </p>
        </div>

        <dl className="space-y-3 rounded-xl border border-border bg-secondary/60 p-4 text-sm">
          {userEmail && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-foreground/60">Signed in as</dt>
              <dd className="font-medium text-foreground">{userEmail}</dd>
            </div>
          )}
          {redirectUri && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-foreground/60">Connects from</dt>
              <dd className="max-w-[60%] truncate font-medium text-foreground" title={redirectUri}>
                {redirectUri}
              </dd>
            </div>
          )}
          <div className="space-y-1.5">
            <dt className="text-foreground/60">This will share</dt>
            <dd>
              {scopes.length > 0 ? (
                <ul className="space-y-1">
                  {scopes.map((scope) => (
                    <li key={scope} className="flex items-center gap-2 text-foreground/80">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span>{scopeLabel(scope)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-foreground/80">Your basic identity</span>
              )}
            </dd>
          </div>
        </dl>

        <p className="text-xs text-foreground/60">
          This does not bypass this app's permissions or backend policies — what {clientName} can reach is still
          limited to your own account's data.
        </p>

        {error && (
          <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => decide(true)}
            disabled={busy}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--gradient-brand)" }}
          >
            <ShieldCheck className="mr-2 inline h-4 w-4" />
            {busy ? "Working…" : "Approve connection"}
          </button>
          <button
            onClick={() => decide(false)}
            disabled={busy}
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent disabled:opacity-60"
          >
            <X className="mr-2 inline h-4 w-4" />
            Cancel connection
          </button>
        </div>
      </div>
    </main>
  );
}

function scopeLabel(scope: string): string {
  switch (scope) {
    case "openid":
      return "Confirm your identity";
    case "email":
      return "Share your email address";
    case "profile":
      return "Share your basic profile";
    default:
      return `Additional permission requested: ${scope}`;
  }
}
