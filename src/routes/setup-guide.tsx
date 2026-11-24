import { createFileRoute } from "@tanstack/react-router";
import { SUPPORT_EMAIL } from "../espritTrust";

export const Route = createFileRoute("/setup-guide")({
    component: SetupGuidePage,
});

function SetupGuidePage() {
    return (
        <main className="mx-auto max-w-4xl space-y-6 px-4 py-12 text-[#142B4A]">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold sm:text-3xl">VPN Setup Guide</h1>
                <a href="/" className="text-sm font-medium underline">
                    Back to Home
                </a>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-bold">Android</h2>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#526273]">
                    <li>Install the supported client app from Google Play.</li>
                    <li>
                        Sign in to your EspritAccess dashboard and open My VPN for your
                        configuration details.
                    </li>
                    <li>
                        Import or enter your configuration, connect, and confirm your
                        status.
                    </li>
                </ol>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-bold">iPhone (iOS)</h2>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#526273]">
                    <li>Install the supported client app from the Apple App Store.</li>
                    <li>
                        Open My VPN in your dashboard to retrieve your configuration
                        details.
                    </li>
                    <li>Approve iOS VPN configuration prompts when asked and connect.</li>
                </ol>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-bold">Windows</h2>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#526273]">
                    <li>Install the supported Windows desktop client.</li>
                    <li>
                        Apply your configuration from My VPN and start the connection.
                    </li>
                    <li>
                        Need help? Email{" "}
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
                            {SUPPORT_EMAIL}
                        </a>
                        .
                    </li>
                </ol>
            </section>
        </main>
    );
}