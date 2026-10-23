import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { currentCycle } from "@/lib/plan-limits";

export type StatSource = "requests" | "health" | "metrics" | "usage";

export type StatResult = {
  source: StatSource;
  ok: boolean;
  data: unknown | null;
  error: string | null;
};

const ref = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!;
const mgmtBase = `https://api.supabase.com/v1/projects/${ref}`;
const mgmtHeaders = {
  Authorization: `Bearer ${process.env.SUPABASE_API_TOKEN}`,
};
const TIMEOUT_MS = 20_000;

// Only keep metrics whose name starts with one of these. Empty array = keep everything
// (that's ~200 series per snapshot, so filtering is recommended).
// Check the raw output of the metrics endpoint and adjust these to the series you care about.
const METRIC_PREFIXES = [
  "pg_up",
  "pg_stat_activity",
  "pg_database_size",
  "node_load",
  "node_memory_MemAvailable",
];

async function getJson(
  url: string,
  headers: Record<string, string>,
): Promise<unknown> {
  const res = await fetch(url, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok)
    throw new Error(
      `${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`,
    );
  return res.json();
}

async function fetchRequests(): Promise<unknown> {
  return getJson(
    `${mgmtBase}/analytics/endpoints/usage.api-requests-count`,
    mgmtHeaders,
  );
}

async function fetchHealth(): Promise<unknown> {
  return getJson(
    `${mgmtBase}/health?services=auth,db,rest,realtime,storage`,
    mgmtHeaders,
  );
}

async function fetchMetrics(): Promise<unknown> {
  const auth = Buffer.from(
    `service_role:${process.env.SUPABASE_SECRET_KEY}`,
  ).toString("base64");
  const res = await fetch(
    `https://${ref}.supabase.co/customer/v1/privileged/metrics`,
    {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    },
  );
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const text = await res.text();

  // Parse Prometheus text format: `name{labels} value`
  const out: Record<string, number> = {};
  for (const line of text.split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const idx = line.lastIndexOf(" ");
    if (idx === -1) continue;
    const key = line.slice(0, idx);
    const value = Number(line.slice(idx + 1));
    if (Number.isNaN(value)) continue;
    if (
      METRIC_PREFIXES.length &&
      !METRIC_PREFIXES.some((p) => key.startsWith(p))
    )
      continue;
    out[key] = value;
  }
  return out;
}

// Database size, file storage and approximate MAU, from the get_usage_snapshot() SQL function.
async function fetchUsage(): Promise<unknown> {
  const { start } = currentCycle(Number(process.env.BILLING_CYCLE_DAY) || 1);
  const { data, error } = await supabaseAdmin.rpc("get_usage_snapshot", {
    period_start: start.toISOString(),
  });
  if (error) throw new Error(error.message);
  return data;
}

/** Runs all checks in parallel. One failing never blocks the others. */
export async function collectStats(): Promise<StatResult[]> {
  const jobs: [StatSource, () => Promise<unknown>][] = [
    ["requests", fetchRequests],
    ["health", fetchHealth],
    ["metrics", fetchMetrics],
    ["usage", fetchUsage],
  ];

  const settled = await Promise.allSettled(jobs.map(([, fn]) => fn()));

  return settled.map((r, i): StatResult => {
    const source = jobs[i][0];
    return r.status === "fulfilled"
      ? { source, ok: true, data: r.value, error: null }
      : {
          source,
          ok: false,
          data: null,
          error: String(r.reason?.message ?? r.reason),
        };
  });
}
