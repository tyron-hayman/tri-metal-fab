import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { currentCycle } from "@/lib/plan-limits";

export const dynamic = "force-dynamic";

// NOTE: like /api/stats/history, put this behind your own auth before going live.
export async function GET() {
  const { start, end } = currentCycle(
    Number(process.env.BILLING_CYCLE_DAY) || 1,
  );

  const base = () =>
    supabaseAdmin
      .from("supabase_stats")
      .select("collected_at, data")
      .eq("source", "usage")
      .eq("ok", true)
      .gte("collected_at", start.toISOString());

  const [first, latest] = await Promise.all([
    base().order("collected_at", { ascending: true }).limit(1),
    base().order("collected_at", { ascending: false }).limit(1),
  ]);

  if (first.error || latest.error) {
    return NextResponse.json(
      { error: (first.error ?? latest.error)!.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    cycle: { start: start.toISOString(), end: end.toISOString() },
    first: first.data?.[0] ?? null,
    latest: latest.data?.[0] ?? null,
  });
}
