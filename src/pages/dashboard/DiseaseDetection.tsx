import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Camera, Upload, Loader2, Leaf, History as HistoryIcon, Sprout, AlertTriangle, Stethoscope, ShieldCheck, Info, ListChecks } from "lucide-react";
import { predictDisease, type DiseasePrediction } from "@/lib/cnn";
import { usePredictions } from "@/hooks/useDashboardData";
import { toast } from "sonner";

export default function DiseaseDetection() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<DiseasePrediction | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [capturedAt, setCapturedAt] = useState<Date | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const { data: history } = usePredictions(8);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setImageUrl(url);
      setPrediction(null);
      setCapturedAt(new Date());
    };
    reader.readAsDataURL(file);
  };

  const analyze = async (url?: string) => {
    const target = url ?? imageUrl;
    if (!target) return;
    setAnalyzing(true);
    try {
      const result = await predictDisease(target);
      setPrediction(result);
      toast.success(`CNN prediction: ${result.predictedClass}`);
    } catch {
      toast.error("CNN analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  // Auto-analyze whenever a new image is captured/uploaded
  useEffect(() => {
    if (imageUrl && !prediction && !analyzing) {
      analyze(imageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

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
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
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
                  <p className="text-xs mt-1">Tap "Take Photo" on your phone to capture a leaf</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button onClick={() => cameraRef.current?.click()} className="gap-2">
                <Camera className="w-4 h-4" /> Take Photo
              </Button>
              <Button onClick={() => fileRef.current?.click()} variant="outline" className="gap-2">
                <Upload className="w-4 h-4" /> Upload
              </Button>
              <Button onClick={analyze} disabled={!imageUrl || analyzing} className="col-span-2 gap-2">
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                {analyzing ? "Analyzing leaf with CNN..." : "Detect Disease (Run CNN)"}
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
                  {prediction.severity && (
                    <Badge variant="outline">Severity: {prediction.severity}</Badge>
                  )}
                </div>
                {(prediction.leafName || prediction.plantType) && (
                  <div className="p-3 rounded-lg bg-muted/40 border">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Sprout className="w-4 h-4 text-primary" /> Identified Leaf
                    </div>
                    <div className="mt-1 text-base font-bold">
                      {prediction.leafName || prediction.plantType}
                    </div>
                    {prediction.scientificName && (
                      <div className="text-xs italic text-muted-foreground">{prediction.scientificName}</div>
                    )}
                    {prediction.plantInfo && (
                      <p className="text-sm text-muted-foreground mt-2">{prediction.plantInfo}</p>
                    )}
                  </div>
                )}
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
                {prediction.diseaseInfo && (
                  <div className="p-3 rounded-lg bg-muted/40 border">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                      <Info className="w-4 h-4 text-primary" /> About this condition
                    </div>
                    <p className="text-sm text-muted-foreground">{prediction.diseaseInfo}</p>
                  </div>
                )}
                {prediction.symptoms && prediction.symptoms.length > 0 && (
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Stethoscope className="w-4 h-4 text-primary" /> Symptoms
                    </div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {prediction.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {prediction.causes && prediction.causes.length > 0 && (
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Likely Causes
                    </div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {prediction.causes.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {prediction.solution && prediction.solution.length > 0 && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <ListChecks className="w-4 h-4 text-primary" /> Solution / Treatment Plan
                    </div>
                    <ol className="list-decimal list-inside text-sm text-foreground space-y-1">
                      {prediction.solution.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </div>
                )}
                {prediction.prevention && prediction.prevention.length > 0 && (
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <ShieldCheck className="w-4 h-4 text-primary" /> Prevention
                    </div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {prediction.prevention.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-sm font-semibold mb-1">Quick Answer</div>
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