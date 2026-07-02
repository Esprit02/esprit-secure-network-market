import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { adminAuth, adminAddVaultItems, adminInventory } from "@/lib/admin.functions";
import { Lock, ShieldCheck, KeyRound, PackagePlus } from "lucide-react";

export const Route = createFileRoute("/admin-vault")({
  head: () => ({
    meta: [
      { title: "Admin Vault — Esprit VPN" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminVault,
});

function AdminVault() {
  const auth = useServerFn(adminAuth);
  const add = useServerFn(adminAddVaultItems);
  const inv = useServerFn(adminInventory);

  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [keys, setKeys] = useState("");
  const [busy, setBusy] = useState(false);
  const [stock, setStock] = useState<{ monthly: { available: number; sold: number }; yearly: { available: number; sold: number } } | null>(null);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { ok } = await auth({ data: { password } });
      if (!ok) throw new Error("Wrong password");
      setUnlocked(true);
      const s = await inv({ data: { password } });
      setStock(s);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unauthorized");
    } finally {
      setBusy(false);
    }
  }

  async function submitKeys(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { inserted } = await add({ data: { password, plan_type: plan, keys } });
      toast.success(`Added ${inserted} ${plan} key(s)`);
      setKeys("");
      const s = await inv({ data: { password } });
      setStock(s);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A1128] px-4">
        <form onSubmit={unlock} className="w-full max-w-sm rounded-2xl border border-border bg-panel p-8 shadow-[var(--shadow-panel)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-[var(--shadow-red)]" style={{ background: "var(--gradient-red)" }}>
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-[Space_Grotesk] text-xl font-bold">Admin Vault</h1>
              <p className="text-xs text-foreground/60">Restricted access</p>
            </div>
          </div>
          <Label htmlFor="pwd">Password</Label>
          <Input id="pwd" type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2" />
          <Button type="submit" disabled={busy} className="mt-4 w-full font-semibold" style={{ background: "var(--gradient-red)" }}>
            {busy ? "Verifying…" : "Unlock Vault"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-[var(--shadow-red)]" style={{ background: "var(--gradient-red)" }}>
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-[Space_Grotesk] text-2xl font-bold">Vault Console</h1>
          <p className="text-sm text-foreground/60">Stock and manage decentralized VPN credentials.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stock && (Object.keys(stock) as ("monthly"|"yearly")[]).map((k) => (
          <div key={k} className="rounded-2xl border border-border bg-panel p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                <span className="font-medium capitalize">{k} Inventory</span>
              </div>
              <span className="text-xs text-foreground/50">Total {stock[k].available + stock[k].sold}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-black/30 p-3">
                <div className="text-xs text-foreground/60">Available</div>
                <div className="text-2xl font-bold text-primary">{stock[k].available}</div>
              </div>
              <div className="rounded-lg bg-black/30 p-3">
                <div className="text-xs text-foreground/60">Sold</div>
                <div className="text-2xl font-bold text-foreground/80">{stock[k].sold}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submitKeys} className="rounded-2xl border border-border bg-panel p-6">
        <div className="mb-4 flex items-center gap-2">
          <PackagePlus className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Add Vault Items</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={plan} onValueChange={(v) => setPlan(v as "monthly"|"yearly")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 space-y-2">
            <Label>API Keys / Configs (one per line)</Label>
            <Textarea rows={8} value={keys} onChange={(e) => setKeys(e.target.value)} placeholder="paste one credential per line…" required />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={busy || !keys.trim()} className="font-semibold" style={{ background: "var(--gradient-red)" }}>
            {busy ? "Uploading…" : "Add to Vault"}
          </Button>
        </div>
      </form>
    </div>
  );
}
