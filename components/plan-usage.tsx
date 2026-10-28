"use client";

import { useEffect, useState } from "react";
import { FREE_LIMITS, GB, MB, type UsageKey } from "@/lib/plan-limits";
import { motion, animate } from "motion/react";
import { User } from "lucide-react";
import { useUser } from "@/providers/user-provider";

type Snapshot = { collected_at: string; data: Record<UsageKey, number> };
type Payload = {
  cycle: { start: string; end: string };
  first: Snapshot | null;
  latest: Snapshot | null;
};

const DAY = 86_400_000;
const REFRESH_MS = 60_000;

function fmt(key: UsageKey, value: number) {
  if (FREE_LIMITS[key].unit === "count")
    return Math.round(value).toLocaleString();
  return value >= GB
    ? `${(value / GB).toFixed(2)} GB`
    : `${(value / MB).toFixed(1)} MB`;
}

/** Estimate usage at the end of the billing cycle. Returns null until there is enough history (about 1 day). */
function project(key: UsageKey, p: Payload): number | null {
  const { latest, first, cycle } = p;
  if (!latest) return null;
  const now = new Date(latest.collected_at).getTime();
  const start = new Date(cycle.start).getTime();
  const end = new Date(cycle.end).getTime();
  const cur = latest.data[key];

  if (FREE_LIMITS[key].kind === "cumulative") {
    const elapsed = now - start;
    return elapsed < DAY ? null : cur * ((end - start) / elapsed);
  }

  if (!first) return null;
  const t0 = new Date(first.collected_at).getTime();
  if (now - t0 < DAY) return null;
  const rate = (cur - first.data[key]) / (now - t0);
  return Math.max(cur, cur + rate * (end - now));
}

function status(pct: number) {
  if (pct >= 0.9) return { label: "At risk", color: "#c0392b" };
  if (pct >= 0.7) return { label: "Getting close", color: "#b9770e" };
  return { label: "Comfortable", color: "#1e8449" };
}

export default function PlanUsage() {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { placeHolderAvatar } = useUser();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/stats/usage", { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = (await res.json()) as Payload;
        if (!json?.cycle) {
          throw new Error(
            (json as any)?.error ?? "Unexpected response from /api/stats/usage",
          );
        }
        if (active) {
          setPayload(json);
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
  }, []);

  const card: React.CSSProperties = {
    border: "1px solid rgba(128,128,128,.3)",
    borderRadius: 12,
    padding: 16,
  };
  const keys = Object.keys(FREE_LIMITS) as UsageKey[];

  return (
    <div className="mx-10">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <h2 style={{ margin: 0 }}>
          Supabase Usage
          <span className="text-xs bg-[var(--foreground)]/10 px-5 py-2 ml-5">
            Free Plan
          </span>
        </h2>
        {payload?.cycle && (
          <small style={{ opacity: 0.7 }}>
            Cycle resets {new Date(payload.cycle.end).toLocaleDateString()}
          </small>
        )}
      </div>

      {error && (
        <p style={{ color: "crimson" }}>Could not load usage: {error}</p>
      )}
      {!error && !payload?.latest && (
        <p style={{ opacity: 0.7 }}>
          No usage data collected yet for this cycle.
        </p>
      )}

      {payload?.latest && (
        <div
          className="border-[var(--foreground)]/10 border border-solid p-5"
          style={{ display: "grid", gap: 16, marginTop: 12 }}
        >
          {keys.map((key) => {
            const def = FREE_LIMITS[key];
            const current = payload.latest!.data[key];
            const projected = project(key, payload);
            const pct = current / def.limit;
            const worst = Math.max(
              pct,
              projected != null ? projected / def.limit : 0,
            );
            const s = status(worst);

            const TOTAL = current;
            const MAX_VISIBLE = 20;
            const remaining = Math.max(TOTAL - MAX_VISIBLE, 0);

            return (
              <div key={key}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <strong>{def.label}</strong>
                  <span
                    className={`text-xs font-semibold uppercase text-[var(--foreground)]`}
                  >
                    {s.label}
                  </span>
                </div>
                <div style={{ fontSize: 14, opacity: 0.85 }}>
                  {fmt(key, current)} of {fmt(key, def.limit)} (
                  {(pct * 100).toFixed(1)}%)
                </div>
                {key != "mau" ? (
                  <div
                    style={{
                      height: "20px",
                      background: "rgba(128,128,128,.25)",
                      margin: "6px 0",
                    }}
                  >
                    <motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: `${Math.min(100, pct * 100)}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      style={{
                        height: "100%",
                        background:
                          Math.min(100, pct * 100) < 49
                            ? "#ffffff"
                            : Math.min(100, pct * 100) > 49 &&
                                Math.min(100, pct * 100) < 80
                              ? "#f59e0b"
                              : Math.min(100, pct * 100) > 79 &&
                                  Math.min(100, pct * 100) <= 100
                                ? "#f43f5e"
                                : "",
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex gap-1 items-center py-2 flex-wrap">
                    {Array.from(
                      { length: Math.min(TOTAL, MAX_VISIBLE) },
                      (_, i) => (
                        <motion.div
                          key={i}
                          className="w-[32px] aspect-square rounded-full border-black border-2 border-solid block relative"
                          style={{
                            background: `#000000 url("https://api.dicebear.com/10.x/disco/svg?backgroundColor=&patternProbability=100&shapeVariant=circle&shapeColor=ffffff&seed=${i}") center center no-repeat`,
                            zIndex: i,
                          }}
                          initial={{ y: 30, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.05 * i }}
                        />
                      ),
                    )}

                    {remaining > 0 && (
                      <motion.p
                        className="ml-2 text-sm font-medium text-white whitespace-nowrap"
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        + {remaining}
                      </motion.p>
                    )}
                  </div>
                )}
                <div style={{ fontSize: 13, opacity: 0.75 }}>
                  {projected != null
                    ? `Projected by end of cycle: ${fmt(key, projected)} (${((projected / def.limit) * 100).toFixed(0)}% of limit)`
                    : "Projection available after about a day of data"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          marginTop: 16,
          fontSize: 13,
          opacity: 0.8,
          display: "grid",
          gap: 6,
        }}
      >
        <div>
          <p className="text-xs text-foreground/60">
            <strong>If a limit is reached on Free:</strong> there are no extra
            charges. After a grace period, the project can be restricted
            (read-only database, paused, or API requests returning HTTP 402)
            until usage resets or the plan is upgraded.
          </p>
        </div>
        <div>
          <p className="text-xs text-foreground/60">
            <strong>Upgrade option:</strong> Pro is $25/month and lifts
            restrictions immediately.{" "}
            {keys
              .map((k) => `${FREE_LIMITS[k].label}: ${FREE_LIMITS[k].proNote}`)
              .join(". ")}
            .
          </p>
        </div>
      </div>
    </div>
  );
}
