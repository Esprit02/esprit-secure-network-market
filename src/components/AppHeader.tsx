import { useState } from "react";
import { Bell, Menu, LogOut, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initialsFrom(email?: string | null) {
  if (!email) return "EA";
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
        <div className="w-full bg-navy text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm">
            <span className="font-medium">
              Email Not Verified. Verify your email to access all features.
            </span>
            <button
              onClick={onVerify}
              className="rounded-md bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground hover:opacity-90"
            >
              Verify Now
            </button>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
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
            <BrandLogo size={34} />
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative text-foreground/80"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Profile"
                  className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white ring-2 ring-primary/60 transition hover:opacity-90"
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
          <nav className="border-t border-border/60 bg-panel-elev px-4 py-3 text-sm">
            <ul className="mx-auto flex max-w-6xl flex-col gap-1">
              <li className="rounded-md px-3 py-2 hover:bg-secondary">Dashboard</li>
              <li className="rounded-md px-3 py-2 hover:bg-secondary">Store</li>
              <li className="rounded-md px-3 py-2 hover:bg-secondary">Settings</li>
              <li>
                <a href="/admin-vault" className="block rounded-md px-3 py-2 text-primary hover:bg-secondary">
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
