import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDevices, usePredictions } from "@/hooks/useDashboardData";
import { Camera, Cpu, Upload, Wifi, WifiOff, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function timeAgo(iso: string | null) {
  if (!iso) return "never";
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return `${Math.floor(d)}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = r.result as string;
      resolve(s.includes(",") ? s.split(",")[1] : s);
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function Devices() {
  const { devices, loading } = useDevices();
  const { data: predictions } = usePredictions(100);
  const [busy, setBusy] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const uploadFor = async (device_id: string, file: File) => {
    setBusy(device_id);
    try {
      const image_base64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke("esp32-ingest", {
        body: { device_id, image_base64 },
      });
      if (error || !data?.ok) throw new Error(data?.error ?? error?.message ?? "Upload failed");
      toast.success(`Uploaded → ${data.prediction?.predicted_class ?? "saved"}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  };

  const placeholders = devices.length === 0 && !loading
    ? [{ id: "ph", device_id: "esp32-cam-01", name: "ESP32-CAM (not yet connected)", is_online: false, last_seen: null }]
    : devices;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="font-display text-2xl font-bold">Device Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage ESP32-CAM units, upload leaf images, and browse every capture from each device.
        </p>
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
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Status</div>
                  <div className="font-medium flex items-center gap-1">
                    <Camera className="w-3 h-3" /> {d.is_online ? "Ready" : "Standby"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Last sync</div>
                  <div className="font-medium">{timeAgo(d.last_seen)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Captures</div>
                  <div className="font-medium">
                    {predictions.filter((p) => p.device_id === d.device_id).length}
                  </div>
                </div>
              </div>
              <input
                ref={(el) => (fileRefs.current[d.device_id] = el)}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFor(d.device_id, f);
                  e.target.value = "";
                }}
              />
              <Button
                size="sm"
                className="w-full gap-1"
                disabled={busy === d.device_id}
                onClick={() => fileRefs.current[d.device_id]?.click()}
              >
                {busy === d.device_id ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Uploading & detecting…</>
                ) : (
                  <><Upload className="w-3 h-3" /> Upload Leaf Image</>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <ImageIcon className="w-4 h-4" /> All Captures
              </CardTitle>
              <CardDescription>Every image uploaded from any device, newest first.</CardDescription>
            </div>
            <Badge variant="outline">{predictions.length} total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {predictions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No captures yet. Upload an image from a device card above.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {predictions.map((p) => (
                <a
                  key={p.id}
                  href={p.image_url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="border rounded-lg overflow-hidden hover:border-primary transition-colors group"
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.predicted_class}
                      className="w-full aspect-square object-cover group-hover:scale-[1.02] transition-transform"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-muted flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="p-2 space-y-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${p.is_healthy ? "border-primary/30 text-primary" : "border-destructive/30 text-destructive"}`}
                    >
                      {p.predicted_class}
                    </Badge>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>{(Number(p.confidence) * 100).toFixed(0)}%</span>
                      <span>{new Date(p.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground truncate">{p.device_id}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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