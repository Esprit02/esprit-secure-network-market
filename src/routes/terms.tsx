import { createFileRoute } from "@tanstack/react-router";
import { SUPPORT_EMAIL } from "../espritTrust";

export const Route = createFileRoute("/terms")({
    component: TermsPage,
});

function TermsPage() {
    return (
        <main className="mx-auto max-w-4xl space-y-6 px-4 py-12 text-[#142B4A]">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold sm:text-3xl">Terms of Service</h1>
                <a href="/" className="text-sm font-medium underline">
                    Back to Home
                </a>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-[#526273]">
                <p>
                    By creating an account or purchasing a plan on EspritAccess, you agree
                    to use the service lawfully and follow applicable rules and
                    third-party platform terms.
                </p>
                <p>
                    Plan billing cycles (monthly or annual) and plan details are displayed
                    before checkout. For questions, contact{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
                        {SUPPORT_EMAIL}
                    </a>
                    .
                </p>
            </div>
        </main>
    );
}