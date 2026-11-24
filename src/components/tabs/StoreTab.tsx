
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  KeyRound,
  Copy,
  Phone,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import {
  finalizePaystackOrder,
  listMyKeys,
} from "@/lib/paystack.functions";
import {
  loadPaystack,
  generateReference,
  PAYSTACK_PUBLIC_KEY,
} from "@/lib/paystack";

const PLANS = [
  {
    id: "monthly" as const,
    name: "Monthly Plan",
    price: 4000,
    tag: "Flexible Billing",
    period: "/ month",
    description: "Great for customers who prefer monthly payments.",
  },
  {
    id: "yearly" as const,
    name: "Yearly Plan",
    price: 19999,
    tag: "Save 58%",
    period: "/ year",
    description: "Enjoy a lower effective monthly cost with annual billing.",
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
      /* Keep existing dashboard state if loading fails */
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function purchase(
    plan: "monthly" | "yearly",
    price: number,
  ) {
    if (!user.email) {
      return toast.error("Email required to purchase");
    }

    setBusy(plan);

    try {
      const Paystack = await loadPaystack();
      const reference = generateReference();

      const handler = Paystack.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: price * 100,
        currency: "NGN",
        ref: reference,
        metadata: {
          plan,
          user_id: user.id,
        },

        callback: (response) => {
          (async () => {
            try {
              const res = await finalize({
                data: {
                  reference: response.reference,
                  plan_type: plan,
                },
              });

              toast.success("Payment verified — your key is ready!");

              await refresh();

              setKeys((prev) => [
                {
                  id: res.reference,
                  plan_type: res.plan_type,
                  reference_id: res.reference,
                  created_at: new Date().toISOString(),
                  api_key_or_config: res.api_key_or_config,
                },
                ...prev.filter(
                  (key) => key.reference_id !== res.reference,
                ),
              ]);
            } catch (err) {
              toast.error(
                err instanceof Error
                  ? err.message
                  : "Payment verification failed",
              );
            } finally {
              setBusy(null);
            }
          })();
        },

        onClose: () => {
          setBusy(null);
        },
      });

      handler.openIframe();
    } catch (err) {
      setBusy(null);

      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to start payment",
      );
    }
  }

  return (
    <div className="space-y-10">
      {/* VPN Services */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              VPN Services
            </h2>

            <p className="text-sm text-foreground/60">
              Secure connectivity for your digital life.
            </p>
          </div>

          <Badge className="bg-primary text-primary-foreground">
            Live
          </Badge>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 shadow-[var(--shadow-panel)] ${plan.highlight
                  ? "border-primary/60 bg-card"
                  : "border-border bg-card"
                }`}
            >
              {plan.highlight && (
                <div className="absolute right-4 top-4">
                  <Badge className="bg-primary text-primary-foreground">
                    Best Value
                  </Badge>
                </div>
              )}

              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                {plan.tag}
              </div>

              <h3 className="mt-2 font-display text-2xl font-bold">
                {plan.name}
              </h3>

              <p className="mt-2 text-sm text-foreground/60">
                {plan.description}
              </p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">
                  ₦{plan.price.toLocaleString("en-NG")}
                </span>

                <span className="text-sm text-foreground/60">
                  {plan.period}
                </span>
              </div>

              {plan.id === "yearly" && (
                <p className="mt-2 text-sm font-medium text-primary">
                  Equivalent to approximately ₦1,667/month
                </p>
              )}

              <div className="my-5 h-px bg-border" />

              <ul className="flex-1 space-y-3 text-sm">
                {FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                      <Check
                        className="h-3.5 w-3.5"
                        strokeWidth={3}
                      />
                    </span>

                    <span className="text-foreground/80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => purchase(plan.id, plan.price)}
                disabled={busy !== null}
                className="mt-7 w-full font-semibold"
                style={{
                  background: "var(--gradient-brand)",
                }}
              >
                {busy === plan.id
                  ? "Processing..."
                  : `Purchase ${plan.name}`}
              </Button>

              <p className="mt-3 text-center text-xs text-foreground/50">
                Secure payment powered by Paystack
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Active VPN Keys */}
      {keys.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl font-bold">
            Your Active Keys
          </h2>

          <div className="space-y-3">
            {keys.map((key) => (
              <div
                key={key.id}
                className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-panel)]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-primary" />

                    <span className="font-medium capitalize">
                      {key.plan_type} Plan
                    </span>

                    <Badge
                      variant="secondary"
                      className="text-[10px] uppercase"
                    >
                      Paid
                    </Badge>
                  </div>

                  <button
                    className="flex items-center gap-1 text-xs text-primary hover:opacity-80"
                    onClick={async () => {
                      if (!key.api_key_or_config) {
                        toast.error("VPN configuration is not available yet");
                        return;
                      }

                      try {
                        await navigator.clipboard.writeText(
                          key.api_key_or_config,
                        );

                        toast.success("Copied to clipboard");
                      } catch {
                        toast.error("Unable to copy configuration");
                      }
                    }}
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                </div>

                <code className="block break-all rounded-md bg-secondary p-3 text-xs text-foreground/80">
                  {key.api_key_or_config ?? "Pending allocation..."}
                </code>

                <p className="mt-1 text-[11px] text-foreground/40">
                  Ref: {key.reference_id}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* One-Time Numbers */}
      <ComingSoonShelf
        icon={Phone}
        title="One-Time Numbers"
        body="Disposable phone numbers for verifications, worldwide."
      />

      {/* E-Books */}
      <ComingSoonShelf
        icon={BookOpen}
        title="E-Books"
        body="Curated privacy & digital library."
      />
    </div>
  );
}

function ComingSoonShelf({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Phone;
  title: string;
  body: string;
}) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">
            {title}
          </h2>

          <p className="text-sm text-foreground/60">
            {body}
          </p>
        </div>

        <Badge
          variant="outline"
          className="border-primary/40 text-primary"
        >
          Coming Soon
        </Badge>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
          <Icon className="h-7 w-7" />
        </div>

        <p className="mt-3 text-sm text-foreground/60">
          This shelf is being stocked. Check back soon.
        </p>
      </div>
    </section>
  );
}
