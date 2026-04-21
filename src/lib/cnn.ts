// Mock CNN prediction service. Swap with a real prediction API later by
// changing only this file - the UI imports `predictDisease` from here.

export type DiseasePrediction = {
  predictedClass: string;
  confidence: number;
  isHealthy: boolean;
  recommendation: string;
  modelVersion: string;
};

const CLASSES = [
  { name: "Healthy", healthy: true, recommendation: "Leaf appears healthy. Maintain current irrigation and nutrition schedule." },
  { name: "Leaf Blight", healthy: false, recommendation: "Apply copper-based fungicide. Remove affected leaves and improve drainage." },
  { name: "Powdery Mildew", healthy: false, recommendation: "Improve air circulation. Apply sulfur or potassium bicarbonate fungicide." },
  { name: "Bacterial Spot", healthy: false, recommendation: "Use copper bactericide. Avoid overhead watering and rotate crops." },
  { name: "Rust", healthy: false, recommendation: "Remove infected leaves. Apply systemic fungicide with myclobutanil." },
  { name: "Mosaic Virus", healthy: false, recommendation: "Remove and destroy infected plants. Control aphid vectors." },
];

export async function predictDisease(_imageDataUrl: string): Promise<DiseasePrediction> {
  // Simulated CNN inference latency
  await new Promise((r) => setTimeout(r, 1200));
  const pick = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  const confidence = 0.72 + Math.random() * 0.27;
  return {
    predictedClass: pick.name,
    confidence,
    isHealthy: pick.healthy,
    recommendation: pick.recommendation,
    modelVersion: "cnn-v1.0",
  };
}