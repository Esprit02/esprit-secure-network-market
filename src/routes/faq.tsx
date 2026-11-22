import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, ChevronDown, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  component: TestimonialsAndFAQ,
});

const testimonials = [
  {
    name: "Adebayo T.",
    role: "Digital Marketer & Growth Specialist",
    content:
      "EspritAccess has made managing my digital workflows across different regions easier. The connection is reliable, and the support process makes getting assistance straightforward.",
    rating: 5,
  },
  {
    name: "Chinedu E.",
    role: "Remote Developer",
    content:
      "I needed a convenient connectivity solution for my remote development work. EspritAccess made getting started simple, and the setup process was straightforward.",
    rating: 5,
  },
  {
    name: "Fatima S.",
    role: "Content Creator & Online Entrepreneur",
    content:
      "The support experience is important to me. Being able to contact the EspritAccess team when I need assistance makes the service more convenient.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "What is EspritAccess and how does it work?",
    answer:
      "EspritAccess is a digital access platform designed to make useful digital services, connectivity solutions, and privacy tools more accessible. You can explore available products, choose a suitable plan, complete your payment, and follow the instructions provided to activate your service.",
  },
  {
    question: "How do I receive my VPN access after payment?",
    answer:
      "After selecting an available VPN plan and completing payment, follow the activation instructions provided. Where manual assistance is required, our support team can guide you through the setup process.",
  },
  {
    question: "What is a residential IP address?",
    answer:
      "A residential IP address is an internet address associated with a residential internet connection. Residential IP services can be useful for location-specific browsing and certain digital workflows. Availability and performance depend on the selected service and provider.",
  },
  {
    question: "Can I use my subscription on multiple devices?",
    answer:
      "Device limits depend on the specific subscription you purchase. Please check the plan description before subscribing or contact our support team if you need clarification about multi-device access.",
  },
  {
    question: "Which countries can I connect to?",
    answer:
      "Available connection locations depend on the VPN plan and provider infrastructure. Check the available server locations on the pricing page before making a purchase.",
  },
  {
    question: "What should I do if I need help setting up?",
    answer:
      "Our support team is available to assist with questions about payments, subscriptions, activation, and technical setup. You can contact us through our official support email at Espritaccess360@gmail.com.",
  },
  {
    question: "How can I renew my subscription?",
    answer:
      "You can renew your subscription by selecting the applicable renewal option or purchasing another plan through the website. Follow the payment and activation instructions provided.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Payments are processed through the available payment provider on our website. Always complete transactions through official EspritAccess payment channels and never share your passwords or sensitive payment details with anyone.",
  },
  {
    question: "How can I contact EspritAccess?",
    answer:
      "For enquiries, technical assistance, and general support, email us at Espritaccess360@gmail.com. Our team will assist you with your request.",
  },
];

export function TestimonialsAndFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <div className="space-y-24 py-20 px-4 max-w-7xl mx-auto">
      {/* Testimonials Section */}
      <section>
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
            <Star className="w-3.5 h-3.5 fill-emerald-400" />
            Customer Experiences
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            What Our Users Are Saying
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Discover how digital connectivity and accessible digital services
            can support your everyday online activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl p-8 bg-card/60 border border-border hover:border-emerald-500/30 transition-all duration-300 shadow-lg"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-emerald-400 text-emerald-400"
                    />
                  ))}
                </div>

                <p className="text-sm md:text-base text-foreground/90 italic mb-6">
                  "{t.content}"
                </p>
              </div>

              <div className="border-t border-border/60 pt-4">
                <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            Need Help?
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Find answers to common questions about EspritAccess, our digital
            services, subscriptions, payments, and customer support.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl bg-card/60 border border-border overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                aria-expanded={openFaq === index}
                className="w-full flex items-center justify-between gap-4 p-6 text-left font-semibold text-foreground hover:text-emerald-400 transition-colors"
              >
                <span className="text-sm md:text-base">{faq.question}</span>

                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-emerald-400 transition-transform duration-200 ${openFaq === index ? "rotate-180" : ""
                    }`}
                />
              </button>

              {openFaq === index && (
                <div className="px-6 pb-6 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}