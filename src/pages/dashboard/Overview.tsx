import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Thermometer, CloudDrizzle, Sun, Wifi, WifiOff, Leaf, AlertTriangle, CheckCircle2, Brain, ArrowRight } from "lucide-react";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { useDevices, useLatestSensor, usePredictions, useSensorHistory } from "@/hooks/useDashboardData";
import { generateMockSeries } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function statusFor(value: number | null, low: number, high: number): "low" | "ok" | "high" {
  if (value === null) return "ok";
  if (value < low) return "low";
  if (value > high) return "high";
  return "ok";
}

export default function Overview() {
  const { reading } = useLatestSensor();
  const { data: history } = useSensorHistory(24);
  const { data: predictions } = usePredictions(1);
  const { devices } = useDevices();

  const latestPrediction = predictions[0];
  const onlineDevices = devices.filter((d) => d.is_online).length;

  const chartData = (history.length > 0
    ? history.map((r) => ({
        time: new Date(r.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        soil_moisture: Number(r.soil_moisture ?? 0),
        temperature: Number(r.temperature ?? 0),
      }))
    : generateMockSeries(24));

  const soil = reading?.soil_moisture ?? null;
  const temp = reading?.temperature ?? null;
  const hum = reading?.humidity ?? null;
  const light = reading?.light_intensity ?? null;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Farm Overview</h2>
          <p className="text-sm text-muted-foreground">Real-time field monitoring & CNN disease analysis</p>
        </div>
        <Badge variant={onlineDevices > 0 ? "default" : "secondary"} className="gap-1">
          {onlineDevices > 0 ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {onlineDevices} ESP32-CAM online
        </Badge>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard label="Soil Moisture" value={soil !== null ? Number(soil) : null} unit="%" icon={Droplets} iconColor="bg-sky/10 text-sky" max={100} status={statusFor(soil !== null ? Number(soil) : null, 30, 70)} />
        <SensorCard label="Temperature" value={temp !== null ? Number(temp) : null} unit="°C" icon={Thermometer} iconColor="bg-secondary/10 text-secondary" max={50} status={statusFor(temp !== null ? Number(temp) : null, 15, 32)} />
        <SensorCard label="Humidity" value={hum !== null ? Number(hum) : null} unit="%" icon={CloudDrizzle} iconColor="bg-accent/10 text-accent" max={100} status={statusFor(hum !== null ? Number(hum) : null, 40, 80)} />
        <SensorCard label="Light" value={light !== null ? Number(light) : null} unit="lux" icon={Sun} iconColor="bg-harvest/10 text-harvest" max={1200} status={statusFor(light !== null ? Number(light) : null, 200, 1000)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* CNN Latest Result */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  CNN Disease Analysis
                </CardTitle>
                <CardDescription>Latest leaf prediction from ESP32-CAM</CardDescription>
              </div>
              <Link to="/dashboard/disease">
                <Button variant="ghost" size="sm" className="gap-1">
                  Open <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {latestPrediction ? (
              <div className="flex flex-col sm:flex-row gap-4">
                {latestPrediction.image_url && (
                  <img
                    src={latestPrediction.image_url}
                    alt="Captured leaf"
                    className="w-full sm:w-40 h-40 object-cover rounded-lg border"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <Badge className={latestPrediction.is_healthy ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}>
                    {latestPrediction.is_healthy ? "Healthy" : "Diseased"}
                  </Badge>
                  <div className="text-2xl font-bold">{latestPrediction.predicted_class}</div>
                  <div className="text-sm text-muted-foreground">
                    Confidence: <span className="font-semibold text-foreground">{(latestPrediction.confidence * 100).toFixed(1)}%</span>
                  </div>
                  {latestPrediction.recommendation && (
                    <p className="text-sm border-l-2 border-primary pl-3 py-1">
                      {latestPrediction.recommendation}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <Leaf className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No predictions yet. Upload a leaf image or wait for ESP32-CAM.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Smart Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {soil !== null && Number(soil) < 30 ? (
              <Alert icon={AlertTriangle} tone="warn" title="Low soil moisture" body="Irrigate within 2-3 hours." />
            ) : (
              <Alert icon={CheckCircle2} tone="ok" title="Soil moisture OK" body="No irrigation needed." />
            )}
            {latestPrediction && !latestPrediction.is_healthy ? (
              <Alert icon={AlertTriangle} tone="warn" title={`${latestPrediction.predicted_class} detected`} body={latestPrediction.recommendation ?? "Take action."} />
            ) : null}
            {temp !== null && Number(temp) > 32 ? (
              <Alert icon={AlertTriangle} tone="warn" title="High temperature" body="Provide shade or extra watering." />
            ) : (
              <Alert icon={CheckCircle2} tone="ok" title="Temperature normal" body="Within ideal range." />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">24h Trend — Soil Moisture & Temperature</CardTitle>
          <CardDescription>{history.length === 0 && "Showing sample data until ESP32-CAM sends readings"}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="m" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--sky))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--sky))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="t" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area type="monotone" dataKey="soil_moisture" stroke="hsl(var(--sky))" fill="url(#m)" name="Soil %" />
              <Area type="monotone" dataKey="temperature" stroke="hsl(var(--secondary))" fill="url(#t)" name="Temp °C" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function Alert({ icon: Icon, tone, title, body }: { icon: typeof AlertTriangle; tone: "ok" | "warn"; title: string; body: string }) {
  const cls =
    tone === "ok"
      ? "bg-primary/5 border-primary/20 text-primary"
      : "bg-destructive/5 border-destructive/20 text-destructive";
  return (
    <div className={`flex gap-2 p-3 rounded-lg border ${cls}`}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{body}</div>
      </div>
    </div>
  );
}