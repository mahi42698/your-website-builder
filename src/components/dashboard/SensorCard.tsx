import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number | null;
  unit: string;
  icon: LucideIcon;
  iconColor: string;
  max: number;
  status: "low" | "ok" | "high";
};

const statusMap = {
  low: { label: "Low", className: "bg-destructive/10 text-destructive border-destructive/20" },
  ok: { label: "Optimal", className: "bg-primary/10 text-primary border-primary/20" },
  high: { label: "High", className: "bg-secondary/20 text-secondary-foreground border-secondary/30" },
};

export function SensorCard({ label, value, unit, icon: Icon, iconColor, max, status }: Props) {
  const display = value ?? 0;
  const pct = Math.min(100, (display / max) * 100);
  const s = statusMap[status];
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <div className={cn("p-2 rounded-lg", iconColor)}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-3xl font-bold">{value !== null ? display : "—"}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <Progress value={pct} className="h-1.5 mb-3" />
        <Badge variant="outline" className={cn("text-xs", s.className)}>
          {s.label}
        </Badge>
      </CardContent>
    </Card>
  );
}