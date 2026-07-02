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
