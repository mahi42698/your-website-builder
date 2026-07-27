import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FarmSensorCard } from "@/components/dashboard/FarmSensorCard";
import { FarmCamera, type CameraState } from "@/components/dashboard/FarmCamera";
import { useLiveTelemetry, OFFLINE_AFTER_MS } from "@/hooks/useLiveTelemetry";
import { usePredictions } from "@/hooks/useDashboardData";
import { useLanguage } from "@/contexts/LanguageContext";
import { predictDisease, type DiseasePrediction } from "@/lib/cnn";
import { humidityInsight, lightInsight, soilInsight, tempInsight } from "@/lib/farm";
import { toast } from "sonner";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CloudDrizzle, Droplets, Sun, Thermometer, Clock, Wifi, WifiOff } from "lucide-react";

async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function LiveMonitor() {
  const { lang } = useLanguage();
  const bn = lang === "bn";
  const { latest, series, isOnline, lastUpdated } = useLiveTelemetry(60);
  const { data: predictions } = usePredictions(6);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseasePrediction | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  const latestCapture = predictions[0] ?? null;

  const num = (v: number | null | undefined) => (v === null || v === undefined ? null : Number(v));
  const soil = isOnline ? num(latest?.soil_moisture) : null;
  const temp = isOnline ? num(latest?.temperature) : null;
  const hum = isOnline ? num(latest?.humidity) : null;
  const light = isOnline ? num(latest?.light_intensity) : null;

  const cameraState: CameraState = !isOnline ? "offline" : latestCapture ? "connected" : "connecting";
  const chart = useMemo(() => series.slice(-40), [series]);

  const updated = lastUpdated
    ? `${bn ? "সর্বশেষ আপডেট" : "Last update"} ${new Date(lastUpdated).toLocaleTimeString()}`
    : bn ? "তথ্যের অপেক্ষায়" : "Waiting for data";

  const retry = useCallback(() => {
    setReconnecting(true);
    toast.info(bn ? "ক্যামেরা আবার খোঁজা হচ্ছে..." : "Looking for your camera again...");
    setTimeout(() => setReconnecting(false), 1500);
  }, [bn]);

  const analyze = async () => {
    if (!latestCapture?.image_url) return;
    setAnalyzing(true);
    try {
      const dataUrl = await urlToDataUrl(latestCapture.image_url);
      const r = await predictDisease(dataUrl);
      setResult(r);
      toast.success(bn ? "পাতা পরীক্ষা সম্পন্ন" : "Leaf check complete");
    } catch {
      toast.error(bn ? "পাতা পরীক্ষা করা যায়নি" : "We could not check this leaf");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    setResult(null);
  }, [latestCapture?.id]);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">{bn ? "লাইভ খামার দেখুন" : "Live Farm View"}</h2>
          <p className="text-sm text-muted-foreground">
            {bn ? "আপনার খামারের অবস্থা প্রতি কয়েক সেকেন্ডে নিজে থেকেই আপডেট হয়" : "Your farm conditions refresh automatically every few seconds"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={isOnline ? "gap-1.5 bg-primary text-primary-foreground" : "gap-1.5 bg-destructive text-destructive-foreground"}>
            <span className={`w-2 h-2 rounded-full bg-current ${isOnline ? "animate-pulse" : ""}`} />
            {isOnline ? (bn ? "খামার যন্ত্র চালু" : "Farm device on") : bn ? "খামার যন্ত্র বন্ধ" : "Farm device off"}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            {isOnline ? <Wifi className="w-3 h-3 text-primary" /> : <WifiOff className="w-3 h-3 text-destructive" />}
            {isOnline ? (bn ? "ইন্টারনেট সংযুক্ত" : "Internet connected") : bn ? "সংযোগ নেই" : "Not connected"}
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="w-3 h-3" /> {updated}
          </Badge>
        </div>
      </div>

      {!isOnline && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <span className="font-semibold text-destructive">{bn ? "খামার যন্ত্র থেকে তথ্য আসছে না" : "No data from your farm device"}</span>{" "}
          <span className="text-muted-foreground">
            {bn
              ? `${OFFLINE_AFTER_MS / 1000} সেকেন্ড তথ্য না এলে যন্ত্রটি বন্ধ ধরা হয়। বিদ্যুৎ ও ওয়াইফাই পরীক্ষা করুন — AgroAI নিজে থেকেই আবার যুক্ত হবে।`
              : `We mark the device off after ${OFFLINE_AFTER_MS / 1000} seconds of silence. Check power and WiFi — AgroAI reconnects automatically.`}
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FarmSensorCard index={0} label={bn ? "মাটির আর্দ্রতা" : "Soil Moisture"} value={soil} unit="%" icon={Droplets} max={100} insight={soilInsight(soil, lang)} updatedLabel={updated} />
        <FarmSensorCard index={1} label={bn ? "তাপমাত্রা" : "Temperature"} value={temp} unit="°C" icon={Thermometer} max={50} insight={tempInsight(temp, lang)} updatedLabel={updated} />
        <FarmSensorCard index={2} label={bn ? "বাতাসের আর্দ্রতা" : "Humidity"} value={hum} unit="%" icon={CloudDrizzle} max={100} insight={humidityInsight(hum, lang)} updatedLabel={updated} />
        <FarmSensorCard index={3} label={bn ? "সূর্যের আলো" : "Sunlight"} value={light} unit="lux" icon={Sun} max={1200} insight={lightInsight(light, lang)} updatedLabel={updated} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <FarmCamera
          state={reconnecting ? "connecting" : cameraState}
          imageUrl={latestCapture?.image_url ?? null}
          capturedAt={latestCapture?.created_at ?? null}
          analyzing={analyzing}
          onRetry={retry}
          onAnalyze={analyze}
        />

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">{bn ? "পাতার ফলাফল" : "Leaf result"}</CardTitle>
            <CardDescription>
              {bn ? "সর্বশেষ ছবির উপর ভিত্তি করে AgroAI-এর মতামত" : "What AgroAI sees in your latest photo"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <Badge className={result.isHealthy ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}>
                  {result.isHealthy ? (bn ? "সুস্থ পাতা" : "Healthy leaf") : bn ? "রোগ পাওয়া গেছে" : "Disease found"}
                </Badge>
                <div className="text-2xl font-display font-bold">{result.predictedClass}</div>
                {result.leafName && <div className="text-sm text-muted-foreground">{result.leafName}</div>}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{bn ? "নিশ্চয়তা" : "Certainty"}</span>
                    <span className="font-semibold">{(result.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={result.confidence * 100} className="h-2" />
                </div>
                <p className="text-sm p-3 rounded-xl bg-primary/5 border border-primary/20">{result.recommendation}</p>
              </motion.div>
            ) : latestCapture ? (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {bn ? "সর্বশেষ সংরক্ষিত ফলাফল" : "Last saved result"}
                </div>
                <div className="text-xl font-semibold">{latestCapture.predicted_class}</div>
                <p className="text-sm text-muted-foreground">{latestCapture.recommendation}</p>
                <p className="text-xs text-muted-foreground">
                  {bn ? "নতুন করে পরীক্ষা করতে \"পাতা পরীক্ষা করুন\" চাপুন।" : 'Press "Analyze Leaf" to check it again.'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {bn ? "এখনো কোনো ছবি আসেনি।" : "No photo has arrived yet."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="text-base">{bn ? "মাটির আর্দ্রতা (লাইভ)" : "Soil moisture (live)"}</CardTitle></CardHeader>
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

        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="text-base">{bn ? "তাপমাত্রা ও আর্দ্রতা" : "Temperature & humidity"}</CardTitle></CardHeader>
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
      </div>
    </div>
  );
}
