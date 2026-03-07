import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { GlobalSidebar } from "@/components/global/sidebar";
import { createClient } from "@/supabase/supabase-server";
import { redirect } from "next/navigation";

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

  return (
    <SidebarProvider>
      <GlobalSidebar userdata={user} />
      <main className="w-full relative">{children}</main>
    </SidebarProvider>
  );
}
