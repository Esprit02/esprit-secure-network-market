
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Headphones,
  ArrowLeft,
  Zap,
  Smartphone,
  BookOpen,
  LockKeyhole,
  Mail,
  Search,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { SUPPORT_EMAIL } from "../espritTrust";

export const Route = createFileRoute("/faq")({
  component: TestimonialsAndFAQ,
});

const platformHighlights = [
  {
    icon: ShieldCheck,
    title: "Clear & Straightforward",
    description:
      "Explore available services, review pricing and follow the instructions provided for your chosen product.",
  },
  {
    icon: CreditCard,
    title: "Transparent Payments",
    description:
      "Review product prices and billing terms before checkout. Payments are made through the available payment options on EspritAccess.",
  },
  {
    icon: Headphones,
    title: "Support When You Need It",
    description:
      `Need assistance? Contact our support team at ${SUPPORT_EMAIL} for help with orders, activation and account questions.`,
  },
];

const faqs = [
  {
    category: "General",
    question: "What is EspritAccess?",
    answer:
      "EspritAccess is a digital access platform designed to make connectivity, privacy tools, virtual SMS services, digital subscriptions, software and digital products easier to access from one place.",
  },
  {
    category: "General",
    question: "How does EspritAccess work?",
    answer:
      "Create an account, explore the services available on our platform, choose the product or plan you need and complete checkout. Depending on the product, access may be delivered automatically or through instructions provided in your dashboard.",
  },
  {
    category: "General",
    question: "Do I need an account to purchase?",
    answer:
      "An EspritAccess account is required for services that involve account-based purchases, subscriptions, order tracking or access delivery through your dashboard. Follow the account and checkout instructions displayed on the website.",
  },
  {
    category: "VPN",
    question: "What is the EspritAccess VPN?",
    answer:
      "Our VPN service is designed to encrypt your internet connection and help protect your privacy when browsing online. Connection availability, performance and features depend on the selected plan and VPN infrastructure.",
  },
  {
    category: "VPN",
    question: "How do I activate my VPN after payment?",
    answer:
      "After your payment is confirmed, check the My VPN section of your dashboard for your available access details and setup instructions. If your access is not available as expected, contact support for assistance.",
  },
  {
    category: "VPN",
    question: "Which devices can I use with the VPN?",
    answer:
      "Device compatibility depends on the VPN configuration provided. Our setup instructions may cover supported platforms such as Android, iOS and Windows. Please check the instructions for your specific configuration before connecting.",
  },
  {
    category: "VPN",
    question: "Which countries are available on the VPN?",
    answer:
      "VPN connection locations depend on the availability of the service provider's network. Check the available locations displayed when selecting your VPN plan or configuration.",
  },
  {
    category: "VPN",
    question: "Can I use my VPN on multiple devices?",
    answer:
      "The number of supported devices depends on your selected plan. Check the plan details before purchasing to understand the available device access.",
  },
  {
    category: "VPN",
    question: "Does a VPN make me completely anonymous?",
    answer:
      "No VPN can guarantee complete anonymity online. A VPN can encrypt your connection and help protect your IP address from websites you visit, but your online activities may still be identifiable through cookies, account logins, browser fingerprinting and other methods.",
  },
  {
    category: "Virtual SMS",
    question: "What are Virtual SMS numbers?",
    answer:
      "Virtual SMS numbers allow you to receive text messages, including supported verification codes, through a number supplied by a digital service provider without necessarily using your personal SIM number.",
  },
  {
    category: "Virtual SMS",
    question: "How do I receive a verification code?",
    answer:
      "Select an available number and the service it is intended for, complete the purchase and follow the instructions provided to receive the message. Delivery depends on the service provider and the originating platform.",
  },
  {
    category: "Virtual SMS",
    question: "Are all virtual numbers guaranteed to receive OTPs?",
    answer:
      "No. Verification services may reject certain numbers, and delivery can depend on the platform sending the code, number availability and provider restrictions. We cannot guarantee successful verification on every third-party platform.",
  },
  {
    category: "Virtual SMS",
    question: "Can I use a virtual number for any platform?",
    answer:
      "Virtual number compatibility varies by platform. Some services restrict virtual numbers or require additional verification. Always check the intended service and number description before purchasing.",
  },
  {
    category: "Payments",
    question: "Which payment methods are available?",
    answer:
      "EspritAccess offers the payment methods displayed during checkout. Where Paystack is available, customers can complete eligible payments in Nigerian Naira using the supported payment options.",
  },
  {
    category: "Payments",
    question: "How do I know if my payment was successful?",
    answer:
      "Check your payment confirmation and order information after checkout. If payment was deducted but your order or product access has not been updated, contact support with your transaction reference.",
  },
  {
    category: "Payments",
    question: "Can I renew my subscription?",
    answer:
      "You can renew or purchase another subscription using the renewal or purchase options available on your dashboard. Check your subscription status and billing terms before completing another payment.",
  },
  {
    category: "Payments",
    question: "Can I request a refund?",
    answer:
      "Refund eligibility depends on the product purchased, the applicable terms and the circumstances of your request. Contact our support team with your order details before assuming a refund is available.",
  },
  {
    category: "Digital Products",
    question: "What digital products are available?",
    answer:
      "Our digital products may include e-books, software, subscriptions, AI tools, educational resources and other digital products. Availability may change as the platform grows.",
  },
  {
    category: "Digital Products",
    question: "How do I receive a purchased digital product?",
    answer:
      "Delivery depends on the product. Some products may be accessible through your dashboard, while others may be delivered through a download link, activation instructions or another method specified during purchase.",
  },
  {
    category: "Digital Products",
    question: "Are digital products available immediately?",
    answer:
      "Some products may be delivered immediately after payment confirmation. Other products may require manual processing or additional instructions. Check the product description before purchasing.",
  },
  {
    category: "Security",
    question: "How does EspritAccess protect my payment information?",
    answer:
      "Payments are processed through the payment options made available at checkout. Never share your passwords, card PINs or sensitive banking credentials with anyone claiming to be EspritAccess support.",
  },
  {
    category: "Security",
    question: "How do I protect my EspritAccess account?",
    answer:
      "Use a strong, unique password, avoid sharing your login details, sign out of devices you no longer use and contact support if you notice suspicious activity.",
  },
  {
    category: "Support",
    question: "How can I contact EspritAccess support?",
    answer:
      `For assistance with payments, account access, VPN setup, virtual SMS orders or digital products, email our support team at ${SUPPORT_EMAIL}.`,
  },
];

const categories = [
  "All",
  "General",
  "VPN",
  "Virtual SMS",
  "Payments",
  "Digital Products",
  "Security",
  "Support",
];

export function TestimonialsAndFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;

    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index: number) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#040711] text-slate-100">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.06),transparent_55%)]" />

      {/* Navbar */}
      <header className="sticky top-3 z-40 mx-auto w-full max-w-6xl px-3 sm:px-6">
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

      <main className="relative z-10 mx-auto max-w-6xl space-y-16 px-3 pb-24 pt-10 sm:px-6">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#090f1d]/85 px-6 py-12 text-center shadow-[0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.09),transparent_65%)]" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Questions?
              <span className="mt-2 block text-emerald-400">
                We've got answers.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Everything you need to know about EspritAccess, VPN access,
              virtual numbers, payments, digital products and your account.
            </p>

            {/* FAQ search */}
            <div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#050811] px-4 py-3 transition focus-within:border-emerald-400/50">
              <Search className="h-5 w-5 shrink-0 text-slate-500" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setOpenFaq(null);
                }}
                placeholder="Search your question..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>
        </section>

        {/* Trust standards */}
        <section>
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Our Approach
            </span>

            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              What you can expect
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              We aim to make digital access straightforward, transparent
              and easier to navigate.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {platformHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.08] bg-[#090f1d]/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/30"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Service overview */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: LockKeyhole,
              title: "Privacy & Security",
              description: "Tools designed to help protect your digital life.",
            },
            {
              icon: Globe,
              title: "Global Connectivity",
              description: "Explore available VPN access and connection options.",
            },
            {
              icon: Smartphone,
              title: "Virtual SMS",
              description: "Access supported verification number services.",
            },
            {
              icon: BookOpen,
              title: "Digital Products",
              description: "Explore software, e-books and useful resources.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/[0.08] bg-[#090f1d]/70 p-5"
              >
                <Icon className="mb-4 h-5 w-5 text-emerald-400" />

                <h3 className="text-sm font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Frequently Asked Questions
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                Find answers before or after making a purchase.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-7 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setOpenFaq(null);
                }}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${activeCategory === category
                    ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                    : "border-white/[0.08] bg-[#090f1d] text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div
                key={`${faq.category}-${faq.question}`}
                className={`overflow-hidden rounded-2xl border transition duration-300 ${openFaq === index
                    ? "border-emerald-500/30 bg-[#0b1220]"
                    : "border-white/[0.08] bg-[#090f1d]/80"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <div>
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {faq.category}
                    </span>

                    <span className="text-sm font-semibold leading-6 text-white sm:text-base">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${openFaq === index ? "rotate-180 text-emerald-400" : ""
                      }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${openFaq === index
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-white/[0.06] px-5 py-5 text-sm leading-7 text-slate-400 sm:px-6">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#090f1d] p-10 text-center">
              <HelpCircle className="mx-auto h-8 w-8 text-slate-500" />

              <h3 className="mt-4 font-semibold text-white">
                No matching questions found
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Try another search term or select a different category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("All");
                  setOpenFaq(0);
                }}
                className="mt-5 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Trust / no fabricated testimonials */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#090f1d]/80 p-7 sm:p-10">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>

              <h2 className="text-2xl font-extrabold text-white">
                Built around accessibility and transparency.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                EspritAccess is focused on bringing useful digital services
                together and making them easier to access. We aim to provide
                clear product information, straightforward purchasing and
                support when you need assistance.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Clear product descriptions before purchase",
                "Pricing displayed before checkout",
                "Account-based access to supported services",
                "Direct support for customer enquiries",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#050811] p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-6 text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#091321] p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_70%)]" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
              <Headphones className="h-7 w-7 text-emerald-400" />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">
              Still need help?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
              Our support team is available to help you with your account,
              payments, product access and technical enquiries.
            </p>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-[#04110d] transition hover:bg-emerald-400"
            >
              <Mail className="h-4 w-4" />
              Contact Support
            </a>

            <p className="mt-4 text-xs text-slate-500">
              {SUPPORT_EMAIL}
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] px-5 py-8 text-center">
        <Link
          to="/"
          className="text-sm font-bold text-white"
        >
          Esprit<span className="text-emerald-400">Access</span>
        </Link>

        <p className="mt-2 text-xs text-slate-500">
          Your Gateway to Digital Access.
        </p>

        <p className="mt-4 text-xs text-slate-600">
          © {new Date().getFullYear()} EspritAccess. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
