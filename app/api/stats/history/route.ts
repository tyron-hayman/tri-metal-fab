import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// NOTE: this exposes your project's operational data. Put it behind your own auth
// (session check, middleware, etc.) before shipping it to production.
export async function GET(request: Request) {
  const hours = Math.min(
    Number(new URL(request.url).searchParams.get("hours")) || 24,
    24 * 30,
  );
  const since = new Date(Date.now() - hours * 3_600_000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("supabase_stats")
    .select("id, collected_at, source, ok, data, error")
    .neq("source", "usage")
    .gte("collected_at", since)
    .order("collected_at", { ascending: true })
    .limit(3000);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
