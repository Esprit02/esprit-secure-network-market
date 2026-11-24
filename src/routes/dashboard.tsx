import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
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
  ArrowRight,
  Mail,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  MessageCircle,
  Activity,
  CheckCircle2,
  RefreshCw,
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

function ScrollFloat({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-700 ease-out ${visible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-6 scale-[0.99] opacity-0"
        } ${className}`}
    >
      {children}
    </div>
  );
}

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
      gradient: "from-emerald-900/60 to-[#050811]",
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
      gradient: "from-teal-900/60 to-[#050811]",
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
      gradient: "from-amber-900/50 to-[#050811]",
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
      gradient: "from-cyan-900/60 to-[#050811]",
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
      gradient: "from-teal-900/60 to-[#050811]",
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
      gradient: "from-emerald-950/80 to-[#050811]",
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
      gradient: "from-[#0c162d] to-[#050811]",
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
      gradient: "from-slate-900/80 to-[#050811]",
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
      gradient: "from-teal-950/80 to-[#050811]",
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
      gradient: "from-amber-950/70 to-[#050811]",
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
      gradient: "from-emerald-950/70 to-[#050811]",
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
      gradient: "from-[#0c162d] to-[#050811]",
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
      gradient: "from-amber-950/60 to-[#050811]",
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
      gradient: "from-rose-950/60 to-[#050811]",
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
      gradient: "from-teal-950/70 to-[#050811]",
    },
  ];

const NAV_ITEMS: {
  id: TabKey;
  label: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  badge?: number;
}[] = [
    { id: "dashboard", label: "Overview", icon: Home, accent: "text-[#00F59B]" },
    { id: "vpn", label: "My VPN", icon: Shield, accent: "text-[#00F59B]" },
    {
      id: "sms",
      label: "Virtual SMS",
      icon: Smartphone,
      accent: "text-amber-400",
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      icon: CreditCard,
      accent: "text-orange-400",
    },
    {
      id: "products",
      label: "Digital Products",
      icon: BookOpen,
      accent: "text-emerald-300",
    },
    {
      id: "security",
      label: "Security Tools",
      icon: Lock,
      accent: "text-amber-300",
    },
    {
      id: "billing",
      label: "Billing & Orders",
      icon: Receipt,
      accent: "text-slate-300",
    },
    {
      id: "referrals",
      label: "Referral Program",
      icon: Users,
      accent: "text-[#00F59B]",
    },
    {
      id: "support",
      label: "Support Center",
      icon: HelpCircle,
      accent: "text-orange-300",
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: Settings,
      accent: "text-slate-300",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      accent: "text-amber-400",
      badge: 2,
    },
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
  const [menuOpen, setMenuOpen] = useState(false);
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

  function selectTab(tab: TabKey) {
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  const referralCode = `EA-${(user?.id || "MEMBER").slice(0, 6).toUpperCase()}`;

  const filteredBooks = DIGITAL_PRODUCTS.filter((b) => {
    const matchesNiche = selectedNiche === "All" || b.niche === selectedNiche;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.niche.toLowerCase().includes(q);
    return matchesNiche && matchesQuery;
  });

  const filteredNumbers = VIRTUAL_NUMBERS.filter((n) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      n.country.toLowerCase().includes(q) ||
      n.service.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040812] text-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#00F59B] border-t-transparent" />
          <span className="text-sm font-medium">Loading EspritAccess...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#040812] text-slate-100 antialiased selection:bg-[#00F59B]/25 selection:text-[#00F59B]">
      {/* Deep Obsidian Navy Ambient Emerald & Warm Amber Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(0,245,155,0.09),transparent_40%),radial-gradient(circle_at_88%_25%,rgba(245,158,11,0.06),transparent_38%),radial-gradient(circle_at_50%_92%,rgba(16,185,129,0.07),transparent_44%)]" />

      {/* Top Navigation Bar with Three-Line Hamburger Menu at the Top */}
      <header className="relative z-40 mx-auto w-full max-w-6xl px-4 pt-4 pb-2 sm:px-6">
        <div className="relative flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#081020]/90 px-3.5 py-2.5 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:px-4">
          {/* Left: Top Hamburger Button + Brand */}
          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              aria-label="Toggle Navigation Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#050A15] text-slate-100 transition hover:border-[#00F59B]/45 hover:text-[#00F59B]"
            >
              {menuOpen ? (
                <X className="h-5 w-5 text-amber-400" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <Link to="/" className="group flex items-center gap-2">
              <img
                src="/logo-mark.png"
                alt="EspritAccess"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="h-8 w-8 rounded-lg border border-white/10"
              />
              <span className="hidden text-base font-extrabold tracking-tight text-white sm:inline">
                Esprit<span className="text-[#00F59B]">Access</span>
              </span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="relative min-w-0 max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search VPN, SMS numbers, e-books..."
              className="w-full rounded-full border border-white/[0.08] bg-[#050A15] py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 transition focus:border-[#00F59B]/50 focus:outline-none"
            />
          </div>

          {/* Right: Notifications & Sign Out */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => selectTab("notifications")}
              className="relative rounded-full border border-white/[0.08] bg-[#050A15] p-2 text-slate-200 transition hover:border-amber-400/40"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
            </button>

            <button
              type="button"
              aria-label="Sign Out"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#050A15] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-rose-400/40 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

          {/* Dropdown Menu Panel Opened From Top Hamburger */}
          {menuOpen && (
            <nav
              aria-label="Dashboard Navigation"
              className="absolute left-0 top-[calc(100%+0.6rem)] z-50 w-72 max-w-[92vw] rounded-2xl border border-white/[0.08] bg-[#070E1C]/98 p-3 shadow-[0_24px_64px_rgba(0,0,0,0.92),0_0_32px_rgba(0,245,155,0.12)] backdrop-blur-2xl"
            >
              <div className="mb-2 flex items-center justify-between border-b border-white/[0.07] px-2.5 pb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Sparkles className="h-3.5 w-3.5 text-[#00F59B]" />
                  {displayName}
                </span>
                <span className="rounded-full border border-[#00F59B]/25 bg-[#00F59B]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00F59B]">
                  Products &amp; Tools
                </span>
              </div>

              <div className="max-h-[62vh] space-y-1 overflow-y-auto pr-0.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectTab(item.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${isActive
                          ? "bg-[#00F59B] text-[#040812] shadow-[0_0_16px_rgba(0,245,155,0.25)]"
                          : "border border-transparent text-slate-200 hover:border-white/[0.07] hover:bg-white/[0.05] hover:text-white"
                        }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${isActive ? "text-[#040812]" : item.accent
                            }`}
                        />
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive
                              ? "bg-[#040812] text-[#00F59B]"
                              : "bg-orange-500 text-white"
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2.5 space-y-1.5 border-t border-white/[0.07] pt-2.5">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/[0.07] bg-[#050A15] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-[#00F59B]/35 hover:text-white"
                >
                  <span>Main Website</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#00F59B]" />
                </Link>

                <a
                  href="https://wa.me/2348051309239?text=Hello%20EspritAccess%2C%20I%20need%20help%20with%20my%20dashboard."
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 px-3 py-2.5 text-xs font-bold text-[#040812] shadow-[0_0_20px_rgba(0,245,155,0.25)] transition hover:opacity-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Support
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto w-full max-w-6xl space-y-6 px-4 pb-20 pt-4 sm:px-6">
        {statusMessage && (
          <div className="rounded-2xl border border-[#00F59B]/30 bg-emerald-950/40 px-4 py-3 text-xs font-medium text-emerald-200 backdrop-blur-md">
            {statusMessage}
          </div>
        )}

        {/* ==================== OVERVIEW / REALISTIC OPERATIONS DASHBOARD ==================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Welcome & Live Service Status Banner */}
            <ScrollFloat>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#0B1528]/90 to-[#060B16]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_28px_rgba(0,245,155,0.08)] backdrop-blur-xl sm:p-6">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                    <Activity className="h-3 w-3" />
                    Account Control Center
                  </div>
                  <h1 className="mt-2.5 break-words text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    Welcome back,{" "}
                    <span className="text-[#00F59B]">{displayName}</span>
                  </h1>
                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    Your VPN setup, subscriptions, and digital tools in one
                    place.
                  </p>
                </div>

                <div
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${statusIndicator.pillClass}`}
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusIndicator.dotClass}`}
                  />
                  <div>
                    <p className="text-xs font-bold">{statusIndicator.label}</p>
                    <p className="text-[11px] text-slate-300">
                      {activeKey
                        ? "VPN key active in My VPN"
                        : "No active VPN configuration yet"}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollFloat>

            {/* 4 Key Metric Cards */}
            <ScrollFloat delay={60}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#00F59B]/35 hover:shadow-[0_18px_45px_rgba(0,245,155,0.14)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#00F59B]/25 bg-[#00F59B]/10">
                      <Shield className="h-4 w-4 text-[#00F59B]" />
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${statusIndicator.dotClass}`}
                    />
                  </div>
                  <p className="mt-4 text-sm font-bold text-white">
                    My VPN Status
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {statusIndicator.label}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-amber-400/35 hover:shadow-[0_18px_45px_rgba(245,158,11,0.12)]">
                  <p className="text-[11px] font-medium text-slate-400">
                    Subscription Plan
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-white">
                    {currentPlanName}
                  </p>
                  <button
                    type="button"
                    onClick={() => selectTab("subscriptions")}
                    className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#00F59B] hover:underline"
                  >
                    Manage Subscriptions →
                  </button>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#00F59B]/35">
                  <p className="text-[11px] font-medium text-slate-400">
                    Total Spent
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-white">
                    ₦{totalSpent.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Lifetime ({orders.length} orders)
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-orange-400/35">
                  <p className="text-[11px] font-medium text-slate-400">
                    Referral Bonus
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-white">₦0</p>
                  <button
                    type="button"
                    onClick={() => selectTab("referrals")}
                    className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:underline"
                  >
                    Invite Friends →
                  </button>
                </div>
              </div>
            </ScrollFloat>

            {/* Connection Summary + Quick Actions Grid */}
            <ScrollFloat delay={110}>
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Connection Summary Card */}
                <div className="flex flex-col justify-between rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.78)] backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-bold text-white">
                      Connection Summary
                    </h2>
                    <Link
                      to="/setup-guide"
                      className="text-xs font-semibold text-[#00F59B] hover:underline"
                    >
                      VPN Setup Guide →
                    </Link>
                  </div>

                  {/* Clean Emerald Pulse Line */}
                  <div className="my-6">
                    <svg
                      viewBox="0 0 400 90"
                      className="h-20 w-full overflow-visible"
                    >
                      <defs>
                        <linearGradient
                          id="eaWaveFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#00F59B"
                            stopOpacity="0.28"
                          />
                          <stop
                            offset="100%"
                            stopColor="#00F59B"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 68 Q 55 48, 110 56 T 220 32 T 320 52 T 400 18 L 400 90 L 0 90 Z"
                        fill="url(#eaWaveFill)"
                      />
                      <path
                        d="M0 68 Q 55 48, 110 56 T 220 32 T 320 52 T 400 18"
                        fill="none"
                        stroke="#00F59B"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="border-t border-white/[0.07]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="flex items-center gap-1.5 text-slate-400">
                        <Globe className="h-3.5 w-3.5 text-[#00F59B]" />
                        Supported Platforms
                      </p>
                      <p className="mt-1 font-bold text-white">
                        Android, iOS, Windows
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-slate-400">
                        <Zap className="h-3.5 w-3.5 text-amber-400" />
                        Configuration State
                      </p>
                      <p className="mt-1 font-bold text-white">
                        {statusIndicator.label}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions 2x2 Grid */}
                <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.78)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-base font-bold text-white">
                      <Zap className="h-4 w-4 text-[#00F59B]" />
                      Quick Actions
                    </h2>
                    <span className="text-[11px] text-slate-400">
                      Instant Workspace
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => selectTab("vpn")}
                      className="group rounded-2xl border border-white/[0.07] bg-[#050A15]/90 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#00F59B]/40 hover:shadow-[0_12px_30px_rgba(0,245,155,0.12)]"
                    >
                      <Shield className="h-5 w-5 text-[#00F59B]" />
                      <p className="mt-3 text-xs font-bold text-white">
                        My VPN
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Connection &amp; key
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectTab("sms")}
                      className="group rounded-2xl border border-white/[0.07] bg-[#050A15]/90 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-[0_12px_30px_rgba(245,158,11,0.12)]"
                    >
                      <Smartphone className="h-5 w-5 text-amber-400" />
                      <p className="mt-3 text-xs font-bold text-white">
                        Virtual SMS
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Receive OTPs
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectTab("products")}
                      className="group rounded-2xl border border-white/[0.07] bg-[#050A15]/90 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/40 hover:shadow-[0_12px_30px_rgba(16,185,129,0.12)]"
                    >
                      <BookOpen className="h-5 w-5 text-emerald-300" />
                      <p className="mt-3 text-xs font-bold text-white">
                        Digital Products
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        E-books &amp; guides
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectTab("security")}
                      className="group rounded-2xl border border-white/[0.07] bg-[#050A15]/90 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-orange-400/40 hover:shadow-[0_12px_30px_rgba(251,146,60,0.12)]"
                    >
                      <Lock className="h-5 w-5 text-orange-400" />
                      <p className="mt-3 text-xs font-bold text-white">
                        Security Tools
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Password generator
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </ScrollFloat>

            {/* My VPN Configuration + Need Setup Instructions */}
            <ScrollFloat delay={150}>
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.78)] backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2 text-base font-bold text-white">
                      <KeyRound className="h-4 w-4 text-[#00F59B]" />
                      My VPN Configuration
                    </h3>
                    <span className="rounded-full border border-white/[0.1] bg-[#050A15] px-3 py-1 text-[11px] font-semibold text-slate-300">
                      {statusIndicator.label}
                    </span>
                  </div>

                  {activeKey ? (
                    <div className="mt-4 space-y-3">
                      <div className="break-all rounded-2xl border border-[#00F59B]/25 bg-[#050A15] p-3.5 font-mono text-xs text-[#00F59B]">
                        {activeKey}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyKey(activeKey)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#00F59B] px-5 py-2.5 text-xs font-bold text-[#040812] transition hover:bg-emerald-300"
                      >
                        {copiedKey ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied Key
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy Configuration Key
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <p className="text-xs leading-relaxed text-slate-400">
                        Choose a plan in Subscriptions to retrieve your VPN
                        configuration.
                      </p>
                      <button
                        type="button"
                        onClick={() => selectTab("subscriptions")}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00F59B] px-5 py-2.5 text-xs font-bold text-[#040812] shadow-[0_0_20px_rgba(0,245,155,0.25)] transition hover:bg-emerald-300"
                      >
                        View Plans
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.78)] backdrop-blur-xl">
                  <h3 className="text-base font-bold text-white">
                    Need Setup Instructions?
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Follow step-by-step instructions for Android, iOS, and
                    Windows to connect in under 2 minutes.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link
                      to="/setup-guide"
                      className="inline-flex items-center gap-2 rounded-full bg-[#00F59B] px-5 py-2.5 text-xs font-bold text-[#040812] shadow-[0_0_20px_rgba(0,245,155,0.25)] transition hover:bg-emerald-300"
                    >
                      Open Setup Guide →
                    </Link>
                    <button
                      type="button"
                      onClick={() => selectTab("billing")}
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#050A15] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-amber-400/40"
                    >
                      Order History ({orders.length})
                    </button>
                  </div>
                </div>
              </div>
            </ScrollFloat>
          </div>
        )}

        {/* ==================== MY VPN TAB ==================== */}
        {activeTab === "vpn" && (
          <ScrollFloat>
            <div className="space-y-5 rounded-3xl border border-white/[0.07] bg-[#081020]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    My VPN Workspace
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    View your private residential VPN key and connection setup.
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold ${statusIndicator.pillClass}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${statusIndicator.dotClass}`}
                  />
                  {statusIndicator.label}
                </span>
              </div>

              {activeKey ? (
                <div className="space-y-4 rounded-2xl border border-[#00F59B]/30 bg-[#050A15] p-5">
                  <p className="text-xs font-semibold text-slate-300">
                    Active Access Key ({currentPlanName})
                  </p>
                  <div className="break-all rounded-xl border border-white/[0.08] bg-[#040812] p-4 font-mono text-xs text-[#00F59B]">
                    {activeKey}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopyKey(activeKey)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#00F59B] px-5 py-2.5 text-xs font-bold text-[#040812] hover:bg-emerald-300"
                    >
                      {copiedKey ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copiedKey ? "Copied to Clipboard" : "Copy VPN Key"}
                    </button>
                    <Link
                      to="/setup-guide"
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#081020] px-5 py-2.5 text-xs font-semibold text-white hover:border-[#00F59B]/40"
                    >
                      Setup Instructions
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.07] bg-[#050A15] p-6">
                  <p className="text-sm font-bold text-white">
                    No Active VPN Key Found
                  </p>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Activate a Standard, Plus, or Pro plan to generate your
                    private VPN configuration immediately.
                  </p>
                  <button
                    type="button"
                    onClick={() => selectTab("subscriptions")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00F59B] px-5 py-2.5 text-xs font-bold text-[#040812] hover:bg-emerald-300"
                  >
                    Choose a VPN Plan
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </ScrollFloat>
        )}

        {/* ==================== VIRTUAL SMS TAB ==================== */}
        {activeTab === "sms" && (
          <ScrollFloat>
            <div className="space-y-5 rounded-3xl border border-white/[0.07] bg-[#081020]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-xl">
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  International Virtual SMS Numbers
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Receive instant one-time verification codes (OTPs) or rent a
                  dedicated 30-day international line.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredNumbers.map((item) => (
                  <div
                    key={item.code}
                    className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#050A15]/95 p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-400/35"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {item.country} ({item.dialCode})
                        </span>
                        <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                          {item.tag}
                        </span>
                      </div>

                      <p className="mt-3 text-base font-bold text-white">
                        {item.service}
                      </p>
                      <p className="mt-1 font-mono text-xs text-[#00F59B]">
                        {item.sampleNumber}
                      </p>
                      <p className="mt-2 text-[11px] text-slate-400">
                        {item.type} • {item.delivery}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                      <span className="text-base font-extrabold text-white">
                        ₦{item.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        disabled={payingCode === item.code}
                        onClick={() =>
                          handleCheckout(
                            item.code,
                            `${item.country} - ${item.service}`,
                            item.price
                          )
                        }
                        className="rounded-full bg-[#00F59B] px-4 py-2 text-xs font-bold text-[#040812] transition hover:bg-emerald-300 disabled:opacity-50"
                      >
                        {payingCode === item.code
                          ? "Opening..."
                          : "Order Number"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== SUBSCRIPTIONS TAB ==================== */}
        {activeTab === "subscriptions" && (
          <ScrollFloat>
            <div className="space-y-6 rounded-3xl border border-white/[0.07] bg-[#081020]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-xl">
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  VPN Subscription Plans
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Select a plan below to pay securely via Paystack and unlock
                  your VPN key.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {PRICING_PLANS.map((plan) => {
                  const numericPrice = parsePriceNgn(plan.priceDisplay);
                  const isFeatured = plan.id === "plus";
                  return (
                    <div
                      key={plan.id}
                      className={`flex flex-col justify-between rounded-2xl p-6 transition duration-300 hover:-translate-y-1 ${isFeatured
                          ? "border border-[#00F59B]/40 bg-[#050A15] shadow-[0_18px_50px_rgba(0,245,155,0.14)]"
                          : "border border-white/[0.07] bg-[#050A15]/85"
                        }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-white">
                            {plan.name}
                          </h3>
                          <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                            {plan.billingPeriod}
                          </span>
                        </div>
                        <p className="mt-3 text-3xl font-extrabold text-white">
                          {plan.priceDisplay}
                        </p>
                        <p className="mt-1 text-xs text-[#00F59B]">
                          {plan.billingLabel}
                        </p>
                        <p className="mt-3 text-xs text-slate-400">
                          {plan.summary}
                        </p>

                        <ul className="mt-5 space-y-2 text-xs text-slate-200">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00F59B]" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 border-t border-white/[0.07] pt-4">
                        <button
                          type="button"
                          disabled={payingCode === plan.id}
                          onClick={() =>
                            handleCheckout(plan.id, plan.name, numericPrice)
                          }
                          className="w-full rounded-full bg-[#00F59B] py-3 text-xs font-bold text-[#040812] shadow-[0_0_20px_rgba(0,245,155,0.22)] transition hover:bg-emerald-300 disabled:opacity-50"
                        >
                          {payingCode === plan.id
                            ? "Launching Paystack..."
                            : `Activate ${plan.name}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== DIGITAL PRODUCTS TAB ==================== */}
        {activeTab === "products" && (
          <ScrollFloat>
            <div className="space-y-5 rounded-3xl border border-white/[0.07] bg-[#081020]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    Digital Library &amp; E-Books
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Instant PDF + EPUB downloads curated for growth, finance,
                    and wellness.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {BOOK_NICHES.map((niche) => (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => setSelectedNiche(niche)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${selectedNiche === niche
                          ? "bg-[#00F59B] text-[#040812]"
                          : "border border-white/[0.08] bg-[#050A15] text-slate-300 hover:border-white/20"
                        }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBooks.map((book) => (
                  <div
                    key={book.code}
                    className={`flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-gradient-to-b ${book.gradient} p-5 transition duration-300 hover:-translate-y-1 hover:border-[#00F59B]/35`}
                  >
                    <div className="flex gap-3.5">
                      <img
                        src={book.cover}
                        alt={book.title}
                        loading="lazy"
                        className="h-24 w-16 shrink-0 rounded-lg border border-white/10 object-cover"
                      />
                      <div className="min-w-0">
                        <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                          {book.niche}
                        </span>
                        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">
                          {book.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {book.author}
                        </p>
                        <p className="mt-1 text-[11px] text-[#00F59B]">
                          {book.format} • ★ {book.rating}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3.5">
                      <span className="text-sm font-extrabold text-white">
                        ₦{book.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        disabled={payingCode === book.code}
                        onClick={() =>
                          handleCheckout(book.code, book.title, book.price)
                        }
                        className="rounded-full bg-[#00F59B] px-4 py-1.5 text-xs font-bold text-[#040812] transition hover:bg-emerald-300 disabled:opacity-50"
                      >
                        {payingCode === book.code ? "Opening..." : "Buy E-Book"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== SECURITY TOOLS TAB ==================== */}
        {activeTab === "security" && (
          <ScrollFloat>
            <div className="space-y-5 rounded-3xl border border-white/[0.07] bg-[#081020]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-xl">
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  Privacy &amp; Password Generator
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Generate high-entropy client-side passwords directly in your
                  browser.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#050A15] p-5">
                <p className="text-xs font-semibold text-slate-400">
                  Generated 16-Character Password
                </p>
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#00F59B]/25 bg-[#040812] px-4 py-3">
                  <span className="break-all font-mono text-sm font-bold text-[#00F59B]">
                    {generatedPass}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyKey(generatedPass)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#00F59B] px-4 py-1.5 text-xs font-bold text-[#040812] hover:bg-emerald-300"
                    >
                      {copiedKey ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedKey ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#081020] px-4 py-1.5 text-xs font-semibold text-white hover:border-amber-400/40"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== BILLING & ORDERS TAB ==================== */}
        {activeTab === "billing" && (
          <ScrollFloat>
            <div className="space-y-4 rounded-3xl border border-white/[0.07] bg-[#081020]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    Billing &amp; Transaction History
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    All verified Paystack payments and order references.
                  </p>
                </div>
                <span className="rounded-full border border-[#00F59B]/25 bg-[#00F59B]/10 px-3 py-1 text-xs font-bold text-[#00F59B]">
                  Total: ₦{totalSpent.toLocaleString()}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.07] bg-[#050A15] p-6 text-center">
                  <p className="text-sm font-bold text-white">
                    No transactions recorded yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Your Paystack receipts and order IDs will appear here once
                    you activate a service.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-[#050A15] p-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">
                          {order.plan_name || order.plan_code || "Service Order"}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                          Ref: {order.reference || order.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-[#00F59B]">
                          ₦{(Number(order.amount_ngn) || 0).toLocaleString()}
                        </p>
                        <p className="text-[11px] capitalize text-slate-400">
                          {order.status || "confirmed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollFloat>
        )}

        {/* ==================== REFERRAL PROGRAM TAB ==================== */}
        {activeTab === "referrals" && (
          <ScrollFloat>
            <div className="space-y-4 rounded-3xl border border-white/[0.07] bg-[#081020]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-xl">
              <h2 className="text-xl font-extrabold text-white">
                Referral Program
              </h2>
              <p className="text-xs text-slate-400">
                Share your EspritAccess referral code with friends and earn
                account rewards when they subscribe.
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/25 bg-[#050A15] p-4">
                <div>
                  <p className="text-[11px] text-slate-400">
                    Your Referral Code
                  </p>
                  <p className="mt-0.5 font-mono text-base font-extrabold text-amber-300">
                    {referralCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(referralCode);
                    setCopiedRef(true);
                    setTimeout(() => setCopiedRef(false), 2000);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#00F59B] px-5 py-2 text-xs font-bold text-[#040812] hover:bg-emerald-300"
                >
                  {copiedRef ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copiedRef ? "Copied Code" : "Copy Code"}
                </button>
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== SUPPORT CENTER TAB ==================== */}
        {activeTab === "support" && (
          <ScrollFloat>
            <div className="space-y-4 rounded-3xl border border-white/[0.07] bg-[#081020]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-xl">
              <h2 className="text-xl font-extrabold text-white">
                Support Center
              </h2>
              <p className="text-xs text-slate-400">
                Need fast help setting up your VPN, verifying an OTP number, or
                confirming an order? Reach us directly.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href="https://wa.me/2348051309239?text=Hello%20EspritAccess%2C%20I%20need%20support%20with%20my%20account."
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-[#00F59B]/30 bg-[#050A15] p-5 transition hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-6 w-6 text-[#00F59B]" />
                  <p className="mt-3 text-sm font-bold text-white">
                    WhatsApp Support Desk
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Chat directly with EspritAccess support (+234 805 130 9239)
                  </p>
                </a>

                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="rounded-2xl border border-white/[0.07] bg-[#050A15] p-5 transition hover:-translate-y-0.5 hover:border-amber-400/35"
                >
                  <Mail className="h-6 w-6 text-amber-400" />
                  <p className="mt-3 text-sm font-bold text-white">
                    Email Support
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{SUPPORT_EMAIL}</p>
                </a>
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== ACCOUNT SETTINGS TAB ==================== */}
        {activeTab === "settings" && (
          <ScrollFloat>
            <div className="grid gap-5 rounded-3xl border border-white/[0.07] bg-[#081020]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-xl md:grid-cols-2">
              <form
                onSubmit={handleUpdateProfile}
                className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#050A15] p-5"
              >
                <h3 className="text-base font-bold text-white">
                  Profile Information
                </h3>
                <div>
                  <label className="text-xs text-slate-400">Account Email</label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || ""}
                    className="mt-1 w-full rounded-xl border border-white/[0.07] bg-[#040812] px-3.5 py-2.5 text-xs text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Display Name</label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder={displayName}
                    className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#040812] px-3.5 py-2.5 text-xs text-white focus:border-[#00F59B]/50 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="rounded-full bg-[#00F59B] px-5 py-2.5 text-xs font-bold text-[#040812] hover:bg-emerald-300 disabled:opacity-50"
                >
                  Save Profile
                </button>
              </form>

              <form
                onSubmit={handleUpdatePassword}
                className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#050A15] p-5"
              >
                <h3 className="text-base font-bold text-white">
                  Update Password
                </h3>
                <div>
                  <label className="text-xs text-slate-400">
                    New Password (min. 8 characters)
                  </label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password"
                    className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#040812] px-3.5 py-2.5 text-xs text-white focus:border-[#00F59B]/50 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="rounded-full bg-[#00F59B] px-5 py-2.5 text-xs font-bold text-[#040812] hover:bg-emerald-300 disabled:opacity-50"
                >
                  Update Password
                </button>
              </form>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== NOTIFICATIONS TAB ==================== */}
        {activeTab === "notifications" && (
          <ScrollFloat>
            <div className="space-y-3 rounded-3xl border border-white/[0.07] bg-[#081020]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.82)] backdrop-blur-xl">
              <h2 className="text-xl font-extrabold text-white">
                Notifications
              </h2>
              <div className="rounded-2xl border border-[#00F59B]/25 bg-[#050A15] p-4">
                <p className="text-xs font-bold text-[#00F59B]">
                  Welcome to EspritAccess
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Your dashboard is active. Choose any subscription plan or
                  virtual SMS number whenever you are ready.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-400/25 bg-[#050A15] p-4">
                <p className="text-xs font-bold text-amber-300">
                  Instant WhatsApp Support Available
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Tap the menu button at the top left to jump to any product,
                  tool, or support channel.
                </p>
              </div>
            </div>
          </ScrollFloat>
        )}
      </main>
    </div>
  );
}