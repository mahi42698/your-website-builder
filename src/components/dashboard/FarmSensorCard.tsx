import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toneBadge, toneBar, type Insight } from "@/lib/farm";

type Props = {
  label: string;
  value: number | null;
  unit: string;
  icon: LucideIcon;
  max: number;
  insight: Insight;
  updatedLabel?: string;
  index?: number;
};

export function FarmSensorCard({ label, value, unit, icon: Icon, max, insight, updatedLabel, index = 0 }: Props) {
  const pct = value === null ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card className="h-full rounded-2xl border-border/70 shadow-soft hover:shadow-elegant transition-shadow">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </span>
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </div>
            <span className={`text-[11px] px-2 py-0.5 rounded-full border ${toneBadge[insight.tone]}`}>
              {insight.status}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <motion.span
              key={value ?? "none"}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-3xl font-display font-bold"
            >
              {value === null ? "--" : value.toFixed(unit === "lux" ? 0 : 1)}
            </motion.span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${toneBar[insight.tone]}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">{insight.message}</p>
          {updatedLabel && <p className="text-[11px] text-muted-foreground/70">{updatedLabel}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
