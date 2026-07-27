import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLiveTelemetry } from "@/hooks/useLiveTelemetry";
import { usePredictions } from "@/hooks/useDashboardData";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildRecommendations, healthSummary, farmHealthScore, toneBadge } from "@/lib/farm";
import { Lightbulb, Sparkles } from "lucide-react";

export default function Recommendations() {
  const { lang } = useLanguage();
  const bn = lang === "bn";
  const { latest, isOnline } = useLiveTelemetry(20);
  const { data: predictions } = usePredictions(1);

  const num = (v: number | null | undefined) => (v === null || v === undefined ? null : Number(v));
  const vitals = {
    soil: isOnline ? num(latest?.soil_moisture) : null,
    temp: isOnline ? num(latest?.temperature) : null,
    humidity: isOnline ? num(latest?.humidity) : null,
    light: isOnline ? num(latest?.light_intensity) : null,
    online: isOnline,
    diseaseDetected: !!predictions[0] && !predictions[0].is_healthy,
  };
  const recs = buildRecommendations(vitals, lang);
  const score = farmHealthScore(vitals);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-display text-2xl font-bold">{bn ? "আজকের পরামর্শ" : "Today's Advice"}</h2>
        <p className="text-sm text-muted-foreground">
          {bn ? "আপনার খামারের তথ্য দেখে AgroAI যা পরামর্শ দিচ্ছে" : "What AgroAI suggests based on your farm today"}
        </p>
      </div>

      <Card className="rounded-2xl bg-gradient-to-br from-primary/10 to-transparent">
        <CardContent className="p-6 flex items-center gap-4">
          <span className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </span>
          <div>
            <div className="font-display text-xl font-bold">{healthSummary(score, lang)}</div>
            <div className="text-sm text-muted-foreground">
              {bn ? "খামার স্বাস্থ্য স্কোর" : "Farm health score"}: {score}/100
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {recs.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="rounded-2xl h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start gap-2 text-base">
                  <Lightbulb className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  {r.title}
                </CardTitle>
                <CardDescription>
                  <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full border ${toneBadge[r.tone]}`}>
                    {r.tone === "good" ? (bn ? "ভালো" : "Good") : r.tone === "warn" ? (bn ? "খেয়াল রাখুন" : "Watch") : r.tone === "bad" ? (bn ? "জরুরি" : "Urgent") : bn ? "তথ্য নেই" : "No data"}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{r.detail}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
