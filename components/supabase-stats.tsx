"use client";

import { useEffect, useState } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";

type Row = {
  id: number;
  collected_at: string;
  source: "requests" | "health" | "metrics";
  ok: boolean;
  data: any;
  error: string | null;
};

const REFRESH_MS = 60_000; // re-read stored snapshots every minute (collection itself runs every 5 min server-side)

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2)
    return <span style={{ opacity: 0.6 }}>Not enough data yet</span>;
  const w = 240,
    h = 48;
  const min = Math.min(...values),
    max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map(
      (v, i) =>
        `${(i / (values.length - 1)) * w},${h - 4 - ((v - min) / span) * (h - 8)}`,
    )
    .join(" ");
  return (
    <svg width={w} height={h} role="img" aria-label="Requests over time">
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
}

// The health endpoint returns one entry per service; handle a couple of plausible shapes.
function normalizeHealth(data: any): { name: string; healthy: boolean }[] {
  if (!Array.isArray(data)) return [];
  return data.map((s) => ({
    name: String(s.name ?? s.service ?? "unknown"),
    healthy:
      s.healthy === true ||
      s.status === "ACTIVE_HEALTHY" ||
      s.status === "healthy",
  }));
}

export default function SupabaseStats({ hours = 24 }: { hours?: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/stats/history?hours=${hours}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = (await res.json()) as Row[];
        if (active) {
          setRows(json);
          setError(null);
        }
      } catch (e: any) {
        if (active) setError(e.message);
      }
    }
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [hours]);

  const latest = (source: Row["source"]) =>
    [...rows].reverse().find((r) => r.source === source);
  const requestRows = rows.filter((r) => r.source === "requests" && r.ok);
  const requestCounts = requestRows.map((r) =>
    Number(r.data?.result?.[0]?.count ?? 0),
  );
  const health = latest("health");
  const metrics = latest("metrics");
  const lastRun = rows.length
    ? new Date(rows[rows.length - 1].collected_at)
    : null;

  return (
    <div className="grid grid-cols-1 gap-5 p-10">
      {error && (
        <div style={{ borderColor: "crimson" }}>
          Could not load stats: {error}
        </div>
      )}

      <div>
        <h3 className="mb-5">
          App Service health
          <span className="text-xs bg-[var(--foreground)]/10 px-5 py-2 ml-5">
            {lastRun && lastRun?.toUTCString()}
          </span>
        </h3>
        {health?.ok ? (
          <div className="grid grid-cols-5 gap-5">
            {normalizeHealth(health.data).map((s, index) => (
              <div className={``} key={s.name}>
                <p className="text-base uppercase font-black mb-5">{s.name}</p>
                <div className={`border-border" border border-solid p-5`}>
                  <p
                    className={`text-xs font-semibold uppercase flex items-center gap-2 ${s.healthy ? "text-white" : "text-rose-500"}`}
                  >
                    <span>
                      {s.healthy ? (
                        <CircleCheck color="#84cc16" />
                      ) : (
                        <TriangleAlert color="#f59e0b" />
                      )}
                    </span>
                    <span>{s.healthy ? "Active" : "Issues Reported"}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span style={{ opacity: 0.7 }}>
            {health ? `Last check failed: ${health.error}` : "No data yet"}
          </span>
        )}
      </div>
    </div>
  );
}
