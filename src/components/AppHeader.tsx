import { useState } from "react";
import { Bell, Menu, ShieldCheck, LogOut, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initialsFrom(email?: string | null) {
  if (!email) return "AM";
  const base = email.split("@")[0];
  const parts = base.split(/[._-]/).filter(Boolean);
  const s =
    parts.length >= 2
      ? parts[0][0] + parts[1][0]
      : base.slice(0, 2);
  return s.toUpperCase();
}

export function AppHeader({
  email,
  emailVerified,
  onVerify,
}: {
  email: string | null;
  emailVerified: boolean;
  onVerify: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!emailVerified && (
        <div className="w-full bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm">
            <span className="font-medium">
              Email Not Verified. Verify your email to access all features.
            </span>
            <button
              onClick={onVerify}
              className="rounded-md bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur hover:bg-white/25"
            >
              Verify Now
            </button>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-[#0A1128]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              className="text-foreground/80"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-[var(--shadow-red)]"
                style={{ background: "var(--gradient-red)" }}
              >
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-[Space_Grotesk] text-lg font-bold tracking-tight">
                Esprit<span className="text-primary">VPN</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative text-foreground/80"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-[#0A1128]" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Profile"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-primary/50 shadow-[var(--shadow-red)]"
                  style={{ background: "var(--gradient-red)" }}
                >
                  {initialsFrom(email)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{email ?? "Signed in"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {open && (
          <nav className="border-t border-border/60 bg-panel-elev/90 px-4 py-3 text-sm">
            <ul className="mx-auto flex max-w-6xl flex-col gap-2">
              <li className="rounded-md px-3 py-2 hover:bg-white/5">Dashboard</li>
              <li className="rounded-md px-3 py-2 hover:bg-white/5">Store</li>
              <li className="rounded-md px-3 py-2 hover:bg-white/5">Settings</li>
              <li>
                <a href="/admin-vault" className="block rounded-md px-3 py-2 text-primary hover:bg-white/5">
                  Admin Vault
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
