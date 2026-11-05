import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfileTool from "./tools/get-profile";
import listOrdersTool from "./tools/list-orders";

// Vite inlines the stable ref; the published SUPABASE_URL may be a proxy.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "esprit-vpn-hub",
  title: "Esprit VPN Hub",
  version: "0.1.0",
  instructions:
    "Tools for the EspritAccess client portal. Call `get_profile` to read the signed-in user's profile and " +
    "`list_orders` to review their VPN subscription orders and payment status. All tools act as the signed-in " +
    "user and respect the app's row-level security; VPN credentials themselves are never exposed.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getProfileTool, listOrdersTool],
});
