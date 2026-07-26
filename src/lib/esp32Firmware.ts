export const INGEST_URL =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/esp32-ingest`;

export const ARDUINO_SKETCH = `/*
  AgroAI — ESP32-CAM live telemetry + leaf capture
  ------------------------------------------------
  Board:  AI Thinker ESP32-CAM   (Tools > Board > ESP32 Arduino > AI Thinker ESP32-CAM)
  Libs:   ArduinoJson, DHT sensor library (Adafruit), Adafruit Unified Sensor

  Wiring
    Soil moisture (analog AOUT) -> GPIO 33   (ADC1, safe with WiFi)
    DHT22 DATA                  -> GPIO 14   (+ 10k pull-up to 3V3)
    LDR divider output          -> GPIO 32   (ADC1)
    All sensors VCC             -> 3V3       GND -> GND
    Board power                 -> 5V / 2A regulated supply
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "esp_camera.h"
#include "base64.h"

// ---------- USER CONFIG ----------
const char* WIFI_SSID     = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* INGEST_URL    = "${INGEST_URL}";
const char* DEVICE_ID     = "esp32-cam-01";

const uint32_t SENSOR_INTERVAL_MS = 2000;    // telemetry every 2 s
const uint32_t IMAGE_INTERVAL_MS  = 60000;   // leaf photo every 60 s
// ---------------------------------

#define SOIL_PIN 33
#define LDR_PIN  32
#define DHT_PIN  14
#define DHTTYPE  DHT22
DHT dht(DHT_PIN, DHTTYPE);

// AI Thinker ESP32-CAM pin map
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

uint32_t lastSensor = 0, lastImage = 0;

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("WiFi connecting");
  uint32_t start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000) {
    delay(400); Serial.print(".");
  }
  Serial.println(WiFi.status() == WL_CONNECTED
    ? "\\nWiFi connected: " + WiFi.localIP().toString()
    : "\\nWiFi failed, will retry");
}

bool initCamera() {
  camera_config_t c;
  c.ledc_channel = LEDC_CHANNEL_0; c.ledc_timer = LEDC_TIMER_0;
  c.pin_d0=Y2_GPIO_NUM; c.pin_d1=Y3_GPIO_NUM; c.pin_d2=Y4_GPIO_NUM; c.pin_d3=Y5_GPIO_NUM;
  c.pin_d4=Y6_GPIO_NUM; c.pin_d5=Y7_GPIO_NUM; c.pin_d6=Y8_GPIO_NUM; c.pin_d7=Y9_GPIO_NUM;
  c.pin_xclk=XCLK_GPIO_NUM; c.pin_pclk=PCLK_GPIO_NUM; c.pin_vsync=VSYNC_GPIO_NUM;
  c.pin_href=HREF_GPIO_NUM; c.pin_sccb_sda=SIOD_GPIO_NUM; c.pin_sccb_scl=SIOC_GPIO_NUM;
  c.pin_pwdn=PWDN_GPIO_NUM; c.pin_reset=RESET_GPIO_NUM;
  c.xclk_freq_hz=20000000; c.pixel_format=PIXFORMAT_JPEG;
  if (psramFound()) { c.frame_size=FRAMESIZE_SXGA; c.jpeg_quality=10; c.fb_count=2; c.grab_mode=CAMERA_GRAB_LATEST; }
  else              { c.frame_size=FRAMESIZE_SVGA; c.jpeg_quality=12; c.fb_count=1; }
  if (esp_camera_init(&c) != ESP_OK) { Serial.println("Camera init failed"); return false; }
  sensor_t* s = esp_camera_sensor_get();
  s->set_brightness(s, 1); s->set_contrast(s, 1); s->set_saturation(s, 1);
  s->set_whitebal(s, 1); s->set_awb_gain(s, 1); s->set_exposure_ctrl(s, 1);
  s->set_gain_ctrl(s, 1); s->set_lenc(s, 1);
  return true;
}

int readSoilPercent() {
  long raw = 0;
  for (int i = 0; i < 10; i++) { raw += analogRead(SOIL_PIN); delay(5); }
  raw /= 10;                                  // 0..4095, dry = high
  int pct = map(raw, 4095, 1200, 0, 100);     // calibrate 1200 = fully wet
  return constrain(pct, 0, 100);
}

float readLux() {
  long raw = 0;
  for (int i = 0; i < 5; i++) { raw += analogRead(LDR_PIN); delay(3); }
  raw /= 5;
  return (raw / 4095.0) * 1200.0;             // approx lux scale 0..1200
}

void postJson(const String& payload) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(INGEST_URL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(15000);
  int code = http.POST(payload);
  Serial.printf("POST -> %d\\n", code);
  http.end();
}

void sendSensors() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  if (isnan(t)) t = 0; if (isnan(h)) h = 0;

  StaticJsonDocument<256> doc;
  doc["device_id"]       = DEVICE_ID;
  doc["soil_moisture"]   = readSoilPercent();
  doc["temperature"]     = t;
  doc["humidity"]        = h;
  doc["light_intensity"] = readLux();
  String out; serializeJson(doc, out);
  postJson(out);
}

void sendImage() {
  for (int i = 0; i < 3; i++) {           // warm-up frames = sharp exposure
    camera_fb_t* w = esp_camera_fb_get(); if (w) esp_camera_fb_return(w); delay(120);
  }
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) { Serial.println("Capture failed"); return; }
  String b64 = base64::encode(fb->buf, fb->len);
  esp_camera_fb_return(fb);

  String payload = "{\\"device_id\\":\\"" + String(DEVICE_ID) + "\\",\\"image_base64\\":\\"" + b64 + "\\"}";
  postJson(payload);
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  pinMode(SOIL_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);
  dht.begin();
  connectWiFi();
  initCamera();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) { connectWiFi(); delay(1000); return; }  // auto reconnect
  uint32_t now = millis();
  if (now - lastSensor >= SENSOR_INTERVAL_MS) { lastSensor = now; sendSensors(); }
  if (now - lastImage  >= IMAGE_INTERVAL_MS)  { lastImage  = now; sendImage();  }
  delay(50);
}
`;
