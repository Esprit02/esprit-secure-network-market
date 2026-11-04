import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/2347055618585?text=Hello%20Admin,%20I%20have%20a%20question%20about%20EspritAccess!";

export function WhatsAppWidget() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Admin on WhatsApp"
      className="fixed bottom-5 right-5 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-primary/30 blur-xl scale-110 animate-pulse" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[var(--shadow-brand)] ring-2 ring-primary/40 transition-transform group-hover:scale-110"
            style={{ background: "var(--gradient-brand)" }}>
        <MessageCircle className="h-7 w-7" strokeWidth={2.4} />
      </span>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-card px-3 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-lg ring-1 ring-border transition-opacity group-hover:opacity-100">
        Chat with Admin
      </span>
    </a>
  );
}
