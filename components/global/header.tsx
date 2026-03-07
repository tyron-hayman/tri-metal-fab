"use client";
import ThemeSwitch from "@/components/global/theme-switcher";
import { LogOut } from "lucide-react";
import { createClient } from "@/supabase/supabase-client";

export default function Heading({
  heading,
  subheading,
}: {
  heading: string | null;
  subheading: string | null;
}) {
  const supabase = createClient();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <div className="w-full p-4 flex items-center justify-between border-b-1 border-white/10 border-solid">
      <div>
        <h2 className="text-2xl uppercase text-amber-500">
          {heading ? heading : "Page Heading"}
        </h2>
        <p className="text-sm text-foreground/40">
          {subheading ? subheading : "Page Sub Heading"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeSwitch />
        <div className="pl-5 border-l-1 border-muted border-solid">
          <button type="button" onClick={signOut}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
