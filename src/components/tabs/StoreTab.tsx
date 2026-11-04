import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, KeyRound, Copy, Phone, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { finalizePaystackOrder, listMyKeys } from "@/lib/paystack.functions";
import { loadPaystack, generateReference, PAYSTACK_PUBLIC_KEY } from "@/lib/paystack";

const PLANS = [
  {
    id: "monthly" as const,
    name: "Monthly Plan",
    price: 4000,
    tag: "Best to try",
    period: "/ month",
  },
  {
    id: "yearly" as const,
    name: "Yearly Plan",
    price: 14000,
    tag: "Save 70%",
    period: "/ year",
    highlight: true,
  },
];

const FEATURES = [
  "Access to 65,000+ localized decentralized nodes across the world",
  "Built-in malware blocking & secure ad shielding",
  "Anti-detect browser fingerprint protection matrix",
  "High-speed encrypted P2P bandwidth connection",
];

type MyKey = {
  id: string;
  plan_type: string;
  reference_id: string | null;
  created_at: string;
  api_key_or_config: string | null;
};

export function StoreTab({ user }: { user: User }) {
  const finalize = useServerFn(finalizePaystackOrder);
  const listKeys = useServerFn(listMyKeys);
  const [busy, setBusy] = useState<"monthly" | "yearly" | null>(null);
  const [keys, setKeys] = useState<MyKey[]>([]);

  async function refresh() {
    try {
      const rows = await listKeys();
      setKeys(rows as MyKey[]);
    } catch {
      /* silent */
    }
  }

  useEffect(() => { refresh(); }, []);

  async function purchase(plan: "monthly" | "yearly", price: number) {
    if (!user.email) return toast.error("Email required to purchase");
    setBusy(plan);
    try {
      const Paystack = await loadPaystack();
      const reference = generateReference();
      const handler = Paystack.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: price * 100, // kobo
        currency: "NGN",
        ref: reference,
        metadata: { plan, user_id: user.id },
        callback: (response) => {
          (async () => {
            try {
              const res = await finalize({ data: { reference: response.reference, plan_type: plan } });
              toast.success("Payment verified — your key is ready!");
              await refresh();
              // Also reveal immediately
              setKeys((prev) => [
                {
                  id: res.reference,
                  plan_type: res.plan_type,
                  reference_id: res.reference,
                  created_at: new Date().toISOString(),
                  api_key_or_config: res.api_key_or_config,
                },
                ...prev.filter((k) => k.reference_id !== res.reference),
              ]);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Verification failed");
            } finally {
              setBusy(null);
            }
          })();
        },
        onClose: () => setBusy(null),
      });
      handler.openIframe();
    } catch (err) {
      setBusy(null);
      toast.error(err instanceof Error ? err.message : "Unable to start payment");
    }
  }

  return (
    <div className="space-y-10">
      {/* Shelf 1: VPN Services */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">VPN Services</h2>
            <p className="text-sm text-foreground/60">Active · Purchase and get instant access.</p>
          </div>
          <Badge className="bg-primary text-primary-foreground">Live</Badge>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-2xl border p-6 shadow-[var(--shadow-panel)] ${
                p.highlight ? "border-primary/60" : "border-border"
              } bg-card`}
            >
              {p.highlight && (
                <div className="absolute -right-14 top-6 rotate-45 bg-primary px-14 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow">
                  Best Value
                </div>
              )}
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">{p.tag}</div>
              <h3 className="mt-1 font-display text-2xl font-bold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">₦{p.price.toLocaleString()}</span>
                <span className="text-sm text-foreground/60">{p.period}</span>
              </div>
              <ul className="mt-5 space-y-3 text-sm">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => purchase(p.id, p.price)}
                disabled={busy !== null}
                className="mt-6 w-full font-semibold"
                style={{ background: "var(--gradient-brand)" }}
              >
                {busy === p.id ? "Processing…" : "Purchase Now"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Your keys */}
      {keys.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl font-bold">Your Active Keys</h2>
          <div className="space-y-3">
            {keys.map((k) => (
              <div key={k.id} className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-panel)]">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-primary" />
                    <span className="font-medium capitalize">{k.plan_type} Plan</span>
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      Paid
                    </Badge>
                  </div>
                  <button
                    className="flex items-center gap-1 text-xs text-primary hover:opacity-80"
                    onClick={() => {
                      if (k.api_key_or_config) {
                        navigator.clipboard.writeText(k.api_key_or_config);
                        toast.success("Copied to clipboard");
                      }
                    }}
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
                <code className="block break-all rounded-md bg-secondary p-3 text-xs text-foreground/80">
                  {k.api_key_or_config ?? "Pending allocation…"}
                </code>
                <p className="mt-1 text-[11px] text-foreground/40">Ref: {k.reference_id}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shelf 2: One-Time Numbers */}
      <ComingSoonShelf icon={Phone} title="One-Time Numbers" body="Disposable phone numbers for verifications, worldwide." />

      {/* Shelf 3: E-Books */}
      <ComingSoonShelf icon={BookOpen} title="E-Books" body="Curated privacy & digital library." />
    </div>
  );
}

function ComingSoonShelf({ icon: Icon, title, body }: { icon: typeof Phone; title: string; body: string }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <p className="text-sm text-foreground/60">{body}</p>
        </div>
        <Badge variant="outline" className="border-primary/40 text-primary">Coming Soon</Badge>
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
          <Icon className="h-7 w-7" />
        </div>
        <p className="mt-3 text-sm text-foreground/60">This shelf is being stocked. Check back soon.</p>
      </div>
    </section>
  );
}
