// Paystack Inline JS integration helper.
// PUBLIC key (safe in source).
export const PAYSTACK_PUBLIC_KEY = "pk_live_a9b26ad9c87441fd49001e5e9b81a55560e5f9db";
// NOTE: the Paystack SECRET KEY is stored server-side as env `PAYSTACK_SECRET_KEY`
// and used only in server functions (never shipped to the browser).
// Webhook secret placeholder for server-side webhook verification when configured:
//   const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET; // set via secrets

type PaystackHandler = {
  openIframe: () => void;
};

declare global {
  interface Window {
    PaystackPop?: {
      setup: (opts: {
        key: string;
        email: string;
        amount: number; // in kobo
        currency?: string;
        ref: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => PaystackHandler;
    };
  }
}

export function generateReference(prefix = "ESPRIT") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function loadPaystack(): Promise<NonNullable<Window["PaystackPop"]>> {
  if (typeof window === "undefined") throw new Error("Paystack requires browser");
  if (window.PaystackPop) return window.PaystackPop;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src*="paystack.co/v1/inline.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Paystack script failed")), { once: true });
      if (window.PaystackPop) resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Paystack script failed"));
    document.head.appendChild(s);
  });
  if (!window.PaystackPop) throw new Error("Paystack SDK missing");
  return window.PaystackPop;
}
