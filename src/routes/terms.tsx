import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SUPPORT_EMAIL } from "../espritTrust";

export const Route = createFileRoute("/terms")({
    component: TermsPage,
});

function TermsPage() {
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
                        Terms of Service
                    </h1>
                    <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                        Service usage rules and billing terms for EspritAccess accounts.
                    </p>
                </div>

                <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#090f1d]/85 p-6 text-sm leading-relaxed text-slate-300 shadow-[0_18px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                    <p>
                        By creating an account or purchasing a plan on EspritAccess, you
                        agree to use the service lawfully and follow applicable rules and
                        third-party platform terms.
                    </p>
                    <p>
                        Plan billing cycles (monthly or annual) and plan details are
                        displayed before checkout. For questions, contact{" "}
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