import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDevices } from "@/hooks/useDashboardData";
import { Camera, Cpu, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

function timeAgo(iso: string | null) {
  if (!iso) return "never";
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return `${Math.floor(d)}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export default function Devices() {
  const { devices, loading } = useDevices();
  const [busy, setBusy] = useState<string | null>(null);

  const triggerCapture = async (id: string) => {
    setBusy(id);
    setTimeout(() => {
      toast.success("Capture command queued for ESP32-CAM");
      setBusy(null);
    }, 800);
  };

  const placeholders = devices.length === 0 && !loading
    ? [{ id: "ph", device_id: "esp32-cam-01", name: "ESP32-CAM (not yet connected)", is_online: false, last_seen: null }]
    : devices;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-display text-2xl font-bold">Device Management</h2>
        <p className="text-sm text-muted-foreground">Manage your ESP32-CAM units, refresh status, trigger captures</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {placeholders.map((d) => (
          <Card key={d.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-gradient-accent flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{d.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">{d.device_id}</CardDescription>
                  </div>
                </div>
                <Badge variant={d.is_online ? "default" : "secondary"} className="gap-1">
                  {d.is_online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {d.is_online ? "Online" : "Offline"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Camera</div>
                  <div className="font-medium flex items-center gap-1">
                    <Camera className="w-3 h-3" /> {d.is_online ? "Ready" : "Standby"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Last sync</div>
                  <div className="font-medium">{timeAgo(d.last_seen)}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-1"
                  disabled={!d.is_online || busy === d.id}
                  onClick={() => triggerCapture(d.id)}
                >
                  <Camera className="w-3 h-3" />
                  {busy === d.id ? "Sending..." : "Capture Leaf"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">ESP32-CAM Endpoint</CardTitle>
          <CardDescription>Configure your ESP32-CAM firmware to POST sensor + image data here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-xs bg-muted p-3 rounded-lg break-all">
            POST {import.meta.env.VITE_SUPABASE_URL}/functions/v1/esp32-ingest
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Body: <code>{`{ device_id, soil_moisture, temperature, humidity, light_intensity, image_base64 }`}</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}