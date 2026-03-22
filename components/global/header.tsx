"use client";

export default function Heading({
  heading,
  subheading,
}: {
  heading: string | null;
  subheading: string | null;
}) {
  return (
    <div className="w-full py-5 px-10 flex items-center justify-between border-b-[var(--sidebar-border)] border-b-1 border-solid">
      <h2 className="text-2xl uppercase text-[var(--foreground)] font-black">
        {heading ? heading : "Page Heading"}
      </h2>
      <p className="text-base text-foreground/40">
        {subheading ? subheading : "Page Sub Heading"}
      </p>
    </div>
  );
}
