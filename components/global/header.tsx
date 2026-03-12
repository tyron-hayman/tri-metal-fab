"use client";
import ThemeSwitch from "@/components/global/theme-switcher";

export default function Heading({
  heading,
  subheading,
}: {
  heading: string | null;
  subheading: string | null;
}) {
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
      </div>
    </div>
  );
}
