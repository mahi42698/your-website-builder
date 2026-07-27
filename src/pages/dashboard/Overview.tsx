import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FarmSensorCard } from "@/components/dashboard/FarmSensorCard";
import { useLiveTelemetry } from "@/hooks/useLiveTelemetry";
import { usePredictions } from "@/hooks/useDashboardData";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  buildRecommendations, farmHealthScore, healthSummary, healthTone,
  humidityInsight, lightInsight, soilInsight, tempInsight, toneBadge,
} from "@/lib/farm";
import { ArrowRight, CloudDrizzle, Droplets, Leaf, Sun, Thermometer, Wifi, WifiOff } from "lucide-react";

function HealthRing({ score, tone }: { score: number; tone: string }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const stroke = tone === "good" ? "hsl(var(--primary))" : tone === "warn" ? "hsl(var(--harvest))" : "hsl(var(--destructive))";
  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
        <motion.circle
          cx="64" cy="64" r={r} fill="none" stroke={stroke} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * score) / 100 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display font-bold">{score}</span>
        <span className="text-[11px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export default function Overview() {
  const { lang } = useLanguage();
  const bn = lang === "bn";
  const { latest, isOnline, lastUpdated, loading } = useLiveTelemetry(40);
  const { data: predictions } = usePredictions(5);

  const num = (v: number | null | undefined) => (v === null || v === undefined ? null : Number(v));
  const soil = isOnline ? num(latest?.soil_moisture) : null;
  const temp = isOnline ? num(latest?.temperature) : null;
  const hum = isOnline ? num(latest?.humidity) : null;
  const light = isOnline ? num(latest?.light_intensity) : null;

  const latestPrediction = predictions[0];
  const diseaseDetected = !!latestPrediction && !latestPrediction.is_healthy;
  const vitals = { soil, temp, humidity: hum, light, online: isOnline, diseaseDetected };
  const score = farmHealthScore(vitals);
  const tone = healthTone(score);
  const recs = buildRecommendations(vitals, lang).slice(0, 3);

  const updated = lastUpdated
    ? `${bn ? "সর্বশেষ আপডেট" : "Last update"} ${new Date(lastUpdated).toLocaleTimeString()}`
    : bn ? "তথ্যের অপেক্ষায়" : "Waiting for data";

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">{bn ? "আমার খামার" : "My Farm"}</h2>
          <p className="text-sm text-muted-foreground">
            {bn ? "আজ আপনার খামার কেমন আছে দেখুন" : "See how your farm is doing today"}
          </p>
        </div>
        <Badge className={isOnline ? "gap-1.5 bg-primary text-primary-foreground" : "gap-1.5 bg-muted text-muted-foreground"}>
          {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {isOnline ? (bn ? "খামার যন্ত্র চালু" : "Farm device on") : bn ? "খামার যন্ত্র বন্ধ" : "Farm device off"}
        </Badge>
      </div>

      <Card className="rounded-2xl overflow-hidden shadow-soft">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <HealthRing score={score} tone={tone} />
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {bn ? "খামার স্বাস্থ্য স্কোর" : "Farm Health Score"}
            </div>
            <h3 className="font-display text-2xl font-bold">{healthSummary(score, lang)}</h3>
            <p className="text-sm text-muted-foreground">{updated}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
              <Link to="/dashboard/live">
                <Button size="sm" className="gap-1.5">
                  {bn ? "লাইভ দেখুন" : "See live view"} <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link to="/dashboard/advice">
                <Button size="sm" variant="outline">{bn ? "আজকের পরামর্শ" : "Today's advice"}</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FarmSensorCard index={0} label={bn ? "মাটির আর্দ্রতা" : "Soil Moisture"} value={soil} unit="%" icon={Droplets} max={100} insight={soilInsight(soil, lang)} updatedLabel={updated} />
          <FarmSensorCard index={1} label={bn ? "তাপমাত্রা" : "Temperature"} value={temp} unit="°C" icon={Thermometer} max={50} insight={tempInsight(temp, lang)} updatedLabel={updated} />
          <FarmSensorCard index={2} label={bn ? "বাতাসের আর্দ্রতা" : "Humidity"} value={hum} unit="%" icon={CloudDrizzle} max={100} insight={humidityInsight(hum, lang)} updatedLabel={updated} />
          <FarmSensorCard index={3} label={bn ? "সূর্যের আলো" : "Sunlight"} value={light} unit="lux" icon={Sun} max={1200} insight={lightInsight(light, lang)} updatedLabel={updated} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Leaf className="w-4 h-4 text-primary" />
                  {bn ? "সর্বশেষ পাতা পরীক্ষা" : "Latest leaf check"}
                </CardTitle>
                <CardDescription>{bn ? "আপনার ফসলের সাম্প্রতিক ছবি ও ফলাফল" : "Your most recent crop photo and result"}</CardDescription>
              </div>
              <Link to="/dashboard/disease">
                <Button variant="ghost" size="sm" className="gap-1">{bn ? "খুলুন" : "Open"} <ArrowRight className="w-3 h-3" /></Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {latestPrediction ? (
              <div className="flex flex-col sm:flex-row gap-4">
                {latestPrediction.image_url && (
                  <img src={latestPrediction.image_url} alt={latestPrediction.predicted_class} className="w-full sm:w-40 h-40 object-cover rounded-xl border" />
                )}
                <div className="flex-1 space-y-2">
                  <Badge className={latestPrediction.is_healthy ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}>
                    {latestPrediction.is_healthy ? (bn ? "সুস্থ" : "Healthy") : bn ? "রোগ পাওয়া গেছে" : "Disease found"}
                  </Badge>
                  <div className="text-xl font-bold">{latestPrediction.predicted_class}</div>
                  <div className="text-sm text-muted-foreground">
                    {bn ? "নিশ্চয়তা" : "Certainty"}: <span className="font-semibold text-foreground">{(Number(latestPrediction.confidence) * 100).toFixed(0)}%</span>
                  </div>
                  {latestPrediction.recommendation && (
                    <p className="text-sm border-l-2 border-primary pl-3 py-1">{latestPrediction.recommendation}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
                <Leaf className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">{bn ? "এখনো কোনো পাতা পরীক্ষা হয়নি।" : "No leaf checked yet."}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">{bn ? "আজকের পরামর্শ" : "Today's advice"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recs.map((r) => (
              <div key={r.id} className={`p-3 rounded-xl border ${toneBadge[r.tone]}`}>
                <div className="text-sm font-semibold text-foreground">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.detail}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">{bn ? "সাম্প্রতিক কার্যক্রম" : "Recent activity"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {predictions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{bn ? "এখনো কিছু ঘটেনি।" : "Nothing has happened yet."}</p>
          ) : (
            predictions.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2 h-2 rounded-full ${p.is_healthy ? "bg-primary" : "bg-destructive"}`} />
                  <span className="text-sm truncate">
                    {p.is_healthy ? (bn ? "পাতা সুস্থ পাওয়া গেছে" : "Leaf looked healthy") : `${bn ? "রোগ" : "Found"}: ${p.predicted_class}`}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(p.created_at).toLocaleString()}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
