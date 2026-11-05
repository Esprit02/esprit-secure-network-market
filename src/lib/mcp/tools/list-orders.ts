import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

type OrderRow = {
  id: string;
  plan_type: string;
  amount_ngn: number;
  payment_status: string;
  reference_id: string | null;
  created_at: string;
};

const toOrderJson = (row: OrderRow) => ({
  id: row.id,
  plan: row.plan_type,
  amountNgn: row.amount_ngn,
  paymentStatus: row.payment_status,
  reference: row.reference_id,
  createdAt: row.created_at,
});

function toOrdersText(orders: ReturnType<typeof toOrderJson>[]): string {
  if (orders.length === 0) return "No orders found for this account.";
  return orders
    .map(
      (o) =>
        `${o.createdAt.slice(0, 10)}  ${o.plan}  NGN ${o.amountNgn.toLocaleString("en-NG")}  ${o.paymentStatus}${o.reference ? `  (${o.reference})` : ""}`,
    )
    .join("\n");
}

export default defineTool({
  name: "list_orders",
  title: "List orders",
  description:
    "List the signed-in user's EspritAccess orders (most recent first), including plan, amount in naira and payment status.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const userId = ctx.getUserId();
    if (!userId) {
      return { content: [{ type: "text", text: "Could not determine the signed-in user." }], isError: true };
    }
    const supabase = await supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("orders")
      .select("id, plan_type, amount_ngn, payment_status, reference_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const orders = (data ?? []).map(toOrderJson);
    return {
      content: [{ type: "text", text: toOrdersText(orders) }],
      structuredContent: { orders },
    };
  },
});
