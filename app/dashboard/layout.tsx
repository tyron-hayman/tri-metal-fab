import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { GlobalSidebar } from "@/components/global/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <GlobalSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
