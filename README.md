# Esprit VPN Hub

Build a Premium Decentralized VPN Store & Client Portal named "Esprit VPN" featuring a deep navy blue background (#0A1128), modular dark panels, and vibrant neon red accents inspired by "1782974650757.png".



### 1. NAVIGATION & LAYOUT STYLING

- Implement the header structure from "Screenshot_20260701-102956_Chrome.jpg": hamburger menu icon, logo placeholder, notifications bell, and user initials profile avatar dropdown ("AM").

- Include the red alert bar at the very top: "Email Not Verified. Verify your email to access all features. [Verify Now]".

- Floating Admin Contact Widget: Pinned to the bottom-right corner, style a red chat bubble icon exactly like "1782974650757.png" that links directly to WhatsApp: https://wa.me/2347055618585?text=Hello%20Admin,%20I%20have%20a%20question%20about%20Esprit%20VPN!



### 2. CLIENT DASHBOARD PORTAL

Create a tabbed user interface containing these view modules:

- Browse/Home Tab: Displays a "Welcome Back!" hero greeting with the Esprit VPN logo card layout shown in "1782974650757.png".

- Store Tab (Active): Shows 3 distinct item shelves:

  1. VPN Services (Active & purchasable).

  2. One-Time Numbers (Styled with a "Coming Soon" badge).

  3. E-Books (Styled with a "Coming Soon" badge).

- Settings & Profile Tab: Includes the exact comprehensive text input layouts, dropdown selections (Gender, Language, Timezone), and outline iconography from "Screenshot_20260701-103002_Chrome.jpg" through "Screenshot_20260701-103012_Chrome.jpg".



### 3. ACTIVE VPN PRICING & PRODUCT DESCRIPTIONS

Under the Active VPN Store section, generate two main subscription purchasing cards:

- Monthly Plan: ₦4,000 NGN

- Yearly Plan: ₦14,000 NGN

- Feature Descriptions Under Cards: Add premium bullet items with red checkmarks detailing: "Access to 65,000+ localized decentralized nodes across the world", "Built-in malware blocking & secure ad shielding", "Anti-detect browser fingerprint protection matrix", and "High-speed encrypted P2P bandwidth connection".



### 4. SUPABASE DATABASE MATRIX & AUTOMATED VAULT

Automatically configure a Supabase backend logic schema with Row Level Security (RLS) enabled:

- `profiles` table: (id, name, email, phone, location)

- `vpn_vault` table: A shelf to store ready-to-sell dVPN API keys/configs. (id, plan_type ['monthly', 'yearly'], api_key_or_config, is_sold [boolean default false])

- `orders` table: Tracks transactions. (id, user_id, vpn_vault_id, payment_status, reference_id, created_at)

- Include a secure admin panel route `/admin-vault` protected by a password field where the administrator can manually input, store, and check inventory counts of unallocated decentralized VPN credentials/API keys.



### 5. PAYSTACK PAYMENT GATEWAY IMPLEMENTATION

- Wire the "Purchase Now" buttons on the pricing cards to execute a Paystack Inline Javascript checkout flow.

- Add code placeholders inside the application payment script handler precisely labeled:

  * `const PAYSTACK_PUBLIC_KEY = 'YOUR_LIVE_KEY_HERE';`

  * `const PAYSTACK_WEBHOOK_SECRET = 'YOUR_WEBHOOK_KEY_HERE';`

- Logic Flow: When a payment transaction finishes successfully, change the user's order record to 'Paid', flip the purchased `vpn_vault` key item state to `is_sold = true`, and instantly reveal that specific open API key profile directly onto the user's dashboard view.

Here is my live secret key for Paystack sk_live_07ce20a6af823dd8dfe258b2653c6f1af77badcd

And the pk key pk_live_a9b26ad9c87441fd49001e5e9b81a55560e5f9db



My password Ballon3086$

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://esprit-secure-network-market.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bc5aab9e-2145-4b79-95e7-e1103f51ed3b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
