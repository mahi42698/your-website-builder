import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SensorReading = {
  id: string;
  device_id: string;
  soil_moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  light_intensity: number | null;
  recorded_at: string;
};

export type Prediction = {
  id: string;
  device_id: string | null;
  image_url: string | null;
  predicted_class: string;
  confidence: number;
  is_healthy: boolean;
  recommendation: string | null;
  model_version: string | null;
  created_at: string;
};

export type Device = {
  id: string;
  device_id: string;
  name: string;
  is_online: boolean;
  last_seen: string | null;
};

export function useLatestSensor() {
  const [reading, setReading] = useState<SensorReading | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchOne = async () => {
      const { data } = await supabase
        .from("sensor_readings")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) {
        setReading(data as SensorReading | null);
        setLoading(false);
      }
    };
    fetchOne();
    const channel = supabase
      .channel("sensor-latest")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sensor_readings" },
        (payload) => setReading(payload.new as SensorReading),
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { reading, loading };
}

export function useSensorHistory(limit = 24) {
  const [data, setData] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      const { data } = await supabase
        .from("sensor_readings")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(limit);
      if (!cancelled) {
        setData(((data ?? []) as SensorReading[]).reverse());
        setLoading(false);
      }
    };
    fetchAll();
    const channel = supabase
      .channel("sensor-history")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sensor_readings" },
        () => fetchAll(),
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return { data, loading };
}

export function usePredictions(limit = 20) {
  const [data, setData] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      const { data } = await supabase
        .from("disease_predictions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (!cancelled) {
        setData((data ?? []) as Prediction[]);
        setLoading(false);
      }
    };
    fetchAll();
    const channel = supabase
      .channel("predictions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "disease_predictions" },
        () => fetchAll(),
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return { data, loading };
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      const { data } = await supabase
        .from("devices")
        .select("*")
        .order("created_at", { ascending: false });
      if (!cancelled) {
        setDevices((data ?? []) as Device[]);
        setLoading(false);
      }
    };
    fetchAll();
    const channel = supabase
      .channel("devices")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "devices" },
        () => fetchAll(),
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { devices, loading };
}