import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Shield,
  Smartphone,
  CreditCard,
  Sparkles,
  Lock,
  BookOpen,
  Check,
  ChevronDown,
  ArrowRight,
  Star,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const SERVICES = [
  {
    icon: Shield,
    title: 'VPN Services',
    desc: 'Fast, encrypted, and private browsing with instant WireGuard key delivery.',
    glow: 'group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
    iconBg: 'bg-blue-500/15 text-blue-400 ring-blue-500/30',
  },
  {
    icon: Smartphone,
    title: 'Virtual SMS Numbers',
    desc: 'Receive OTPs and verifications globally without exposing your personal line.',
    glow: 'group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    iconBg: 'bg-cyan-500/15 text-cyan-400 ring-cyan-500/30',
  },
  {
    icon: CreditCard,
    title: 'Digital Subscriptions',
    desc: 'The global subscriptions you rely on, activated in minutes with Naira.',
    glow: 'group-hover:border-violet-500/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
    iconBg: 'bg-violet-500/15 text-violet-400 ring-violet-500/30',
  },
  {
    icon: Sparkles,
    title: 'AI Tools & Software',
    desc: 'Practical AI tools and software licenses for work, study, and creativity.',
    glow: 'group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    iconBg: 'bg-cyan-500/15 text-cyan-400 ring-cyan-500/30',
  },
  {
    icon: Lock,
    title: 'Security & Privacy Tools',
    desc: 'Password managers, 2FA essentials, and privacy-first digital utilities.',
    glow: 'group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    iconBg: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  },
  {
    icon: BookOpen,
    title: 'E-books & Digital Guides',
    desc: 'Best-selling e-books across Finance, Health, Self-Development, Gospel, and Novels.',
    glow: 'group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
    iconBg: 'bg-blue-500/15 text-blue-400 ring-blue-500/30',
  },
]

const PLANS = [
  {
    name: 'Standard',
    tag: 'STARTER',
    price: '₦4,000',
    period: '/ month',
    featured: false,
    features: [
      '1 High-Speed VPN Key',
      'Instant Paystack Activation',
      'Zero-Logs Encrypted Tunnel',
      'WhatsApp Support',
    ],
  },
  {
    name: 'Plus',
    tag: 'MOST POPULAR',
    price: '₦8,500',
    period: '/ month',
    featured: true,
    features: [
      'Up to 3 Devices Simultaneously',
      'Priority High-Speed Servers',
      'Virtual SMS Number Access',
      '24/7 Priority Support',
    ],
  },
  {
    name: 'Pro',
    tag: 'ALL ACCESS',
    price: '₦14,000',
    period: '/ year',
    featured: false,
    features: [
      'Unlimited Bandwidth & Priority Nodes',
      'Full Digital Marketplace Discounts',
      'Dedicated Account Dashboard',
      'Instant Key Replacement',
    ],
  },
]

const TESTIMONIALS = [
  {
    name: 'Chinedu O.',
    role: 'Remote Developer, Lagos',
    quote:
      'Paid with Paystack and my VPN key showed up immediately. Speeds are rock solid for GitHub and client calls.',
  },
  {
    name: 'Amina B.',
    role: 'Digital Marketer, Abuja',
    quote:
      'Finally a clean platform where I can pay in Naira without card declines. Virtual numbers and VPN in one place.',
  },
  {
    name: 'Tunde K.',
    role: 'Freelance Designer, Benin',
    quote:
      'Setup took less than two minutes and support actually responds on WhatsApp. Worth every Naira.',
  },
]

const FAQS = [
  {
    q: 'How fast do I get my VPN key after paying?',
    a: 'Immediately. As soon as Paystack confirms your payment, your key is automatically assigned from our vault and unlocked on your dashboard.',
  },
  {
    q: 'Can I pay with a Nigerian debit card or bank transfer?',
    a: 'Yes. All plans are billed in Naira (NGN) via Paystack—supporting cards, bank transfers, USSD, and OPay.',
  },
  {
    q: 'Does EspritAccess work on both phones and laptops?',
    a: 'Yes. Your encrypted configuration works smoothly on Windows, macOS, Android, and iOS.',
  },
  {
    q: 'What if I need help setting up my connection?',
    a: 'Our support team is available directly via WhatsApp and your dashboard to walk you through setup in minutes.',
  },
]

function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 selection:bg-blue-600 selection:text-white">
      {/* Multi-Tone Ambient Lighting (Blue + Cyan + Violet on Pure Black) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute top-1/3 -left-32 h-[360px] w-[360px] rounded-full bg-cyan-500/12 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[420px] rounded-full bg-violet-600/12 blur-[140px]" />
      </div>

      {/* Floating Glass Pill Menu Bar */}
      <div className="sticky top-4 z-50 mx-auto max-w-5xl px-4">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-[#0b0b0f]/80 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-black text-white shadow-[0_0_18px_rgba(59,130,246,0.75)]">
              EA
            </span>
            <span className="text-white">
              Esprit<span className="text-blue-400">Access</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-semibold text-zinc-400 md:flex">
            <a href="#services" className="transition hover:text-white">
              Services
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#testimonials" className="transition hover:text-white">
              Testimonials
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/auth"
              className="rounded-full px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_22px_rgba(37,99,235,0.75)] transition hover:bg-blue-500"
            >
              Get Started
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl px-6 pb-20 pt-20 text-center md:pt-28">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.18)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          Instant Activation • Pay in Naira
        </div>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Your Gateway to{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
            Digital Access
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
          Protect your privacy, browse securely with high-speed encrypted VPNs, and unlock virtual
          SMS numbers, AI tools, and best-selling e-books—all in one fast platform.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-8 py-3.5 text-sm font-bold text-zinc-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:text-white"
          >
            View Pricing
          </a>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              one platform
            </span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            From encrypted connectivity to everyday digital products.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className={`group rounded-2xl border border-white/10 bg-[#0c0c10] p-6 transition-all duration-300 hover:-translate-y-1.5 ${s.glow}`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${s.iconBg}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3-Tier Pricing */}
      <section id="pricing" className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, transparent{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Choose a plan and get instant dashboard access via Paystack.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col justify-between rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5 ${plan.featured
                ? 'border border-blue-500/70 bg-[#0e0f17] shadow-[0_0_45px_rgba(37,99,235,0.28)]'
                : 'border border-white/10 bg-[#0c0c10] hover:border-white/25'
                }`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  {plan.tag}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-sm text-zinc-400">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-cyan-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/auth"
                className={`mt-8 block w-full rounded-full py-3 text-center text-sm font-bold text-white transition ${plan.featured
                  ? 'bg-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.7)] hover:bg-blue-500'
                  : 'bg-white/10 hover:bg-blue-600'
                  }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              users across Nigeria
            </span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/10 bg-[#0c0c10] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <div className="flex gap-1 text-cyan-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-cyan-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">"{t.quote}"</p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-zinc-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative mx-auto max-w-3xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c10]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-white"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/10 px-6 py-4 text-sm text-zinc-400">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-600/20 via-[#0c0c10] to-violet-600/15 p-10 text-center shadow-[0_0_50px_rgba(37,99,235,0.18)]">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Your Digital Freedom,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Our Priority.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-300">
            Create your account in seconds and unlock instant VPN, Virtual SMS, and digital access.
          </p>
          <Link
            to="/auth"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_28px_rgba(37,99,235,0.75)] transition hover:bg-blue-500"
          >
            Get Started Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#040406] py-10 text-center text-xs text-zinc-500">
        <p>© 2026 EspritAccess — Your Gateway to Digital Access. All rights reserved.</p>
      </footer>
    </div>
  )
}