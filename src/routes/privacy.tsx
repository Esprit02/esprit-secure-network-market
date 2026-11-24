import { createFileRoute } from "@tanstack/react-router";
import { SUPPORT_EMAIL } from "../espritTrust";

export const Route = createFileRoute("/privacy")({
    component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
    return (
        <main className="mx-auto max-w-4xl space-y-6 px-4 py-12 text-[#142B4A]">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold sm:text-3xl">Privacy Policy</h1>
                <a href="/" className="text-sm font-medium underline">
                    Back to Home
                </a>
            </div>

            <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950">
                Editable Policy Draft: Replace bracketed sections below with your final
                verified operational and provider disclosures before launch.
            </p>

            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-[#526273]">
                <p>
                    <strong>VPN Technology:</strong> [Specify VPN protocol/client technology
                    in use].
                </p>
                <p>
                    <strong>Data Collected by EspritAccess:</strong> Account information
                    (such as email address) and order/transaction records needed to run
                    your account.
                </p>
                <p>
                    <strong>Underlying Provider Data:</strong> [Describe what network or
                    connection metadata an underlying infrastructure or payment provider
                    may process].
                </p>
                <p>
                    <strong>Billing Records &amp; Retention:</strong> [State how long order
                    and billing records are retained].
                </p>
                <p>
                    <strong>Account Deletion &amp; Subscriptions:</strong> To request
                    account deletion or ask how account closure affects active
                    subscriptions, email{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
                        {SUPPORT_EMAIL}
                    </a>
                    .
                </p>
            </div>
        </main>
    );
}