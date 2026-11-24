import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ShieldCheck,
    Globe,
    Smartphone,
    CreditCard,
    ArrowRight,
    CheckCircle2,
    Mail,
    MoreHorizontal,
    X,
    Sparkles,
    BookOpen,
    HelpCircle,
    LayoutDashboard,
    MessageCircle,
    Layers,
} from "lucide-react";
import { PRICING_PLANS, SUPPORT_EMAIL } from "../espritTrust";

export const Route = createFileRoute("/")({
    component: IndexRoute,
});

function ScrollFloat({
    children,
    delay = 0,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transform transition-all duration-700 ease-out ${visible
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-8 scale-[0.985] opacity-0"
                } ${className}`}
        >
            {children}
        </div>
    );
}

function IndexRoute() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#040812] text-slate-100 antialiased selection:bg-[#00F59B]/25 selection:text-[#00F59B]">
            {/* Deep Navy Ambient Emerald & Warm Amber Glow */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(0,245,155,0.10),transparent_40%),radial-gradient(circle_at_88%_22%,rgba(245,158,11,0.07),transparent_38%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.08),transparent_45%)]" />

            {/* Clean Non-Sticky Top Brand Bar (Won't crowd the screen when scrolling) */}
            <header className="relative z-30 mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-5 pb-2 sm:px-6">
                <Link to="/" className="group flex items-center gap-3">
                    <img
                        src="/logo-mark.png"
                        alt="EspritAccess"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                        className="h-9 w-9 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,245,155,0.22)] transition-transform group-hover:scale-105"
                    />
                    <span className="text-lg font-extrabold tracking-tight text-white">
                        Esprit<span className="text-[#00F59B]">Access</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2.5">
                    <Link
                        to="/auth"
                        className="rounded-full border border-white/[0.08] bg-[#081020]/90 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-[#00F59B]/40 hover:text-white"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/dashboard"
                        className="rounded-full bg-[#00F59B] px-4 py-2 text-xs font-bold text-[#040812] shadow-[0_0_20px_rgba(0,245,155,0.28)] transition hover:bg-emerald-300"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            {/* Floating Three Horizontal Dots Menu on the Side */}
            <div className="fixed right-3.5 top-1/2 z-50 flex -translate-y-1/2 flex-col items-end">
                <button
                    type="button"
                    aria-label="Open EspritAccess Menu"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00F59B]/35 bg-[#070E1C]/90 text-[#00F59B] shadow-[0_0_26px_rgba(0,245,155,0.28)] backdrop-blur-xl transition-all hover:scale-105 hover:border-[#00F59B]"
                >
                    {menuOpen ? (
                        <X className="h-5 w-5 text-amber-400" />
                    ) : (
                        <MoreHorizontal className="h-5 w-5" />
                    )}
                </button>

                {menuOpen && (
                    <nav className="mt-3 w-60 space-y-1 rounded-2xl border border-white/[0.08] bg-[#070E1C]/95 p-2.5 shadow-[0_24px_64px_rgba(0,0,0,0.88),0_0_32px_rgba(0,245,155,0.14)] backdrop-blur-2xl">
                        <div className="mb-1 flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                                <Sparkles className="h-3.5 w-3.5 text-[#00F59B]" />
                                EspritAccess
                            </span>
                            <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                Quick Menu
                            </span>
                        </div>

                        <a
                            href="#services"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-white/[0.07] hover:bg-white/[0.05] hover:text-white"
                        >
                            <Layers className="h-4 w-4 text-[#00F59B]" />
                            <span>Services</span>
                        </a>

                        <a
                            href="#pricing"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-white/[0.07] hover:bg-white/[0.05] hover:text-white"
                        >
                            <CreditCard className="h-4 w-4 text-amber-400" />
                            <span>Pricing Plans</span>
                        </a>

                        <Link
                            to="/setup-guide"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-white/[0.07] hover:bg-white/[0.05] hover:text-white"
                        >
                            <BookOpen className="h-4 w-4 text-orange-400" />
                            <span>Setup Guide</span>
                        </Link>

                        <Link
                            to="/faq"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-white/[0.07] hover:bg-white/[0.05] hover:text-white"
                        >
                            <HelpCircle className="h-4 w-4 text-emerald-300" />
                            <span>FAQ</span>
                        </Link>

                        <Link
                            to="/dashboard"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-white/[0.07] hover:bg-white/[0.05] hover:text-white"
                        >
                            <LayoutDashboard className="h-4 w-4 text-amber-300" />
                            <span>Dashboard</span>
                        </Link>

                        <div className="mt-1.5 border-t border-white/[0.07] pt-1.5">
                            <a
                                href="https://wa.me/2348051309239?text=Hello%20EspritAccess%2C%20I%20need%20help%20getting%20started."
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setMenuOpen(false)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 px-3 py-2.5 text-xs font-bold text-[#040812] shadow-[0_0_20px_rgba(0,245,155,0.25)] transition hover:opacity-95"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp Support
                            </a>
                        </div>
                    </nav>
                )}
            </div>

            {/* Main Floating Content Stack */}
            <main className="relative z-10 mx-auto w-full max-w-6xl space-y-10 px-4 pb-20 pt-5 sm:px-6 sm:pt-8">
                {/* Floating Hero Section */}
                <ScrollFloat>
                    <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#0B1528]/90 via-[#070E1C]/95 to-[#040812]/95 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_32px_rgba(0,245,155,0.10)] backdrop-blur-xl sm:p-12">
                        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#00F59B]/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />

                        <div className="relative max-w-3xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#00F59B]/25 bg-[#00F59B]/10 px-3.5 py-1 text-xs font-semibold text-[#00F59B]">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Unified Digital Access &amp; Connectivity
                            </span>

                            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Reliable Connectivity &amp;{" "}
                                <span className="bg-gradient-to-r from-[#00F59B] via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                                    Digital Tools
                                </span>{" "}
                                in One Account
                            </h1>

                            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
                                Manage VPN configurations, virtual numbers, and digital
                                resources from one clear dashboard with transparent monthly and
                                annual billing.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-3.5">
                                <Link
                                    to="/auth"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#00F59B] px-6 py-3.5 text-sm font-bold text-[#040812] shadow-[0_0_26px_rgba(0,245,155,0.3)] transition hover:-translate-y-0.5 hover:bg-emerald-300"
                                >
                                    Create Account
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    to="/setup-guide"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#060C18]/90 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-amber-400/40"
                                >
                                    View Setup Guide
                                </Link>
                            </div>
                        </div>
                    </section>
                </ScrollFloat>

                {/* Floating Core Services Section */}
                <ScrollFloat delay={80}>
                    <section
                        id="services"
                        className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82),0_0_24px_rgba(0,245,155,0.06)] backdrop-blur-xl sm:p-10"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                    Everything Managed From One Dashboard
                                </h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    Clear separation between your active VPN setup and your
                                    subscription billing records.
                                </p>
                            </div>
                            <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                                Instant Access
                            </span>
                        </div>

                        <div className="mt-8 grid gap-5 md:grid-cols-3">
                            <div className="group rounded-2xl border border-white/[0.07] bg-[#050A15]/90 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-[#00F59B]/35 hover:shadow-[0_18px_40px_rgba(0,245,155,0.14)]">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00F59B]/25 bg-[#00F59B]/10">
                                    <Globe className="h-5 w-5 text-[#00F59B]" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-white">
                                    VPN Access &amp; Setup
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                    Dedicated My VPN workspace with live connection status,
                                    configuration details, and step-by-step guides for Android,
                                    iOS, and Windows.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-white/[0.07] bg-[#050A15]/90 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/35 hover:shadow-[0_18px_40px_rgba(245,158,11,0.14)]">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/10">
                                    <Smartphone className="h-5 w-5 text-amber-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-white">
                                    Virtual SMS &amp; Digital Tools
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                    Access virtual numbers, privacy utilities, and curated
                                    digital e-books directly inside your authenticated account.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-white/[0.07] bg-[#050A15]/90 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/35 hover:shadow-[0_18px_40px_rgba(251,146,60,0.14)]">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-400/10">
                                    <CreditCard className="h-5 w-5 text-orange-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-white">
                                    Transparent Billing
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                    Review exact billing cycles before checkout and track every
                                    Paystack transaction reference in your Subscriptions tab.
                                </p>
                            </div>
                        </div>
                    </section>
                </ScrollFloat>

                {/* Floating Pricing Section */}
                <ScrollFloat delay={120}>
                    <section
                        id="pricing"
                        className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82),0_0_24px_rgba(0,245,155,0.06)] backdrop-blur-xl sm:p-10"
                    >
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Clear Plans &amp; Billing Cycles
                            </h2>
                            <p className="mt-2 text-sm text-slate-400">
                                Every plan clearly displays whether it is billed monthly or
                                annually before checkout.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-5 lg:grid-cols-3">
                            {PRICING_PLANS.map((plan) => {
                                const isFeatured = plan.id === "plus";
                                return (
                                    <div
                                        key={plan.id}
                                        className={`flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${isFeatured
                                                ? "border border-[#00F59B]/40 bg-[#050A15]/95 shadow-[0_18px_50px_rgba(0,245,155,0.16)]"
                                                : "border border-white/[0.07] bg-[#050A15]/85 hover:border-white/20"
                                            }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="text-xl font-bold text-white">
                                                    {plan.name}
                                                </h3>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${isFeatured
                                                            ? "border border-amber-400/30 bg-amber-400/15 text-amber-300"
                                                            : "border border-[#00F59B]/25 bg-[#00F59B]/10 text-[#00F59B]"
                                                        }`}
                                                >
                                                    {plan.billingPeriod}
                                                </span>
                                            </div>

                                            <p className="mt-4 text-3xl font-extrabold tracking-tight text-white">
                                                {plan.priceDisplay}
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-[#00F59B]">
                                                {plan.billingLabel}
                                            </p>
                                            <p className="mt-3 text-sm text-slate-400">
                                                {plan.summary}
                                            </p>

                                            <ul className="mt-6 space-y-2.5 text-sm text-slate-200">
                                                {plan.features.map((feature) => (
                                                    <li
                                                        key={feature}
                                                        className="flex items-start gap-2.5"
                                                    >
                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00F59B]" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-8 border-t border-white/[0.07] pt-5">
                                            <p className="mb-4 text-xs text-slate-400">
                                                {plan.preCheckoutNote}
                                            </p>
                                            <Link
                                                to="/auth"
                                                className={`block w-full rounded-full py-3 text-center text-sm font-bold transition ${isFeatured
                                                        ? "bg-[#00F59B] text-[#040812] shadow-[0_0_24px_rgba(0,245,155,0.28)] hover:bg-emerald-300"
                                                        : "border border-[#00F59B]/35 bg-[#00F59B]/15 text-[#00F59B] hover:bg-[#00F59B] hover:text-[#040812]"
                                                    }`}
                                            >
                                                Select {plan.name}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </ScrollFloat>

                {/* Floating Footer */}
                <ScrollFloat delay={150}>
                    <footer className="rounded-2xl border border-white/[0.07] bg-[#081020]/90 px-6 py-8 text-sm text-slate-400 shadow-[0_16px_45px_rgba(0,0,0,0.75)] backdrop-blur-xl">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                            <div>
                                <p className="text-base font-bold text-white">
                                    Esprit<span className="text-[#00F59B]">Access</span>
                                </p>
                                <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                                    <Mail className="h-3.5 w-3.5 text-[#00F59B]" />
                                    <a
                                        href={`mailto:${SUPPORT_EMAIL}`}
                                        className="text-[#00F59B] hover:underline"
                                    >
                                        {SUPPORT_EMAIL}
                                    </a>
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-5 text-xs font-medium">
                                <Link
                                    to="/setup-guide"
                                    className="transition hover:text-[#00F59B]"
                                >
                                    VPN Setup Guide
                                </Link>
                                <Link
                                    to="/faq"
                                    className="transition hover:text-[#00F59B]"
                                >
                                    FAQ
                                </Link>
                                <Link
                                    to="/privacy"
                                    className="transition hover:text-[#00F59B]"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    to="/terms"
                                    className="transition hover:text-[#00F59B]"
                                >
                                    Terms of Service
                                </Link>
                                <Link
                                    to="/refund-policy"
                                    className="transition hover:text-[#00F59B]"
                                >
                                    Refund Policy
                                </Link>
                            </div>
                        </div>
                    </footer>
                </ScrollFloat>
            </main>
        </div>
    );
}