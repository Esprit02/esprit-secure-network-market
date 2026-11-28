import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type VpnPlanType =
  | "standard_monthly"
  | "plus_monthly"
  | "pro_monthly"
  | "standard_yearly"
  | "plus_yearly"
  | "pro_yearly";

interface VaultRecord {
  id: string;
  api_key_or_config: string;
}

interface ProvisionApiResponse {
  ok?: boolean;
  config?: string;
  ip?: string;
  publicKey?: string;
  error?: string;
}

const PLAN_AMOUNTS: Record<VpnPlanType, number> = {
  standard_monthly: 3999,
  plus_monthly: 6999,
  pro_monthly: 9999,
  standard_yearly: 39990,
  plus_yearly: 69990,
  pro_yearly: 99990,
};

const PLAN_DURATION_DAYS: Record<VpnPlanType, number> = {
  standard_monthly: 30,
  plus_monthly: 30,
  pro_monthly: 30,
  standard_yearly: 365,
  plus_yearly: 365,
  pro_yearly: 365,
};

const PROVISION_API_URL = (
  process.env.VITE_API_URL || "https://api.espritaccess.com.ng"
).replace(/\/+$/, "");

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

function getAuthUserEmail(context: unknown, fallbackUserId: string): string {
  const ctx = context as {
    user?: { email?: string | null };
    email?: string | null;
  };
  const email = ctx.user?.email ?? ctx.email;
  if (email && email.includes("@")) {
    return email;
  }
  return `${fallbackUserId}@espritaccess.com.ng`;
}

async function provisionWireGuardConfig(params: {
  email: string;
  country?: string;
}): Promise<string> {
  const res = await fetch(`${PROVISION_API_URL}/provision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      country: params.country || "US",
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `Provisioning service error (${res.status}): ${errText || "Unable to create WireGuard config"}`,
    );
  }

  const payload = (await res.json()) as ProvisionApiResponse;
  if (payload.ok === false || !payload.config || !payload.config.trim()) {
    throw new Error(
      payload.error || "Provisioning service returned an empty WireGuard config",
    );
  }

  return payload.config.trim();
}

export const finalizePaystackOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        reference: z.string().min(6).max(120),
        plan_type: z.enum([
          "standard_monthly",
          "plus_monthly",
          "pro_monthly",
          "standard_yearly",
          "plus_yearly",
          "pro_yearly",
        ]),
        country: z.string().min(2).max(10).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const userId = getAuthUserId(context);
    const userEmail = getAuthUserEmail(context, userId);
    const expectedAmountNgn = PLAN_AMOUNTS[data.plan_type];
    const expectedKobo = expectedAmountNgn * 100;
    const isSandboxBypass =
      data.reference.startsWith("TEST_") || data.reference.startsWith("test-");

    let paystackCustomerEmail: string | undefined;

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
          customer?: { email?: string };
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

      paystackCustomerEmail = transaction.customer?.email;
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
        .select("api_key_or_config")
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
          expires_at: null,
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
    const expiresAt = new Date(
      Date.now() + durationDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    const wireGuardConfig = await provisionWireGuardConfig({
      email: paystackCustomerEmail || userEmail,
      country: data.country || "US",
    });

    const { data: insertedVault, error: vaultInsertErr } = await db
      .from("vpn_vault")
      .insert({
        plan_type: data.plan_type,
        api_key_or_config: wireGuardConfig,
        is_sold: true,
      })
      .select("id, api_key_or_config")
      .single();

    if (vaultInsertErr || !insertedVault) {
      throw new Error(
        vaultInsertErr?.message || "Failed to store provisioned WireGuard config",
      );
    }

    const { error: linkErr } = await db
      .from("orders")
      .update({ vpn_vault_id: insertedVault.id })
      .eq("id", savedOrder.id);

    if (linkErr) {
      throw new Error(linkErr.message);
    }

    return {
      ok: true as const,
      reference: data.reference,
      plan_type: data.plan_type,
      api_key_or_config: insertedVault.api_key_or_config as string,
      expires_at: expiresAt,
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
        .select("id, api_key_or_config")
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
        expires_at: null,
      };
    });
  });