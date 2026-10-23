import { NextResponse } from "next/server";
import { collectStats } from "@/lib/collect-stats";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RETENTION_DAYS = 30;

export async function GET(request: Request) {
  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET` automatically when CRON_SECRET is set.
  // If you trigger this from another scheduler, send the same header.
  if (
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await collectStats();

  const { error } = await supabaseAdmin
    .from("supabase_stats")
    .insert(
      results.map((r) => ({
        source: r.source,
        ok: r.ok,
        data: r.data,
        error: r.error,
      })),
    );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Keep the table from growing forever.
  const cutoff = new Date(
    Date.now() - RETENTION_DAYS * 86_400_000,
  ).toISOString();
  await supabaseAdmin
    .from("supabase_stats")
    .delete()
    .lt("collected_at", cutoff);

  return NextResponse.json({
    stored: results.length,
    failed: results
      .filter((r) => !r.ok)
      .map((r) => ({ source: r.source, error: r.error })),
  });
}
