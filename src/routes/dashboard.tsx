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
import {
  finalizePaystackOrder,
  listMyKeys,
  type VpnPlanType,
} from "@/lib/paystack.functions";
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

type BillingCycle = "monthly" | "yearly";

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
  plan_type?: string;
  amount_ngn?: number;
  status?: string;
  payment_status?: string;
  reference?: string;
  reference_id?: string;
  vpn_key?: string;
  created_at?: string;
}

interface AssignedKeyRecord {
  id: string;
  plan_type: string;
  reference_id: string | null;
  created_at: string;
  api_key_or_config: string | null;
  expires_at: string | null;
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

function parsePriceNgn(priceDisplay: string): number {
  const digits = priceDisplay.replace(/[^\d]/g, "");
  return Number(digits) || 0;
}

const PLAN_LABELS: Record<string, string> = {
  standard_monthly: "Standard (Monthly)",
  plus_monthly: "Plus (Monthly)",
  pro_monthly: "Pro (Monthly)",
  standard_yearly: "Standard (Yearly)",
  plus_yearly: "Plus (Yearly)",
  pro_yearly: "Pro (Yearly)",
};

const YEARLY_PRICING_PLANS = [
  {
    id: "standard",
    planType: "standard_yearly" as VpnPlanType,
    name: "Standard",
    priceNgn: 39990,
    priceDisplay: "₦39,990",
    billingPeriod: "Yearly (365 Days)",
    billingLabel: "Billed once per year · Save 2 months",
    summary:
      "Full-year encrypted WireGuard access for everyday browsing and stable private connections.",
    features: [
      "12 months private WireGuard VPN access",
      "Residential-grade encrypted tunnel",
      "Android, iOS & Windows setup support",
      "Priority email & WhatsApp assistance",
    ],
    preCheckoutNote: "Instant WireGuard config delivery upon payment.",
  },
  {
    id: "plus",
    planType: "plus_yearly" as VpnPlanType,
    name: "Plus",
    priceNgn: 69990,
    priceDisplay: "₦69,990",
    billingPeriod: "Yearly (365 Days)",
    billingLabel: "Billed once per year · Most Popular",
    summary:
      "High-speed annual VPN protection built for heavy streaming, remote work, and multi-session stability.",
    features: [
      "12 months high-speed WireGuard access",
      "Enhanced low-latency routing",
      "Android, iOS & Windows support",
      "Fast key replacement & priority support",
    ],
    preCheckoutNote: "Instant WireGuard config delivery upon payment.",
  },
  {
    id: "pro",
    planType: "pro_yearly" as VpnPlanType,
    name: "Pro",
    priceNgn: 99990,
    priceDisplay: "₦99,990",
    billingPeriod: "Yearly (365 Days)",
    billingLabel: "Billed once per year · Maximum Tier",
    summary:
      "Top-tier annual bandwidth and dedicated priority support for power users and business workflows.",
    features: [
      "12 months maximum-priority WireGuard access",
      "Dedicated high-throughput residential route",
      "All platforms supported (Android, iOS, Windows)",
      "Direct 1-on-1 WhatsApp onboarding support",
    ],
    preCheckoutNote: "Instant WireGuard config delivery upon payment.",
  },
];

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
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [assignedKeys, setAssignedKeys] = useState<AssignedKeyRecord[]>([]);
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
    void init();

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

    try {
      const keys = (await (
        listMyKeys as () => Promise<AssignedKeyRecord[]>
      )()) as AssignedKeyRecord[];
      if (Array.isArray(keys)) {
        setAssignedKeys(keys);
      }
    } catch {
      // Fallback to orders state if listMyKeys fails
    }
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

  async function triggerTestBypassOrder(
    plan_type: VpnPlanType = "standard_monthly"
  ) {
    if (!user?.email) return;
    const testCode = `test-bypass-${plan_type}`;
    setPayingCode(testCode);
    setStatusMessage(null);
    const testRef = `TEST_${Date.now()}`;

    try {
      const result = await (
        finalizePaystackOrder as (args: {
          data: {
            reference: string;
            plan_type: VpnPlanType;
          };
        }) => Promise<unknown>
      )({
        data: {
          reference: testRef,
          plan_type,
        },
      });
      console.log("TEST order result:", result);
      await fetchOrders(user.id);
      setStatusMessage(
        `Test bypass order (${testRef}) finalized for ${PLAN_LABELS[plan_type] || plan_type
        }. Orders refreshed.`
      );
    } catch (err: unknown) {
      const detail =
        err instanceof Error ? err.message : "Test bypass order failed.";
      console.error("TEST order error:", err);
      setStatusMessage(`Test bypass error (${testRef}): ${detail}`);
    } finally {
      setPayingCode(null);
    }
  }

  async function handleCheckout(
    planType: VpnPlanType,
    name: string,
    price: number
  ) {
    if (!user?.email) return;
    setPayingCode(planType);
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
                    plan_type: VpnPlanType;
                  };
                }) => Promise<unknown>
              )({
                data: {
                  reference: response.reference,
                  plan_type: planType,
                },
              });
              setStatusMessage(
                `Payment confirmed for ${name}. Your WireGuard configuration has been assigned.`
              );
              await fetchOrders(user.id);
              setActiveTab("vpn");
            } catch (finalizeErr: unknown) {
              const detail =
                finalizeErr instanceof Error
                  ? finalizeErr.message
                  : "Order finalization failed.";
              setStatusMessage(
                `Payment received (${response.reference}), but provisioning had an issue: ${detail}`
              );
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

  const latestAssignedKey = assignedKeys.find((k) => k.api_key_or_config);
  const latestKeyOrder = orders.find((o) => o.vpn_key);
  const activeKey =
    latestAssignedKey?.api_key_or_config || latestKeyOrder?.vpn_key || null;
  const activeExpiresAt = latestAssignedKey?.expires_at || null;
  const connectionStatus: ConnectionStatus = activeKey
    ? "connected"
    : "disconnected";
  const statusIndicator = getConnectionIndicator(connectionStatus);
  const totalSpent = orders.reduce(
    (sum, o) => sum + (Number(o.amount_ngn) || 0),
    0
  );
  const rawPlanKey =
    latestAssignedKey?.plan_type ||
    latestKeyOrder?.plan_type ||
    latestKeyOrder?.plan_name ||
    "";
  const currentPlanName =
    PLAN_LABELS[rawPlanKey] ||
    rawPlanKey ||
    (activeKey ? "Active VPN Plan" : "No Active Plan");
  const referralCode = `EA-${(user?.id || "MEMBER").slice(0, 6).toUpperCase()}`;

  const monthlyPlans = PRICING_PLANS.map((plan) => {
    const tier = plan.id as "standard" | "plus" | "pro";
    return {
      id: plan.id,
      planType: `${tier}_monthly` as VpnPlanType,
      name: plan.name,
      priceNgn: parsePriceNgn(plan.priceDisplay),
      priceDisplay: plan.priceDisplay,
      billingPeriod: "Monthly (30 Days)",
      billingLabel: plan.billingLabel,
      summary: plan.summary,
      features: plan.features,
      preCheckoutNote: plan.preCheckoutNote,
    };
  });

  const displayedPlans =
    billingCycle === "monthly" ? monthlyPlans : YEARLY_PRICING_PLANS;

  const activeTestPlanType: VpnPlanType =
    billingCycle === "monthly" ? "standard_monthly" : "standard_yearly";

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
      <div className="flex min-h-screen items-center justify-center bg-[#040812]">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#00F59B]/20 border-t-[#00F59B] shadow-[0_0_24px_rgba(0,245,155,0.3)]" />
          <img
            src="/favicon.png"
            alt="EspritAccess"
            className="h-16 w-16 rounded-2xl object-cover"
          />
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
                src="/favicon.png"
                alt="EspritAccess"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="h-8 w-8 rounded-lg border border-white/10 object-cover"
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
              onClick={() => void handleSignOut()}
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

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={payingCode === "test-bypass-standard_monthly"}
                    onClick={() =>
                      void triggerTestBypassOrder("standard_monthly")
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/15 px-3.5 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-400/25 disabled:opacity-60"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-300" />
                    {payingCode === "test-bypass-standard_monthly"
                      ? "Running Test Order..."
                      : "Test Bypass Order (Standard)"}
                  </button>

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
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Subscription Plan
                    </span>
                    <CreditCard className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="mt-3 text-base font-extrabold text-white">
                    {currentPlanName}
                  </p>
                  <button
                    type="button"
                    onClick={() => selectTab("subscriptions")}
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#00F59B] hover:underline"
                  >
                    Manage Subscriptions <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-400/35">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Total Spent
                    </span>
                    <Receipt className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="mt-3 text-xl font-extrabold text-white">
                    ₦{totalSpent.toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Lifetime ({orders.length}{" "}
                    {orders.length === 1 ? "order" : "orders"})
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-amber-400/35">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Referral Bonus
                    </span>
                    <Users className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="mt-3 text-xl font-extrabold text-white">₦0</p>
                  <button
                    type="button"
                    onClick={() => selectTab("referrals")}
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:underline"
                  >
                    Invite Friends <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </ScrollFloat>

            {/* Connection Summary + Quick Access */}
            <div className="grid gap-6 lg:grid-cols-3">
              <ScrollFloat delay={120} className="lg:col-span-2">
                <div className="flex h-full flex-col justify-between rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white">
                        Connection Summary
                      </h2>
                      <p className="text-xs text-slate-400">
                        Account &amp; service readiness overview
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectTab("vpn")}
                      className="text-xs font-semibold text-[#00F59B] hover:underline"
                    >
                      VPN Setup Guide →
                    </button>
                  </div>

                  <div className="my-6 rounded-2xl border border-white/[0.06] bg-[#050A15] p-4">
                    <svg
                      viewBox="0 0 400 90"
                      className="h-24 w-full overflow-visible"
                      aria-label="Service status wave"
                    >
                      <defs>
                        <linearGradient
                          id="eaWaveGrad"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#00F59B"
                            stopOpacity="0.2"
                          />
                          <stop
                            offset="55%"
                            stopColor="#00F59B"
                            stopOpacity="0.95"
                          />
                          <stop
                            offset="100%"
                            stopColor="#F59E0B"
                            stopOpacity="0.85"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 68 Q 65 62, 130 46 T 260 32 T 400 22"
                        fill="none"
                        stroke="url(#eaWaveGrad)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="260" cy="32" r="4.5" fill="#00F59B" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/[0.07] pt-4 text-xs">
                    <div>
                      <p className="text-slate-400">Supported Platforms</p>
                      <p className="mt-1 font-semibold text-white">
                        Android, iOS, Windows
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Configuration State</p>
                      <p className="mt-1 font-semibold text-amber-300">
                        {activeKey ? "Key Assigned" : "Not Activated"}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollFloat>

              <ScrollFloat delay={180}>
                <div className="flex h-full flex-col justify-between rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md">
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Quick Access
                    </h2>
                    <p className="text-xs text-slate-400">
                      Jump directly to a tool
                    </p>

                    <div className="mt-4 space-y-2.5">
                      <button
                        type="button"
                        onClick={() => selectTab("vpn")}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-[#050A15] px-4 py-3 text-left text-xs font-semibold text-white transition hover:border-[#00F59B]/40"
                      >
                        <span className="flex items-center gap-2.5">
                          <Shield className="h-4 w-4 text-[#00F59B]" />
                          My VPN Access
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => selectTab("sms")}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-[#050A15] px-4 py-3 text-left text-xs font-semibold text-white transition hover:border-amber-400/40"
                      >
                        <span className="flex items-center gap-2.5">
                          <Smartphone className="h-4 w-4 text-amber-400" />
                          Virtual SMS Numbers
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => selectTab("products")}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-[#050A15] px-4 py-3 text-left text-xs font-semibold text-white transition hover:border-emerald-400/40"
                      >
                        <span className="flex items-center gap-2.5">
                          <BookOpen className="h-4 w-4 text-emerald-300" />
                          Digital E-Books Store
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-3.5 text-xs text-amber-200">
                    Need help setting up? Chat with support on WhatsApp or email{" "}
                    <span className="font-semibold">{SUPPORT_EMAIL}</span>.
                  </div>
                </div>
              </ScrollFloat>
            </div>
          </div>
        )}

        {/* ==================== MY VPN ==================== */}
        {activeTab === "vpn" && (
          <ScrollFloat>
            <div className="space-y-6 rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">My VPN</h2>
                  <p className="text-xs text-slate-400">
                    Your active VPN credentials and setup steps.
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusIndicator.pillClass}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${statusIndicator.dotClass}`}
                  />
                  {statusIndicator.label}
                </span>
              </div>

              {activeKey ? (
                <div className="space-y-3 rounded-2xl border border-[#00F59B]/25 bg-[#050A15] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-[#00F59B]">
                        Assigned WireGuard Configuration ({currentPlanName})
                      </span>
                      {activeExpiresAt && (
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Expires:{" "}
                          {new Date(activeExpiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(activeKey)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-white hover:border-[#00F59B]/40"
                    >
                      {copiedKey ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#00F59B]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Config
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-black/60 p-3 font-mono text-xs text-emerald-200">
                    {activeKey}
                  </pre>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.07] bg-[#050A15] p-5 text-sm text-slate-300">
                  No active VPN key assigned yet. Choose a subscription plan to
                  activate access.
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => selectTab("subscriptions")}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#00F59B] px-4 py-2 text-xs font-bold text-[#040812]"
                    >
                      View VPN Plans <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/[0.07] bg-[#050A15] p-4">
                  <p className="text-xs font-bold text-[#00F59B]">Step 1</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Install WireGuard App
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Download the official WireGuard app on Android, iOS, or
                    Windows.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-[#050A15] p-4">
                  <p className="text-xs font-bold text-amber-400">Step 2</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Import Configuration
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Paste your assigned WireGuard configuration into a new tunnel
                    in the app.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-[#050A15] p-4">
                  <p className="text-xs font-bold text-emerald-300">Step 3</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Connect &amp; Browse
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Toggle the tunnel switch on and verify your protected
                    connection.
                  </p>
                </div>
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== VIRTUAL SMS ==================== */}
        {activeTab === "sms" && (
          <ScrollFloat>
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  Virtual SMS Numbers
                </h2>
                <p className="text-xs text-slate-400">
                  Receive verification codes on temporary or 30-day rental
                  numbers.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredNumbers.map((num) => (
                  <div
                    key={num.code}
                    className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.75)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">
                          {num.country} ({num.dialCode})
                        </span>
                        <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                          {num.tag}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-xs text-[#00F59B]">
                        {num.sampleNumber}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-slate-200">
                        {num.service}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {num.type} · {num.delivery}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-3.5">
                      <span className="text-base font-extrabold text-white">
                        ₦{num.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        disabled={payingCode === "standard_monthly"}
                        onClick={() =>
                          void handleCheckout(
                            "standard_monthly",
                            `${num.country} SMS (${num.service})`,
                            num.price
                          )
                        }
                        className="rounded-xl bg-[#00F59B] px-3.5 py-2 text-xs font-bold text-[#040812] transition hover:opacity-95 disabled:opacity-50"
                      >
                        {payingCode === "standard_monthly"
                          ? "Opening..."
                          : "Get Number"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== SUBSCRIPTIONS ==================== */}
        {activeTab === "subscriptions" && (
          <ScrollFloat>
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    VPN Subscription Plans
                  </h2>
                  <p className="text-xs text-slate-400">
                    Select a plan below to pay securely via Paystack and unlock
                    your VPN access.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex rounded-xl border border-white/10 bg-[#050A15] p-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setBillingCycle("monthly")}
                      className={`rounded-lg px-3 py-1.5 transition ${billingCycle === "monthly"
                          ? "bg-[#00F59B] text-[#040812]"
                          : "text-slate-300 hover:text-white"
                        }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("yearly")}
                      className={`rounded-lg px-3 py-1.5 transition ${billingCycle === "yearly"
                          ? "bg-[#00F59B] text-[#040812]"
                          : "text-slate-300 hover:text-white"
                        }`}
                    >
                      Yearly
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={payingCode === `test-bypass-${activeTestPlanType}`}
                    onClick={() =>
                      void triggerTestBypassOrder(activeTestPlanType)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/15 px-3.5 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-400/25 disabled:opacity-60"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-300" />
                    {payingCode === `test-bypass-${activeTestPlanType}`
                      ? "Running Test Order..."
                      : `Test Bypass Order (${billingCycle === "monthly" ? "Monthly" : "Yearly"
                      })`}
                  </button>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {displayedPlans.map((plan) => {
                  const isHighlighted = plan.id === "plus";
                  return (
                    <div
                      key={plan.planType}
                      className={`flex flex-col justify-between rounded-3xl border p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)] ${isHighlighted
                          ? "border-[#00F59B]/45 bg-gradient-to-b from-[#0D1D34] to-[#060B16]"
                          : "border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95"
                        }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-extrabold text-white">
                            {plan.name}
                          </h3>
                          <span className="rounded-full bg-[#00F59B]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#00F59B]">
                            {plan.billingPeriod}
                          </span>
                        </div>
                        <p className="mt-3 text-2xl font-extrabold text-white">
                          {plan.priceDisplay}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {plan.billingLabel}
                        </p>
                        <p className="mt-3 text-xs text-slate-300">
                          {plan.summary}
                        </p>

                        <ul className="mt-4 space-y-2 text-xs text-slate-300">
                          {plan.features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00F59B]" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6">
                        <p className="mb-2 text-[11px] text-slate-400">
                          {plan.preCheckoutNote}
                        </p>
                        <button
                          type="button"
                          disabled={payingCode === plan.planType}
                          onClick={() =>
                            void handleCheckout(
                              plan.planType,
                              `${plan.name} (${plan.billingPeriod})`,
                              plan.priceNgn
                            )
                          }
                          className="w-full rounded-xl bg-[#00F59B] py-2.5 text-xs font-bold text-[#040812] transition hover:opacity-95 disabled:opacity-50"
                        >
                          {payingCode === plan.planType
                            ? "Launching Paystack..."
                            : `Get ${plan.name} (${billingCycle === "monthly" ? "Monthly" : "Yearly"
                            })`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== DIGITAL PRODUCTS ==================== */}
        {activeTab === "products" && (
          <ScrollFloat>
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    Digital Products &amp; E-Books
                  </h2>
                  <p className="text-xs text-slate-400">
                    Browse curated titles across finance, health, growth,
                    gospel, and fiction.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {BOOK_NICHES.map((niche) => (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => setSelectedNiche(niche)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${selectedNiche === niche
                          ? "bg-[#00F59B] text-[#040812]"
                          : "border border-white/[0.08] bg-[#081020] text-slate-300 hover:text-white"
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
                    className={`flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-gradient-to-b ${book.gradient} p-5 shadow-[0_14px_40px_rgba(0,0,0,0.75)]`}
                  >
                    <div className="flex gap-3.5">
                      <img
                        src={book.cover}
                        alt={book.title}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="h-20 w-14 shrink-0 rounded-lg border border-white/10 object-cover"
                      />
                      <div className="min-w-0">
                        <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          {book.niche}
                        </span>
                        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">
                          {book.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {book.author}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {book.format} · ★ {book.rating}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3">
                      <span className="text-base font-extrabold text-white">
                        ₦{book.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        disabled={payingCode === "standard_monthly"}
                        onClick={() =>
                          void handleCheckout(
                            "standard_monthly",
                            book.title,
                            book.price
                          )
                        }
                        className="rounded-xl bg-[#00F59B] px-3.5 py-2 text-xs font-bold text-[#040812] transition hover:opacity-95 disabled:opacity-50"
                      >
                        {payingCode === "standard_monthly"
                          ? "Opening..."
                          : "Buy E-Book"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== SECURITY TOOLS ==================== */}
        {activeTab === "security" && (
          <ScrollFloat>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)]">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="h-5 w-5 text-[#00F59B]" />
                  <h2 className="text-lg font-extrabold text-white">
                    Strong Password Generator
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Generate a high-entropy password locally in your browser.
                </p>

                <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-white/[0.08] bg-[#050A15] p-3.5">
                  <code className="overflow-x-auto font-mono text-xs text-[#00F59B]">
                    {generatedPass}
                  </code>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      aria-label="Regenerate Password"
                      className="rounded-lg border border-white/10 p-2 text-slate-200 hover:border-[#00F59B]/40"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(generatedPass)}
                      aria-label="Copy Password"
                      className="rounded-lg border border-white/10 p-2 text-slate-200 hover:border-[#00F59B]/40"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)]">
                <div className="flex items-center gap-2.5">
                  <Globe className="h-5 w-5 text-amber-400" />
                  <h2 className="text-lg font-extrabold text-white">
                    Privacy &amp; Security Checklist
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Practical habits to keep your accounts and connections safe.
                </p>

                <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#050A15] p-3">
                    <Zap className="h-4 w-4 shrink-0 text-[#00F59B]" />
                    <span>Use unique passwords for email, banking, and VPN.</span>
                  </li>
                  <li className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#050A15] p-3">
                    <Shield className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>Enable two-factor authentication on critical logins.</span>
                  </li>
                  <li className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#050A15] p-3">
                    <Lock className="h-4 w-4 shrink-0 text-emerald-300" />
                    <span>Keep your VPN client updated to the latest release.</span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== BILLING & ORDERS ==================== */}
        {activeTab === "billing" && (
          <ScrollFloat>
            <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    Billing &amp; Orders
                  </h2>
                  <p className="text-xs text-slate-400">
                    Your recorded transactions on EspritAccess.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => user && void fetchOrders(user.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#050A15] px-3 py-2 text-xs font-semibold text-slate-200 hover:border-[#00F59B]/40"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-white/[0.06] bg-[#050A15] p-5 text-xs text-slate-400">
                  No orders found yet.
                </p>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-slate-400">
                        <th className="py-2.5 pr-4">Reference</th>
                        <th className="py-2.5 pr-4">Plan / Item</th>
                        <th className="py-2.5 pr-4">Amount</th>
                        <th className="py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {orders.map((order) => (
                        <tr key={order.id} className="text-slate-200">
                          <td className="py-3 pr-4 font-mono text-[11px]">
                            {order.reference || order.reference_id || order.id}
                          </td>
                          <td className="py-3 pr-4 font-semibold">
                            {PLAN_LABELS[order.plan_type || ""] ||
                              order.plan_name ||
                              order.plan_code ||
                              order.plan_type ||
                              "Order"}
                          </td>
                          <td className="py-3 pr-4">
                            ₦{(Number(order.amount_ngn) || 0).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span className="rounded-full bg-[#00F59B]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#00F59B]">
                              {order.status ||
                                order.payment_status ||
                                "completed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </ScrollFloat>
        )}

        {/* ==================== REFERRAL PROGRAM ==================== */}
        {activeTab === "referrals" && (
          <ScrollFloat>
            <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)]">
              <h2 className="text-xl font-extrabold text-white">
                Referral Program
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Share your referral code with friends joining EspritAccess.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#050A15] p-4">
                <div>
                  <p className="text-[11px] text-slate-400">
                    Your Referral Code
                  </p>
                  <p className="mt-0.5 font-mono text-base font-extrabold text-[#00F59B]">
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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#00F59B] px-4 py-2 text-xs font-bold text-[#040812]"
                >
                  {copiedRef ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== SUPPORT CENTER ==================== */}
        {activeTab === "support" && (
          <ScrollFloat>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)]">
                <MessageCircle className="h-6 w-6 text-[#00F59B]" />
                <h2 className="mt-3 text-lg font-extrabold text-white">
                  WhatsApp Support
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Reach out directly for quick assistance with orders, VPN setup,
                  or virtual numbers.
                </p>
                <a
                  href="https://wa.me/2348051309239?text=Hello%20EspritAccess%2C%20I%20need%20help%20with%20my%20account."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#00F59B] px-4 py-2.5 text-xs font-bold text-[#040812]"
                >
                  Open WhatsApp Chat <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)]">
                <Mail className="h-6 w-6 text-amber-400" />
                <h2 className="mt-3 text-lg font-extrabold text-white">
                  Email Support
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Send detailed questions or billing inquiries to our support
                  inbox.
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#050A15] px-4 py-2.5 text-xs font-bold text-white hover:border-[#00F59B]/40"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== ACCOUNT SETTINGS ==================== */}
        {activeTab === "settings" && (
          <ScrollFloat>
            <div className="grid gap-6 md:grid-cols-2">
              <form
                onSubmit={(e) => void handleUpdateProfile(e)}
                className="space-y-4 rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)]"
              >
                <h2 className="text-lg font-extrabold text-white">
                  Profile Details
                </h2>
                <div>
                  <label className="block text-xs text-slate-400">Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="mt-1 w-full rounded-xl border border-white/[0.07] bg-[#050A15] px-3.5 py-2 text-xs text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder={displayName}
                    className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#050A15] px-3.5 py-2 text-xs text-white focus:border-[#00F59B]/50 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="rounded-xl bg-[#00F59B] px-4 py-2 text-xs font-bold text-[#040812] disabled:opacity-50"
                >
                  {savingSettings ? "Saving..." : "Save Profile"}
                </button>
              </form>

              <form
                onSubmit={(e) => void handleUpdatePassword(e)}
                className="space-y-4 rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)]"
              >
                <h2 className="text-lg font-extrabold text-white">
                  Change Password
                </h2>
                <div>
                  <label className="block text-xs text-slate-400">
                    New Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password"
                    className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#050A15] px-3.5 py-2 text-xs text-white focus:border-[#00F59B]/50 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="rounded-xl border border-white/15 bg-[#050A15] px-4 py-2 text-xs font-bold text-white hover:border-[#00F59B]/40 disabled:opacity-50"
                >
                  {savingSettings ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </ScrollFloat>
        )}

        {/* ==================== NOTIFICATIONS ==================== */}
        {activeTab === "notifications" && (
          <ScrollFloat>
            <div className="space-y-4 rounded-3xl border border-white/[0.07] bg-gradient-to-b from-[#0A1324]/90 to-[#060B16]/95 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.75)]">
              <h2 className="text-xl font-extrabold text-white">
                Notifications
              </h2>
              <div className="space-y-3 text-xs">
                <div className="rounded-2xl border border-white/[0.07] bg-[#050A15] p-4">
                  <p className="font-bold text-[#00F59B]">
                    Account Dashboard Ready
                  </p>
                  <p className="mt-1 text-slate-400">
                    Your EspritAccess account is active. Manage VPN keys, SMS
                    numbers, and digital products anytime.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-[#050A15] p-4">
                  <p className="font-bold text-amber-300">Support Available</p>
                  <p className="mt-1 text-slate-400">
                    Need help with an order or configuration? Use WhatsApp
                    Support or email {SUPPORT_EMAIL}.
                  </p>
                </div>
              </div>
            </div>
          </ScrollFloat>
        )}
      </main>
    </div>
  );
}