import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import heroDevices from "@/assets/hero-devices.png";
import {
  ShieldCheck,
  Smartphone,
  CreditCard,
  Sparkles,
  LockKeyhole,
  BookOpen,
  ArrowRight,
  MessageCircle,
  Globe2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EspritAccess — Your Gateway to Digital Access" },
      { name: "description", content: "VPN services, virtual SMS numbers, digital subscriptions, AI tools, security & privacy products and e-books — one platform for your digital life." },
      { property: "og:title", content: "EspritAccess — Your Gateway to Digital Access" },
      { property: "og:description", content: "VPN, virtual numbers, digital subscriptions, AI tools, privacy products and e-books. Fast, secure and affordable." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const SERVICES = [
  { icon: ShieldCheck, title: "VPN Services", body: "Fast, encrypted and private browsing wherever you are." },
  { icon: Smartphone, title: "Virtual SMS Numbers", body: "Receive verifications without exposing your personal number." },
  { icon: CreditCard, title: "Digital Subscriptions", body: "The subscriptions you rely on, activated in minutes." },
  { icon: Sparkles, title: "AI Tools & Software", body: "Practical AI tools and software for work and creativity." },
  { icon: LockKeyhole, title: "Security & Privacy Tools", body: "Password managers, 2FA products and privacy essentials." },
  { icon: BookOpen, title: "E-books & Digital Products", body: "Educational resources and templates that help you grow." },
];

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const u = data.user;
      if (u?.email_confirmed_at) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }
      if (u && !u.email_confirmed_at) {
        navigate({
          to: "/verify-email",
          search: { email: u.email ?? "" },
          replace: true,
        });
        return;
      }
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!active) return;
      const u = session?.user;
      if (u?.email_confirmed_at) navigate({ to: "/dashboard", replace: true });
      else if (u)
        navigate({
          to: "/verify-email",
          search: { email: u.email ?? "" },
          replace: true,
        });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <img src={heroDevices === undefined ? undefined : logoPulse} alt="" className="h-16 w-16 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <PricingTeaser />
        <About />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" aria-label="EspritAccess home">
          <BrandLogo size={34} />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/80 md:flex">
          <a href="/#services" className="transition hover:text-foreground">Services</a>
          <Link to="/pricing" className="transition hover:text-foreground">Pricing</Link>
          <a href="/#about" className="transition hover:text-foreground">About</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild className="font-semibold" style={{ background: "var(--gradient-brand)" }}>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Globe2 className="h-3.5 w-3.5" /> EspritAccess
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] md:text-6xl">
            Your Gateway to <span className="text-primary">Digital Access</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Protect your privacy, browse securely, access content safely, and
            enjoy fast encrypted internet connections — plus the digital
            services and products you need, all in one platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="font-semibold" style={{ background: "var(--gradient-brand)" }}>
              <Link to="/auth">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-semibold border-border">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-foreground/50">
            Secure checkout · Instant activation · Customer support on WhatsApp
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-secondary blur-2xl" />
          <img
            src={heroDevices}
            alt="EspritAccess dashboard on a laptop and smartphone"
            width={1600}
            height={1000}
            className="w-full rounded-2xl shadow-[var(--shadow-panel)]"
          />
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="scroll-mt-20 border-t border-border/60 bg-panel-elev/60 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">Everything you need, one platform</h2>
          <p className="mt-3 text-foreground/70">
            From secure connectivity to digital products — EspritAccess brings
            your digital life together.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-panel)] transition duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-foreground/70">
            Start with a monthly plan or commit for the year and save.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          <PlanCard name="Monthly Plan" price="₦4,000" period="/ month" tag="Flexible" cta="Get Started" />
          <PlanCard
            name="Yearly Plan"
            price="₦14,000"
            period="/ year"
            tag="Best Value"
            highlight
            cta="Get Started"
          />
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="link" className="text-primary">
            <Link to="/pricing">
              See full pricing details <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  name, price, period, tag, cta, highlight = false,
}: {
  name: string; price: string; period: string; tag: string; cta: string; highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border bg-card p-8 shadow-[var(--shadow-panel)] transition duration-300 hover:-translate-y-1 ${
        highlight ? "border-primary/60" : "border-border"
      }`}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-primary">{tag}</div>
      <h3 className="mt-1 text-xl font-bold">{name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className="text-sm text-foreground/60">{period}</span>
      </div>
      <Button asChild className="mt-7 w-full font-semibold" style={{ background: "var(--gradient-brand)" }}>
        <Link to="/auth">{cta}</Link>
      </Button>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-border/60 bg-panel-elev/60 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold md:text-4xl">About EspritAccess</h2>
          <p className="mt-4 leading-relaxed text-foreground/70">
            EspritAccess is a modern digital access platform providing
            connectivity, privacy, security, digital subscriptions and digital
            products. We bring the services people need every day into one
            clean, trusted place.
          </p>
          <p className="mt-4 leading-relaxed text-foreground/70">
            Our vision is to make digital access, connectivity, privacy and
            useful digital resources more accessible for everyone.
          </p>
        </div>
        <blockquote className="rounded-2xl border border-border bg-navy p-8 text-white shadow-[var(--shadow-panel)]">
          <p className="text-lg font-medium leading-relaxed">
            "Technology should open doors, not create barriers. EspritAccess
            exists to make digital access simpler, safer and more accessible."
          </p>
          <footer className="mt-4 text-sm text-primary">— The EspritAccess Team</footer>
        </blockquote>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-14 text-center text-white shadow-[var(--shadow-panel)] md:px-16">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Your Digital Freedom, <span className="text-primary">Our Priority.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Experience the freedom to access, connect and explore without limits.
            </p>
            <Button asChild size="lg" className="mt-8 font-semibold" style={{ background: "var(--gradient-brand)" }}>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-panel-elev/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <BrandLogo size={36} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/60">
            A modern digital access platform providing connectivity, privacy,
            security, digital subscriptions and digital products. Secure.
            Private. Unlimited.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider">Platform</h3>
          <ul className="mt-4 space-y-2 text-sm text-foreground/70">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><a href="/#services" className="hover:text-foreground">Services</a></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><a href="/#about" className="hover:text-foreground">About</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider">Account & Support</h3>
          <ul className="mt-4 space-y-2 text-sm text-foreground/70">
            <li><Link to="/auth" className="hover:text-foreground">Sign In</Link></li>
            <li><Link to="/auth" className="hover:text-foreground">Create Account</Link></li>
            <li>
              <a
                href="https://wa.me/2347055618585?text=Hello%20Admin,%20I%20have%20a%20question%20about%20EspritAccess!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Customer Support
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} EspritAccess · Your Gateway to Digital Access
      </div>
    </footer>
  );
}

import logoPulse from "@/assets/logo-mark.png";
