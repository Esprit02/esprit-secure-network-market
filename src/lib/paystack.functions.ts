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
  yearly: 19999,
};

/**
 * Verify a Paystack transaction by reference, then:
 * - mark the user's order as paid
 * - claim an available VPN vault entry
 * - link the vault entry to the order
 * - return the allocated VPN configuration
 */
export const finalizePaystackOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        reference: z.string().min(6).max(120),
        plan_type: z.enum([
          "standard",
          "plus",
          "pro",
          "monthly",
          "yearly",
        ]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      throw new Error("Payment provider not configured");
    }

    // 1. Verify payment directly with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        data.reference,
      )}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      },
    );

    if (!verifyRes.ok) {
      throw new Error("Unable to verify payment");
    }

    const payload = (await verifyRes.json()) as {
      status: boolean;
      data?: {
        status: string;
        amount: number;
        currency: string;
        reference: string;
      };
    };

    const transaction = payload.data;

    if (
      !payload.status ||
      !transaction ||
      transaction.status !== "success"
    ) {
      throw new Error("Payment not successful");
    }

    if (transaction.currency !== "NGN") {
      throw new Error("Invalid payment currency");
    }

    if (transaction.reference !== data.reference) {
      throw new Error("Payment reference mismatch");
    }

    // 2. Verify the exact expected amount in kobo
    const expectedKobo = PLAN_AMOUNTS[data.plan_type] * 100;

    if (transaction.amount !== expectedKobo) {
      throw new Error("Payment amount does not match the selected plan");
    }

    // 3. Load Supabase service-role client
    const {
      supabaseAdmin,
    } = await import("@/integrations/supabase/client.server");

    // 4. Find an available VPN key for the selected plan
    const { data: vaultRow, error: vaultErr } = await supabaseAdmin
      .from("vpn_vault")
      .select("id, api_key_or_config, is_sold, plan_type")
      .eq("plan_type", data.plan_type)
      .eq("is_sold", false)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (vaultErr) {
      throw new Error(vaultErr.message);
    }

    // 5. Record successful payment if no key is available
    if (!vaultRow) {
      const { error: orderErr } = await supabaseAdmin
        .from("orders")
        .upsert(
          {
            user_id: context.userId,
            reference_id: data.reference,
            plan_type: data.plan_type,
            amount_ngn: PLAN_AMOUNTS[data.plan_type],
            payment_status: "paid",
          },
          {
            onConflict: "reference_id",
          },
        );

      if (orderErr) {
        throw new Error(orderErr.message);
      }

      throw new Error(
        "Payment received, but no keys are currently in stock. Our admin will assign one shortly.",
      );
    }

    // 6. Reserve the VPN key
    const { error: claimErr, data: claimed } = await supabaseAdmin
      .from("vpn_vault")
      .update({ is_sold: true })
      .eq("id", vaultRow.id)
      .eq("is_sold", false)
      .select("id, api_key_or_config")
      .maybeSingle();

    if (claimErr || !claimed) {
      throw new Error("Could not reserve a key, please retry");
    }

    // 7. Save the paid order
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
        {
          onConflict: "reference_id",
        },
      );

    if (orderErr) {
      throw new Error(orderErr.message);
    }

    // 8. Return the VPN configuration
    return {
      ok: true as const,
      reference: data.reference,
      plan_type: data.plan_type,
      api_key_or_config: claimed.api_key_or_config,
    };
  });

/**
 * Fetch the current user's paid orders
 * and their allocated VPN configurations.
 */
export const listMyKeys = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const {
      supabaseAdmin,
    } = await import("@/integrations/supabase/client.server");

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, plan_type, payment_status, reference_id, created_at, vpn_vault_id",
      )
      .eq("user_id", context.userId)
      .eq("payment_status", "paid")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const vaultIds = (orders ?? [])
      .map((order) => order.vpn_vault_id)
      .filter((id): id is string => !!id);

    let keyMap = new Map<string, string>();

    if (vaultIds.length > 0) {
      const { data: vaults, error: vaultError } = await supabaseAdmin
        .from("vpn_vault")
        .select("id, api_key_or_config")
        .in("id", vaultIds);

      if (vaultError) {
        throw new Error(vaultError.message);
      }

      keyMap = new Map(
        (vaults ?? []).map((vault) => [
          vault.id,
          vault.api_key_or_config,
        ]),
      );
    }

    return (orders ?? []).map((order) => ({
      id: order.id,
      plan_type: order.plan_type,
      reference_id: order.reference_id,
      created_at: order.created_at,
      api_key_or_config: order.vpn_vault_id
        ? keyMap.get(order.vpn_vault_id) ?? null
        : null,
    }));
  });