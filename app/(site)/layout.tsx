import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Tri-Metal Fabricators",
  description:
    "Old-Fashioned Craftsmanship. Precision steel fabrication, superior production standards, and exacting industry standards for metal fabrication.",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased">
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="top-right" />
    </div>
  );
}
