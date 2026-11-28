export type ConnectionStatus = "connected" | "disconnected" | "expired";

export interface PricingPlan {
    id: "standard" | "plus" | "pro";
    name: string;
    priceDisplay: string;
    billingPeriod: "Monthly" | "Annual";
    billingLabel: string;
    summary: string;
    features: string[];
    preCheckoutNote: string;
}

export const SUPPORT_EMAIL = "Espritaccess360@gmail.com";

export const PRICING_PLANS: PricingPlan[] = [
    {
        id: "standard",
        name: "Standard",
        priceDisplay: "₦100",
        billingPeriod: "Monthly",
        billingLabel: "Monthly Billing · ₦100 / month",
        summary: "Core connectivity access for everyday digital usage.",
        features: [
            "Monthly billing cycle (₦100 / month)",
            "Configuration and device setup instructions",
            `Support via ${SUPPORT_EMAIL}`,
        ],
        preCheckoutNote:
            "Confirm billing period and plan terms before starting checkout.",
    },
    {
        id: "plus",
        name: "Plus",
        priceDisplay: "₦8,500",
        billingPeriod: "Monthly",
        billingLabel: "Monthly Billing · ₦8,500 / month",
        summary: "Expanded monthly access with setup support across devices.",
        features: [
            "Monthly billing cycle (₦8,500 / month)",
            "Device setup assistance",
            "Order and transaction history in dashboard",
        ],
        preCheckoutNote:
            "Confirm billing period and plan terms before starting checkout.",
    },
    {
        id: "pro",
        name: "Pro",
        priceDisplay: "₦14,000",
        billingPeriod: "Annual",
        billingLabel: "Annual Billing · ₦14,000 / year",
        summary: "Annual billing option — verify yearly entitlements before purchase.",
        features: [
            "Annual billing cycle (₦14,000 / year)",
            "Account and subscription management hub",
            `Support via ${SUPPORT_EMAIL}`,
        ],
        preCheckoutNote:
            "Billed once per year at ₦14,000. Verify exact annual plan terms before payment.",
    },
];

export function getConnectionIndicator(status: ConnectionStatus) {
    switch (status) {
        case "connected":
            return {
                label: "Connected",
                dotClass: "bg-emerald-500",
                pillClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
            };
        case "expired":
            return {
                label: "Expired",
                dotClass: "bg-amber-400",
                pillClass: "border-amber-500/30 bg-amber-500/10 text-amber-300",
            };
        default:
            return {
                label: "Not Activated",
                dotClass: "bg-slate-400",
                pillClass: "border-slate-500/30 bg-slate-500/10 text-slate-300",
            };
    }
}

export function generateClientPassword(length = 16): string {
    const safeLength = Math.max(12, Math.min(64, length));
    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_+=";
    const array = new Uint32Array(safeLength);
    crypto.getRandomValues(array);
    return Array.from(array, (n) => chars[n % chars.length]).join("");
}