const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

    const farm = await req.json();

    const tools = [
      {
        type: "function",
        function: {
          name: "report_recommendation",
          description: "Return crop advice for a smallholder farm",
          parameters: {
            type: "object",
            properties: {
              recommendedCrops: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    confidence: { type: "number", description: "0-100" },
                    season: { type: "string" },
                    profit: { type: "string", enum: ["Low", "Medium", "High"] },
                    reason: { type: "string" },
                  },
                  required: ["name", "confidence", "season", "profit", "reason"],
                  additionalProperties: false,
                },
              },
              soilHealth: {
                type: "object",
                properties: {
                  ph: { type: "number" },
                  nitrogen: { type: "string" },
                  phosphorus: { type: "string" },
                  potassium: { type: "string" },
                },
                required: ["ph", "nitrogen", "phosphorus", "potassium"],
                additionalProperties: false,
              },
              warnings: { type: "array", items: { type: "string" } },
              tips: { type: "array", items: { type: "string" } },
            },
            required: ["recommendedCrops", "soilHealth", "warnings", "tips"],
            additionalProperties: false,
          },
        },
      },
    ];

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an agronomy advisor for smallholder farmers in Bangladesh & South Asia. Recommend 3 best crops with confidence (0-100), season, profitability and a short reason. Estimate soil health from soil type & water source. Provide concise warnings and practical tips.",
          },
          { role: "user", content: `Farm data: ${JSON.stringify(farm)}` },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "report_recommendation" } },
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
      return new Response(JSON.stringify({ error: "No recommendation returned" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(call.function.arguments, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});