import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { User as UserIcon, Mail, Phone, MapPin, Globe, Languages, Clock } from "lucide-react";

type Profile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  gender: string;
  language: string;
  timezone: string;
};

const EMPTY: Profile = { name: "", email: "", phone: "", location: "", gender: "", language: "", timezone: "" };

export function SettingsTab({ user }: { user: User }) {
  const [p, setP] = useState<Profile>(EMPTY);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setP({
          name: data.name ?? "",
          email: data.email ?? user.email ?? "",
          phone: data.phone ?? "",
          location: data.location ?? "",
          gender: data.gender ?? "",
          language: data.language ?? "",
          timezone: data.timezone ?? "",
        });
      } else {
        setP((s) => ({ ...s, email: user.email ?? "" }));
      }
    })();
  }, [user.id, user.email]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...p });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  }

  const field = (
    id: keyof Profile,
    label: string,
    icon: typeof UserIcon,
    props: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {},
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-xs uppercase tracking-wider text-foreground/60">{label}</Label>
        <div className="relative">
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <Input
            id={id}
            value={p[id]}
            onChange={(e) => setP((s) => ({ ...s, [id]: e.target.value }))}
            className="pl-9"
            {...props}
          />
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-8">
      <header className="rounded-2xl border border-border bg-panel p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-red)]"
               style={{ background: "var(--gradient-red)" }}>
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-[Space_Grotesk] text-xl font-bold">Settings & Profile</h2>
            <p className="text-sm text-foreground/60">Manage your account, preferences and localization.</p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-panel p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/70">Personal Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {field("name", "Full Name", UserIcon, { required: true })}
          {field("email", "Email", Mail, { type: "email", disabled: true })}
          {field("phone", "Phone", Phone, { type: "tel", placeholder: "+234 ..." })}
          {field("location", "Location", MapPin, { placeholder: "City, Country" })}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-panel p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/70">Preferences</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField label="Gender" icon={UserIcon} value={p.gender} onChange={(v) => setP((s) => ({ ...s, gender: v }))}
            options={[["male","Male"],["female","Female"],["other","Other"],["undisclosed","Prefer not to say"]]} />
          <SelectField label="Language" icon={Languages} value={p.language} onChange={(v) => setP((s) => ({ ...s, language: v }))}
            options={[["en","English"],["fr","French"],["yo","Yoruba"],["ig","Igbo"],["ha","Hausa"]]} />
          <SelectField label="Timezone" icon={Clock} value={p.timezone} onChange={(v) => setP((s) => ({ ...s, timezone: v }))}
            options={[
              ["Africa/Lagos","Africa/Lagos (WAT)"],
              ["Africa/Accra","Africa/Accra (GMT)"],
              ["Europe/London","Europe/London"],
              ["Europe/Berlin","Europe/Berlin"],
              ["America/New_York","America/New_York"],
              ["America/Los_Angeles","America/Los_Angeles"],
              ["Asia/Dubai","Asia/Dubai"],
              ["Asia/Singapore","Asia/Singapore"],
            ]} />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={busy} className="font-semibold" style={{ background: "var(--gradient-red)" }}>
          {busy ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function SelectField({
  label, icon: Icon, value, onChange, options,
}: {
  label: string;
  icon: typeof Globe;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-foreground/60">{label}</Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-foreground/40" />
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map(([v, l]) => (
            <SelectItem key={v} value={v}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
