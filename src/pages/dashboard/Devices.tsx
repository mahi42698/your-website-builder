import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDevices, usePredictions } from "@/hooks/useDashboardData";
import { Camera, Cpu, Upload, Wifi, WifiOff, ImageIcon, Loader2, Trash2, BellRing, Copy, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const HIDDEN_KEY = "devices.hiddenPredictionIds";

function loadHidden(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveHidden(s: Set<string>) {
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(Array.from(s)));
}

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
  const [hidden, setHidden] = useState<Set<string>>(() => loadHidden());
  const [notice, setNotice] = useState<{ device_id: string; predicted_class: string; confidence: number; image_url: string | null } | null>(null);
  const lastSeenId = useRef<string | null>(null);

  const visiblePredictions = predictions.filter((p) => !hidden.has(p.id));

  // Watch for new predictions → toast + banner
  useEffect(() => {
    if (predictions.length === 0) return;
    const newest = predictions[0];
    if (lastSeenId.current === null) {
      lastSeenId.current = newest.id;
      return;
    }
    if (newest.id !== lastSeenId.current) {
      lastSeenId.current = newest.id;
      if (!hidden.has(newest.id)) {
        toast.success(
          `New capture from ${newest.device_id ?? "device"} → ${newest.predicted_class} (${(Number(newest.confidence) * 100).toFixed(0)}%)`,
        );
        setNotice({
          device_id: newest.device_id ?? "unknown",
          predicted_class: newest.predicted_class,
          confidence: Number(newest.confidence),
          image_url: newest.image_url,
        });
        const t = setTimeout(() => setNotice(null), 5000);
        return () => clearTimeout(t);
      }
    }
  }, [predictions, hidden]);

  const clearDevice = (device_id: string) => {
    const next = new Set(hidden);
    predictions.filter((p) => p.device_id === device_id).forEach((p) => next.add(p.id));
    saveHidden(next);
    setHidden(next);
    toast.success(`Cleared history for ${device_id}`);
  };

  const clearAll = () => {
    const next = new Set(hidden);
    predictions.forEach((p) => next.add(p.id));
    saveHidden(next);
    setHidden(next);
    setNotice(null);
    toast.success("Cleared all captures");
  };

  const uploadFor = async (device_id: string, file: File) => {
    setBusy(device_id);
    try {
      const image_base64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke("esp32-ingest", {
        body: { device_id, image_base64 },
      });
      if (error || !data?.ok) throw new Error(data?.error ?? error?.message ?? "Upload failed");
      const p = data.prediction;
      if (p) {
        setNotice({
          device_id,
          predicted_class: p.predicted_class,
          confidence: Number(p.confidence),
          image_url: p.image_url,
        });
        toast.success(`Captured → ${p.predicted_class} (${(Number(p.confidence) * 100).toFixed(0)}%)`);
        setTimeout(() => setNotice(null), 5000);
      } else {
        toast.success("Uploaded");
      }
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
          Manage ESP32-CAM units, upload leaf images, get instant capture notices, and clean history any time.
        </p>
      </div>

      {notice && (
        <Card className="border-primary/40 bg-primary/5 animate-in fade-in slide-in-from-top-2">
          <CardContent className="flex items-center gap-3 py-3">
            {notice.image_url ? (
              <img src={notice.image_url} alt="" className="w-12 h-12 rounded object-cover border" />
            ) : (
              <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold flex items-center gap-2">
                <BellRing className="w-4 h-4 text-primary animate-pulse" />
                New capture from <span className="font-mono">{notice.device_id}</span>
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {notice.predicted_class} • {(notice.confidence * 100).toFixed(0)}% confidence
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setNotice(null)}>Dismiss</Button>
          </CardContent>
        </Card>
      )}

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
                    {visiblePredictions.filter((p) => p.device_id === d.device_id).length}
                  </div>
                </div>
              </div>
              {(() => {
                const latest = visiblePredictions.find((p) => p.device_id === d.device_id);
                if (!latest) return (
                  <div className="border rounded-lg p-6 text-center text-xs text-muted-foreground">
                    No captures yet. Upload an image to see it appear here instantly.
                  </div>
                );
                return (
                  <div className="border rounded-lg overflow-hidden">
                    {latest.image_url && (
                      <img src={latest.image_url} alt={latest.predicted_class} className="w-full h-44 object-cover" />
                    )}
                    <div className="p-2 flex items-center justify-between text-xs">
                      <Badge
                        variant="outline"
                        className={latest.is_healthy ? "border-primary/30 text-primary" : "border-destructive/30 text-destructive"}
                      >
                        {latest.predicted_class}
                      </Badge>
                      <span className="text-muted-foreground">
                        {(Number(latest.confidence) * 100).toFixed(0)}% • {timeAgo(latest.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })()}
              {(() => {
                const list = visiblePredictions.filter((p) => p.device_id === d.device_id).slice(0, 12);
                if (list.length === 0) return null;
                return (
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {list.map((p) => (
                      <a key={p.id} href={p.image_url ?? "#"} target="_blank" rel="noreferrer"
                         className="shrink-0 w-14 h-14 rounded border overflow-hidden hover:border-primary">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.predicted_class} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </a>
                    ))}
                  </div>
                );
              })()}
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
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-1"
                  disabled={busy === d.device_id}
                  onClick={() => fileRefs.current[d.device_id]?.click()}
                >
                  {busy === d.device_id ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Uploading & detecting…</>
                  ) : (
                    <><Upload className="w-3 h-3" /> Capture / Upload</>
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={visiblePredictions.filter((p) => p.device_id === d.device_id).length === 0}
                    >
                      <Trash2 className="w-3 h-3" /> Clean
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear history for {d.device_id}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This hides all captures from this device on the dashboard. Existing records stay safe in the database.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => clearDevice(d.device_id)}>Clear</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
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
            <div className="flex items-center gap-2">
              <Badge variant="outline">{visiblePredictions.length} shown</Badge>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1" disabled={visiblePredictions.length === 0}>
                    <Trash2 className="w-3 h-3" /> Clear all
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all captures?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hides every capture from the dashboard view. Records remain stored in the database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAll}>Clear all</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {visiblePredictions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No captures yet. Upload an image from a device card above.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {visiblePredictions.map((p) => (
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
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="w-4 h-4" /> ESP32-CAM Firmware (Optimized for Leaf Capture)
          </CardTitle>
          <CardDescription>
            Tuned settings + warm-up frames so every photo is sharp, well-lit, and detectable by the AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs space-y-1">
            <div className="font-semibold flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5 text-primary" /> Capture tips</div>
            <ul className="list-disc pl-5 text-muted-foreground space-y-0.5">
              <li>Hold camera 15–25 cm from the leaf, fill the frame with green.</li>
              <li>Use bright, diffuse daylight — avoid direct sun and harsh shadows.</li>
              <li>Keep the leaf still for 1 second; ESP32-CAM has no stabilization.</li>
              <li>Clean the lens (a fingerprint is the #1 cause of blurry shots).</li>
              <li>Power the board with a stable 5V/2A supply — brownouts cause dark frames.</li>
            </ul>
          </div>

          <div className="font-mono text-xs bg-muted p-3 rounded-lg break-all">
            POST {import.meta.env.VITE_SUPABASE_URL}/functions/v1/esp32-ingest
          </div>

          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2 gap-1 z-10"
              onClick={() => {
                navigator.clipboard.writeText(ESP32_SKETCH);
                toast.success("Firmware copied to clipboard");
              }}
            >
              <Copy className="w-3 h-3" /> Copy
            </Button>
            <pre className="bg-muted text-[11px] leading-relaxed p-4 pt-12 rounded-lg overflow-auto max-h-96">
              <code>{ESP32_SKETCH}</code>
            </pre>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Board: <b>AI Thinker ESP32-CAM</b> • Libraries: <b>ArduinoJson</b>, <b>base64</b> (built-in <code>esp_camera.h</code>).
            Set your WiFi SSID/password at the top of the sketch.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const ESP32_SKETCH = `#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "mbedtls/base64.h"

// === USER CONFIG ===
const char* WIFI_SSID     = "YOUR_WIFI";
const char* WIFI_PASS     = "YOUR_PASSWORD";
const char* DEVICE_ID     = "esp32-cam-01";
const char* INGEST_URL    = "${typeof window !== "undefined" ? "" : ""}${""}";
// Endpoint: ${"https://ckhfigacvfcsowduvkjj.supabase.co/functions/v1/esp32-ingest"}
const unsigned long CAPTURE_INTERVAL_MS = 60000; // every 60s

// === AI-Thinker ESP32-CAM pins ===
#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22

bool initCamera() {
  camera_config_t c = {};
  c.ledc_channel = LEDC_CHANNEL_0; c.ledc_timer = LEDC_TIMER_0;
  c.pin_d0=Y2_GPIO_NUM; c.pin_d1=Y3_GPIO_NUM; c.pin_d2=Y4_GPIO_NUM; c.pin_d3=Y5_GPIO_NUM;
  c.pin_d4=Y6_GPIO_NUM; c.pin_d5=Y7_GPIO_NUM; c.pin_d6=Y8_GPIO_NUM; c.pin_d7=Y9_GPIO_NUM;
  c.pin_xclk=XCLK_GPIO_NUM; c.pin_pclk=PCLK_GPIO_NUM; c.pin_vsync=VSYNC_GPIO_NUM;
  c.pin_href=HREF_GPIO_NUM; c.pin_sccb_sda=SIOD_GPIO_NUM; c.pin_sccb_scl=SIOC_GPIO_NUM;
  c.pin_pwdn=PWDN_GPIO_NUM; c.pin_reset=RESET_GPIO_NUM;
  c.xclk_freq_hz = 20000000;
  c.pixel_format = PIXFORMAT_JPEG;
  // High quality for AI detection
  if (psramFound()) {
    c.frame_size = FRAMESIZE_SXGA;   // 1280x1024
    c.jpeg_quality = 10;             // 0-63, lower = better
    c.fb_count = 2;
    c.grab_mode = CAMERA_GRAB_LATEST;
    c.fb_location = CAMERA_FB_IN_PSRAM;
  } else {
    c.frame_size = FRAMESIZE_SVGA;
    c.jpeg_quality = 12;
    c.fb_count = 1;
  }
  if (esp_camera_init(&c) != ESP_OK) return false;

  // Tune the sensor for sharp, color-accurate leaf photos
  sensor_t* s = esp_camera_sensor_get();
  s->set_brightness(s, 1);     // -2..2  (slightly brighter)
  s->set_contrast(s, 1);       // -2..2
  s->set_saturation(s, 1);     // -2..2  (greens pop)
  s->set_sharpness(s, 1);      // -2..2
  s->set_whitebal(s, 1);       // auto WB on
  s->set_awb_gain(s, 1);
  s->set_wb_mode(s, 0);        // 0=auto
  s->set_exposure_ctrl(s, 1);  // AEC on
  s->set_aec2(s, 1);
  s->set_ae_level(s, 0);
  s->set_gain_ctrl(s, 1);      // AGC on
  s->set_gainceiling(s, GAINCEILING_4X);
  s->set_bpc(s, 1);            // black pixel correction
  s->set_wpc(s, 1);            // white pixel correction
  s->set_raw_gma(s, 1);
  s->set_lenc(s, 1);           // lens correction
  s->set_hmirror(s, 0);
  s->set_vflip(s, 0);
  s->set_dcw(s, 1);
  return true;
}

String captureBase64() {
  // Throw away 3 frames so AWB/AEC settle (anti-dark/anti-green-tint)
  for (int i = 0; i < 3; i++) {
    camera_fb_t* fb = esp_camera_fb_get();
    if (fb) esp_camera_fb_return(fb);
    delay(120);
  }
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) return "";
  size_t outLen = 4 * ((fb->len + 2) / 3) + 1;
  String out; out.reserve(outLen);
  unsigned char* buf = (unsigned char*)malloc(outLen);
  size_t written = 0;
  mbedtls_base64_encode(buf, outLen, &written, fb->buf, fb->len);
  for (size_t i = 0; i < written; i++) out += (char)buf[i];
  free(buf);
  esp_camera_fb_return(fb);
  return out;
}

void sendCapture() {
  if (WiFi.status() != WL_CONNECTED) return;
  String b64 = captureBase64();
  if (b64.length() == 0) { Serial.println("capture failed"); return; }

  DynamicJsonDocument doc(b64.length() + 512);
  doc["device_id"] = DEVICE_ID;
  doc["image_base64"] = b64;
  String body; serializeJson(doc, body);

  HTTPClient http;
  http.begin(INGEST_URL);
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(body);
  Serial.printf("POST -> %d\\n", code);
  if (code > 0) Serial.println(http.getString());
  http.end();
}

void setup() {
  Serial.begin(115200);
  if (!initCamera()) { Serial.println("camera init FAILED"); return; }
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(400); Serial.print("."); }
  Serial.println("\\nWiFi OK: " + WiFi.localIP().toString());
  delay(1500); // sensor warm-up
}

void loop() {
  sendCapture();
  delay(CAPTURE_INTERVAL_MS);
}
`;