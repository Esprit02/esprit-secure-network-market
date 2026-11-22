import { createFileRoute } from '@tanstack/react-router'
import { Check, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute('/pricing')({
  component: PricingSection,
})

const plans = [
  {
    name: "1-Day Access Pass",
    price: "₦1,500",
    period: "24 hours",
    description: "Instant high-speed residential IP access for quick tasks and testing.",
    features: [
      "High-Speed Residential Proxy",
      "Zero-Log Privacy Policy",
      "Instant Automated Activation",
      "Standard WhatsApp Support",
    ],
    popular: false,
  },
  {
    name: "Monthly Resident Pro",
    price: "₦12,500",
    period: "30 days",
    description: "Our most popular plan for uninterrupted streaming, secure browsing, and work.",
    features: [
      "Dedicated High-Speed Nodes",
      "Advanced WireGuard Protocol",
      "Unlimited Bandwidth",
      "Priority WhatsApp Support",
      "Multi-Device Connection",
    ],
    popular: true,
  },
  {
    name: "Quarterly VIP Pass",
    price: "₦32,000",
    period: "90 days",
    description: "Maximum savings and long-term stability for power users and businesses.",
    features: [
      "Everything in Monthly Pro",
      "Maximum Encryption Tier",
      "Static Residential IP Option",
      "Dedicated Account Manager",
      "Instant Telegram/WhatsApp API",
    ],
    popular: false,
  },
];

function PricingSection() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
          <Zap className="w-3.5 h-3.5" /> Transparent Pricing
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Choose Your Gateway to Digital Access
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
          Lightning-fast residential IPs with instant automated delivery straight to your WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative flex flex-col justify-between rounded-2xl p-8 border transition-all duration-300 ${plan.popular
                ? "bg-card border-emerald-500/50 shadow-2xl shadow-emerald-500/10 scale-105 z-10"
                : "bg-card/60 border-border hover:border-border/80"
              }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider shadow">
                Most Popular
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-muted-foreground mb-6">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-xs text-muted-foreground">/ {plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 text-xs md:text-sm text-foreground/90">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className={`w-full font-semibold py-6 rounded-xl transition-all ${plan.popular
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                }`}
              onClick={() => {
                const text = "Hello EspritAccess, I want to subscribe to " + plan.name + " (" + plan.price + "). Please guide me.";
                window.open("https://wa.me/2348051309239?text=" + encodeURIComponent(text), "_blank");
              }}
            >
              Get Started Now
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}