import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  PAYSTACK_PUBLIC_KEY,
  generateReference,
  loadPaystack,
} from "@/lib/paystack";
import { finalizePaystackOrder } from "@/lib/paystack.functions";
import {
  LayoutDashboard,
  Store,
  CreditCard,
  Settings,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Copy,
  Check,
  LogOut,
  Zap,
  Receipt,
  Headphones,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type TabKey = "overview" | "store" | "transactions" | "settings";
type PlanCode = "standard" | "plus" | "pro";

interface OrderRecord {
  id: string;
  plan_name?: string;
  plan_code?: string;
  amount_ngn?: number;
  status?: string;
  reference?: string;
  vpn_key?: string;
  created_at?: string;
}

const PLANS: {
  code: PlanCode;
  name: string;
  tag: string;
  price: number;
  period: string;
  featured?: boolean;
  features: string[];
}[] = [
    {
      code: "standard",
      name: "Standard",
      tag: "STARTER",
      price: 4000,
      period: "/ month",
      features: [
        "1 High-Speed VPN Key",
        "Instant Paystack Activation",
        "Zero-Logs Encrypted Tunnel",
        "WhatsApp Support",
      ],
    },
    {
      code: "plus",
      name: "Plus",
      tag: "MOST POPULAR",
      price: 8500,
      period: "/ month",
      featured: true,
      features: [
        "Up to 3 Devices Simultaneously",
        "Priority High-Speed Servers",
        "Virtual SMS Number Access",
        "24/7 Priority Support",
      ],
    },
    {
      code: "pro",
      name: "Pro",
      tag: "ALL ACCESS",
      price: 14000,
      period: "/ year",
      features: [
        "Unlimited Bandwidth & Priority Nodes",
        "Full Digital Marketplace Discounts",
        "Dedicated Account Dashboard",
        "Instant Key Replacement",
      ],
    },
  ];

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [payingPlan, setPayingPlan] = useState<PlanCode | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;

      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }

      setUser(data.user);
      await fetchOrders(data.user.id);
      setLoading(false);
    }

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          navigate({ to: "/auth" });
        } else {
          setUser(session.user);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  async function fetchOrders(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as OrderRecord[]);
    }
  }

  async function handlePaystackCheckout(plan: (typeof PLANS)[number]) {
    if (!user?.email) return;
    setPayingPlan(plan.code);
    setStatusMessage(null);

    try {
      await loadPaystack();
      const reference = generateReference();
      const PaystackPop = (window as any).PaystackPop;

      if (!PaystackPop) {
        setStatusMessage("Payment gateway failed to load. Please refresh and try again.");
        setPayingPlan(null);
        return;
      }

      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: plan.price * 100,
        currency: "NGN",
        ref: reference,
        callback: async (response: { reference: string }) => {
          try {
            await (finalizePaystackOrder as any)({
              data: {
                reference: response.reference,
                planCode: plan.code,
                userId: user.id,
                email: user.email,
              },
            });
            setStatusMessage(`Payment confirmed! Your ${plan.name} VPN key is now active.`);
            await fetchOrders(user.id);
            setActiveTab("overview");
          } catch {
            setStatusMessage("Payment received. Refreshing your dashboard...");
            await fetchOrders(user.id);
          } finally {
            setPayingPlan(null);
          }
        },
        onClose: () => {
          setPayingPlan(null);
        },
      });

      handler.openIframe();
    } catch {
      setStatusMessage("Unable to start checkout. Please try again.");
      setPayingPlan(null);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  function handleCopyKey(keyValue: string) {
    navigator.clipboard.writeText(keyValue);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  const latestKeyOrder = orders.find((o) => o.vpn_key);
  const activeKey = latestKeyOrder?.vpn_key || null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm font-medium">Loading your EspritAccess dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-blue-500/15 bg-[#030712]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5 text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.7)]">
              EA
            </span>
            <span>
              Esprit<span className="text-blue-400">Access</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-slate-400 sm:inline">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/25 bg-[#070d1f] px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-blue-400 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-[220px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="space-y-2">
          {[
            { id: "overview" as TabKey, label: "Overview", icon: LayoutDashboard },
            { id: "store" as TabKey, label: "VPN & Store", icon: Store },
            { id: "transactions" as TabKey, label: "Transactions", icon: CreditCard },
            { id: "settings" as TabKey, label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active
                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                    : "text-slate-400 hover:bg-[#070d1f] hover:text-white"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* Main Content */}
        <main className="space-y-6">
          {statusMessage && (
            <div className="rounded-xl border border-blue-500/40 bg-blue-950/60 px-4 py-3 text-sm text-blue-200">
              {statusMessage}
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-500/20 bg-[#070d1f] p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Protection Status
                    </span>
                    {activeKey ? (
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-amber-400" />
                    )}
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">
                    {activeKey ? "Active & Encrypted" : "No Active Plan"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {activeKey
                      ? "Your VPN key is unlocked and ready to use."
                      : "Choose a plan in the Store to get instant access."}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-[#070d1f] p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total Orders
                    </span>
                    <Receipt className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">{orders.length}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Verified via Paystack NGN checkout
                  </p>
                </div>
              </div>

              {/* Active VPN Key Box */}
              <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-[#08122b] to-[#070d1f] p-6 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                <div className="flex items-center gap-2 text-blue-400">
                  <KeyRound className="h-5 w-5" />
                  <h2 className="text-base font-bold text-white">Your Active VPN Key</h2>
                </div>

                {activeKey ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-500/25 bg-[#030712] px-4 py-3 font-mono text-xs text-blue-300">
                      <span className="truncate">{activeKey}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyKey(activeKey)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 font-sans text-xs font-semibold text-white transition hover:bg-blue-500"
                      >
                        {copiedKey ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copy Key
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      Paste this key into your WireGuard or Outline client to connect immediately.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="text-sm text-slate-400">
                      You don&apos;t have an active VPN key yet. Activate a plan to unlock your key instantly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("store")}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] transition hover:bg-blue-500"
                    >
                      <Zap className="h-4 w-4" />
                      Get a VPN Key
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STORE TAB */}
          {activeTab === "store" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Choose Your Access Plan</h1>
                <p className="mt-1 text-sm text-slate-400">
                  Pay securely in Naira via Paystack for instant VPN key activation.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {PLANS.map((plan) => (
                  <div
                    key={plan.code}
                    className={`flex flex-col justify-between rounded-2xl p-6 ${plan.featured
                        ? "border-2 border-blue-500 bg-[#08122b] shadow-[0_0_35px_rgba(37,99,235,0.25)]"
                        : "border border-blue-500/20 bg-[#070d1f]"
                      }`}
                  >
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                        {plan.tag}
                      </span>
                      <h3 className="mt-1 text-xl font-bold text-white">{plan.name}</h3>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white">
                          ₦{plan.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400">{plan.period}</span>
                      </div>

                      <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      disabled={payingPlan === plan.code}
                      onClick={() => handlePaystackCheckout(plan)}
                      className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] transition hover:bg-blue-500 disabled:opacity-60"
                    >
                      {payingPlan === plan.code ? "Opening Paystack..." : `Pay ₦${plan.price.toLocaleString()}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === "transactions" && (
            <div className="rounded-2xl border border-blue-500/20 bg-[#070d1f] p-6">
              <h2 className="text-lg font-bold text-white">Transaction History</h2>
              {orders.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">
                  No transactions yet. Your Paystack receipts will appear here.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-blue-500/15 bg-[#030712] px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          {order.plan_name || order.plan_code || "VPN Plan"}
                        </p>
                        <p className="text-xs text-slate-400">
                          Ref: {order.reference || order.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-400">
                          ₦{(order.amount_ngn || 0).toLocaleString()}
                        </p>
                        <p className="text-xs uppercase text-emerald-400">
                          {order.status || "Paid"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="rounded-2xl border border-blue-500/20 bg-[#070d1f] p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Account Settings</h2>
              <div className="rounded-xl border border-blue-500/15 bg-[#030712] p-4 text-sm">
                <p className="text-xs text-slate-400">Signed in email</p>
                <p className="mt-1 font-semibold text-white">{user?.email}</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-blue-500/15 bg-[#030712] p-4 text-sm">
                <Headphones className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-semibold text-white">Need help?</p>
                  <p className="text-xs text-slate-400">
                    Contact EspritAccess Support on WhatsApp for instant setup help.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}