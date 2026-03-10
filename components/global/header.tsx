"use client";
import ThemeSwitch from "@/components/global/theme-switcher";
import { LogOut } from "lucide-react";
import { createClient } from "@/supabase/supabase-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Heading({
  heading,
  subheading,
}: {
  heading: string | null;
  subheading: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message, {
          duration: 5000,
        });
        return;
      }
      router.push("/");
    } catch (error) {
      toast.error(error as string, {
        duration: 5000,
      });
    }
  };

  return (
    <div className="w-full py-4 px-10 flex items-center justify-between border-b-1 border-foreground/10 border-solid">
      <div>
        <h2 className="text-2xl uppercase text-[var(--foreground)]">
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
