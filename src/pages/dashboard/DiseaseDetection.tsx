import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Camera, Upload, Loader2, Leaf, History as HistoryIcon } from "lucide-react";
import { predictDisease, type DiseasePrediction } from "@/lib/cnn";
import { usePredictions } from "@/hooks/useDashboardData";
import { toast } from "sonner";

export default function DiseaseDetection() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<DiseasePrediction | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: history } = usePredictions(8);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setImageUrl(url);
      setPrediction(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageUrl) return;
    setAnalyzing(true);
    try {
      const result = await predictDisease(imageUrl);
      setPrediction(result);
      toast.success(`CNN prediction: ${result.predictedClass}`);
    } catch {
      toast.error("CNN analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="font-display text-2xl font-bold">Leaf Disease Detection</h2>
        <p className="text-sm text-muted-foreground">Upload a leaf image or use ESP32-CAM. CNN model classifies disease and confidence.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="w-4 h-4" /> Leaf Image Input
            </CardTitle>
            <CardDescription>Upload from device or pull from ESP32-CAM feed</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="aspect-video rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="Leaf to analyze" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <Leaf className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No image selected</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => fileRef.current?.click()} variant="outline" className="flex-1 gap-2">
                <Upload className="w-4 h-4" /> Upload Image
              </Button>
              <Button onClick={analyze} disabled={!imageUrl || analyzing} className="flex-1 gap-2">
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                {analyzing ? "Analyzing..." : "Run CNN"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="w-4 h-4 text-primary" /> CNN Prediction
            </CardTitle>
            <CardDescription>Convolutional Neural Network classification result</CardDescription>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={prediction.isHealthy ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}>
                    {prediction.isHealthy ? "Healthy" : "Diseased"}
                  </Badge>
                  <Badge variant="outline">{prediction.modelVersion}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Predicted disease</div>
                  <div className="text-2xl font-bold">{prediction.predictedClass}</div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-semibold">{(prediction.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={prediction.confidence * 100} className="h-2" />
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-sm font-semibold mb-1">Recommended Action</div>
                  <p className="text-sm text-muted-foreground">{prediction.recommendation}</p>
                </div>
              </div>
            ) : analyzing ? (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">CNN model processing image...</p>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Run CNN to see disease prediction</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HistoryIcon className="w-4 h-4" /> Recent Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No predictions logged yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {history.map((p) => (
                <div key={p.id} className="border rounded-lg overflow-hidden">
                  {p.image_url && <img src={p.image_url} alt={p.predicted_class} className="w-full aspect-square object-cover" />}
                  <div className="p-2">
                    <Badge variant="outline" className={`text-xs ${p.is_healthy ? "border-primary/30 text-primary" : "border-destructive/30 text-destructive"}`}>
                      {p.predicted_class}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">{(p.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}