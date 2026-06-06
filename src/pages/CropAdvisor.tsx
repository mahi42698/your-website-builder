import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Leaf, 
  Droplets, 
  Sun, 
  ThermometerSun, 
  MapPin, 
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from "lucide-react";

type Recommendation = {
  recommendedCrops: { name: string; confidence: number; season: string; profit: string; reason?: string }[];
  soilHealth: { ph: number; nitrogen: string; phosphorus: string; potassium: string };
  warnings: string[];
  tips: string[];
};

export default function CropAdvisor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [formData, setFormData] = useState({
    location: "",
    soilType: "",
    landSize: "",
    waterSource: "",
    currentSeason: "",
    budget: "",
    previousCrop: "",
    additionalInfo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("crop-advisor", { body: formData });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setRecommendations(data as Recommendation);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      toast.error("Could not generate recommendations. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setRecommendations(null);
    setFormData({
      location: "",
      soilType: "",
      landSize: "",
      waterSource: "",
      currentSeason: "",
      budget: "",
      previousCrop: "",
      additionalInfo: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Recommendations</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              Smart Crop <span className="text-primary">Advisor</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized crop recommendations based on your soil, climate, and market conditions. 
              Our AI analyzes multiple factors to maximize your yield and profit.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {!showResults ? (
            <Card className="max-w-4xl mx-auto border-primary/20 shadow-soft">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl md:text-3xl font-display">
                  Tell Us About Your Farm
                </CardTitle>
                <CardDescription className="text-base">
                  Provide details about your land and we'll recommend the best crops for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Location & Land */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Location / District
                      </Label>
                      <Input
                        id="location"
                        placeholder="e.g., Rangpur, Dinajpur"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landSize" className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-primary" />
                        Land Size (Bigha/Acre)
                      </Label>
                      <Input
                        id="landSize"
                        placeholder="e.g., 5 Bigha"
                        value={formData.landSize}
                        onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Soil & Water */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="soilType" className="flex items-center gap-2">
                        <ThermometerSun className="w-4 h-4 text-primary" />
                        Soil Type
                      </Label>
                      <Select
                        value={formData.soilType}
                        onValueChange={(value) => setFormData({ ...formData, soilType: value })}
                        required
                      >
                        <SelectTrigger id="soilType">
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alluvial">Alluvial Soil</SelectItem>
                          <SelectItem value="clay">Clay Soil</SelectItem>
                          <SelectItem value="sandy">Sandy Soil</SelectItem>
                          <SelectItem value="loamy">Loamy Soil</SelectItem>
                          <SelectItem value="red">Red Soil</SelectItem>
                          <SelectItem value="unknown">Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="waterSource" className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-primary" />
                        Water Source
                      </Label>
                      <Select
                        value={formData.waterSource}
                        onValueChange={(value) => setFormData({ ...formData, waterSource: value })}
                        required
                      >
                        <SelectTrigger id="waterSource">
                          <SelectValue placeholder="Select water source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="irrigation">Canal Irrigation</SelectItem>
                          <SelectItem value="tubewell">Tubewell</SelectItem>
                          <SelectItem value="pond">Pond/Lake</SelectItem>
                          <SelectItem value="rain">Rain-fed Only</SelectItem>
                          <SelectItem value="river">River/Stream</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Season & Budget */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentSeason" className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-primary" />
                        Current/Upcoming Season
                      </Label>
                      <Select
                        value={formData.currentSeason}
                        onValueChange={(value) => setFormData({ ...formData, currentSeason: value })}
                        required
                      >
                        <SelectTrigger id="currentSeason">
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                          <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                          <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Investment Budget (BDT)
                      </Label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) => setFormData({ ...formData, budget: value })}
                        required
                      >
                        <SelectTrigger id="budget">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Below ৳20,000</SelectItem>
                          <SelectItem value="medium">৳20,000 - ৳50,000</SelectItem>
                          <SelectItem value="high">৳50,000 - ৳1,00,000</SelectItem>
                          <SelectItem value="premium">Above ৳1,00,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Previous Crop */}
                  <div className="space-y-2">
                    <Label htmlFor="previousCrop">Previous Crop (for rotation analysis)</Label>
                    <Input
                      id="previousCrop"
                      placeholder="e.g., Wheat, Mustard, Potato"
                      value={formData.previousCrop}
                      onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Any specific challenges, preferences, or goals? e.g., organic farming interest, labor availability, market access..."
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Your Farm Data...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Get AI Recommendations
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            /* Results Section */
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Results Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf/20 text-leaf mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Analysis Complete</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Your Personalized Recommendations
                </h2>
                <p className="text-muted-foreground mt-2">
                  Based on {formData.location} • {formData.soilType} soil • {formData.currentSeason} season
                </p>
              </div>

              {/* Recommended Crops */}
              <Card className="border-primary/20 shadow-soft overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-leaf/10">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Recommended Crops
                  </CardTitle>
                  <CardDescription>Ranked by suitability for your conditions</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockRecommendations.recommendedCrops.map((crop, index) => (
                      <Card 
                        key={crop.name} 
                        className={`border-2 ${index === 0 ? 'border-primary bg-primary/5' : 'border-border'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-2xl font-bold text-foreground">#{index + 1}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              crop.profit === 'High' 
                                ? 'bg-leaf/20 text-leaf' 
                                : 'bg-harvest/20 text-harvest'
                            }`}>
                              {crop.profit} Profit
                            </span>
                          </div>
                          <h3 className="text-xl font-display font-bold text-foreground mb-2">
                            {crop.name}
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Confidence</span>
                              <span className="font-semibold text-primary">{crop.confidence}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-primary to-leaf h-2 rounded-full transition-all duration-500"
                                style={{ width: `${crop.confidence}%` }}
                              />
                            </div>
                            <div className="flex justify-between pt-1">
                              <span className="text-muted-foreground">Season</span>
                              <span className="font-medium">{crop.season}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Soil Health & Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Soil Health */}
                <Card className="border-earth/20 shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <ThermometerSun className="w-5 h-5 text-earth" />
                      Soil Health Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">pH Level</span>
                        <p className="text-xl font-bold text-foreground">{mockRecommendations.soilHealth.ph}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Nitrogen</span>
                        <p className="text-xl font-bold text-foreground">{mockRecommendations.soilHealth.nitrogen}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Phosphorus</span>
                        <p className="text-xl font-bold text-harvest">{mockRecommendations.soilHealth.phosphorus}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Potassium</span>
                        <p className="text-xl font-bold text-leaf">{mockRecommendations.soilHealth.potassium}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Warnings */}
                <Card className="border-harvest/20 shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <AlertTriangle className="w-5 h-5 text-harvest" />
                      Important Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {mockRecommendations.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-harvest/10">
                          <AlertTriangle className="w-4 h-4 text-harvest mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Tips */}
              <Card className="border-leaf/20 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle2 className="w-5 h-5 text-leaf" />
                    Expert Tips for Success
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockRecommendations.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 p-4 rounded-lg bg-leaf/5 border border-leaf/20">
                        <span className="w-6 h-6 rounded-full bg-leaf/20 flex items-center justify-center text-leaf font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="hero" size="lg" onClick={handleReset}>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get New Recommendation
                </Button>
                <Button variant="heroOutline" size="lg">
                  Download Report (PDF)
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
