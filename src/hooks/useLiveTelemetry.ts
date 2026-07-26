import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SensorReading } from "@/hooks/useDashboardData";

export const OFFLINE_AFTER_MS = 15_000;
export const POLL_INTERVAL_MS = 2_000;

export type LivePoint = {
  t: number;
  time: string;
  soil_moisture: number;
  temperature: number;
  humidity: number;
  light_intensity: number;
};

export type SoilClass = "optimal" | "dry" | "very-dry" | "unknown";

export function classifySoil(v: number | null | undefined): SoilClass {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return "unknown";
  const n = Number(v);
  if (n >= 40) return "optimal";
  if (n >= 20) return "dry";
  return "very-dry";
}

function toPoint(r: SensorReading): LivePoint {
  const d = new Date(r.recorded_at);
  return {
    t: d.getTime(),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    soil_moisture: Number(r.soil_moisture ?? 0),
    temperature: Number(r.temperature ?? 0),
    humidity: Number(r.humidity ?? 0),
    light_intensity: Number(r.light_intensity ?? 0),
  };
}

/**
 * Live telemetry stream:
 *  - Postgres realtime INSERT subscription (instant push)
 *  - 2s polling fallback so the UI stays live even if the socket drops
 *  - auto-reconnect on socket error / tab refocus
 *  - device considered OFFLINE when no reading for > 15s
 */
export function useLiveTelemetry(maxPoints = 60) {
  const [latest, setLatest] = useState<SensorReading | null>(null);
  const [series, setSeries] = useState<LivePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const lastIdRef = useRef<string | null>(null);
  const seriesRef = useRef<LivePoint[]>([]);

  const push = useCallback(
    (r: SensorReading) => {
      if (!r || r.id === lastIdRef.current) return;
      lastIdRef.current = r.id;
      setLatest(r);
      const next = [...seriesRef.current, toPoint(r)].slice(-maxPoints);
      seriesRef.current = next;
      setSeries(next);
    },
    [maxPoints],
  );

  // initial backfill
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("sensor_readings")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(maxPoints);
      if (cancelled) return;
      const rows = ((data ?? []) as SensorReading[]).slice().reverse();
      seriesRef.current = rows.map(toPoint);
      setSeries(seriesRef.current);
      const last = rows[rows.length - 1] ?? null;
      if (last) {
        lastIdRef.current = last.id;
        setLatest(last);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [maxPoints]);

  // realtime subscription with auto-reconnect
  useEffect(() => {
    let channel = supabase.channel("live-telemetry");
    let retry: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const subscribe = () => {
      channel = supabase
        .channel(`live-telemetry-${Date.now()}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "sensor_readings" },
          (payload) => push(payload.new as SensorReading),
        )
        .subscribe((status) => {
          if (disposed) return;
          setConnected(status === "SUBSCRIBED");
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            retry = setTimeout(() => {
              supabase.removeChannel(channel);
              subscribe();
            }, 3000);
          }
        });
    };

    subscribe();
    return () => {
      disposed = true;
      if (retry) clearTimeout(retry);
      supabase.removeChannel(channel);
    };
  }, [push]);

  // 2s polling fallback + clock tick for the offline timer
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      setNow(Date.now());
      if (document.hidden) return;
      const { data } = await supabase
        .from("sensor_readings")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled && data) push(data as SensorReading);
    };
    const id = setInterval(tick, POLL_INTERVAL_MS);
    tick();
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [push]);

  const lastUpdated = latest ? new Date(latest.recorded_at).getTime() : null;
  const ageMs = lastUpdated ? now - lastUpdated : null;
  const isOnline = ageMs !== null && ageMs <= OFFLINE_AFTER_MS;

  return { latest, series, loading, isOnline, connected, lastUpdated, ageMs, now };
}
