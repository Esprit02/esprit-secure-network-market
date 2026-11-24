import { createFileRoute } from "@tanstack/react-router";
import { SUPPORT_EMAIL } from "../espritTrust";

export const Route = createFileRoute("/refund-policy")({
    component: RefundPolicyPage,
});

function RefundPolicyPage() {
    return (
        <main className="mx-auto max-w-4xl space-y-6 px-4 py-12 text-[#142B4A]">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold sm:text-3xl">Refund Policy</h1>
                <a href="/" className="text-sm font-medium underline">
                    Back to Home
                </a>
            </div>

            <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950">
                Editable Policy Draft: Confirm and finalize your exact refund eligibility
                window and conditions before launch.
            </p>

            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-[#526273]">
                <p>
                    Review plan billing cycles (monthly vs. annual) and plan details
                    carefully before completing payment.
                </p>
                <p>
                    For billing or order assistance, email{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
                        {SUPPORT_EMAIL}
                    </a>{" "}
                    with your account email and transaction reference.
                </p>
            </div>
        </main>
    );
}