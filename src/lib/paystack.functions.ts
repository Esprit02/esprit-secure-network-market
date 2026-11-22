import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const PLAN_AMOUNTS: Record<
  "standard" | "plus" | "pro" | "monthly" | "yearly",
  number
> = {
  standard: 3999,
  plus: 6999,
  pro: 9999,
  monthly: 4000,
  yearly: 14000,
};

/**
 * Verify a Paystack transaction by reference, then atomically:
 * - mark the user's order as `paid`
 * - claim one unsold vpn_vault entry matching the plan
 * - link the vault entry to the order and mark it sold
 * - return the revealed api_key_or_config to the client
 */
export const finalizePaystackOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        reference: z.string().min(6).max(120),
        plan_type: z.enum(["standard", "plus", "pro", "monthly", "yearly"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) throw new Error("Payment provider not configured");

    // 1. Verify with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${secret}` } },
    );
    if (!verifyRes.ok) throw new Error("Unable to verify payment");
    const payload = (await verifyRes.json()) as {
      status: boolean;
      data?: { status: string; amount: number; currency: string; reference: string };
    };
    const t = payload.data;
    if (!payload.status || !t || t.status !== "success") {
      throw new Error("Payment not successful");
    }
    const expectedKobo = PLAN_AMOUNTS[data.plan_type] * 100;
    if (t.amount < expectedKobo) {
      throw new Error("Payment amount below plan price");
    }

    // 2. Load service-role client to touch vault + order atomically.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Claim an unsold vault key (SELECT then UPDATE with is_sold guard)
    const { data: vaultRow, error: vaultErr } = await supabaseAdmin
      .from("vpn_vault")
      .select("id, api_key_or_config, is_sold, plan_type")
      .eq("plan_type", data.plan_type)
      .eq("is_sold", false)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (vaultErr) throw new Error(vaultErr.message);
    if (!vaultRow) {
      // Record the order as paid but pending allocation
      await supabaseAdmin.from("orders").upsert(
        {
          user_id: context.userId,
          reference_id: data.reference,
          plan_type: data.plan_type,
          amount_ngn: PLAN_AMOUNTS[data.plan_type],
          payment_status: "paid",
        },
        { onConflict: "reference_id" },
      );
      throw new Error(
        "Payment received but no keys are currently in stock. Our admin will assign one shortly.",
      );
    }

    const { error: claimErr, data: claimed } = await supabaseAdmin
      .from("vpn_vault")
      .update({ is_sold: true })
      .eq("id", vaultRow.id)
      .eq("is_sold", false)
      .select("id, api_key_or_config")
      .maybeSingle();
    if (claimErr || !claimed) throw new Error("Could not reserve a key, please retry");

    const { error: orderErr } = await supabaseAdmin
      .from("orders")
      .upsert(
        {
          user_id: context.userId,
          reference_id: data.reference,
          plan_type: data.plan_type,
          amount_ngn: PLAN_AMOUNTS[data.plan_type],
          payment_status: "paid",
          vpn_vault_id: claimed.id,
        },
        { onConflict: "reference_id" },
      );
    if (orderErr) throw new Error(orderErr.message);

    return {
      ok: true as const,
      reference: data.reference,
      plan_type: data.plan_type,
      api_key_or_config: claimed.api_key_or_config,
    };
  });

/** Fetch the current user's paid orders with their allocated keys. */
export const listMyKeys = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id, plan_type, payment_status, reference_id, created_at, vpn_vault_id")
      .eq("user_id", context.userId)
      .eq("payment_status", "paid")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const vaultIds = (orders ?? [])
      .map((o) => o.vpn_vault_id)
      .filter((x): x is string => !!x);
    let keyMap = new Map<string, string>();
    if (vaultIds.length) {
      const { data: vaults } = await supabaseAdmin
        .from("vpn_vault")
        .select("id, api_key_or_config")
        .in("id", vaultIds);
      keyMap = new Map((vaults ?? []).map((v) => [v.id, v.api_key_or_config]));
    }
    return (orders ?? []).map((o) => ({
      id: o.id,
      plan_type: o.plan_type,
      reference_id: o.reference_id,
      created_at: o.created_at,
      api_key_or_config: o.vpn_vault_id ? keyMap.get(o.vpn_vault_id) ?? null : null,
    }));
  });