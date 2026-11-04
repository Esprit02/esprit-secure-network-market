import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — EspritAccess" },
      { name: "description", content: "EspritAccess VPN pricing: Monthly ₦4,000, Yearly ₦14,000. Secure checkout with instant activation." },
      { property: "og:title", content: "Pricing — EspritAccess" },
      { property: "og:description", content: "EspritAccess VPN pricing: Monthly ₦4,000, Yearly ₦14,000. Secure checkout with instant activation." },
    ],
  }),
  component: PricingPage,
});

const FEATURES = [
  "Access to 65,000+ localized decentralized nodes across the world",
  "Built-in malware blocking & secure ad shielding",
  "Anti-detect browser fingerprint protection matrix",
  "High-speed encrypted P2P bandwidth connection",
];

const PLANS = [
  { name: "Monthly Plan", price: "₦4,000", period: "/ month", tag: "Flexible", highlight: false },
  { name: "Yearly Plan", price: "₦14,000", period: "/ year", tag: "Best Value", highlight: true },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" aria-label="EspritAccess home"><BrandLogo size={34} /></Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild className="font-semibold" style={{ background: "var(--gradient-brand)" }}>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">VPN Plans & Pricing</h1>
          <p className="mt-4 text-foreground/70">
            Prices in Nigerian Naira. Purchase happens securely inside your
            dashboard after signing in — your access key is revealed instantly
            after payment.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border bg-card p-8 shadow-[var(--shadow-panel)] ${
                p.highlight ? "border-primary/60" : "border-border"
              }`}
            >
              {p.highlight && (
                <Badge className="absolute right-6 top-6 bg-primary text-primary-foreground">Best Value</Badge>
              )}
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">{p.tag}</div>
              <h2 className="mt-1 text-xl font-bold">{p.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{p.price}</span>
                <span className="text-sm text-foreground/60">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 w-full font-semibold" style={{ background: "var(--gradient-brand)" }}>
                <Link to="/auth">
                  Sign in to purchase <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-foreground/60">
          Checkout is processed securely by Paystack. Your VPN key is revealed
          on your dashboard immediately after a successful payment.
        </p>
      </main>
    </div>
  );
}
