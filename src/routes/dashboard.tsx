import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { PAYSTACK_PUBLIC_KEY, generateReference } from "@/lib/paystack";
import { finalizePaystackOrder } from "@/lib/paystack.functions";
import {
  Home,
  Shield,
  Smartphone,
  CreditCard,
  Lock,
  BookOpen,
  HelpCircle,
  Settings,
  Receipt,
  Users,
  Bell,
  Search,
  LogOut,
  Copy,
  Check,
  KeyRound,
  Zap,
  Globe,
  Crown,
  ArrowRight,
  Mail,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type TabKey =
  | "dashboard"
  | "vpn"
  | "sms"
  | "subscriptions"
  | "security"
  | "products"
  | "support"
  | "settings"
  | "billing"
  | "referrals"
  | "notifications";

type BookNiche =
  | "All"
  | "Finance"
  | "Health"
  | "Self-Development"
  | "Gospel"
  | "Novel";

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

const VPN_PLANS = [
  {
    code: "standard",
    name: "Standard Plan",
    tag: "STARTER",
    price: 4000,
    period: "/ month",
    features: [
      "1 High-Speed VPN Key",
      "Instant Paystack Activation",
      "Zero-Logs Tunnel",
    ],
  },
  {
    code: "plus",
    name: "Plus Plan",
    tag: "MOST POPULAR",
    price: 8500,
    period: "/ month",
    featured: true,
    features: [
      "Up to 3 Devices",
      "Priority Global Servers",
      "Virtual SMS Access",
    ],
  },
  {
    code: "pro",
    name: "Pro Plan",
    tag: "ALL ACCESS",
    price: 14000,
    period: "/ year",
    features: [
      "Unlimited Bandwidth",
      "Marketplace Discounts",
      "24/7 Priority Support",
    ],
  },
];

const VIRTUAL_NUMBERS = [
  {
    code: "sms-us-wa",
    country: "United States",
    iso: "us",
    dialCode: "+1",
    sampleNumber: "+1 (415) 890-4421",
    service: "WhatsApp / Business",
    type: "One-Time OTP",
    delivery: "Instant (10–30s)",
    successRate: "99.2%",
    price: 2500,
    tag: "Most Popular",
  },
  {
    code: "sms-uk-tg",
    country: "United Kingdom",
    iso: "gb",
    dialCode: "+44",
    sampleNumber: "+44 7700 900412",
    service: "Telegram & Signal",
    type: "One-Time OTP",
    delivery: "Instant (10–30s)",
    successRate: "98.8%",
    price: 3000,
    tag: "High Trust",
  },
  {
    code: "sms-us-ai",
    country: "United States",
    iso: "us",
    dialCode: "+1",
    sampleNumber: "+1 (646) 512-8830",
    service: "OpenAI / ChatGPT / Claude",
    type: "One-Time OTP",
    delivery: "Instant",
    successRate: "99.5%",
    price: 2200,
    tag: "AI Ready",
  },
  {
    code: "sms-ca-google",
    country: "Canada",
    iso: "ca",
    dialCode: "+1",
    sampleNumber: "+1 (416) 555-0194",
    service: "Google / Gmail / YouTube",
    type: "One-Time OTP",
    delivery: "Instant",
    successRate: "98.4%",
    price: 2800,
    tag: "Clean IP",
  },
  {
    code: "sms-uk-rent",
    country: "United Kingdom",
    iso: "gb",
    dialCode: "+44",
    sampleNumber: "+44 7911 123456",
    service: "All Apps (30-Day Rental)",
    type: "Private Dedicated Line",
    delivery: "Active for 30 Days",
    successRate: "99.9%",
    price: 9500,
    tag: "Reusable",
  },
  {
    code: "sms-nl-fintech",
    country: "Netherlands",
    iso: "nl",
    dialCode: "+31",
    sampleNumber: "+31 6 2489 1104",
    service: "PayPal / Wise / Stripe OTP",
    type: "One-Time OTP",
    delivery: "Instant",
    successRate: "97.9%",
    price: 3500,
    tag: "EU Line",
  },
];

const BOOK_NICHES: BookNiche[] = [
  "All",
  "Finance",
  "Health",
  "Self-Development",
  "Gospel",
  "Novel",
];

const DIGITAL_PRODUCTS: {
  code: string;
  title: string;
  author: string;
  niche: Exclude<BookNiche, "All">;
  format: string;
  rating: string;
  price: number;
  cover: string;
  gradient: string;
}[] = [
    {
      code: "book-fin-1",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      niche: "Finance",
      format: "PDF + EPUB",
      rating: "4.9",
      price: 2500,
      cover: "https://covers.openlibrary.org/b/isbn/9780857197689-M.jpg",
      gradient: "from-emerald-600 to-teal-950",
    },
    {
      code: "book-fin-2",
      title: "Rich Dad Poor Dad",
      author: "Robert T. Kiyosaki",
      niche: "Finance",
      format: "PDF + EPUB",
      rating: "4.8",
      price: 2000,
      cover: "https://covers.openlibrary.org/b/isbn/9781612680194-M.jpg",
      gradient: "from-purple-700 to-indigo-950",
    },
    {
      code: "book-fin-3",
      title: "The Richest Man in Babylon",
      author: "George S. Clason",
      niche: "Finance",
      format: "PDF + EPUB",
      rating: "4.9",
      price: 1800,
      cover: "https://covers.openlibrary.org/b/isbn/9780451205360-M.jpg",
      gradient: "from-amber-600 to-stone-950",
    },
    {
      code: "book-hlt-1",
      title: "Why We Sleep",
      author: "Matthew Walker",
      niche: "Health",
      format: "PDF + EPUB",
      rating: "4.8",
      price: 2500,
      cover: "https://covers.openlibrary.org/b/isbn/9781501144318-M.jpg",
      gradient: "from-sky-600 to-blue-950",
    },
    {
      code: "book-hlt-2",
      title: "Outlive: The Science & Art of Longevity",
      author: "Peter Attia, MD",
      niche: "Health",
      format: "PDF + EPUB",
      rating: "4.9",
      price: 3000,
      cover: "https://covers.openlibrary.org/b/isbn/9780593236598-M.jpg",
      gradient: "from-cyan-600 to-slate-950",
    },
    {
      code: "book-hlt-3",
      title: "How Not to Die",
      author: "Dr. Michael Greger",
      niche: "Health",
      format: "PDF + EPUB",
      rating: "4.8",
      price: 2500,
      cover: "https://covers.openlibrary.org/b/isbn/9781250066114-M.jpg",
      gradient: "from-green-600 to-emerald-950",
    },
    {
      code: "book-dev-1",
      title: "Atomic Habits",
      author: "James Clear",
      niche: "Self-Development",
      format: "PDF + EPUB",
      rating: "4.9",
      price: 2500,
      cover: "https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg",
      gradient: "from-blue-600 to-indigo-950",
    },
    {
      code: "book-dev-2",
      title: "Deep Work",
      author: "Cal Newport",
      niche: "Self-Development",
      format: "PDF + EPUB",
      rating: "4.8",
      price: 2200,
      cover: "https://covers.openlibrary.org/b/isbn/9781455586691-M.jpg",
      gradient: "from-slate-600 to-slate-950",
    },
    {
      code: "book-dev-3",
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen R. Covey",
      niche: "Self-Development",
      format: "PDF + EPUB",
      rating: "4.9",
      price: 2500,
      cover: "https://covers.openlibrary.org/b/isbn/9780743269513-M.jpg",
      gradient: "from-indigo-600 to-blue-950",
    },
    {
      code: "book-gos-1",
      title: "The Purpose Driven Life",
      author: "Rick Warren",
      niche: "Gospel",
      format: "PDF + EPUB",
      rating: "4.9",
      price: 2000,
      cover: "https://covers.openlibrary.org/b/isbn/9780310205715-M.jpg",
      gradient: "from-amber-500 to-orange-950",
    },
    {
      code: "book-gos-2",
      title: "Good Morning, Holy Spirit",
      author: "Benny Hinn",
      niche: "Gospel",
      format: "PDF + EPUB",
      rating: "4.9",
      price: 2000,
      cover: "https://covers.openlibrary.org/b/isbn/9780785271765-M.jpg",
      gradient: "from-blue-500 to-cyan-950",
    },
    {
      code: "book-gos-3",
      title: "Battlefield of the Mind",
      author: "Joyce Meyer",
      niche: "Gospel",
      format: "PDF + EPUB",
      rating: "4.8",
      price: 2200,
      cover: "https://covers.openlibrary.org/b/isbn/9780446691093-M.jpg",
      gradient: "from-violet-600 to-purple-950",
    },
    {
      code: "book-nov-1",
      title: "The Alchemist",
      author: "Paulo Coelho",
      niche: "Novel",
      format: "PDF + EPUB",
      rating: "4.9",
      price: 2000,
      cover: "https://covers.openlibrary.org/b/isbn/9780062315007-M.jpg",
      gradient: "from-orange-600 to-amber-950",
    },
    {
      code: "book-nov-2",
      title: "Things Fall Apart",
      author: "Chinua Achebe",
      niche: "Novel",
      format: "PDF + EPUB",
      rating: "4.9",
      price: 1800,
      cover: "https://covers.openlibrary.org/b/isbn/9780385474542-M.jpg",
      gradient: "from-red-700 to-stone-950",
    },
    {
      code: "book-nov-3",
      title: "Purple Hibiscus",
      author: "Chimamanda Ngozi Adichie",
      niche: "Novel",
      format: "PDF + EPUB",
      rating: "4.8",
      price: 2200,
      cover: "https://covers.openlibrary.org/b/isbn/9781616202415-M.jpg",
      gradient: "from-fuchsia-700 to-purple-950",
    },
  ];

const SIDEBAR_ITEMS: { id: TabKey; label: string; icon: any; badge?: number }[] =
  [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "vpn", label: "My VPN", icon: Shield },
    { id: "sms", label: "Virtual SMS", icon: Smartphone },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "security", label: "Security Tools", icon: Lock },
    { id: "products", label: "Digital Products", icon: BookOpen },
    { id: "support", label: "Support Center", icon: HelpCircle },
    { id: "settings", label: "Account Settings", icon: Settings },
    { id: "billing", label: "Billing & Payments", icon: Receipt },
    { id: "referrals", label: "Referral Program", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 2 },
  ];

function ensurePaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).PaystackPop) {
      resolve();
      return;
    }
    const existing = document.querySelector(
      'script[src="https://js.paystack.co/v1/inline.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Paystack script failed to load"))
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Paystack script failed to load"));
    document.head.appendChild(script);
  });
}

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [payingCode, setPayingCode] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState<BookNiche>("All");

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
      (_e, session) => {
        if (!session?.user) navigate({ to: "/auth" });
        else setUser(session.user);
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
    if (!error && data) setOrders(data as OrderRecord[]);
  }

  async function handleCheckout(code: string, name: string, price: number) {
    if (!user?.email) return;
    setPayingCode(code);
    setStatusMessage(null);

    const publicKey =
      PAYSTACK_PUBLIC_KEY || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
      setStatusMessage(
        "Paystack public key is missing. Check VITE_PAYSTACK_PUBLIC_KEY in Vercel."
      );
      setPayingCode(null);
      return;
    }

    try {
      await ensurePaystackScript();
      const PaystackPop = (window as any).PaystackPop;
      if (!PaystackPop) {
        setStatusMessage(
          "Paystack popup was blocked. Please disable ad-blockers and try again."
        );
        setPayingCode(null);
        return;
      }

      const reference = generateReference();
      const handler = PaystackPop.setup({
        key: publicKey,
        email: user.email,
        amount: price * 100,
        currency: "NGN",
        ref: reference,
        callback: async (response: { reference: string }) => {
          try {
            await (finalizePaystackOrder as any)({
              data: {
                reference: response.reference,
                planCode: code,
                userId: user.id,
                email: user.email,
              },
            });
            setStatusMessage(
              `Payment confirmed! ${name} is now active on your account.`
            );
            await fetchOrders(user.id);
            setActiveTab("dashboard");
          } catch {
            setStatusMessage("Payment received. Refreshing your dashboard...");
            await fetchOrders(user.id);
          } finally {
            setPayingCode(null);
          }
        },
        onClose: () => setPayingCode(null),
      });
      handler.openIframe();
    } catch (err: any) {
      setStatusMessage(
        err?.message || "Unable to open Paystack checkout. Please try again."
      );
      setPayingCode(null);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  function handleCopyKey(val: string) {
    navigator.clipboard.writeText(val);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Member";
  const latestKeyOrder = orders.find((o) => o.vpn_key);
  const activeKey = latestKeyOrder?.vpn_key || null;
  const totalSpent = orders.reduce(
    (sum, o) => sum + (Number(o.amount_ngn) || 0),
    0
  );
  const currentPlanName =
    latestKeyOrder?.plan_name || (activeKey ? "Pro Plan" : "No Active Plan");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm font-medium">Loading EspritAccess...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-[#030712] text-slate-100">
      {/* Left Sidebar (Desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-blue-500/15 bg-[#050b18] p-4 lg:flex">
        <div>
          <div className="mb-6 flex items-center gap-2.5 px-2 pt-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-[0_0_18px_rgba(37,99,235,0.7)]">
              EA
            </span>
            <div>
              <p className="text-base font-bold leading-tight text-white">
                Esprit<span className="text-blue-400">Access</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Your Gateway to Digital Access
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${active
                      ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.55)]"
                      : "text-slate-400 hover:bg-blue-950/40 hover:text-white"
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={() => setActiveTab("subscriptions")}
            className="flex w-full items-center justify-between rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-blue-950/40 p-3 text-left transition hover:border-amber-400/60"
          >
            <div className="flex items-center gap-2.5">
              <Crown className="h-4 w-4 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-white">Upgrade to Pro</p>
                <p className="text-[10px] text-slate-400">
                  Unlock more features
                </p>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("support")}
            className="flex w-full items-center gap-2.5 rounded-xl border border-blue-500/20 bg-[#070f24] p-3 text-left transition hover:border-blue-400/50"
          >
            <Mail className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-xs font-bold text-white">Need Help?</p>
              <p className="text-[10px] text-slate-400">
                support@espritaccess.com
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Right Main Panel (min-w-0 prevents mobile horizontal overflow) */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-blue-500/15 bg-[#030712]/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="relative min-w-0 flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-xl border border-blue-500/20 bg-[#070f24] py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className="relative rounded-xl border border-blue-500/20 bg-[#070f24] p-2 text-slate-300 hover:border-blue-400"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <div className="hidden items-center gap-2 rounded-xl border border-blue-500/20 bg-[#070f24] px-3 py-1.5 sm:flex">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-[120px] truncate text-xs font-semibold text-white">
                {displayName}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/20 bg-[#070f24] px-3 py-2 text-xs font-semibold text-slate-300 hover:border-blue-400 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Nav Strip */}
        <div className="flex w-full gap-2 overflow-x-auto border-b border-blue-500/15 bg-[#050b18] px-4 py-2.5 lg:hidden">
          {SIDEBAR_ITEMS.slice(0, 6).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "bg-[#070f24] text-slate-400"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
          {statusMessage && (
            <div className="rounded-xl border border-blue-500/40 bg-blue-950/60 px-4 py-3 text-xs font-medium text-blue-200">
              {statusMessage}
            </div>
          )}

          {/* DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="break-words text-xl font-extrabold text-white sm:text-2xl">
                    Welcome back,{" "}
                    <span className="text-blue-400">{displayName}</span> 👋
                  </h1>
                  <p className="mt-1 text-xs text-slate-400">
                    Your digital access is just a click away.
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-400">
                      {activeKey ? "Active & Secure" : "Ready to Activate"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {activeKey
                        ? "Your connection is protected"
                        : "Select a plan to connect"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 KPI Stat Cards */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 shadow-[0_0_25px_rgba(37,99,235,0.35)]">
                  <div className="flex items-center justify-between">
                    <Shield className="h-6 w-6 text-white" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-white">Active VPN</p>
                  <p className="text-xs text-blue-100">
                    {activeKey ? "Connected" : "Not Activated"}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-[#08122b] p-5">
                  <p className="text-[11px] font-medium text-slate-400">
                    Subscription Plan
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-white">
                    {currentPlanName}
                  </p>
                  <p className="mt-1 text-[11px] text-blue-400">
                    {activeKey ? "Instant Vault Active" : "Upgrade anytime"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-indigo-700 to-purple-900 p-5">
                  <p className="text-[11px] font-medium text-indigo-200">
                    Total Spent
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-white">
                    ₦{totalSpent.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] text-indigo-200">
                    Lifetime ({orders.length} orders)
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-sky-900/80 to-blue-950 p-5">
                  <p className="text-[11px] font-medium text-sky-200">
                    Referral Bonus
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-white">₦0</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("referrals")}
                    className="mt-1 text-[11px] font-semibold text-sky-300 hover:underline"
                  >
                    Invite Friends →
                  </button>
                </div>
              </div>

              {/* Activity Overview + Quick Actions */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-blue-500/20 bg-[#070f24] p-5 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white">
                      Your Activity Overview
                    </h2>
                    <span className="rounded-lg border border-blue-500/20 bg-[#030712] px-2.5 py-1 text-[11px] text-slate-400">
                      Last 30 Days
                    </span>
                  </div>

                  <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_160px]">
                    <svg viewBox="0 0 400 120" className="h-32 w-full">
                      <defs>
                        <linearGradient id="eaGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity="0.45"
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 95 Q 50 65, 100 80 T 200 55 T 300 68 T 400 25 L 400 120 L 0 120 Z"
                        fill="url(#eaGlow)"
                      />
                      <path
                        d="M0 95 Q 50 65, 100 80 T 200 55 T 300 68 T 400 25"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="space-y-3 border-t border-blue-500/15 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                      <div>
                        <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Globe className="h-3.5 w-3.5 text-blue-400" />{" "}
                          Countries Accessed
                        </p>
                        <p className="text-lg font-bold text-white">4</p>
                        <p className="text-[10px] text-slate-500">
                          USA, UK, Germany, Canada
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Zap className="h-3.5 w-3.5 text-amber-400" /> Data
                          Protected
                        </p>
                        <p className="text-lg font-bold text-white">
                          {activeKey ? "12.5 GB" : "0.0 GB"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-blue-500/20 bg-[#070f24] p-5">
                  <h2 className="flex items-center gap-1.5 text-sm font-bold text-white">
                    <Zap className="h-4 w-4 text-blue-400" /> Quick Actions
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Connect VPN",
                        sub: "View your key",
                        tab: "vpn" as TabKey,
                        icon: Shield,
                      },
                      {
                        label: "Virtual SMS",
                        sub: "Receive OTPs",
                        tab: "sms" as TabKey,
                        icon: Smartphone,
                      },
                      {
                        label: "Digital Products",
                        sub: "E-books & kits",
                        tab: "products" as TabKey,
                        icon: BookOpen,
                      },
                      {
                        label: "Security Tools",
                        sub: "Stay extra safe",
                        tab: "security" as TabKey,
                        icon: Lock,
                      },
                    ].map((qa) => {
                      const Icon = qa.icon;
                      return (
                        <button
                          key={qa.label}
                          type="button"
                          onClick={() => setActiveTab(qa.tab)}
                          className="rounded-xl border border-blue-500/20 bg-[#0b1633] p-3 text-left transition hover:border-blue-400"
                        >
                          <Icon className="h-4 w-4 text-blue-400" />
                          <p className="mt-2 text-xs font-bold text-white">
                            {qa.label}
                          </p>
                          <p className="text-[10px] text-slate-400">{qa.sub}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Active VPN Key + Promo Banner */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-blue-500/30 bg-[#070f24] p-5">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-blue-400" />
                    <h2 className="text-sm font-bold text-white">
                      Your Active VPN Key
                    </h2>
                  </div>
                  {activeKey ? (
                    <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-blue-500/25 bg-[#030712] px-3.5 py-2.5 font-mono text-xs text-blue-300">
                      <span className="truncate">{activeKey}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyKey(activeKey)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 font-sans text-xs font-semibold text-white hover:bg-blue-500"
                      >
                        {copiedKey ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copiedKey ? "Copied" : "Copy"}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-400">
                        Activate a VPN plan to unlock your encrypted key
                        immediately.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("subscriptions")}
                        className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-[0_0_18px_rgba(37,99,235,0.6)] hover:bg-blue-500"
                      >
                        Get a VPN Key
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/60 via-[#081538] to-blue-600/30 p-5">
                  <div>
                    <p className="text-base font-extrabold text-white">
                      Unlock the World with EspritAccess
                    </p>
                    <p className="mt-1 text-xs text-blue-200">
                      Stream. Work. Connect. Without Limits.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("subscriptions")}
                      className="mt-3 rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-blue-50"
                    >
                      Explore Plans →
                    </button>
                  </div>
                  <Sparkles className="hidden h-10 w-10 text-blue-300 sm:block" />
                </div>
              </div>
            </div>
          )}

          {/* MY VPN & SUBSCRIPTIONS TABS */}
          {(activeTab === "vpn" || activeTab === "subscriptions") && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  VPN Plans & Access
                </h1>
                <p className="text-xs text-slate-400">
                  Pay in Naira via Paystack for instant key delivery.
                </p>
              </div>
              <div className="grid gap-5 lg:grid-cols-3">
                {VPN_PLANS.map((plan) => (
                  <div
                    key={plan.code}
                    className={`flex flex-col justify-between rounded-2xl p-6 ${plan.featured
                        ? "border-2 border-blue-500 bg-[#08122b] shadow-[0_0_30px_rgba(37,99,235,0.25)]"
                        : "border border-blue-500/20 bg-[#070f24]"
                      }`}
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                        {plan.tag}
                      </span>
                      <h3 className="mt-1 text-xl font-bold text-white">
                        {plan.name}
                      </h3>
                      <p className="mt-3 text-3xl font-extrabold text-white">
                        ₦{plan.price.toLocaleString()}
                        <span className="text-xs font-normal text-slate-400">
                          {" "}
                          {plan.period}
                        </span>
                      </p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-300">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-blue-400" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      disabled={payingCode === plan.code}
                      onClick={() =>
                        handleCheckout(plan.code, plan.name, plan.price)
                      }
                      className="mt-6 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-60"
                    >
                      {payingCode === plan.code
                        ? "Opening Paystack..."
                        : `Pay ₦${plan.price.toLocaleString()}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIRTUAL SMS TAB */}
          {activeTab === "sms" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Virtual SMS Numbers
                  </h1>
                  <p className="text-xs text-slate-400">
                    Clean, non-VoIP numbers for instant OTP verification—paid in
                    Naira.
                  </p>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                  ● Live Stock Available
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {VIRTUAL_NUMBERS.map((num) => (
                  <div
                    key={num.code}
                    className="flex flex-col justify-between rounded-2xl border border-blue-500/20 bg-[#070f24] p-5 transition hover:border-blue-400/60"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2.5 text-sm font-bold text-white">
                          <img
                            src={`https://flagcdn.com/w40/${num.iso}.png`}
                            alt={num.country}
                            className="h-4 w-6 rounded-sm object-cover"
                            loading="lazy"
                          />
                          {num.country} ({num.dialCode})
                        </span>
                        <span className="shrink-0 rounded-md bg-blue-600/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                          {num.tag}
                        </span>
                      </div>

                      <div className="mt-3 rounded-lg border border-blue-500/15 bg-[#030712] px-3 py-2 font-mono text-xs text-blue-300">
                        Sample: {num.sampleNumber}
                      </div>

                      <p className="mt-3 text-sm font-semibold text-white">
                        {num.service}
                      </p>

                      <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                        <p>
                          Type:{" "}
                          <span className="text-slate-200">{num.type}</span>
                        </p>
                        <p>
                          Delivery:{" "}
                          <span className="text-emerald-400">
                            {num.delivery}
                          </span>
                        </p>
                        <p>
                          Success Rate:{" "}
                          <span className="text-slate-200">
                            {num.successRate}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-blue-500/15 pt-4">
                      <p className="text-xl font-extrabold text-white">
                        ₦{num.price.toLocaleString()}
                      </p>
                      <button
                        type="button"
                        disabled={payingCode === num.code}
                        onClick={() =>
                          handleCheckout(
                            num.code,
                            `${num.country} ${num.service}`,
                            num.price
                          )
                        }
                        className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-500 disabled:opacity-60"
                      >
                        {payingCode === num.code ? "Opening..." : "Get Number"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIGITAL PRODUCTS / E-BOOKS TAB */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  E-books & Digital Library
                </h1>
                <p className="text-xs text-slate-400">
                  Best-selling e-books across Finance, Health, Self-Development,
                  Gospel, and Novels.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {BOOK_NICHES.map((niche) => (
                  <button
                    key={niche}
                    type="button"
                    onClick={() => setSelectedNiche(niche)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${selectedNiche === niche
                        ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                        : "border border-blue-500/20 bg-[#070f24] text-slate-300 hover:border-blue-400"
                      }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {DIGITAL_PRODUCTS.filter(
                  (b) => selectedNiche === "All" || b.niche === selectedNiche
                ).map((book) => (
                  <div
                    key={book.code}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-500/20 bg-[#070f24] transition hover:border-blue-400/60"
                  >
                    <div
                      className={`flex items-center gap-4 bg-gradient-to-br ${book.gradient} p-4`}
                    >
                      <img
                        src={book.cover}
                        alt={book.title}
                        loading="lazy"
                        className="h-28 w-20 shrink-0 rounded-lg border border-white/20 object-cover shadow-lg"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/80">
                          <span>{book.niche}</span>
                          <span>★ {book.rating}</span>
                        </div>
                        <h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-snug text-white">
                          {book.title}
                        </h3>
                        <p className="mt-1 text-[11px] text-white/80">
                          {book.author}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-[10px] text-slate-400">
                          {book.format}
                        </p>
                        <p className="text-lg font-extrabold text-white">
                          ₦{book.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={payingCode === book.code}
                        onClick={() =>
                          handleCheckout(book.code, book.title, book.price)
                        }
                        className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-60"
                      >
                        {payingCode === book.code ? "Opening..." : "Buy E-book"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BILLING & PAYMENTS TAB */}
          {activeTab === "billing" && (
            <div className="rounded-2xl border border-blue-500/20 bg-[#070f24] p-6">
              <h2 className="text-lg font-bold text-white">
                Billing & Payment History
              </h2>
              {orders.length === 0 ? (
                <p className="mt-3 text-xs text-slate-400">No payments yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between rounded-xl border border-blue-500/15 bg-[#030712] px-4 py-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {o.plan_name || o.plan_code || "Order"}
                        </p>
                        <p className="text-slate-400">
                          Ref: {o.reference || o.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-400">
                          ₦{(o.amount_ngn || 0).toLocaleString()}
                        </p>
                        <p className="uppercase text-emerald-400">
                          {o.status || "Paid"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REMAINING TABS */}
          {(activeTab === "security" ||
            activeTab === "support" ||
            activeTab === "settings" ||
            activeTab === "referrals" ||
            activeTab === "notifications") && (
              <div className="space-y-3 rounded-2xl border border-blue-500/20 bg-[#070f24] p-6">
                <h2 className="text-lg font-bold capitalize text-white">
                  {activeTab}
                </h2>
                <p className="text-xs text-slate-400">
                  Signed in as{" "}
                  <span className="font-semibold text-white">{user?.email}</span>.
                  Need instant help? Reach out to{" "}
                  <span className="text-blue-400">support@espritaccess.com</span>{" "}
                  or click the WhatsApp support button below.
                </p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}