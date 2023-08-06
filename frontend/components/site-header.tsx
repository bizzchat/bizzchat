"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import { useSupabase } from "@/core/supabase/supabase-provider";
import { useRouter } from "next/navigation";
import { MainNav } from "./main-nav";
import { Button } from "./ui/button";

export function SiteHeader() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-1">
            <Button variant="link" onClick={handleSignOut}>
              Logout
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
