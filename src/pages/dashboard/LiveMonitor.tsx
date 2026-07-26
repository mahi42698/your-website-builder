import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LiveSensorCard } from "@/components/dashboard/LiveSensorCard";
import { classifySoil, OFFLINE_AFTER_MS, useLiveTelemetry } from "@/hooks/useLiveTelemetry";
import { usePredictions } from "@/hooks/useDashboardData";
import { ARDUINO_SKETCH, INGEST_URL } from "@/lib/esp32Firmware";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Camera, Cloud, Copy, Droplets, RadioTower, Sun, Thermometer, Wifi, WifiOff, Clock,
} from "lucide-react";

const STREAM_KEY = "agroai.esp32.streamUrl";

const soilMeta: Record<string, { en: string; bn: string; cls: string }> = {
  optimal: { en: "Optimal", bn: "উপযুক্ত", cls: "bg-primary/10 text-primary border-primary/30" },
  dry: { en: "Dry", bn: "শুষ্ক", cls: "bg-harvest/15 text-harvest border-harvest/30" },
  "very-dry": { en: "Very Dry", bn: "অতি শুষ্ক", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  unknown: { en: "No data", bn: "তথ্য নেই", cls: "bg-muted text-muted-foreground border-border" },
};

function range(v: number | null, low: number, high: number, labels: [string, string, string]) {
  if (v === null) return { label: "No data", cls: "bg-muted text-muted-foreground border-border" };
  if (v < low) return { label: labels[0], cls: "bg-sky/10 text-sky border-sky/30" };
  if (v > high) return { label: labels[2], cls: "bg-destructive/10 text-destructive border-destructive/30" };
  return { label: labels[1], cls: "bg-primary/10 text-primary border-primary/30" };
}

export default function LiveMonitor() {
  const { lang } = useLanguage();
  const bn = lang === "bn";
  const { latest, series, isOnline, connected, lastUpdated, ageMs } = useLiveTelemetry(60);
  const { data: predictions } = usePredictions(1);
  const [streamUrl, setStreamUrl] = useState(() => localStorage.getItem(STREAM_KEY) ?? "");
  const [streamOn, setStreamOn] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!streamOn) return;
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, [streamOn]);

  const soil = latest?.soil_moisture !== null && latest?.soil_moisture !== undefined ? Number(latest.soil_moisture) : null;
  const temp = latest?.temperature !== null && latest?.temperature !== undefined ? Number(latest.temperature) : null;
  const hum = latest?.humidity !== null && latest?.humidity !== undefined ? Number(latest.humidity) : null;
  const light = latest?.light_intensity !== null && latest?.light_intensity !== undefined ? Number(latest.light_intensity) : null;

  const soilCls = soilMeta[classifySoil(isOnline ? soil : null)];
  const tempR = range(isOnline ? temp : null, 15, 32, bn ? ["ঠান্ডা", "স্বাভাবিক", "গরম"] : ["Cold", "Normal", "Hot"]);
  const humR = range(isOnline ? hum : null, 40, 80, bn ? ["শুষ্ক", "স্বাভাবিক", "আর্দ্র"] : ["Low", "Normal", "High"]);
  const lightR = range(isOnline ? light : null, 200, 1000, bn ? ["কম", "ভালো", "তীব্র"] : ["Dim", "Good", "Intense"]);

  const chart = useMemo(() => series.slice(-40), [series]);
  const latestPrediction = predictions[0];

  const saveStream = () => {
    localStorage.setItem(STREAM_KEY, streamUrl.trim());
    setStreamOn(!!streamUrl.trim());
    toast.success(bn ? "ক্যামেরা স্ট্রিম সংরক্ষিত" : "Camera stream saved");
  };

  const copy = async (text: string, msg: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(msg);
  };

  return (
    <div className="space-y-6 max-w-7xl animate-fade-in">
      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">{bn ? "লাইভ আইওটি মনিটর" : "Live IoT Monitor"}</h2>
          <p className="text-sm text-muted-foreground">
            {bn ? "ESP32-CAM থেকে প্রতি ২ সেকেন্ডে রিয়েল-টাইম ডেটা" : "Real-time telemetry from ESP32-CAM every 2 seconds"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className={
              isOnline
                ? "gap-1.5 bg-primary text-primary-foreground"
                : "gap-1.5 bg-destructive text-destructive-foreground"
            }
          >
            <span className={`w-2 h-2 rounded-full bg-current ${isOnline ? "animate-pulse" : ""}`} />
            {isOnline ? (bn ? "ডিভাইস অনলাইন" : "Device Online") : bn ? "ডিভাইস অফলাইন" : "Device Offline"}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            {isOnline ? <Wifi className="w-3 h-3 text-primary" /> : <WifiOff className="w-3 h-3 text-destructive" />}
            {isOnline ? (bn ? "ওয়াইফাই সংযুক্ত" : "WiFi Connected") : bn ? "সংযোগ নেই" : "No Signal"}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <RadioTower className={`w-3 h-3 ${connected ? "text-primary" : "text-muted-foreground"}`} />
            {connected ? (bn ? "রিয়েলটাইম" : "Realtime") : bn ? "পোলিং" : "Polling"}
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="w-3 h-3" />
            {lastUpdated
              ? `${bn ? "শেষ আপডেট" : "Updated"} ${new Date(lastUpdated).toLocaleTimeString()}${
                  ageMs !== null ? ` (${Math.round(ageMs / 1000)}s)` : ""
                }`
              : bn ? "ডেটার অপেক্ষায়" : "Waiting for data"}
          </Badge>
        </div>
      </div>

      {!isOnline && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <span className="font-semibold text-destructive">
            {bn ? "কোনো ডেটা আসছে না" : "No telemetry received"}
          </span>{" "}
          <span className="text-muted-foreground">
            {bn
              ? `${OFFLINE_AFTER_MS / 1000} সেকেন্ডের বেশি সময় ডেটা না এলে ডিভাইস অফলাইন দেখানো হয়। ESP32-CAM এ পাওয়ার ও ওয়াইফাই পরীক্ষা করুন।`
              : `The device is marked offline after ${OFFLINE_AFTER_MS / 1000}s without a reading. Check ESP32-CAM power and WiFi — the dashboard reconnects automatically.`}
          </span>
        </div>
      )}

      {/* Animated live cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveSensorCard
          label={bn ? "মাটির আর্দ্রতা" : "Soil Moisture"}
          value={isOnline ? soil : null}
          unit="%"
          icon={Droplets}
          accent="bg-sky"
          iconColor="text-sky"
          max={100}
          statusLabel={bn ? soilCls.bn : soilCls.en}
          statusClass={soilCls.cls}
          live={isOnline}
        />
        <LiveSensorCard
          label={bn ? "তাপমাত্রা" : "Temperature"}
          value={isOnline ? temp : null}
          unit="°C"
          icon={Thermometer}
          accent="bg-secondary"
          iconColor="text-secondary"
          max={50}
          statusLabel={tempR.label}
          statusClass={tempR.cls}
          live={isOnline}
        />
        <LiveSensorCard
          label={bn ? "আর্দ্রতা" : "Humidity"}
          value={isOnline ? hum : null}
          unit="%"
          icon={Cloud}
          accent="bg-accent"
          iconColor="text-accent"
          max={100}
          statusLabel={humR.label}
          statusClass={humR.cls}
          live={isOnline}
        />
        <LiveSensorCard
          label={bn ? "আলোর তীব্রতা" : "Light Intensity"}
          value={isOnline ? light : null}
          unit="lux"
          icon={Sun}
          accent="bg-harvest"
          iconColor="text-harvest"
          max={1200}
          statusLabel={lightR.label}
          statusClass={lightR.cls}
          live={isOnline}
        />
      </div>

      {/* Camera + latest capture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera className="w-4 h-4 text-primary" />
            {bn ? "লাইভ ক্যামেরা" : "Live Camera"}
          </CardTitle>
          <CardDescription>
            {bn
              ? "ESP32-CAM এর MJPEG স্ট্রিম URL দিন (যেমন http://192.168.0.50:81/stream)"
              : "Paste your ESP32-CAM MJPEG stream URL (e.g. http://192.168.0.50:81/stream)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="http://192.168.0.50:81/stream"
            />
            <Button onClick={saveStream}>{bn ? "সংযুক্ত করুন" : "Connect"}</Button>
            {streamOn && (
              <Button variant="outline" onClick={() => setStreamOn(false)}>
                {bn ? "বন্ধ" : "Stop"}
              </Button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border bg-muted/30 overflow-hidden aspect-video flex items-center justify-center">
              {streamOn && streamUrl ? (
                <img
                  key={tick}
                  src={streamUrl}
                  alt="ESP32-CAM live stream"
                  className="w-full h-full object-cover"
                  onError={() => setStreamOn(false)}
                />
              ) : (
                <div className="text-center text-muted-foreground text-sm p-6">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  {bn ? "স্ট্রিম বন্ধ" : "Stream idle"}
                </div>
              )}
            </div>
            <div className="rounded-lg border overflow-hidden aspect-video bg-muted/30 flex items-center justify-center">
              {latestPrediction?.image_url ? (
                <img src={latestPrediction.image_url} alt="Latest leaf capture" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground text-sm p-6">
                  {bn ? "এখনও কোনো ছবি আসেনি" : "No capture received yet"}
                </div>
              )}
            </div>
          </div>
          {latestPrediction && (
            <div className="text-sm text-muted-foreground">
              {bn ? "সর্বশেষ শনাক্তকরণ:" : "Latest detection:"}{" "}
              <span className="font-semibold text-foreground">{latestPrediction.predicted_class}</span> ·{" "}
              {(Number(latestPrediction.confidence) * 100).toFixed(0)}% ·{" "}
              {new Date(latestPrediction.created_at).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{bn ? "মাটির আর্দ্রতা (লাইভ)" : "Soil Moisture (live)"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="ls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--sky))" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(var(--sky))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Area type="monotone" dataKey="soil_moisture" stroke="hsl(var(--sky))" fill="url(#ls)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{bn ? "তাপমাত্রা ও আর্দ্রতা" : "Temperature & Humidity"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Line type="monotone" dataKey="temperature" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} isAnimationActive={false} name="°C" />
                <Line type="monotone" dataKey="humidity" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} name="%" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{bn ? "আলোর তীব্রতা (lux)" : "Light Intensity (lux)"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="ll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--harvest))" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(var(--harvest))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Area type="monotone" dataKey="light_intensity" stroke="hsl(var(--harvest))" fill="url(#ll)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Firmware */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">
                {bn ? "ESP32-CAM ফার্মওয়্যার (২ সেকেন্ড টেলিমেট্রি)" : "ESP32-CAM Firmware (2s telemetry)"}
              </CardTitle>
              <CardDescription>
                {bn ? "সয়েল + DHT22 + LDR + ক্যামেরা → JSON POST" : "Soil + DHT22 + LDR + camera → JSON POST"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => copy(INGEST_URL, "Endpoint copied")}>
                <Copy className="w-3 h-3" /> {bn ? "এন্ডপয়েন্ট" : "Endpoint"}
              </Button>
              <Button size="sm" className="gap-1" onClick={() => copy(ARDUINO_SKETCH, "Arduino sketch copied")}>
                <Copy className="w-3 h-3" /> {bn ? "কোড কপি" : "Copy code"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs mb-3 font-mono break-all bg-muted rounded p-2">POST {INGEST_URL}</div>
          <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-[11px] leading-relaxed">
            <code>{ARDUINO_SKETCH}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
