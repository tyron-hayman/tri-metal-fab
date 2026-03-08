import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { GlobalSidebar } from "@/components/global/sidebar";
import { createClient } from "@/supabase/supabase-server";
import { redirect } from "next/navigation";
import { UserProvider } from "@/providers/user-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("uid", user.id)
    .single();

  return (
    <UserProvider user={user} profile={profile}>
      <SidebarProvider>
        <GlobalSidebar />
        <main className="w-full relative">{children}</main>
      </SidebarProvider>
    </UserProvider>
  );
}
