export async function GET() {
  const url = `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/customer/v1/privileged/metrics`;
  const auth = Buffer.from(
    `service_role:${process.env.SUPABASE_SECRET_KEY}`,
  ).toString("base64");

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    next: { revalidate: 30 },
  });
  const text = await res.text(); // Prometheus text format

  // Parse the lines you care about, e.g. connection counts
  const metrics: Record<string, number> = {};
  for (const line of text.split("\n")) {
    if (line.startsWith("#") || !line.trim()) continue;
    const [name, value] = line.split(/\s+(?=\S+$)/);
    if (name.startsWith("pg_stat_activity_count"))
      metrics[name] = Number(value);
  }
  return Response.json(metrics);
}
