
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  ShieldCheck,
  Globe,
  ArrowLeft,
  Zap,
  LockKeyhole,
} from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingSection,
});

const plans = [
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 4000,
    period: "month",
    description:
      "Flexible monthly access to EspritAccess VPN services.",
    features: [
      "30-day subscription period",
      "Encrypted VPN connectivity",
      "VPN configuration access, when provisioned",
      "Account and subscription management",
      "Customer support",
    ],
    popular: false,
  },
  {
    id: "yearly",
    name: "Annual Plan",
    price: 19999,
    period: "year",
    description:
      "One annual payment for customers who prefer long-term access.",
    features: [
      "12-month subscription period",
      "Encrypted VPN connectivity",
      "VPN configuration access, when provisioned",
      "Account and subscription management",
      "Customer support",
    ],
    popular: true,
  },
];

function PricingSection() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#040711] text-slate-100">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.05),transparent_55%)]" />

      {/* Navigation */}
      <header className="sticky top-3 z-40 mx-auto w-full max-w-7xl px-3 sm:px-6">
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#090f1d]/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-base font-bold"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#10B981] text-xs font-black text-[#040711]">
              EA
            </span>

            <span className="text-white">
              Esprit<span className="text-emerald-400">Access</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#050811] px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-3 pb-20 pt-12 sm:px-6">
        {/* Introduction */}
        <div className="mb-12 rounded-3xl border border-white/[0.08] bg-[#090f1d]/85 px-6 py-12 text-center shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Simple and Transparent Pricing
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Choose Your VPN Plan
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
            Straightforward subscription options for secure digital
            connectivity. Choose monthly flexibility or annual access.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-7 backdrop-blur-xl transition-all duration-300 sm:p-8 ${plan.popular
                ? "border-emerald-400/45 bg-[#090f1d]/95 shadow-[0_24px_70px_rgba(16,185,129,0.12)]"
                : "border-white/[0.08] bg-[#090f1d]/85 shadow-[0_18px_50px_rgba(0,0,0,0.6)] hover:-translate-y-1 hover:border-emerald-400/30"
                }`}
            >
              {plan.popular && (
                <span className="absolute right-5 top-5 rounded-full bg-[#10B981] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#040711]">
                  Best Value
                </span>
              )}

              <div>
                <div className="mb-5 flex items-center gap-2">
                  {plan.id === "yearly" ? (
                    <Zap className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Globe className="h-5 w-5 text-emerald-400" />
                  )}

                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                    {plan.period} subscription
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white">
                  {plan.name}
                </h2>

                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                  {plan.description}
                </p>

                <div className="mb-6 mt-7 flex items-baseline gap-2 border-b border-white/[0.08] pb-6">
                  <span className="text-4xl font-extrabold tracking-tight text-white">
                    ₦{plan.price.toLocaleString("en-NG")}
                  </span>

                  <span className="text-sm text-slate-400">
                    / {plan.period}
                  </span>
                </div>

                {plan.id === "yearly" && (
                  <p className="mb-5 text-sm font-medium text-emerald-400">
                    Approximately ₦1,667 per month
                  </p>
                )}

                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-200"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      </span>

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/dashboard"
                className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-all ${plan.popular
                  ? "bg-[#10B981] text-[#040711] shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
                  : "border border-white/[0.1] bg-[#050811] text-white hover:border-emerald-400/40"
                  }`}
              >
                Choose {plan.name}
              </Link>

              <p className="mt-4 text-center text-xs text-slate-500">
                Continue to your account to purchase securely.
              </p>
            </article>
          ))}
        </div>

        {/* Trust information */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-[#090f1d]/70 p-5 text-center">
            <LockKeyhole className="mx-auto mb-3 h-6 w-6 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Secure Payments
            </h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Payments are processed through Paystack.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#090f1d]/70 p-5 text-center">
            <ShieldCheck className="mx-auto mb-3 h-6 w-6 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Account Control
            </h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Manage your account and subscription through your dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#090f1d]/70 p-5 text-center">
            <Globe className="mx-auto mb-3 h-6 w-6 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Digital Access
            </h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              EspritAccess is building a gateway to useful digital services.
            </p>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-6 text-slate-500">
          Subscription duration and service availability are subject to
          the applicable plan terms. VPN configuration is provided when
          provisioning is available.
        </p>
      </section>
    </main>
  );
}
