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
  Globe,
  Smartphone,
  BookOpen,
  Sparkles,
  Check,
  ChevronDown,
  ArrowRight,
  Lock,
  Zap,
  Star,
  Clock,
  Wallet,
  Receipt,
  Headphones,
  KeyRound,
} from "lucide-react";

interface DashboardProps {
  user?: User | null;
}

type TabKey = "overview" | "store" | "transactions" | "settings";
type PlanCode = "standard" | "plus" | "pro";

interface OrderRecord {
  id: string;
  plan_type: string;
  amount_ngn: number;
  payment_status: string;
  reference_id?: string | null;
  created_at: string;
}

const VPN_PLANS: {
  id: PlanCode;
  name: string;
  tag: string;
  price: string;
  period: string;
  description: string;
  featured: boolean;
  features: string[];
}[] = [
    {
      id: "standard",
      name: "Standard",
      tag: "STARTER",
      price: "₦3,999",
      period: "/ month",
      description:
        "Reliable everyday privacy and secure browsing across global nodes.",
      featured: false,
      features: [
        "Access to USA, UK & Germany nodes",
        "Encrypted WireGuard VPN tunnel",
        "Built-in ad & tracker shielding",
        "1 device connection",
        "Manual renewal — no auto-debit",
      ],
    },
    {
      id: "plus",
      name: "Plus",
      tag: "BEST VALUE",
      price: "₦6,999",
      period: "/ month",
      description:
        "High-speed residential IP access built for remote work & streaming.",
      featured: true,
      features: [
        "65,000+ decentralized residential nodes",
        "USA, UK, Germany, Australia & more",
        "Anti-detect browser fingerprint protection",
        "Up to 3 simultaneous devices",
        "Priority WhatsApp & portal support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      tag: "POWER USER",
      price: "₦9,999",
      period: "/ month",
      description:
        "Maximum bandwidth, multi-region routing, and full digital access suite.",
      featured: false,
      features: [
        "Unlimited high-speed P2P & residential nodes",
        "Dedicated low-latency routing",
        "Up to 6 simultaneous devices",
        "Early access to Virtual Numbers & AI tools",
        "VIP 24/7 support & instant key replacement",
      ],
    },
  ];

const EBOOKS = [
  {
    id: "ebook-1",
    title: "Digital Privacy & OpSec Playbook",
    subtitle: "Protect your identity, banking & remote accounts",
    price: "₦2,499",
    tag: "#1 Best Seller",
    gradient: "from-blue-600 via-indigo-600 to-slate-900",
    pages: "142 Pages • PDF + Checklist",
  },
  {
    id: "ebook-2",
    title: "Global Remote Income Blueprint",
    subtitle: "Bypass payment & geo barriers from Nigeria",
    price: "₦3,499",
    tag: "Trending",
    gradient: "from-emerald-600 via-teal-700 to-slate-900",
    pages: "198 Pages • PDF + Templates",
  },
  {
    id: "ebook-3",
    title: "AI Automation & Digital Tools Guide",
    subtitle: "Access & master top international AI workflows",
    price: "₦1,999",
    tag: "On Demand",
    gradient: "from-violet-600 via-purple-700 to-slate-900",
    pages: "115 Pages • Instant Access",
  },
];

const NUMBER_DURATIONS = [
  { code: "STR", label: "Short-Term (15 Min)", price: "₦1,200" },
  { code: "STRP", label: "Premium OTP (20 Min)", price: "₦1,800" },
  { code: "LTR-03", label: "3-Day Rental", price: "₦4,500" },
  { code: "LTR-30", label: "30-Day Rental", price: "₦12,500" },
];

const POPULAR_PLATFORMS = [
  "WhatsApp (USA)",
  "Telegram (UK)",
  "OpenAI / ChatGPT",
  "PayPal Verification",
  "Remotasks (USA)",
];

const TESTIMONIALS = [
  {
    name: "Tunde A.",
    role: "Remote Developer, Lagos",
    quote:
      "Paying in Naira via bank transfer without hunting for dollar cards saved me hours. My WireGuard config connected in under 2 minutes.",
  },
  {
    name: "Chidinma O.",
    role: "Digital Marketer, Abuja",
    quote:
      "I use the Plus plan for client dashboards that block Nigerian IPs. Clean interface, zero auto-debit surprises, and fast support.",
  },
  {
    name: "Ibrahim K.",
    role: "Freelance Designer, Port Harcourt",
    quote:
      "EspritAccess feels like a real fintech app. Having my VPN plan, receipts, and digital guides in one dashboard is super convenient.",
  },
];

const FAQS = [
  {
    q: "How do I pay for a plan in Naira?",
    a: "Click Subscribe Now on any plan to open secure Paystack checkout. You can pay instantly via Pay with Transfer, bank USSD, or debit card—no USD card required.",
  },
  {
    q: "Will my bank card be debited automatically every month?",
    a: "No. EspritAccess uses a transparent manual-renewal model. When your 30-day cycle ends, your subscription light turns red and you choose when to renew.",
  },
  {
    q: "How do I connect to the VPN after payment?",
    a: "Once Paystack verifies your payment, your WireGuard configuration key is delivered straight to your dashboard with a 1-minute setup guide for iOS, Android, Windows, and Mac.",
  },
  {
    q: "When do I receive purchased E-Books?",
    a: "All E-Books are delivered immediately after payment verification as instant high-resolution PDF downloads inside your dashboard.",
  },
];

export function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedDuration, setSelectedDuration] = useState("STR");
  const [selectedPlatform, setSelectedPlatform] = useState(
    POPULAR_PLATFORMS[0]
  );
  const [checkoutBanner, setCheckoutBanner] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [paying, setPaying] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || user?.user_metadata?.name || ""
  );
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [savedMsg, setSavedMsg] = useState(false);

  const fetchOrders = async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setOrders(data as OrderRecord[]);
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  // Live subscription & KPI values from Supabase `orders`
  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const isSubscribed = paidOrders.length > 0;
  const latestPlan = paidOrders[0]?.plan_type
    ? `${String(paidOrders[0].plan_type).toUpperCase()} Plan`
    : "Free Account";
  const totalSpent = paidOrders.reduce(
    (sum, o) => sum + (Number(o.amount_ngn) || 0),
    0
  );

  const displayName =
    fullName || user?.email?.split("@")[0] || "Valued Member";

  const handleCheckoutClick = async (
    itemName: string,
    priceStr: string,
    planType: PlanCode = "standard"
  ) => {
    if (!user?.email) {
      setCheckoutBanner("Please sign in with a valid email to complete payment.");
      return;
    }

    try {
      setPaying(true);
      const amountNgn = Number(priceStr.replace(/[^\d]/g, "")) || 3999;
      const PaystackPop = await loadPaystack();
      const ref = generateReference("ESPRIT");

      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: amountNgn * 100, // kobo
        currency: "NGN",
        ref,
        metadata: { user_id: user.id, plan_type: planType, product: itemName },
        callback: async (response) => {
          setCheckoutBanner(
            "Payment received! Verifying and activating your plan..."
          );
          try {
            await finalizePaystackOrder({
              data: { reference: response.reference, plan_type: planType },
            });
            await fetchOrders();
            setCheckoutBanner(
              "✓ Payment verified! Your subscription is now Active."
            );
          } catch (err: any) {
            setCheckoutBanner(
              err?.message ||
              "Payment succeeded, but verification failed. Contact support."
            );
          } finally {
            setPaying(false);
          }
        },
        onClose: () => {
          setPaying(false);
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setPaying(false);
      setCheckoutBanner(err?.message || "Could not open Paystack checkout.");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "overview",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "store",
      label: "Store & Plans",
      icon: <Store className="h-4 w-4" />,
    },
    {
      key: "transactions",
      label: "Transactions",
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        {/* Persistent Fintech Sidebar */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="fintech-card sticky top-6 flex flex-col justify-between p-4 lg:min-h-[calc(100vh-7rem)]">
            <div className="space-y-6">
              <div>
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Client Portal
                </p>
                <nav className="mt-2 flex flex-row gap-1.5 overflow-x-auto lg:flex-col">
                  {navItems.map((item) => {
                    const active = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Admin Vault Link */}
              <div className="hidden border-t border-border pt-4 lg:block">
                <a
                  href="/admin-vault"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <KeyRound className="h-4 w-4 text-emerald-500" />
                  <span>Admin Vault</span>
                </a>
              </div>
            </div>

            {/* Bottom System Status Pill */}
            <div className="mt-6 hidden space-y-3 border-t border-border pt-4 lg:block">
              <div className="rounded-lg bg-secondary/70 p-3">
                <div className="flex items-center gap-2">
                  <span className="status-dot-active" />
                  <span className="text-xs font-semibold text-foreground">
                    All Systems Online
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  65,000+ nodes & Paystack NGN gateway ready
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          {/* Checkout Feedback Toast */}
          {checkoutBanner && (
            <div className="flex items-center justify-between rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-foreground">
              <div className="flex items-center gap-2.5">
                <CreditCard className="h-4 w-4 shrink-0 text-primary" />
                <span>{checkoutBanner}</span>
              </div>
              <button
                onClick={() => setCheckoutBanner(null)}
                className="ml-4 text-xs font-semibold text-primary hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Hero + Live Subscription Status Row */}
              <div className="grid gap-5 lg:grid-cols-3">
                <div className="fintech-card hero-glow relative overflow-hidden p-6 lg:col-span-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    Your Gateway to Digital Access
                  </div>
                  <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome back,{" "}
                    <span className="text-primary">{displayName}</span>
                  </h1>
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    Manage your encrypted VPN access, virtual verification
                    numbers, and digital library in one trusted Naira-first
                    workspace.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab("store")}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                    >
                      Explore Plans & Store
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab("transactions")}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
                    >
                      View Receipts
                    </button>
                  </div>
                </div>

                {/* Live Subscription Status Light Card */}
                <div className="fintech-card flex flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Subscription Light
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${isSubscribed
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/15 text-red-600 dark:text-red-400"
                          }`}
                      >
                        <span
                          className={
                            isSubscribed
                              ? "status-dot-active"
                              : "status-dot-expired"
                          }
                        />
                        {isSubscribed ? "Active" : "Expired / Inactive"}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <div
                        className={`animate-float-slow flex h-12 w-12 items-center justify-center rounded-xl ${isSubscribed
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                          }`}
                      >
                        {isSubscribed ? (
                          <ShieldCheck className="h-6 w-6" />
                        ) : (
                          <ShieldAlert className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <p className="text-base font-bold">
                          {isSubscribed ? latestPlan : "No Active Plan"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isSubscribed
                            ? "Verified via Paystack • Manual renewal"
                            : "Activate a plan to unlock WireGuard keys"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("store")}
                    className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    {isSubscribed ? "Upgrade / Renew Plan" : "Activate Plan Now"}
                  </button>
                </div>
              </div>

              {/* 4 Fintech KPI Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="fintech-card p-4">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium">Active Plan</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="mt-2 text-lg font-bold">{latestPlan}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Manual NGN billing
                  </p>
                </div>

                <div className="fintech-card p-4">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium">Next Renewal</span>
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-lg font-bold">
                    {isSubscribed ? "30 Days" : "—"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    No auto-debit enabled
                  </p>
                </div>

                <div className="fintech-card p-4">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium">Total Spent</span>
                    <CreditCard className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="mt-2 text-lg font-bold">
                    ₦{totalSpent.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Verified Paystack receipts
                  </p>
                </div>

                <div className="fintech-card p-4">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium">Orders</span>
                    <Wallet className="h-4 w-4 text-sky-500" />
                  </div>
                  <p className="mt-2 text-lg font-bold">{paidOrders.length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Completed Naira purchases
                  </p>
                </div>
              </div>

              {/* Our Services Quick Access */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Our Services</h2>
                  <button
                    onClick={() => setActiveTab("store")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Open Full Store →
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <button
                    onClick={() => setActiveTab("store")}
                    className="fintech-card p-5 text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
                      <Globe className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-semibold">Decentralized VPN</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      65,000+ residential nodes in USA, UK, Germany & Australia
                      from ₦3,999/mo.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("store")}
                    className="fintech-card p-5 text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-semibold">Virtual Numbers</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      One-time OTP verification & 30-day international rentals for
                      global platforms.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("store")}
                    className="fintech-card p-5 text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-500">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-semibold">On-Demand E-Books</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Curated privacy, remote income, and AI playbooks with
                      instant PDF delivery.
                    </p>
                  </button>
                </div>
              </div>

              {/* Testimonials Section */}
              <div>
                <h2 className="mb-3 text-lg font-bold">
                  Trusted by Nigerian Digital Professionals
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {TESTIMONIALS.map((t, idx) => (
                    <div
                      key={idx}
                      className="fintech-card flex flex-col justify-between p-5"
                    >
                      <div>
                        <div className="flex gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          “{t.quote}”
                        </p>
                      </div>
                      <div className="mt-4 border-t border-border pt-3">
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive FAQ Accordion */}
              <div className="fintech-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Everything you need to know about payments, renewals, and
                      VPN setup.
                    </p>
                  </div>
                  <Headphones className="hidden h-5 w-5 text-primary sm:block" />
                </div>

                <div className="mt-4 divide-y divide-border">
                  {FAQS.map((item, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={idx} className="py-3">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between text-left text-sm font-semibold hover:text-primary"
                        >
                          <span>{item.q}</span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""
                              }`}
                          />
                        </button>
                        {isOpen && (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {item.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STORE TAB ================= */}
          {activeTab === "store" && (
            <div className="space-y-10">
              {/* 3-Tier VPN Pricing */}
              <section>
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-500">
                      <span className="status-dot-active" />
                      Live • Instant Provisioning
                    </div>
                    <h2 className="mt-1 text-2xl font-bold">VPN Access Plans</h2>
                    <p className="text-sm text-muted-foreground">
                      Pay in Naira via Bank Transfer or Card. Manual
                      renewal—cancel anytime.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 text-emerald-500" />
                    Secured by Paystack
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                  {VPN_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      className={`fintech-card relative flex flex-col justify-between p-6 ${plan.featured ? "border-primary ring-2 ring-primary/20" : ""
                        }`}
                    >
                      {plan.featured && (
                        <span className="absolute -top-3 right-5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm">
                          {plan.tag}
                        </span>
                      )}

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">
                          {plan.tag}
                        </p>
                        <h3 className="mt-1 text-xl font-bold">{plan.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {plan.description}
                        </p>

                        <div className="mt-5 flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold tracking-tight">
                            {plan.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {plan.period}
                          </span>
                        </div>

                        <ul className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                              <span className="text-muted-foreground">
                                {feat}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        disabled={paying}
                        onClick={() =>
                          handleCheckoutClick(
                            `${plan.name} VPN Plan`,
                            plan.price,
                            plan.id
                          )
                        }
                        className={`mt-6 w-full rounded-lg px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${plan.featured
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                          : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                          }`}
                      >
                        {paying ? "Opening Paystack..." : "Subscribe Now"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3 Best-Selling On-Demand E-Books */}
              <section>
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      Best-Selling Digital E-Books
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      High-demand guides delivered instantly to your dashboard
                      after payment.
                    </p>
                  </div>
                  <span className="hidden rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 sm:inline-block">
                    Instant PDF Delivery
                  </span>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {EBOOKS.map((book) => (
                    <div
                      key={book.id}
                      className="fintech-card flex flex-col overflow-hidden"
                    >
                      <div
                        className={`relative flex h-44 flex-col justify-between bg-gradient-to-br ${book.gradient} p-5 text-white`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
                            {book.tag}
                          </span>
                          <BookOpen className="h-5 w-5 text-white/80" />
                        </div>
                        <div>
                          <p className="text-lg font-bold leading-snug">
                            {book.title}
                          </p>
                          <p className="mt-1 text-[11px] text-white/75">
                            {book.pages}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {book.subtitle}
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                          <span className="text-lg font-bold">{book.price}</span>
                          <button
                            disabled={paying}
                            onClick={() =>
                              handleCheckoutClick(book.title, book.price)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                          >
                            <Zap className="h-3.5 w-3.5" />
                            Buy E-Book
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Virtual Numbers Interactive Selector */}
              <section className="fintech-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold">
                      Virtual Numbers & OTP Verification
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Select a rental duration and platform to request a clean
                      non-VoIP number.
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                    Beta Access
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {NUMBER_DURATIONS.map((d) => {
                    const selected = selectedDuration === d.code;
                    return (
                      <button
                        key={d.code}
                        onClick={() => setSelectedDuration(d.code)}
                        className={`rounded-xl border p-3.5 text-left transition ${selected
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "border-border bg-secondary/40 hover:border-primary/40"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">
                            {d.code}
                          </span>
                          <span className="text-xs font-semibold">
                            {d.price}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {d.label}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Most Requested Platforms
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {POPULAR_PLATFORMS.map((platform) => (
                      <button
                        key={platform}
                        onClick={() => setSelectedPlatform(platform)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${selectedPlatform === platform
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">
                    Selected:{" "}
                    <span className="font-semibold text-foreground">
                      {selectedPlatform} ({selectedDuration})
                    </span>
                  </p>
                  <button
                    disabled={paying}
                    onClick={() => {
                      const dur = NUMBER_DURATIONS.find(
                        (d) => d.code === selectedDuration
                      );
                      handleCheckoutClick(
                        `Virtual Number — ${selectedPlatform} (${selectedDuration})`,
                        dur?.price || "₦1,200"
                      );
                    }}
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    Request Number
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* ================= TRANSACTIONS TAB ================= */}
          {activeTab === "transactions" && (
            <div className="fintech-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Recent Transactions</h2>
                  <p className="text-sm text-muted-foreground">
                    All verified Paystack payments and digital receipts appear
                    here.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("store")}
                  className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  New Purchase
                </button>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Product</th>
                      <th className="pb-3 font-semibold">Channel</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-sm text-muted-foreground"
                        >
                          No transactions recorded yet. Purchase a plan or
                          e-book in the Store to see your verified Naira
                          receipts here.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-secondary/40">
                          <td className="py-3 text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 font-medium capitalize">
                            {order.plan_type} Plan
                          </td>
                          <td className="py-3 text-xs text-muted-foreground">
                            Paystack (NGN)
                          </td>
                          <td className="py-3 font-semibold">
                            ₦{Number(order.amount_ngn).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${order.payment_status === "paid"
                                ? "bg-emerald-500/15 text-emerald-500"
                                : "bg-amber-500/15 text-amber-500"
                                }`}
                            >
                              {order.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === "settings" && (
            <div className="fintech-card p-6">
              <h2 className="text-xl font-bold">Settings & Profile</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account details and localization preferences.
              </p>

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-input bg-secondary/60 px-3.5 py-2.5 text-sm text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone Number (Nigeria)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Save Changes
                  </button>
                  {savedMsg && (
                    <span className="text-xs font-semibold text-emerald-500">
                      ✓ Profile preferences updated
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;