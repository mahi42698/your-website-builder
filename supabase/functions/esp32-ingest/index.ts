// ESP32-CAM ingest endpoint
// Accepts: POST with JSON { device_id, soil_moisture?, temperature?, humidity?, light_intensity?, image_base64? }
// Stores sensor readings, optionally uploads leaf image, runs mock CNN prediction.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DISEASE_CLASSES = [
  { name: "Healthy", healthy: true, recommendation: "Leaf appears healthy. Continue current care." },
  { name: "Leaf Blight", healthy: false, recommendation: "Apply copper-based fungicide. Remove affected leaves." },
  { name: "Powdery Mildew", healthy: false, recommendation: "Improve air circulation. Apply sulfur fungicide." },
  { name: "Bacterial Spot", healthy: false, recommendation: "Use copper bactericide. Avoid overhead watering." },
  { name: "Rust", healthy: false, recommendation: "Remove infected leaves and apply fungicide." },
];

function mockCnnPredict() {
  const pick = DISEASE_CLASSES[Math.floor(Math.random() * DISEASE_CLASSES.length)];
  const confidence = 0.7 + Math.random() * 0.29;
  return { ...pick, confidence: Number(confidence.toFixed(4)) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json();
    const {
      device_id = "esp32-cam-01",
      soil_moisture,
      temperature,
      humidity,
      light_intensity,
      image_base64,
    } = body ?? {};

    // Upsert device + mark online
    await supabase.from("devices").upsert(
      {
        device_id,
        name: "ESP32-CAM",
        is_online: true,
        last_seen: new Date().toISOString(),
      },
      { onConflict: "device_id" },
    );

    // Insert sensor reading if any sensor field provided
    if (
      soil_moisture !== undefined ||
      temperature !== undefined ||
      humidity !== undefined ||
      light_intensity !== undefined
    ) {
      await supabase.from("sensor_readings").insert({
        device_id,
        soil_moisture,
        temperature,
        humidity,
        light_intensity,
      });
    }

    let prediction = null;
    if (image_base64) {
      const bytes = Uint8Array.from(atob(image_base64), (c) => c.charCodeAt(0));
      const path = `${device_id}/${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("leaf-images")
        .upload(path, bytes, { contentType: "image/jpeg", upsert: false });
      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage.from("leaf-images").getPublicUrl(path);

      const result = mockCnnPredict();
      const { data: pred, error: predErr } = await supabase
        .from("disease_predictions")
        .insert({
          device_id,
          image_path: path,
          image_url: urlData.publicUrl,
          predicted_class: result.name,
          confidence: result.confidence,
          is_healthy: result.healthy,
          recommendation: result.recommendation,
        })
        .select()
        .single();
      if (predErr) throw predErr;
      prediction = pred;
    }

    return new Response(
      JSON.stringify({ ok: true, prediction }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});