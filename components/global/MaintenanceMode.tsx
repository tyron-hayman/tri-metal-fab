export default function MaintenanceMode({
  heading,
}: {
  heading: string | null;
}) {
  return (
    <div className="absolute inset-0 z-[20] bg-background flex items-center justify-center">
      <h2 className="text-5xl text-foreground font-mono">{heading}</h2>
    </div>
  );
}
