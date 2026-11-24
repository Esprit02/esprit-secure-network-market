import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { SUPPORT_EMAIL } from "../espritTrust";

export const Route = createFileRoute("/privacy")({
    component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#040711] text-slate-100">
            {/* Subtle Ambient Glow */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.06),transparent_55%)]" />

            {/* Floating Glass Navbar */}
            <header className="sticky top-3 z-40 mx-auto w-full max-w-4xl px-3 sm:px-6">
                <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#090f1d]/80 px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-6">
                    <Link to="/" className="flex items-center gap-2.5 text-base font-bold">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#10B981] text-xs font-black text-[#040711]">
                            EA
                        </span>
                        <span className="text-white">
                            Esprit<span className="text-emerald-400">Access</span>
                        </span>
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#050811]/90 px-4 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:text-white"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Floating Content */}
            <main className="relative z-10 mx-auto w-full max-w-4xl space-y-6 px-3 pb-16 pt-6 sm:px-6 sm:pt-8">
                <div className="rounded-3xl border border-white/[0.08] bg-[#090f1d]/85 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8">
                    <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                        Privacy Policy
                    </h1>
                    <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                        Data handling, provider disclosures, and account deletion details
                        for EspritAccess.
                    </p>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-500/[0.08] p-4 text-xs leading-relaxed text-amber-200 backdrop-blur-md">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    <p>
                        Editable Policy Draft: Replace bracketed sections below with your
                        final verified operational and provider disclosures before launch.
                    </p>
                </div>

                <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#090f1d]/85 p-6 text-sm leading-relaxed text-slate-300 shadow-[0_18px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                    <p>
                        <strong className="font-semibold text-white">VPN Technology:</strong>{" "}
                        [Specify VPN protocol/client technology in use].
                    </p>
                    <p>
                        <strong className="font-semibold text-white">
                            Data Collected by EspritAccess:
                        </strong>{" "}
                        Account information (such as email address) and order/transaction
                        records needed to run your account.
                    </p>
                    <p>
                        <strong className="font-semibold text-white">
                            Underlying Provider Data:
                        </strong>{" "}
                        [Describe what network or connection metadata an underlying
                        infrastructure or payment provider may process].
                    </p>
                    <p>
                        <strong className="font-semibold text-white">
                            Billing Records &amp; Retention:
                        </strong>{" "}
                        [State how long order and billing records are retained].
                    </p>
                    <p>
                        <strong className="font-semibold text-white">
                            Account Deletion &amp; Subscriptions:
                        </strong>{" "}
                        To request account deletion or ask how account closure affects
                        active subscriptions, email{" "}
                        <a
                            href={`mailto:${SUPPORT_EMAIL}`}
                            className="font-medium text-emerald-400 underline hover:text-emerald-300"
                        >
                            {SUPPORT_EMAIL}
                        </a>
                        .
                    </p>
                </section>
            </main>
        </div>
    );
}