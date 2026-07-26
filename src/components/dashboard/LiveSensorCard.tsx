import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  value: number | null;
  unit: string;
  icon: LucideIcon;
  accent: string;
  max: number;
  statusLabel: string;
  statusClass: string;
  live: boolean;
};

export function LiveSensorCard({
  label,
  value,
  unit,
  icon: Icon,
  accent,
  max,
  statusLabel,
  statusClass,
  live,
}: Props) {
  const [flash, setFlash] = useState(false);
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (value === null) return;
    if (prev.current !== null && prev.current !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(t);
    }
    prev.current = value;
  }, [value]);

  useEffect(() => {
    prev.current = value;
  }, [value]);

  const pct = value === null ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg",
        flash && "ring-2 ring-primary/40",
      )}
    >
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-1 transition-opacity duration-500",
          accent,
          live ? "opacity-100" : "opacity-30",
        )}
      />
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <div className={cn("p-2 rounded-lg", accent, "bg-opacity-10")}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-3xl font-bold tabular-nums transition-all duration-500",
              flash && "scale-105 text-primary",
            )}
          >
            {value !== null ? value.toFixed(1) : "—"}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <Progress value={pct} className="h-1.5 my-3 transition-all duration-700" />
        <Badge variant="outline" className={cn("text-xs", statusClass)}>
          {statusLabel}
        </Badge>
      </CardContent>
    </Card>
  );
}
