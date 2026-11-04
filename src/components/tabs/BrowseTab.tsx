import type { User } from "@supabase/supabase-js";
import { ShieldCheck, Globe2, Zap } from "lucide-react";

export function BrowseTab({ user }: { user: User }) {
  const name = (user.user_metadata?.name as string | undefined) ?? user.email?.split("@")[0] ?? "there";
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-border p-8 shadow-[var(--shadow-panel)]"
           style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <p className="text-sm text-white/60">Welcome Back!</p>
          <h2 className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">
            Hello, <span className="text-primary">{name}</span>
          </h2>
          <p className="mt-3 max-w-lg text-white/70">
            Your digital access portal is ready. Head to the Store tab to grab
            a plan or manage your active keys.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Globe2, title: "65,000+ Nodes", body: "Localized decentralized network across the globe." },
          { icon: ShieldCheck, title: "Anti-Detect Matrix", body: "Browser fingerprint protection built-in." },
          { icon: Zap, title: "High-Speed P2P", body: "Encrypted bandwidth optimized for streaming." },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-panel)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-foreground/70">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
