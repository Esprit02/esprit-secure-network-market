# Roadmap

## EspritAccess "Invalid key" investigation (2026-11-02)
- [x] Investigate source of "Invalid key" error under Subscription Store
  - Not present anywhere in this project's source or UI; string comes from Paystack checkout UI shown when the passed key is invalid.
- [x] Verify Paystack keys: pk_live (in src/lib/paystack.ts) + sk_live (env PAYSTACK_SECRET_KEY) both valid LIVE keys, same-account pair confirmed via transaction lookup (test checkout txn ESPRIT-...-ZW8VKU ₦4,000 created with pk, visible to sk). Checkout opens end-to-end.
- [x] Test/live mismatch check: none — both keys are live-prefixed, one account.
- [x] Payment init path: no Supabase Edge Functions used; Paystack Inline (client) + TanStack server function (finalizePaystackOrder) verifies. No "Invalid key" possible from backend.
- [x] Env/credentials: PAYSTACK_SECRET_KEY present and valid. Frontend receives correct responses (verified via live flow).
- [x] Found root cause of the report: espritaccess.com.ng serves a DIFFERENT app build (title "EspritAccess — Fast, Secure & Affordable VPN in Nigeria", /login route, ₦4,999 pricing, "VPS hosting, RDP" copy; this project is unpublished). The error belongs to that deployment.
- [x] User confirmed: error is seen on espritaccess.com.ng; wants the OTHER deployed app investigated.
- [x] Workspace search: no other accessible Lovable project exists — the deployed site was built outside this workspace (its own GitHub/Vercel stack), so its code cannot be inspected or edited from this chat. Report stands: keys in THIS project are correct; the error belongs to the external deployment.

## ESPRITACCESS visual redesign (2026-11-03) — BLOCKED
- [ ] User asked for a full redesign of the espritaccess.com.ng site (reference image, light/dark mode, new brand colors #061A35/#0B2545/#16C784, header, hero, features, services, blog, footer) while preserving its Supabase/Vercel/Paystack stack.
- BLOCKER: that codebase is not in this workspace (no GitHub/Vercel access from this chat) and the reference image did not attach. Need the user to decide where the redesign happens (this Lovable project vs their other environment) and re-send the image.
