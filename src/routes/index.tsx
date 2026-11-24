import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ShieldCheck,
    Globe,
    Smartphone,
    CreditCard,
    ArrowRight,
    CheckCircle2,
    Mail,
} from "lucide-react";
import { PRICING_PLANS, SUPPORT_EMAIL } from "../espritTrust";

export const Route = createFileRoute("/")({
    component: IndexRoute,
});

function IndexRoute() {
    return (
        <div className="min-h-screen bg-[#0c192c] text-slate-100">
            {/* Top Navigation */}
            <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#142B4A]/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link to="/" className="flex items-center gap-2.5 text-lg font-bold">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981] text-xs font-black text-[#0c192c]">
                            EA
                        </span>
                        <span className="text-white">
                            Esprit<span className="text-emerald-400">Access</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
                        <a href="#services" className="transition hover:text-emerald-400">
                            Services
                        </a>
                        <a href="#pricing" className="transition hover:text-emerald-400">
                            Pricing
                        </a>
                        <Link to="/setup-guide" className="transition hover:text-emerald-400">
                            Setup Guide
                        </Link>
                        <Link to="/faq" className="transition hover:text-emerald-400">
                            FAQ
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/auth"
                            className="rounded-lg border border-slate-600 px-3.5 py-2 text-xs font-semibold text-slate-100 transition hover:border-emerald-400"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/dashboard"
                            className="rounded-lg bg-[#10B981] px-4 py-2 text-xs font-bold text-[#0c192c] transition hover:bg-emerald-400"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
                <div className="max-w-3xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Unified Digital Access &amp; Connectivity
                    </span>

                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Reliable Connectivity &amp;{" "}
                        <span className="text-emerald-400">Digital Tools</span> in One
                        Account
                    </h1>

                    <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
                        Manage VPN configurations, virtual numbers, and digital resources
                        from one clear dashboard with transparent monthly and annual
                        billing.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                            to="/auth"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-6 py-3.5 text-sm font-bold text-[#0c192c] transition hover:bg-emerald-400"
                        >
                            Create Account
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            to="/setup-guide"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-[#142B4A] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-emerald-400"
                        >
                            View Setup Guide
                        </Link>
                    </div>
                </div>
            </section>

            {/* Core Services */}
            <section
                id="services"
                className="border-y border-slate-800 bg-[#142B4A]/45 py-16"
            >
                <div className="mx-auto max-w-6xl px-6">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        Everything Managed From One Dashboard
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                        Clear separation between your active VPN setup and your subscription
                        billing records.
                    </p>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
                            <Globe className="h-6 w-6 text-emerald-400" />
                            <h3 className="mt-4 text-lg font-bold text-white">
                                VPN Access &amp; Setup
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                Dedicated My VPN workspace with live connection status,
                                configuration details, and step-by-step guides for Android, iOS,
                                and Windows.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
                            <Smartphone className="h-6 w-6 text-emerald-400" />
                            <h3 className="mt-4 text-lg font-bold text-white">
                                Virtual SMS &amp; Digital Tools
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                Access virtual numbers, privacy utilities, and curated digital
                                e-books directly inside your authenticated account.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
                            <CreditCard className="h-6 w-6 text-emerald-400" />
                            <h3 className="mt-4 text-lg font-bold text-white">
                                Transparent Billing
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                Review exact billing cycles before checkout and track every
                                Paystack transaction reference in your Subscriptions tab.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        Clear Plans &amp; Billing Cycles
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                        Every plan clearly displays whether it is billed monthly or
                        annually before checkout.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    {PRICING_PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                                        {plan.billingPeriod}
                                    </span>
                                </div>

                                <p className="mt-4 text-3xl font-extrabold text-white">
                                    {plan.priceDisplay}
                                </p>
                                <p className="mt-1 text-xs font-medium text-emerald-300">
                                    {plan.billingLabel}
                                </p>
                                <p className="mt-3 text-sm text-slate-300">{plan.summary}</p>

                                <ul className="mt-6 space-y-2.5 text-sm text-slate-200">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2.5">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 border-t border-slate-700/80 pt-5">
                                <p className="mb-4 text-xs text-slate-300">
                                    {plan.preCheckoutNote}
                                </p>
                                <Link
                                    to="/auth"
                                    className="block w-full rounded-xl bg-[#10B981] py-3 text-center text-sm font-bold text-[#0c192c] transition hover:bg-emerald-400"
                                >
                                    Select {plan.name}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-[#142B4A] py-12 text-sm text-slate-300">
                <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-6 md:flex-row md:items-center">
                    <div>
                        <p className="text-base font-bold text-white">
                            Esprit<span className="text-emerald-400">Access</span>
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                            <Mail className="h-3.5 w-3.5 text-emerald-400" />
                            <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
                                {SUPPORT_EMAIL}
                            </a>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-5 text-xs font-medium">
                        <Link to="/setup-guide" className="hover:text-emerald-400">ss
                            VPN Setup Guide
                        </Link>
                        <Link to="/faq" className="hover:text-emerald-400">
                            FAQ
                        </Link>
                        <Link to="/privacy" className="hover:text-emerald-400">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="hover:text-emerald-400">
                            Terms of Service
                        </Link>
                        <Link to="/refund-policy" className="hover:text-emerald-400">
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}