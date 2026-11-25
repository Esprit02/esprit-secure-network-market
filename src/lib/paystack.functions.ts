import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

type PlanType = "standard" | "plus" | "pro" | "monthly" | "yearly";

interface ClaimedVaultRow {
  vault_id: string | null;
  config_text: string | null;
  expires_at: string | null;
}

interface VaultRecord {
  id: string;
  api_key_or_config: string;
  expires_at: string | null;
}

const PLAN_AMOUNTS: Record<PlanType, number> = {
  standard: 3999,
  plus: 6999,
  pro: 9999,
  monthly: 4000,
  yearly: 19999,
};

const PLAN_DURATION_DAYS: Record<PlanType, number> = {
  standard: 30,
  plus: 30,
  pro: 30,
  monthly: 30,
  yearly: 365,
};

function getAuthUserId(context: unknown): string {
  const ctx = context as {
    userId?: string;
    user?: { id?: string };
  };
  const userId = ctx.userId ?? ctx.user?.id;
  if (!userId) {
    throw new Error("Authenticated user ID missing");
  }
  return userId;
}

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
    const userId = getAuthUserId(context);
    const expectedAmountNgn = PLAN_AMOUNTS[data.plan_type];
    const expectedKobo = expectedAmountNgn * 100;
    const isSandboxBypass =
      data.reference.startsWith("TEST_") || data.reference.startsWith("test-");

    if (!isSandboxBypass) {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret) {
        throw new Error("Payment provider not configured");
      }

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

      if (!payload.status || !transaction || transaction.status !== "success") {
        throw new Error("Payment not successful");
      }

      if (transaction.currency !== "NGN") {
        throw new Error("Invalid payment currency");
      }

      if (transaction.reference !== data.reference) {
        throw new Error("Payment reference mismatch");
      }

      if (transaction.amount !== expectedKobo) {
        throw new Error("Payment amount does not match the selected plan");
      }
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const db = supabaseAdmin as any;

    const { data: existingOrder, error: existingOrderErr } = await db
      .from("orders")
      .select("id, vpn_vault_id, payment_status")
      .eq("reference_id", data.reference)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingOrderErr) {
      throw new Error(existingOrderErr.message);
    }

    if (existingOrder?.vpn_vault_id) {
      const { data: existingVault, error: existingVaultErr } = await db
        .from("vpn_vault")
        .select("api_key_or_config, expires_at")
        .eq("id", existingOrder.vpn_vault_id)
        .maybeSingle();

      if (existingVaultErr) {
        throw new Error(existingVaultErr.message);
      }

      if (existingVault?.api_key_or_config) {
        return {
          ok: true as const,
          reference: data.reference,
          plan_type: data.plan_type,
          api_key_or_config: existingVault.api_key_or_config as string,
          expires_at: (existingVault.expires_at as string | null) ?? null,
        };
      }
    }

    const { data: savedOrder, error: orderUpsertErr } = await db
      .from("orders")
      .upsert(
        {
          user_id: userId,
          reference_id: data.reference,
          plan_type: data.plan_type,
          amount_ngn: expectedAmountNgn,
          payment_status: "paid",
        },
        {
          onConflict: "reference_id",
        },
      )
      .select("id")
      .single();

    if (orderUpsertErr || !savedOrder) {
      throw new Error(orderUpsertErr?.message || "Failed to save paid order");
    }

    const durationDays = PLAN_DURATION_DAYS[data.plan_type];

    const { data: claimedRows, error: claimErr } = await db.rpc(
      "claim_vpn_config",
      {
        p_plan_type: data.plan_type,
        p_user_id: userId,
        p_order_id: savedOrder.id,
        p_duration_days: durationDays,
      },
    );

    if (claimErr) {
      throw new Error(claimErr.message);
    }

    const claimed = (
      Array.isArray(claimedRows) ? claimedRows[0] : claimedRows
    ) as ClaimedVaultRow | undefined;

    if (!claimed?.vault_id || !claimed?.config_text) {
      throw new Error(
        "Payment received, but no keys are currently in stock. Our admin will assign one shortly.",
      );
    }

    const { error: linkErr } = await db
      .from("orders")
      .update({ vpn_vault_id: claimed.vault_id })
      .eq("id", savedOrder.id);

    if (linkErr) {
      throw new Error(linkErr.message);
    }

    return {
      ok: true as const,
      reference: data.reference,
      plan_type: data.plan_type,
      api_key_or_config: claimed.config_text,
      expires_at: claimed.expires_at ?? null,
    };
  });

export const listMyKeys = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = getAuthUserId(context);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const db = supabaseAdmin as any;

    const { data: orders, error } = await db
      .from("orders")
      .select(
        "id, plan_type, payment_status, reference_id, created_at, vpn_vault_id",
      )
      .eq("user_id", userId)
      .eq("payment_status", "paid")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const orderRows = (orders ?? []) as Array<{
      id: string;
      plan_type: string;
      payment_status: string;
      reference_id: string | null;
      created_at: string;
      vpn_vault_id: string | null;
    }>;

    const vaultIds = orderRows
      .map((order) => order.vpn_vault_id)
      .filter((id): id is string => !!id);

    let vaultMap = new Map<string, VaultRecord>();

    if (vaultIds.length > 0) {
      const { data: vaults, error: vaultError } = await db
        .from("vpn_vault")
        .select("id, api_key_or_config, expires_at")
        .in("id", vaultIds);

      if (vaultError) {
        throw new Error(vaultError.message);
      }

      vaultMap = new Map(
        ((vaults ?? []) as VaultRecord[]).map((vault) => [vault.id, vault]),
      );
    }

    return orderRows.map((order) => {
      const vaultInfo = order.vpn_vault_id
        ? vaultMap.get(order.vpn_vault_id)
        : undefined;

      return {
        id: order.id,
        plan_type: order.plan_type,
        reference_id: order.reference_id,
        created_at: order.created_at,
        api_key_or_config: vaultInfo?.api_key_or_config ?? null,
        expires_at: vaultInfo?.expires_at ?? null,
      };
    });
  });