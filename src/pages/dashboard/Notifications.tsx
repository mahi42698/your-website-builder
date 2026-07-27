import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useLiveTelemetry } from "@/hooks/useLiveTelemetry";
import { usePredictions } from "@/hooks/useDashboardData";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, BellRing, CheckCircle2, Droplets, Camera, Thermometer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Level = "info" | "warn" | "high" | "critical";

const levelCls: Record<Level, string> = {
  info: "bg-primary/10 text-primary border-primary/30",
  warn: "bg-harvest/15 text-harvest border-harvest/40",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  critical: "bg-destructive/10 text-destructive border-destructive/30",
};

type Alert = { id: string; level: Level; icon: LucideIcon; title: string; body: string; at: Date };

export default function Notifications() {
  const { lang } = useLanguage();
  const bn = lang === "bn";
  const { latest, isOnline, lastUpdated } = useLiveTelemetry(20);
  const { data: predictions } = usePredictions(10);

  const now = new Date();
  const alerts: Alert[] = [];
  const num = (v: number | null | undefined) => (v === null || v === undefined ? null : Number(v));
  const soil = num(latest?.soil_moisture);
  const temp = num(latest?.temperature);

  if (!isOnline) {
    alerts.push({
      id: "offline", level: "critical", icon: AlertTriangle,
      title: bn ? "খামার যন্ত্র বন্ধ" : "Farm device offline",
      body: bn ? "বিদ্যুৎ ও ওয়াইফাই পরীক্ষা করুন। AgroAI নিজে থেকেই আবার যুক্ত হবে।" : "Check power and WiFi. AgroAI will reconnect automatically.",
      at: lastUpdated ? new Date(lastUpdated) : now,
    });
    alerts.push({
      id: "cam", level: "high", icon: Camera,
      title: bn ? "ক্যামেরা সংযোগ নেই" : "Camera disconnected",
      body: bn ? "ক্যামেরা চালু হলে ছবি আবার আসতে শুরু করবে।" : "Photos will resume as soon as the camera powers on.",
      at: lastUpdated ? new Date(lastUpdated) : now,
    });
  }
  if (isOnline && soil !== null && soil < 20) {
    alerts.push({
      id: "soil", level: "critical", icon: Droplets,
      title: bn ? "মাটি অতি শুষ্ক" : "Soil is very dry",
      body: bn ? "এখনই ফসলে পানি দিন।" : "Immediate irrigation required.",
      at: now,
    });
  } else if (isOnline && soil !== null && soil < 40) {
    alerts.push({
      id: "soil", level: "warn", icon: Droplets,
      title: bn ? "মাটি শুকিয়ে আসছে" : "Soil is getting dry",
      body: bn ? "আগামীকাল সকালে সেচ দিন।" : "Water your crops tomorrow morning.",
      at: now,
    });
  }
  if (isOnline && temp !== null && temp > 34) {
    alerts.push({
      id: "temp", level: "high", icon: Thermometer,
      title: bn ? "অতিরিক্ত গরম" : "High temperature",
      body: bn ? "ছায়া দিন বা সন্ধ্যায় পানি দিন।" : "Provide shade or water in the evening.",
      at: now,
    });
  }
  predictions.filter((p) => !p.is_healthy).slice(0, 5).forEach((p) => {
    alerts.push({
      id: p.id, level: "critical", icon: AlertTriangle,
      title: `${bn ? "রোগ পাওয়া গেছে" : "Disease detected"}: ${p.predicted_class}`,
      body: p.recommendation ?? (bn ? "চিকিৎসার ধাপ দেখতে রোগ শনাক্তকরণ পাতা খুলুন।" : "Open Disease Detection for treatment steps."),
      at: new Date(p.created_at),
    });
  });

  alerts.sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl font-bold">{bn ? "বার্তা ও সতর্কতা" : "Alerts"}</h2>
        <p className="text-sm text-muted-foreground">
          {bn ? "আপনার খামারের গুরুত্বপূর্ণ খবর এক জায়গায়" : "Everything important about your farm in one place"}
        </p>
      </div>

      {alerts.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-10 text-center">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-primary" />
            <p className="font-medium">{bn ? "সব ঠিক আছে" : "Everything looks fine"}</p>
            <p className="text-sm text-muted-foreground">{bn ? "এই মুহূর্তে কোনো সতর্কতা নেই।" : "No alerts right now."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((a, i) => (
            <motion.div key={`${a.id}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`rounded-2xl border ${levelCls[a.level]}`}>
                <CardContent className="p-4 flex gap-3">
                  <a.icon className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground">{a.title}</div>
                    <div className="text-sm text-muted-foreground">{a.body}</div>
                    <div className="text-[11px] text-muted-foreground/80 mt-1">{a.at.toLocaleString()}</div>
                  </div>
                  <BellRing className="w-4 h-4 opacity-40" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
