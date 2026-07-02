import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrowseTab } from "./tabs/BrowseTab";
import { StoreTab } from "./tabs/StoreTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { Home, Store, Settings } from "lucide-react";

export function Dashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<string>("store");
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (["browse", "store", "settings"].includes(h)) setTab(h);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Tabs value={tab} onValueChange={setTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 bg-panel p-1 md:w-auto md:inline-grid">
          <TabsTrigger value="browse" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Home className="h-4 w-4" /> Browse
          </TabsTrigger>
          <TabsTrigger value="store" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Store className="h-4 w-4" /> Store
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="browse"><BrowseTab user={user} /></TabsContent>
        <TabsContent value="store"><StoreTab user={user} /></TabsContent>
        <TabsContent value="settings"><SettingsTab user={user} /></TabsContent>
      </Tabs>
    </main>
  );
}
