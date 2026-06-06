// Real leaf disease detection via Lovable AI Gateway (Gemini vision).
import { supabase } from "@/integrations/supabase/client";

export type DiseasePrediction = {
  predictedClass: string;
  confidence: number;
  isHealthy: boolean;
  recommendation: string;
  modelVersion: string;
  plantType?: string;
};

export async function predictDisease(imageDataUrl: string): Promise<DiseasePrediction> {
  const { data, error } = await supabase.functions.invoke("detect-disease", {
    body: { imageDataUrl },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return {
    predictedClass: data.predictedClass,
    confidence: data.confidence,
    isHealthy: data.isHealthy,
    recommendation: data.recommendation,
    modelVersion: data.modelVersion ?? "gemini-vision",
    plantType: data.plantType,
  };
}