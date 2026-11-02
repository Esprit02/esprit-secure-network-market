# Roadmap

## EspritAccess "Invalid key" investigation (2026-11-02)
- [x] Investigate source of "Invalid key" error under Subscription Store
  - Not present anywhere in this project's source or UI; string comes from Paystack checkout UI shown when the passed key is invalid.
- [x] Verify Paystack keys: pk_live (in src/lib/paystack.ts) + sk_live (env PAYSTACK_SECRET_KEY) both valid LIVE keys, same-account pair confirmed via transaction lookup (test checkout txn ESPRIT-...-ZW8VKU ₦4,000 created with pk, visible to sk). Checkout opens end-to-end.
- [x] Test/live mismatch check: none — both keys are live-prefixed, one account.
- [x] Payment init path: no Supabase Edge Functions used; Paystack Inline (client) + TanStack server function (finalizePaystackOrder) verifies. No "Invalid key" possible from backend.
- [x] Env/credentials: PAYSTACK_SECRET_KEY present and valid. Frontend receives correct responses (verified via live flow).
- [x] Found root cause of the report: espritaccess.com.ng serves a DIFFERENT app build (title "EspritAccess — Fast, Secure & Affordable VPN in Nigeria", /login route, ₦4,999 pricing, "VPS hosting, RDP" copy; this project is unpublished). The error belongs to that deployment.
- [ ] Decide with user: publish THIS app to the domain, or fix the other deployed app's Paystack key there.
