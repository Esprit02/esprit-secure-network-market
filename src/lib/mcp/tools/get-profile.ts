import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  gender: string | null;
  language: string | null;
  timezone: string | null;
  created_at: string;
};

const toProfileJson = (row: ProfileRow) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  location: row.location,
  gender: row.gender,
  language: row.language,
  timezone: row.timezone,
  createdAt: row.created_at,
});

function toProfileText(profile: ReturnType<typeof toProfileJson>): string {
  const lines = [
    `Name: ${profile.name ?? "—"}`,
    `Email: ${profile.email ?? "—"}`,
    `Phone: ${profile.phone ?? "—"}`,
    `Location: ${profile.location ?? "—"}`,
    `Gender: ${profile.gender ?? "—"}`,
    `Language: ${profile.language ?? "—"}`,
    `Timezone: ${profile.timezone ?? "—"}`,
  ];
  return lines.join("\n");
}

export default defineTool({
  name: "get_profile",
  title: "Get profile",
  description:
    "Read the signed-in user's EspritAccess profile: name, email, phone, location and preferences (gender, language, timezone).",
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
      .from("profiles")
      .select("id, name, email, phone, location, gender, language, timezone, created_at")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data) {
      return { content: [{ type: "text", text: "No profile exists for this account yet." }], isError: true };
    }
    const profile = toProfileJson(data);
    return {
      content: [{ type: "text", text: toProfileText(profile) }],
      structuredContent: { profile },
    };
  },
});
