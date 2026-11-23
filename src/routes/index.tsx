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
  },
  {
    icon: Smartphone,
    title: 'Virtual SMS Numbers',
    desc: 'Receive OTPs and verifications globally without exposing your personal line.',
  },
  {
    icon: CreditCard,
    title: 'Digital Subscriptions',
    desc: 'The global subscriptions you rely on, activated in minutes with Naira.',
  },
  {
    icon: Sparkles,
    title: 'AI Tools & Software',
    desc: 'Practical AI tools and software licenses for work, study, and creativity.',
  },
  {
    icon: Lock,
    title: 'Security & Privacy Tools',
    desc: 'Password managers, 2FA essentials, and privacy-first digital utilities.',
  },
  {
    icon: BookOpen,
    title: 'E-books & Digital Guides',
    desc: 'Actionable tech guides, templates, and digital resources that help you grow.',
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
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Subtle Blue Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-blue-500/15 bg-[#030712]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.7)]">
              EA
            </span>
            <span className="text-white">
              Esprit<span className="text-blue-400">Access</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex">
            <a href="#services" className="transition hover:text-blue-400">
              Services
            </a>
            <a href="#pricing" className="transition hover:text-blue-400">
              Pricing
            </a>
            <a href="#testimonials" className="transition hover:text-blue-400">
              Testimonials
            </a>
            <a href="#faq" className="transition hover:text-blue-400">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition hover:text-blue-400"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] transition hover:bg-blue-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 text-center md:pt-28">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 shadow-[0_0_20px_rgba(37,99,235,0.25)]">
          <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
          Instant Activation • Pay in Naira
        </div>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Your Gateway to{' '}
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Digital Access
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
          Protect your privacy, browse securely with high-speed encrypted VPNs, and unlock virtual
          numbers, AI tools, and digital subscriptions—all in one clean platform.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(37,99,235,0.65)] transition hover:bg-blue-500"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-950/40 px-7 py-3.5 text-sm font-bold text-blue-200 transition hover:border-blue-400 hover:bg-blue-950/70"
          >
            View Pricing
          </a>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need, <span className="text-blue-400">one platform</span>
          </h2>
          <p className="mt-3 text-slate-400">
            From encrypted connectivity to everyday digital products.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="rounded-2xl border border-blue-500/15 bg-[#070d1f] p-6 transition hover:border-blue-500/45 hover:shadow-[0_0_30px_rgba(37,99,235,0.18)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3-Tier Pricing */}
      <section id="pricing" className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, transparent <span className="text-blue-400">pricing</span>
          </h2>
          <p className="mt-3 text-slate-400">
            Choose a plan and get instant dashboard access via Paystack.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col justify-between rounded-2xl p-8 transition ${plan.featured
                  ? 'border-2 border-blue-500 bg-[#08122b] shadow-[0_0_40px_rgba(37,99,235,0.3)]'
                  : 'border border-blue-500/15 bg-[#070d1f]'
                }`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  {plan.tag}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-blue-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/auth"
                className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-bold text-white transition ${plan.featured
                    ? 'bg-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.65)] hover:bg-blue-500'
                    : 'bg-blue-600/80 hover:bg-blue-600'
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
            Trusted by <span className="text-blue-400">users across Nigeria</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-blue-500/15 bg-[#070d1f] p-6"
            >
              <div className="flex gap-1 text-blue-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-blue-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">"{t.quote}"</p>
              <div className="mt-5 border-t border-blue-500/10 pt-4">
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative mx-auto max-w-3xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Frequently Asked <span className="text-blue-400">Questions</span>
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-xl border border-blue-500/20 bg-[#070d1f]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-white"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-blue-400 transition-transform ${isOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-blue-500/10 px-6 py-4 text-sm text-slate-400">
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
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/80 via-[#070d1f] to-[#030712] p-10 text-center shadow-[0_0_50px_rgba(37,99,235,0.2)]">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Your Digital Freedom, <span className="text-blue-400">Our Priority.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            Create your account in seconds and unlock instant VPN and digital access.
          </p>
          <Link
            to="/auth"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(37,99,235,0.65)] transition hover:bg-blue-500"
          >
            Get Started Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/15 bg-[#02050e] py-10 text-center text-xs text-slate-500">
        <p>© 2026 EspritAccess — Your Gateway to Digital Access. All rights reserved.</p>
      </footer>
    </div>
  )
}