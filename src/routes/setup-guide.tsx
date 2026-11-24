
import { createFileRoute, Link } from "@tanstack/react-router";
import {
    ArrowLeft,
    Smartphone,
    Shield,
    Monitor,
    Download,
    Wifi,
    Mail,
    CircleHelp,
    CheckCircle2,
} from "lucide-react";
import { SUPPORT_EMAIL } from "../espritTrust";

export const Route = createFileRoute("/setup-guide")({
    component: SetupGuidePage,
});

const setupSteps = {
    android: [
        "Open Google Play Store on your Android device.",
        "Download the WireGuard app from the official Play Store.",
        "Sign in to your EspritAccess account and open My VPN.",
        "Download your VPN configuration file or use the QR code provided, if available.",
        "Open WireGuard and tap the + button to add a tunnel.",
        "Choose Import from file or scan the QR code provided by EspritAccess.",
        "Give the tunnel a name if prompted, then save it.",
        "Tap the toggle to connect. Approve the VPN permission prompt if it appears.",
    ],
    ios: [
        "Open the App Store on your iPhone or iPad.",
        "Download the official WireGuard app.",
        "Sign in to your EspritAccess dashboard and open My VPN.",
        "Download your configuration file or access the QR code provided, if available.",
        "Open WireGuard and tap Add a tunnel.",
        "Select Import from file or scan the provided QR code.",
        "Save your tunnel configuration.",
        "Toggle the VPN connection on and approve the permission prompt if requested.",
    ],
    windows: [
        "Visit the official WireGuard website and download the Windows application.",
        "Install WireGuard on your computer.",
        "Sign in to your EspritAccess dashboard and open My VPN.",
        "Download the VPN configuration file provided for your subscription.",
        "Open WireGuard on your computer.",
        "Click Import tunnel(s) from file and select your downloaded configuration.",
        "Select the imported tunnel.",
        "Click Activate to connect.",
    ],
};

function SetupGuidePage() {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#040711] text-slate-100">
            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.06),transparent_55%)]" />

            {/* Navbar */}
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

            {/* Main content */}
            <main className="relative z-10 mx-auto w-full max-w-4xl space-y-6 px-3 pb-16 pt-6 sm:px-6 sm:pt-8">

                {/* Hero */}
                <section className="rounded-3xl border border-white/[0.08] bg-[#090f1d]/85 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                        <Shield className="h-3.5 w-3.5" />
                        Secure Connection Guide
                    </div>

                    <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                        VPN Setup Guide
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
                        Follow the steps below to configure your EspritAccess VPN
                        on Android, iPhone, iPad, or Windows. Your VPN
                        configuration is provided through your dashboard after
                        the applicable service has been provisioned.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <a
                            href="https://www.wireguard.com/install/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-[#04110d] transition hover:bg-emerald-400"
                        >
                            <Download className="h-4 w-4" />
                            Official WireGuard Downloads
                        </a>
                    </div>
                </section>

                {/* Android */}
                <section className="rounded-2xl border border-white/[0.08] bg-[#090f1d]/85 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                            <Smartphone className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Android</h2>
                            <p className="text-xs text-slate-400">
                                Setup on Android phones and tablets
                            </p>
                        </div>
                    </div>

                    <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-300">
                        {setupSteps.android.map((step, index) => (
                            <li key={index} className="pl-1">
                                {step}
                            </li>
                        ))}
                    </ol>
                </section>

                {/* iOS */}
                <section className="rounded-2xl border border-white/[0.08] bg-[#090f1d]/85 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                            <Shield className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                iPhone & iPad
                            </h2>
                            <p className="text-xs text-slate-400">
                                Setup on Apple mobile devices
                            </p>
                        </div>
                    </div>

                    <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-300">
                        {setupSteps.ios.map((step, index) => (
                            <li key={index} className="pl-1">
                                {step}
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Windows */}
                <section className="rounded-2xl border border-white/[0.08] bg-[#090f1d]/85 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                            <Monitor className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Windows</h2>
                            <p className="text-xs text-slate-400">
                                Setup on Windows computers
                            </p>
                        </div>
                    </div>

                    <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-300">
                        {setupSteps.windows.map((step, index) => (
                            <li key={index} className="pl-1">
                                {step}
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Connection advice */}
                <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                        <Wifi className="h-5 w-5 text-emerald-400" />
                        <h2 className="text-lg font-bold text-white">
                            Connection Tips
                        </h2>
                    </div>

                    <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-300">
                        <li className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            Ensure your internet connection is working before connecting.
                        </li>
                        <li className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            Make sure you are using the configuration provided for your active subscription.
                        </li>
                        <li className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            If the connection fails, disconnect and reconnect or restart your internet connection.
                        </li>
                        <li className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            Never share your VPN configuration file or QR code with strangers.
                        </li>
                    </ul>
                </section>

                {/* Support */}
                <section className="rounded-2xl border border-white/[0.08] bg-[#090f1d]/85 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8">
                    <div className="flex items-center gap-3">
                        <CircleHelp className="h-5 w-5 text-emerald-400" />
                        <h2 className="text-lg font-bold text-white">
                            Still Need Help?
                        </h2>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                        If you experience difficulties during setup, contact
                        our support team. We can assist you with configuration,
                        activation, and connection troubleshooting.
                    </p>

                    <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/15"
                    >
                        <Mail className="h-4 w-4" />
                        {SUPPORT_EMAIL}
                    </a>
                </section>

                {/* Footer */}
                <div className="pb-4 text-center">
                    <Link
                        to="/"
                        className="text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
                    >
                        ← Return to EspritAccess
                    </Link>
                    <p className="mt-3 text-xs text-slate-600">
                        EspritAccess — Your Gateway to Digital Access
                    </p>
                </div>
            </main>
        </div>
    );
}
