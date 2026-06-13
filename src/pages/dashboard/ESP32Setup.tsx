import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Cpu, Wifi, Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/esp32-ingest`;

const ARDUINO_CODE = `// ESP32-CAM -> AgroAI Disease Detection
// Board: "AI Thinker ESP32-CAM" | Flash: 4MB | Partition: Huge APP
// Libraries: WiFi, HTTPClient, ArduinoJson, base64

#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <base64.h>

// ====== EDIT THESE ======
const char* WIFI_SSID     = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* DEVICE_ID     = "esp32-cam-01";
const char* ENDPOINT_URL  = "${ENDPOINT}";
const unsigned long CAPTURE_INTERVAL_MS = 60000; // every 60s
// ========================

// AI Thinker ESP32-CAM pinout
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

bool initCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer   = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM; config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  // High quality for crisp leaf detail
  if (psramFound()) {
    config.frame_size   = FRAMESIZE_SXGA;   // 1280x1024
    config.jpeg_quality = 10;               // lower = better
    config.fb_count     = 2;
    config.grab_mode    = CAMERA_GRAB_LATEST;
    config.fb_location  = CAMERA_FB_IN_PSRAM;
  } else {
    config.frame_size   = FRAMESIZE_SVGA;   // 800x600
    config.jpeg_quality = 12;
    config.fb_count     = 1;
  }

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("Camera init failed");
    return false;
  }

  // Tune sensor for sharper, colour-accurate leaf images
  sensor_t* s = esp_camera_sensor_get();
  if (s) {
    s->set_brightness(s, 0);
    s->set_contrast(s, 1);
    s->set_saturation(s, 1);
    s->set_sharpness(s, 1);
    s->set_whitebal(s, 1);
    s->set_awb_gain(s, 1);
    s->set_wb_mode(s, 0);     // auto white balance
    s->set_exposure_ctrl(s, 1);
    s->set_aec2(s, 1);
    s->set_gain_ctrl(s, 1);
    s->set_lenc(s, 1);        // lens correction
    s->set_dcw(s, 1);
  }
  return true;
}

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("WiFi connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println(" OK  IP=" + WiFi.localIP().toString());
}

bool sendCapture() {
  // Warm-up: discard a few frames so AGC/AWB settle
  for (int i = 0; i < 3; i++) {
    camera_fb_t* w = esp_camera_fb_get();
    if (w) esp_camera_fb_return(w);
    delay(120);
  }

  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) { Serial.println("Capture failed"); return false; }

  String imgB64 = base64::encode(fb->buf, fb->len);
  esp_camera_fb_return(fb);

  DynamicJsonDocument doc(imgB64.length() + 1024);
  doc["device_id"]      = DEVICE_ID;
  doc["image_base64"]   = imgB64;
  // Optional sensor fields:
  // doc["soil_moisture"] = 42;
  // doc["temperature"]   = 27.5;
  // doc["humidity"]      = 65;
  // doc["light_intensity"] = 850;

  String payload;
  serializeJson(doc, payload);

  HTTPClient http;
  http.begin(ENDPOINT_URL);
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(payload);
  String resp = http.getString();
  http.end();

  Serial.printf("HTTP %d  %s\\n", code, resp.c_str());
  return code >= 200 && code < 300;
}

void setup() {
  Serial.begin(115200);
  delay(200);
  if (!initCamera()) { delay(3000); ESP.restart(); }
  connectWifi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWifi();
  sendCapture();
  delay(CAPTURE_INTERVAL_MS);
}
`;

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-muted-foreground">{label}</span>
        <Button size="sm" variant="outline" onClick={copy} className="gap-1 h-7">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto max-h-[420px] overflow-y-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ESP32Setup() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-display text-2xl font-bold">ESP32-CAM Setup</h2>
        <p className="text-sm text-muted-foreground">
          Flash this firmware, then your device will auto-capture leaf images and stream results to your dashboard.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm">1. Hardware</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• AI Thinker ESP32-CAM</p>
            <p>• FTDI/USB programmer</p>
            <p>• 5V 1A power supply</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm">2. Configure WiFi</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>Edit WIFI_SSID & WIFI_PASSWORD in the code below.</p>
            <p>Set a unique DEVICE_ID per board.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm">3. See results</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>Open Dashboard → History to see disease + recommendation per capture.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your ingest endpoint</CardTitle>
          <CardDescription>The firmware POSTs JSON here. No auth required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="font-mono text-xs bg-muted p-3 rounded-lg break-all">
            POST {ENDPOINT}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">device_id</Badge>
            <Badge variant="outline">image_base64</Badge>
            <Badge variant="outline">soil_moisture?</Badge>
            <Badge variant="outline">temperature?</Badge>
            <Badge variant="outline">humidity?</Badge>
            <Badge variant="outline">light_intensity?</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Arduino firmware (copy & flash)</CardTitle>
          <CardDescription>
            Tuned for sharp, colour-accurate leaf images: SXGA resolution, JPEG quality 10, AWB warm-up, lens correction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={ARDUINO_CODE} label="esp32_cam_agroai.ino" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tips for a perfect leaf photo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Mount the camera 15–25 cm above the leaf, lens parallel to the surface.</p>
          <p>• Use bright, diffused daylight or a white LED — avoid harsh shadows and glare.</p>
          <p>• Place the leaf on a plain background (white paper works great).</p>
          <p>• Keep the lens clean; a single fingerprint will blur every capture.</p>
          <p>• If images look dark/washed, increase CAPTURE_INTERVAL_MS so AWB has time to settle, or raise jpeg_quality value to 8.</p>
        </CardContent>
      </Card>
    </div>
  );
}