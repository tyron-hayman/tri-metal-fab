import { NextResponse } from "next/server";

const ref = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!;
const mgmt = `https://api.supabase.com/v1/projects/${ref}`;
const headers = {
  Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
};

export const revalidate = 60; // cache for 60s to stay under rate limits

export async function GET() {
  const [requests, health] = await Promise.all([
    fetch(`${mgmt}/analytics/endpoints/usage.api-requests-count`, {
      headers,
      next: { revalidate: 60 },
    }),
    fetch(`${mgmt}/health?services=auth,db,rest,realtime,storage`, {
      headers,
      next: { revalidate: 60 },
    }),
  ]);

  if (!requests.ok || !health.ok) {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }

  return NextResponse.json({
    requests: await requests.json(),
    health: await health.json(),
  });
}
