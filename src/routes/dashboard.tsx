import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { PAYSTACK_PUBLIC_KEY, generateReference } from "@/lib/paystack";
import { finalizePaystackOrder } from "@/lib/paystack.functions";
import {
  PRICING_PLANS,
  SUPPORT_EMAIL,
  type ConnectionStatus,
  generateClientPassword,
  getConnectionIndicator,
} from "../espritTrust";
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
  ExternalLink,
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

interface PaystackInlineClient {
  setup: (options: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    callback: (response: { reference: string }) => void;
    onClose: () => void;
  }) => { openIframe: () => void };
}

function getPaystackInline(): PaystackInlineClient | undefined {
  return (window as unknown as { PaystackPop?: PaystackInlineClient })
    .PaystackPop;
}

const COMMUNITY_SHOWCASE = [
  {
    title: "Remote Office & Teams",
    subtitle: "Encrypted connections for developers, designers, and agencies.",
    badge: "Lagos • Abuja • Global",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=75",
  },
  {
    title: "Borderless Digital Work",
    subtitle: "Access global tools, AI platforms, and client portals reliably.",
    badge: "Multi-Region Access",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=75",
  },
  {
    title: "Instant Mobile & OTP Access",
    subtitle: "Verify apps and stay protected on the move from any device.",
    badge: "iOS • Android • PC",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=75",
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
    delivery: "Fast SMS Delivery",
    successRate: "Standard Carrier Route",
    price: 2500,
    tag: "Popular",
  },
  {
    code: "sms-uk-tg",
    country: "United Kingdom",
    iso: "gb",
    dialCode: "+44",
    sampleNumber: "+44 7700 900412",
    service: "Telegram & Signal",
    type: "One-Time OTP",
    delivery: "Fast SMS Delivery",
    successRate: "UK Carrier Route",
    price: 3000,
    tag: "UK Line",
  },
  {
    code: "sms-us-ai",
    country: "United States",
    iso: "us",
    dialCode: "+1",
    sampleNumber: "+1 (646) 512-8830",
    service: "OpenAI / ChatGPT / Claude",
    type: "One-Time OTP",
    delivery: "Fast SMS Delivery",
    successRate: "US Carrier Route",
    price: 2200,
    tag: "US Line",
  },
  {
    code: "sms-ca-google",
    country: "Canada",
    iso: "ca",
    dialCode: "+1",
    sampleNumber: "+1 (416) 555-0194",
    service: "Google / Gmail / YouTube",
    type: "One-Time OTP",
    delivery: "Fast SMS Delivery",
    successRate: "CA Carrier Route",
    price: 2800,
    tag: "CA Line",
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
    successRate: "30-Day Rental",
    price: 9500,
    tag: "30-Day",
  },
  {
    code: "sms-nl-fintech",
    country: "Netherlands",
    iso: "nl",
    dialCode: "+31",
    sampleNumber: "+31 6 2489 1104",
    service: "PayPal / Wise / Stripe OTP",
    type: "One-Time OTP",
    delivery: "Fast SMS Delivery",
    successRate: "EU Carrier Route",
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
      gradient: "from-emerald-700/90 to-slate-950",
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
      gradient: "from-teal-800/90 to-slate-950",
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
      gradient: "from-amber-700/90 to-slate-950",
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
      gradient: "from-cyan-800/90 to-slate-950",
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
      gradient: "from-teal-700/90 to-slate-950",
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
      gradient: "from-emerald-800/90 to-slate-950",
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
      gradient: "from-[#142B4A] to-slate-950",
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
      gradient: "from-slate-700 to-slate-950",
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
      gradient: "from-teal-800/90 to-slate-950",
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
      gradient: "from-amber-700/90 to-slate-950",
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
      gradient: "from-emerald-700/90 to-slate-950",
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
      gradient: "from-[#142B4A] to-slate-950",
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
      gradient: "from-amber-800/90 to-slate-950",
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
      gradient: "from-rose-900/80 to-slate-950",
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
      gradient: "from-teal-900/90 to-slate-950",
    },
  ];

const SIDEBAR_ITEMS: {
  id: TabKey;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number;
}[] = [
    { id: "dashboard", label: "Home", icon: Home },
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

function parsePriceNgn(priceDisplay: string): number {
  const digits = priceDisplay.replace(/[^\d]/g, "");
  return Number(digits) || 0;
}

function ensurePaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (getPaystackInline()) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
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

  // Security & Settings states
  const [generatedPass, setGeneratedPass] = useState(() =>
    generateClientPassword(16)
  );
  const [fullNameInput, setFullNameInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!data.user) {
        await navigate({ to: "/auth" });
        return;
      }
      setUser(data.user);
      await fetchOrders(data.user.id);
      if (mounted) setLoading(false);
    }
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        if (!session?.user) {
          void navigate({ to: "/auth" });
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
    if (!error && data) setOrders(data as OrderRecord[]);
  }

  function handleGeneratePassword() {
    setGeneratedPass(generateClientPassword(16));
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!fullNameInput.trim()) return;
    setSavingSettings(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullNameInput.trim() },
    });
    setSavingSettings(false);
    setStatusMessage(
      error ? error.message : "Profile name updated successfully."
    );
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPasswordInput.length < 8) {
      setStatusMessage("Password must be at least 8 characters.");
      return;
    }
    setSavingSettings(true);
    const { error } = await supabase.auth.updateUser({
      password: newPasswordInput,
    });
    setSavingSettings(false);
    setNewPasswordInput("");
    setStatusMessage(error ? error.message : "Password updated successfully.");
  }

  async function handleCheckout(code: string, name: string, price: number) {
    if (!user?.email) return;
    setPayingCode(code);
    setStatusMessage(null);

    const publicKey =
      PAYSTACK_PUBLIC_KEY || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
      setStatusMessage(
        "Paystack public key is missing. Check VITE_PAYSTACK_PUBLIC_KEY in your environment settings."
      );
      setPayingCode(null);
      return;
    }

    try {
      await ensurePaystackScript();
      const PaystackPop = getPaystackInline();
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
        callback: (response: { reference: string }) => {
          void (async () => {
            try {
              await (
                finalizePaystackOrder as (args: {
                  data: {
                    reference: string;
                    planCode: string;
                    userId: string;
                    email: string;
                  };
                }) => Promise<unknown>
              )({
                data: {
                  reference: response.reference,
                  planCode: code,
                  userId: user.id,
                  email: user.email!,
                },
              });
              setStatusMessage(
                `Payment confirmed for ${name}. Your account records have been refreshed.`
              );
              await fetchOrders(user.id);
              setActiveTab("dashboard");
            } catch {
              setStatusMessage("Payment received. Refreshing your dashboard...");
              await fetchOrders(user.id);
            } finally {
              setPayingCode(null);
            }
          })();
        },
        onClose: () => {
          setPayingCode(null);
        },
      });
      handler.openIframe();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to open Paystack checkout. Please try again.";
      setStatusMessage(msg);
      setPayingCode(null);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth" });
  }

  function handleCopyKey(val: string) {
    void navigator.clipboard.writeText(val);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Member";
  const latestKeyOrder = orders.find((o) => o.vpn_key);
  const activeKey = latestKeyOrder?.vpn_key || null;
  const connectionStatus: ConnectionStatus = activeKey
    ? "connected"
    : "disconnected";
  const statusIndicator = getConnectionIndicator(connectionStatus);
  const totalSpent = orders.reduce(
    (sum, o) => sum + (Number(o.amount_ngn) || 0),
    0
  );
  const currentPlanName =
    latestKeyOrder?.plan_name || (activeKey ? "Pro Plan" : "No Active Plan");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c192c] text-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
          <span className="text-sm font-medium">Loading EspritAccess...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-x-hidden bg-[#0c192c] text-slate-100">
      {/* Left Sidebar (Desktop) */}
      <aside className="relative z-10 hidden w-64 shrink-0 flex-col justify-between border-r border-slate-800 bg-[#142B4A]/95 p-4 lg:flex">
        <div>
          <Link to="/" className="group mb-6 flex items-center gap-2.5 px-2 pt-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981] text-sm font-black text-[#0c192c]">
              EA
            </span>
            <div>
              <p className="text-base font-bold leading-tight text-white">
                Esprit<span className="text-emerald-400">Access</span>
              </p>
              <p className="text-[10px] text-slate-300 transition group-hover:text-emerald-300">
                View Main Website ↗
              </p>
            </div>
          </Link>

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
                      ? "bg-[#10B981] text-[#0c192c]"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
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
            className="flex w-full items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left transition hover:border-amber-400"
          >
            <div className="flex items-center gap-2.5">
              <Crown className="h-4 w-4 text-amber-300" />
              <div>
                <p className="text-xs font-bold text-white">Upgrade Plan</p>
                <p className="text-[10px] text-slate-300">
                  Monthly &amp; annual options
                </p>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("support")}
            className="flex w-full items-center gap-2.5 rounded-xl border border-slate-700 bg-[#0c192c] p-3 text-left transition hover:border-emerald-400"
          >
            <Mail className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-white">Need Help?</p>
              <p className="truncate text-[10px] text-slate-300">
                {SUPPORT_EMAIL}
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Right Main Panel */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-800 bg-[#142B4A]/95 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="relative min-w-0 max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search VPN, SMS numbers, e-books..."
              className="w-full rounded-full border border-slate-700 bg-[#0c192c] py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-full border border-slate-700 bg-[#0c192c] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white md:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
              Main Site
            </Link>

            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className="relative rounded-full border border-slate-700 bg-[#0c192c] p-2 text-slate-200 transition hover:border-emerald-400"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-[#0c192c] px-3 py-1.5 sm:flex">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10B981] text-[11px] font-bold text-[#0c192c]">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-[130px] truncate text-xs font-bold text-emerald-300">
                {displayName}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-[#0c192c] px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-rose-400 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Nav Strip */}
        <div className="flex w-full gap-2 overflow-x-auto border-b border-slate-800 bg-[#142B4A] px-4 py-2.5 lg:hidden">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${activeTab === item.id
                  ? "bg-[#10B981] text-[#0c192c]"
                  : "border border-slate-700 bg-[#0c192c] text-slate-300"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
          {statusMessage && (
            <div className="rounded-xl border border-emerald-500/35 bg-emerald-950/40 px-4 py-3 text-xs font-medium text-emerald-200">
              {statusMessage}
            </div>
          )}

          {/* HOME / DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="break-words text-xl font-extrabold text-white sm:text-2xl">
                    Welcome back,{" "}
                    <span className="text-emerald-400">{displayName}</span>
                  </h1>
                  <p className="mt-1 text-xs text-slate-300">
                    Your VPN setup, subscriptions, and digital tools in one
                    place.
                  </p>
                </div>

                <div
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 ${statusIndicator.pillClass}`}
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusIndicator.dotClass}`}
                  />
                  <div>
                    <p className="text-xs font-bold">{statusIndicator.label}</p>
                    <p className="text-[11px] text-slate-300">
                      {activeKey
                        ? "VPN key available in My VPN"
                        : "No active VPN configuration yet"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-5">
                  <div className="flex items-center justify-between">
                    <Shield className="h-6 w-6 text-emerald-400" />
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${statusIndicator.dotClass}`}
                    />
                  </div>
                  <p className="mt-4 text-sm font-bold text-white">
                    My VPN Status
                  </p>
                  <p className="text-xs text-slate-300">
                    {statusIndicator.label}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-5">
                  <p className="text-[11px] font-medium text-slate-300">
                    Subscription Plan
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-white">
                    {currentPlanName}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("subscriptions")}
                    className="mt-1 text-[11px] font-semibold text-emerald-400 hover:underline"
                  >
                    Manage Subscriptions →
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-5">
                  <p className="text-[11px] font-medium text-slate-300">
                    Total Spent
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-white">
                    ₦{totalSpent.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Lifetime ({orders.length} orders)
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-5">
                  <p className="text-[11px] font-medium text-slate-300">
                    Referral Bonus
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-white">₦0</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("referrals")}
                    className="mt-1 text-[11px] font-semibold text-emerald-400 hover:underline"
                  >
                    Invite Friends →
                  </button>
                </div>
              </div>

              {/* Community & Office Connection Showcase */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">
                    Built for Modern Work &amp; Connection
                  </h2>
                  <span className="text-[11px] text-emerald-400">
                    EspritAccess
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {COMMUNITY_SHOWCASE.map((item) => (
                    <div
                      key={item.title}
                      className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-[#142B4A]"
                    >
                      <div className="relative h-36 w-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#142B4A] via-[#142B4A]/40 to-transparent" />
                        <span className="absolute left-3 top-3 rounded-full border border-slate-600 bg-[#0c192c]/85 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                          {item.badge}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-300">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Overview + Quick Actions */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-5 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white">
                      Connection Summary
                    </h2>
                    <Link
                      to="/setup-guide"
                      className="text-xs font-semibold text-emerald-400 hover:underline"
                    >
                      VPN Setup Guide →
                    </Link>
                  </div>

                  <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_170px]">
                    <svg viewBox="0 0 400 120" className="h-32 w-full">
                      <defs>
                        <linearGradient id="eaTeal" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0%"
                            stopColor="#10B981"
                            stopOpacity="0.35"
                          />
                          <stop
                            offset="100%"
                            stopColor="#10B981"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 95 Q 50 65, 100 80 T 200 55 T 300 68 T 400 25 L 400 120 L 0 120 Z"
                        fill="url(#eaTeal)"
                      />
                      <path
                        d="M0 95 Q 50 65, 100 80 T 200 55 T 300 68 T 400 25"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="space-y-3 border-t border-slate-700/80 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                      <div>
                        <p className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <Globe className="h-3.5 w-3.5 text-emerald-400" />
                          Supported Platforms
                        </p>
                        <p className="text-sm font-bold text-white">
                          Android, iOS, Windows
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <Zap className="h-3.5 w-3.5 text-emerald-400" />
                          Configuration State
                        </p>
                        <p className="text-sm font-bold text-white">
                          {statusIndicator.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-5">
                  <h2 className="flex items-center gap-1.5 text-sm font-bold text-white">
                    <Zap className="h-4 w-4 text-emerald-400" /> Quick Actions
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "My VPN",
                        sub: "Connection & key",
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
                        sub: "E-books",
                        tab: "products" as TabKey,
                        icon: BookOpen,
                      },
                      {
                        label: "Security Tools",
                        sub: "Password generator",
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
                          className="rounded-xl border border-slate-700 bg-[#0c192c] p-3 text-left transition hover:border-emerald-400"
                        >
                          <Icon className="h-4 w-4 text-emerald-400" />
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

              {/* Active VPN Key + Banner */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-emerald-400" />
                      <h2 className="text-sm font-bold text-white">
                        My VPN Configuration
                      </h2>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statusIndicator.pillClass}`}
                    >
                      {statusIndicator.label}
                    </span>
                  </div>

                  {activeKey ? (
                    <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-slate-700 bg-[#0c192c] px-3.5 py-2.5 font-mono text-xs text-emerald-300">
                      <span className="truncate">{activeKey}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyKey(activeKey)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#10B981] px-3.5 py-1.5 font-sans text-xs font-bold text-[#0c192c]"
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
                      <p className="text-xs text-slate-300">
                        Choose a plan in Subscriptions to retrieve your VPN
                        configuration.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("subscriptions")}
                        className="shrink-0 rounded-full bg-[#10B981] px-5 py-2 text-xs font-bold text-[#0c192c] transition hover:bg-emerald-400"
                      >
                        View Plans
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-700/80 bg-[#142B4A] p-5">
                  <div>
                    <p className="text-base font-extrabold text-white">
                      Need Setup Instructions?
                    </p>
                    <p className="mt-1 text-xs text-slate-300">
                      Follow step-by-step instructions for Android, iOS, and
                      Windows.
                    </p>
                    <Link
                      to="/setup-guide"
                      className="mt-3 inline-block rounded-full bg-[#10B981] px-4 py-1.5 text-xs font-bold text-[#0c192c] transition hover:bg-emerald-400"
                    >
                      Open Setup Guide →
                    </Link>
                  </div>
                  <Sparkles className="hidden h-10 w-10 text-emerald-400 sm:block" />
                </div>
              </div>
            </div>
          )}

          {/* MY VPN TAB */}
          {activeTab === "vpn" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">My VPN</h1>
                  <p className="text-xs text-slate-300">
                    Connection status, configuration details, and device setup.
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusIndicator.pillClass}`}
                >
                  {statusIndicator.label}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
                <h2 className="text-sm font-bold text-white">
                  Configuration Key
                </h2>
                {activeKey ? (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-slate-700 bg-[#0c192c] px-4 py-3 font-mono text-xs text-emerald-300">
                    <span className="truncate">{activeKey}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(activeKey)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#10B981] px-4 py-1.5 font-sans text-xs font-bold text-[#0c192c]"
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
                  <p className="mt-2 text-xs text-slate-300">
                    No active VPN key on this account yet. Visit{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("subscriptions")}
                      className="font-semibold text-emerald-400 underline"
                    >
                      Subscriptions
                    </button>{" "}
                    to select a plan.
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/setup-guide"
                    className="rounded-full bg-[#10B981] px-4 py-2 text-xs font-bold text-[#0c192c] transition hover:bg-emerald-400"
                  >
                    Android, iOS &amp; Windows Setup Guide
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab("subscriptions")}
                    className="rounded-full border border-slate-600 bg-[#0c192c] px-4 py-2 text-xs font-semibold text-white transition hover:border-emerald-400"
                  >
                    Manage Subscriptions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBSCRIPTIONS TAB */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
                <p className="text-xs text-slate-300">
                  Review monthly vs. annual billing periods before paying in
                  NGN via Paystack.
                </p>
              </div>
              <div className="grid gap-5 lg:grid-cols-3">
                {PRICING_PLANS.map((plan) => {
                  const amountNgn = parsePriceNgn(plan.priceDisplay);
                  const isFeatured = plan.id === "plus";
                  return (
                    <div
                      key={plan.id}
                      className={`flex flex-col justify-between rounded-2xl p-6 ${isFeatured
                          ? "border border-emerald-400/60 bg-[#142B4A]"
                          : "border border-slate-700/80 bg-[#142B4A]"
                        }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xl font-bold text-white">
                            {plan.name}
                          </h3>
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                            {plan.billingPeriod}
                          </span>
                        </div>
                        <p className="mt-3 text-3xl font-extrabold text-white">
                          {plan.priceDisplay}
                        </p>
                        <p className="mt-1 text-xs font-medium text-emerald-300">
                          {plan.billingLabel}
                        </p>
                        <p className="mt-2 text-xs text-slate-300">
                          {plan.summary}
                        </p>
                        <ul className="mt-4 space-y-2 text-xs text-slate-200">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-center gap-2">
                              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6 border-t border-slate-700/80 pt-4">
                        <p className="mb-3 text-[11px] text-slate-300">
                          {plan.preCheckoutNote}
                        </p>
                        <button
                          type="button"
                          disabled={payingCode === plan.id}
                          onClick={() =>
                            handleCheckout(plan.id, plan.name, amountNgn)
                          }
                          className="w-full rounded-full bg-[#10B981] py-2.5 text-xs font-bold text-[#0c192c] transition hover:bg-emerald-400 disabled:opacity-60"
                        >
                          {payingCode === plan.id
                            ? "Opening Paystack..."
                            : `Pay ${plan.priceDisplay}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                  <p className="text-xs text-slate-300">
                    Select a number option and pay in Naira via Paystack.
                  </p>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                  NGN Checkout Ready
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {VIRTUAL_NUMBERS.map((num) => (
                  <div
                    key={num.code}
                    className="flex flex-col justify-between rounded-2xl border border-slate-700/80 bg-[#142B4A] p-5"
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
                        <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                          {num.tag}
                        </span>
                      </div>

                      <div className="mt-3 rounded-xl border border-slate-700 bg-[#0c192c] px-3 py-2 font-mono text-xs text-emerald-300">
                        Sample: {num.sampleNumber}
                      </div>

                      <p className="mt-3 text-sm font-semibold text-white">
                        {num.service}
                      </p>

                      <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                        <p>
                          Type:{" "}
                          <span className="text-slate-100">{num.type}</span>
                        </p>
                        <p>
                          Delivery:{" "}
                          <span className="text-emerald-300">
                            {num.delivery}
                          </span>
                        </p>
                        <p>
                          Route:{" "}
                          <span className="text-slate-100">
                            {num.successRate}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-700/80 pt-4">
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
                        className="rounded-full bg-[#10B981] px-4 py-2 text-xs font-bold text-[#0c192c] transition hover:bg-emerald-400 disabled:opacity-60"
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
                  E-books &amp; Digital Library
                </h1>
                <p className="text-xs text-slate-300">
                  Browse e-books across Finance, Health, Self-Development,
                  Gospel, and Novels.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {BOOK_NICHES.map((niche) => (
                  <button
                    key={niche}
                    type="button"
                    onClick={() => setSelectedNiche(niche)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${selectedNiche === niche
                        ? "bg-[#10B981] text-[#0c192c]"
                        : "border border-slate-700 bg-[#142B4A] text-slate-200 hover:border-emerald-400"
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
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-700/80 bg-[#142B4A]"
                  >
                    <div
                      className={`flex items-center gap-4 bg-gradient-to-br ${book.gradient} p-4`}
                    >
                      <img
                        src={book.cover}
                        alt={book.title}
                        loading="lazy"
                        className="h-28 w-20 shrink-0 rounded-lg border border-white/15 object-cover"
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
                        <p className="text-[10px] text-slate-300">
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
                        className="rounded-full bg-[#10B981] px-4 py-2 text-xs font-bold text-[#0c192c] transition hover:bg-emerald-400 disabled:opacity-60"
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
            <div className="rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
              <h2 className="text-lg font-bold text-white">
                Billing &amp; Payment History
              </h2>
              {orders.length === 0 ? (
                <p className="mt-3 text-xs text-slate-300">No payments yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between rounded-xl border border-slate-700 bg-[#0c192c] px-4 py-3 text-xs"
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
                        <p className="font-bold text-emerald-400">
                          ₦{(o.amount_ngn || 0).toLocaleString()}
                        </p>
                        <p className="uppercase text-slate-200">
                          {o.status || "Paid"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECURITY TOOLS TAB */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Security &amp; Privacy Tools
                </h1>
                <p className="text-xs text-slate-300">
                  Generate strong passwords locally in your browser and review
                  your VPN state.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-4 rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <KeyRound className="h-5 w-5" />
                    <h2 className="text-sm font-bold text-white">
                      Strong Password Generator
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300">
                    Generate a 16-character password in your browser for your
                    accounts.
                  </p>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-700 bg-[#0c192c] px-3.5 py-2.5 font-mono text-xs text-emerald-300">
                    <span className="truncate">{generatedPass}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(generatedPass)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#10B981] px-3 py-1.5 font-sans text-xs font-bold text-[#0c192c]"
                    >
                      {copiedKey ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedKey ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="w-full rounded-full border border-slate-600 bg-[#0c192c] py-2 text-xs font-bold text-white transition hover:border-emerald-400"
                  >
                    Generate New Password
                  </button>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Shield className="h-5 w-5" />
                    <h2 className="text-sm font-bold text-white">
                      Connection Overview
                    </h2>
                  </div>
                  {[
                    { label: "Account Authentication", status: "Supabase Auth" },
                    { label: "VPN Configuration", status: statusIndicator.label },
                    { label: "Setup Guide", status: "Android / iOS / Windows" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-slate-700 bg-[#0c192c] px-4 py-2.5 text-xs"
                    >
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-bold text-emerald-300">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Account Settings
                </h1>
                <p className="text-xs text-slate-300">
                  Manage your profile details, login password, and active
                  session.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-4 rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6"
                >
                  <h2 className="text-sm font-bold text-white">
                    Profile Information
                  </h2>
                  <div>
                    <label className="block text-xs text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#0c192c] px-3.5 py-2.5 text-xs text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                      placeholder={displayName}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#0c192c] px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="rounded-full bg-[#10B981] px-6 py-2.5 text-xs font-bold text-[#0c192c] transition hover:bg-emerald-400 disabled:opacity-60"
                  >
                    {savingSettings ? "Saving..." : "Save Profile"}
                  </button>
                </form>

                <form
                  onSubmit={handleUpdatePassword}
                  className="space-y-4 rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6"
                >
                  <h2 className="text-sm font-bold text-white">
                    Change Password
                  </h2>
                  <div>
                    <label className="block text-xs text-slate-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#0c192c] px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="rounded-full bg-[#10B981] px-6 py-2.5 text-xs font-bold text-[#0c192c] transition hover:bg-emerald-400 disabled:opacity-60"
                  >
                    Update Password
                  </button>

                  <div className="border-t border-slate-700/80 pt-4">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-500/35 bg-rose-950/30 px-4 py-2 text-xs font-bold text-rose-200 hover:bg-rose-950/50"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out of Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SUPPORT CENTER TAB */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Support Center
                </h1>
                <p className="text-xs text-slate-300">
                  Contact us for VPN setup assistance, virtual numbers, or
                  billing questions.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
                  <Mail className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Email Support
                  </h3>
                  <p className="text-xs text-slate-300">
                    Reach our team at{" "}
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="text-emerald-400 underline"
                    >
                      {SUPPORT_EMAIL}
                    </a>
                    .
                  </p>
                </div>
                <div className="space-y-2 rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
                  <HelpCircle className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Setup &amp; Policies
                  </h3>
                  <p className="text-xs text-slate-300">
                    Review the{" "}
                    <Link
                      to="/setup-guide"
                      className="text-emerald-400 underline"
                    >
                      VPN Setup Guide
                    </Link>
                    ,{" "}
                    <Link
                      to="/refund-policy"
                      className="text-emerald-400 underline"
                    >
                      Refund Policy
                    </Link>
                    , or{" "}
                    <Link to="/terms" className="text-emerald-400 underline">
                      Terms of Service
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* REFERRAL PROGRAM TAB */}
          {activeTab === "referrals" && (
            <div className="space-y-4 rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <Users className="h-5 w-5" />
                <h2 className="text-lg font-bold text-white">
                  Referral Program
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                Share your personal EspritAccess referral link with friends.
              </p>
              <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-700 bg-[#0c192c] px-4 py-3 font-mono text-xs text-emerald-300">
                <span className="truncate">
                  {`https://www.espritaccess.com.ng/auth?ref=${user?.id.slice(0, 8)}`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      `https://www.espritaccess.com.ng/auth?ref=${user?.id.slice(0, 8)}`
                    );
                    setCopiedRef(true);
                    setTimeout(() => setCopiedRef(false), 2000);
                  }}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#10B981] px-3.5 py-1.5 font-sans text-xs font-bold text-[#0c192c]"
                >
                  {copiedRef ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copiedRef ? "Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-4 rounded-2xl border border-slate-700/80 bg-[#142B4A] p-6">
              <h2 className="text-lg font-bold text-white">Notifications</h2>
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-700 bg-[#0c192c] p-4">
                  <p className="text-xs font-bold text-white">
                    Welcome to EspritAccess
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Your account is active. Explore My VPN, Subscriptions,
                    Virtual SMS, or Digital Products.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-[#0c192c] p-4">
                  <p className="text-xs font-bold text-white">
                    Paystack NGN Checkout Ready
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    NGN checkout is configured for supported payment methods.
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