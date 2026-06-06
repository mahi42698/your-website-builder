import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageDataUrl } = await req.json();
    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return new Response(JSON.stringify({ error: "imageDataUrl required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert plant pathologist CNN model. Analyze the leaf image and classify the disease. Respond with the tool call only.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "report_diagnosis",
          description: "Report leaf disease diagnosis",
          parameters: {
            type: "object",
            properties: {
              predictedClass: {
                type: "string",
                description: "Disease name, e.g. 'Healthy', 'Leaf Blight', 'Powdery Mildew', 'Bacterial Spot', 'Rust', 'Mosaic Virus', 'Early Blight', 'Late Blight', 'Septoria Leaf Spot', 'Not a leaf'",
              },
              confidence: { type: "number", description: "0 to 1 confidence" },
              isHealthy: { type: "boolean" },
              recommendation: { type: "string", description: "1-2 sentence treatment advice for the farmer" },
              plantType: { type: "string", description: "Best guess of plant species, or 'Unknown'" },
            },
            required: ["predictedClass", "confidence", "isHealthy", "recommendation", "plantType"],
            additionalProperties: false,
          },
        },
      },
    ];

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this leaf image and call report_diagnosis." },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ],
          },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "report_diagnosis" } },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      const status = aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 500;
      return new Response(JSON.stringify({ error: `AI gateway error: ${errText}` }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      return new Response(JSON.stringify({ error: "No diagnosis returned" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(call.function.arguments);

    return new Response(
      JSON.stringify({ ...parsed, modelVersion: "gemini-2.5-flash-vision" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});