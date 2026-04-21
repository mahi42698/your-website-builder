import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSensorHistory } from "@/hooks/useDashboardData";
import { generateMockSeries } from "@/lib/mockData";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";

const charts = [
  { key: "soil_moisture", label: "Soil Moisture (%)", color: "hsl(var(--sky))", low: 30, high: 70 },
  { key: "temperature", label: "Temperature (°C)", color: "hsl(var(--secondary))", low: 15, high: 32 },
  { key: "humidity", label: "Humidity (%)", color: "hsl(var(--accent))", low: 40, high: 80 },
  { key: "light_intensity", label: "Light Intensity (lux)", color: "hsl(var(--harvest))", low: 200, high: 1000 },
] as const;

export default function Sensors() {
  const { data: history } = useSensorHistory(48);

  const chartData = (history.length > 0
    ? history.map((r) => ({
        time: new Date(r.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        soil_moisture: Number(r.soil_moisture ?? 0),
        temperature: Number(r.temperature ?? 0),
        humidity: Number(r.humidity ?? 0),
        light_intensity: Number(r.light_intensity ?? 0),
      }))
    : generateMockSeries(24));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-display text-2xl font-bold">Sensor Monitoring</h2>
          <p className="text-sm text-muted-foreground">Real-time IoT sensor charts with threshold alerts</p>
        </div>
        {history.length === 0 && <Badge variant="secondary">Sample data</Badge>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {charts.map((c) => (
          <Card key={c.key}>
            <CardHeader>
              <CardTitle className="text-base">{c.label}</CardTitle>
              <CardDescription>
                Threshold: {c.low}–{c.high}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey={c.key} stroke={c.color} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}