// Safe to import from client components (no server-only code here).

export const MB = 1024 * 1024;
export const GB = 1024 * MB;

export type UsageKey = "db_size_bytes" | "storage_bytes" | "mau";

type LimitDef = {
  label: string;
  limit: number;
  unit: "bytes" | "count";
  /** "stock" = a level that grows over time (size). "cumulative" = counts up within the billing cycle. */
  kind: "stock" | "cumulative";
  proNote: string;
};

// Free plan limits, per Supabase's pricing page. Update here if Supabase changes them.
export const FREE_LIMITS: Record<UsageKey, LimitDef> = {
  db_size_bytes: {
    label: "Database size",
    limit: 500 * MB,
    unit: "bytes",
    kind: "stock",
    proNote: "Pro includes 8 GB, then $0.125 per GB",
  },
  storage_bytes: {
    label: "File storage",
    limit: 1 * GB,
    unit: "bytes",
    kind: "stock",
    proNote: "Pro includes 100 GB, then $0.0213 per GB",
  },
  mau: {
    label: "Monthly active users",
    limit: 50_000,
    unit: "count",
    kind: "cumulative",
    proNote: "Pro includes 100,000, then $0.00325 per user",
  },
};

/** Start and end (UTC) of the current billing cycle. Default is the 1st of each month. */
export function currentCycle(cycleDay = 1, now = new Date()) {
  const day = Math.min(Math.max(Math.floor(cycleDay) || 1, 1), 28);
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const thisMonth = new Date(Date.UTC(y, m, day));
  const start =
    now >= thisMonth ? thisMonth : new Date(Date.UTC(y, m - 1, day));
  const end = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, day),
  );
  return { start, end };
}
