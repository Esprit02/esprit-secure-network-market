import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { timingSafeEqual } from "node:crypto";

function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_VAULT_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Verify admin password (used to gate the /admin-vault UI). */
export const adminAuth = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ password: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => ({ ok: verifyPassword(data.password) }));

/** Add a new dVPN key/config to the vault. Admin-password-gated. */
export const adminAddVaultItems = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        password: z.string().min(1).max(200),
        plan_type: z.enum(["monthly", "yearly"]),
        keys: z.string().min(1).max(50_000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    if (!verifyPassword(data.password)) throw new Error("Unauthorized");
    const rows = data.keys
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((api_key_or_config) => ({ plan_type: data.plan_type, api_key_or_config }));
    if (!rows.length) return { inserted: 0 };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("vpn_vault").insert(rows);
    if (error) throw new Error(error.message);
    return { inserted: rows.length };
  });

/** Return per-plan inventory counts. */
export const adminInventory = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ password: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    if (!verifyPassword(data.password)) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("vpn_vault")
      .select("plan_type, is_sold");
    if (error) throw new Error(error.message);
    const acc = {
      monthly: { available: 0, sold: 0 },
      yearly: { available: 0, sold: 0 },
    };
    for (const r of rows ?? []) {
      const p = r.plan_type as "monthly" | "yearly";
      if (!acc[p]) continue;
      if (r.is_sold) acc[p].sold += 1;
      else acc[p].available += 1;
    }
    return acc;
  });
/** Return full admin dashboard overview: inventory, revenue, orders, and users. */
export const adminDashboardData = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ password: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    if (!verifyPassword(data.password)) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [vaultRes, ordersRes, usersRes] = await Promise.all([
      supabaseAdmin.from("vpn_vault").select("plan_type, is_sold"),
      supabaseAdmin
        .from("orders")
        .select("id, user_id, plan_type, amount_ngn, payment_status, reference_id, vpn_vault_id, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 }),
    ]);

    if (vaultRes.error) throw new Error(vaultRes.error.message);
    if (ordersRes.error) throw new Error(ordersRes.error.message);

    const inventory = {
      monthly: { available: 0, sold: 0 },
      yearly: { available: 0, sold: 0 },
    };
    for (const r of vaultRes.data ?? []) {
      const p = r.plan_type as "monthly" | "yearly";
      if (!inventory[p]) continue;
      if (r.is_sold) inventory[p].sold += 1;
      else inventory[p].available += 1;
    }

    const authUsers = usersRes.data?.users ?? [];
    const emailById = new Map(authUsers.map((u) => [u.id, u.email ?? "Unknown"]));

    const orders = (ordersRes.data ?? []).map((o) => ({
      ...o,
      user_email: emailById.get(o.user_id) ?? o.user_id,
    }));

    const paidOrders = orders.filter(
      (o) => o.payment_status === "paid" || o.payment_status === "success"
    );
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount_ngn || 0), 0);

    const users = authUsers.map((u) => ({
      id: u.id,
      email: u.email ?? "No email",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    }));

    return {
      inventory,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        paidOrders: paidOrders.length,
        totalUsers: users.length,
      },
      orders,
      users,
    };
  });